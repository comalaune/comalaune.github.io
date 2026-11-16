import { services } from '../data/services.ts';

export interface ContactData {
  name: string;
  email: string;
  service: string;
  message: string;
}

type ValidationResult =
  | { ok: true; value: ContactData }
  | { ok: false; error: string; field: keyof ContactData };

export function validateContact(input: unknown): ValidationResult {
  const value =
    input && typeof input === 'object' && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  const text = (key: string) =>
    typeof value[key] === 'string' ? value[key].trim() : '';
  const name = text('name');
  const email = text('email');
  const service = text('service');
  const message = text('message');
  if (name.length < 2 || name.length > 100 || /[\r\n]/.test(name))
    return {
      ok: false,
      field: 'name',
      error: 'Indiquez votre nom (entre 2 et 100 caractères).',
    };
  if (email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))
    return {
      ok: false,
      field: 'email',
      error: 'Indiquez une adresse e-mail valide.',
    };
  if (service !== 'a-definir' && !services.some((item) => item.id === service))
    return {
      ok: false,
      field: 'service',
      error: 'Choisissez un besoin dans la liste.',
    };
  if (message.length < 10 || message.length > 5000)
    return {
      ok: false,
      field: 'message',
      error: 'Décrivez votre projet en 10 à 5 000 caractères.',
    };
  return { ok: true, value: { name, email, service, message } };
}

export function serviceName(id: string): string {
  return (
    services.find((item) => item.id === id)?.name ??
    'Un projet à définir ensemble'
  );
}
