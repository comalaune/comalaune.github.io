import { validateContact, serviceName } from '../src/lib/contact.ts';
import { contactEmail } from '../src/data/services.ts';

export interface Env {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  ALLOWED_ORIGINS: string;
  CONTACT_RATE_LIMITER?: {
    limit: (options: { key: string }) => Promise<{ success: boolean }>;
  };
}

interface Options {
  fetcher?: (url: string, init: RequestInit) => Promise<Response>;
  timeoutMs?: number;
}

const MAX_BODY_BYTES = 24000;

export async function handleContactRequest(
  request: Request,
  env: Env,
  options: Options = {},
): Promise<Response> {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
    'X-Content-Type-Options': 'nosniff',
  });
  const json = (status: number, body: object) =>
    new Response(JSON.stringify(body), { status, headers });
  if (!origin || !allowed.includes(origin))
    return json(403, { error: 'Origine non autorisée.' });
  headers.set('Access-Control-Allow-Origin', origin);
  if (new URL(request.url).pathname !== '/contact')
    return json(404, { error: 'Page introuvable.' });
  if (request.method === 'OPTIONS') {
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Access-Control-Max-Age', '600');
    return new Response(null, { status: 204, headers });
  }
  if (request.method !== 'POST') {
    headers.set('Allow', 'POST, OPTIONS');
    return json(405, { error: 'Méthode non autorisée.' });
  }
  if (
    request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !==
    'application/json'
  )
    return json(415, { error: 'Format non pris en charge.' });
  if (Number(request.headers.get('Content-Length')) > MAX_BODY_BYTES)
    return json(413, { error: 'Message trop volumineux.' });

  // Count actual bytes too: clients can omit or misreport Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return json(400, { error: 'Message incomplet.' });
  let body: unknown;
  try {
    let size = 0;
    const decoder = new TextDecoder();
    let text = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return json(413, { error: 'Message trop volumineux.' });
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    body = JSON.parse(text);
  } catch {
    return json(400, { error: 'Message invalide.' });
  }

  const validated = validateContact(body);
  if (!validated.ok) return json(400, { error: validated.error });
  const fields = body as Record<string, unknown>;
  if (
    typeof fields.website !== 'string' ||
    typeof fields.requestId !== 'string' ||
    !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(
      fields.requestId,
    )
  )
    return json(400, { error: 'Message invalide.' });
  if (fields.website.trim()) return json(202, { success: true });
  if (!env.RESEND_API_KEY || !env.CONTACT_RATE_LIMITER)
    return json(503, {
      error:
        'L’envoi est temporairement indisponible. Contactez Apolline par e-mail.',
    });
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'local';
    const { success } = await env.CONTACT_RATE_LIMITER.limit({
      key: `contact:${ip}`,
    });
    if (!success) {
      headers.set('Retry-After', '60');
      return json(429, { error: 'Patientez une minute avant de réessayer.' });
    }
  } catch {
    return json(503, { error: 'L’envoi est temporairement indisponible.' });
  }

  const data = validated.value;
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? 10000,
  );
  try {
    const response = await (options.fetcher ?? fetch)(
      'https://api.resend.com/emails',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `comapo-contact-${fields.requestId}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          from: env.RESEND_FROM || "Com'Apo <onboarding@resend.dev>",
          to: [contactEmail],
          reply_to: data.email,
          subject: `Nouveau projet Com'Apo — ${serviceName(data.service)}`,
          text: `Une nouvelle demande depuis le site Com'Apo\n\nNom : ${data.name}\nE-mail : ${data.email}\nBesoin : ${serviceName(data.service)}\n\n${data.message}`,
        }),
      },
    );
    if (!response.ok)
      return json(502, {
        error:
          'L’envoi n’a pas abouti. Réessayez ou contactez Apolline par e-mail.',
      });
    const result = (await response.json()) as { id?: unknown };
    if (typeof result.id !== 'string' || !result.id)
      return json(502, { error: 'L’envoi n’a pas été confirmé.' });
    return json(200, { success: true });
  } catch {
    return json(502, {
      error:
        'L’envoi n’a pas abouti. Réessayez ou contactez Apolline par e-mail.',
    });
  } finally {
    clearTimeout(timer);
  }
}

export default { fetch: handleContactRequest };
