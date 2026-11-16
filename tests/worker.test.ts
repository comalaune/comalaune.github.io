import assert from 'node:assert/strict';
import { test } from 'node:test';
import { handleContactRequest } from '../api/worker.ts';

const origin = 'https://hugocarolin.github.io';
const valid = {
  name: 'Élodie Martin',
  email: 'elodie@example.com',
  service: 'creation-de-contenu',
  message: 'Bonjour, je souhaite vous parler de mon projet.',
  website: '',
  requestId: '648dcf03-e08d-4d02-af01-5bf64708cbf8',
};
const env = () => ({
  RESEND_API_KEY: 'test-key-never-sent',
  RESEND_FROM: "Com'Apo <onboarding@resend.dev>",
  ALLOWED_ORIGINS: origin,
  CONTACT_RATE_LIMITER: { limit: async () => ({ success: true }) },
});
const request = (body: unknown = valid, options: RequestInit = {}) =>
  new Request('https://contact.example.com/contact', {
    method: 'POST',
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      'CF-Connecting-IP': '192.0.2.1',
    },
    body: JSON.stringify(body),
    ...options,
  });
const noSend = async () => {
  assert.fail('Resend must not be called for a rejected request');
};

test('rejects unapproved origins, including absent origin, and does not grant CORS', async () => {
  for (const headers of [{ Origin: 'https://evil.example' }, {}]) {
    const response = await handleContactRequest(
      request(valid, { headers }),
      env(),
      { fetcher: noSend },
    );
    assert.equal(response.status, 403);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  }
});
test('handles allowed preflight and rejects other methods and paths', async () => {
  const preflight = await handleContactRequest(
    request(null, { method: 'OPTIONS', body: null }),
    env(),
  );
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), origin);
  const get = await handleContactRequest(
    request(null, { method: 'GET', body: null }),
    env(),
  );
  assert.equal(get.status, 405);
  const wrong = new Request(
    'https://contact.example.com/not-contact',
    request(),
  );
  assert.equal((await handleContactRequest(wrong, env())).status, 404);
});
test('rejects non-JSON, malformed JSON and oversized bodies even without Content-Length', async () => {
  assert.equal(
    (
      await handleContactRequest(
        request(valid, {
          headers: { Origin: origin, 'Content-Type': 'text/plain' },
        }),
        env(),
        { fetcher: noSend },
      )
    ).status,
    415,
  );
  assert.equal(
    (
      await handleContactRequest(request(null, { body: '{' }), env(), {
        fetcher: noSend,
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await handleContactRequest(
        request(null, { body: 'a'.repeat(24001) }),
        env(),
        { fetcher: noSend },
      )
    ).status,
    413,
  );
});
test('validates inputs, request identifiers and honeypot types', async () => {
  for (const body of [
    { ...valid, email: [] },
    { ...valid, requestId: '../bad' },
    { ...valid, website: {} },
    { ...valid, message: 'a'.repeat(5001) },
  ]) {
    assert.equal(
      (await handleContactRequest(request(body), env(), { fetcher: noSend }))
        .status,
      400,
    );
  }
});
test('discards honeypot submissions without sending mail', async () => {
  assert.equal(
    (
      await handleContactRequest(
        request({ ...valid, website: 'bot.example' }),
        env(),
        { fetcher: noSend },
      )
    ).status,
    202,
  );
});
test('fails closed if the key or platform rate limiter is missing', async () => {
  assert.equal(
    (
      await handleContactRequest(
        request(),
        { ...env(), RESEND_API_KEY: '' },
        { fetcher: noSend },
      )
    ).status,
    503,
  );
  assert.equal(
    (
      await handleContactRequest(
        request(),
        { ...env(), CONTACT_RATE_LIMITER: undefined },
        { fetcher: noSend },
      )
    ).status,
    503,
  );
});
test('rate limits repeated contact submissions', async () => {
  const blocked = {
    ...env(),
    CONTACT_RATE_LIMITER: { limit: async () => ({ success: false }) },
  };
  const response = await handleContactRequest(request(), blocked, {
    fetcher: noSend,
  });
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Retry-After'), '60');
});
test('uses Resend with the fixed recipient, validated reply-to and stable idempotency key', async () => {
  const calls: { url: string; init: RequestInit }[] = [];
  const fetcher = async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init! });
    return Response.json({ id: 'provider-email-id' });
  };
  for (let i = 0; i < 2; i++) {
    const response = await handleContactRequest(
      request({ ...valid, to: 'attacker@example.com' }),
      env(),
      { fetcher },
    );
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
  }
  const payload = JSON.parse(calls[0].init.body as string);
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
  assert.deepEqual(payload.to, ['com.alaune1@gmail.com']);
  assert.equal(payload.reply_to, valid.email);
  assert.match(payload.text, /Élodie Martin/);
  assert.equal(payload.html, undefined);
  assert.equal(
    new Headers(calls[0].init.headers).get('Idempotency-Key'),
    new Headers(calls[1].init.headers).get('Idempotency-Key'),
  );
  assert.equal(
    new Headers(calls[0].init.headers).get('Authorization'),
    'Bearer test-key-never-sent',
  );
});
test('never reports success for a provider error, missing id or network failure', async () => {
  const fetchers = [
    async () =>
      Response.json({ message: 'private provider error' }, { status: 422 }),
    async () => Response.json({}),
    async () => {
      throw new Error('private network error');
    },
  ];
  for (const fetcher of fetchers) {
    const response = await handleContactRequest(request(), env(), { fetcher });
    assert.equal(response.status, 502);
    const body = await response.text();
    assert.doesNotMatch(body, /private|test-key|Authorization/);
  }
});
test('aborts an unresponsive provider', async () => {
  const fetcher = async (_url: unknown, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error('provider did not abort')),
        500,
      );
      init!.signal!.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          reject(new Error('timeout'));
        },
        { once: true },
      );
    });
  const response = await handleContactRequest(request(), env(), {
    fetcher,
    timeoutMs: 5,
  });
  assert.equal(response.status, 502);
});
