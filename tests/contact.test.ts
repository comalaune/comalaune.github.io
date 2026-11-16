import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateContact } from '../src/lib/contact.ts';

const valid = {
  name: 'Élodie Martin',
  email: 'elodie@example.com',
  service: 'creation-de-contenu',
  message: 'Bonjour, je souhaite vous parler de mon projet de communication.',
};

test('accepts a contact request and trims surrounding whitespace', () => {
  const result = validateContact({ ...valid, name: '  Élodie Martin  ' });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.value.name, 'Élodie Martin');
});

test('rejects missing fields, unexpected types, invalid services and excessive lengths', () => {
  for (const input of [
    null,
    [],
    {},
    { ...valid, name: [] },
    { ...valid, email: 42 },
    { ...valid, service: 'unknown' },
    { ...valid, message: {} },
    { ...valid, name: 'A'.repeat(101) },
    { ...valid, message: 'a'.repeat(5001) },
    { ...valid, message: 'court' },
    { ...valid, email: 'not-an-address' },
    { ...valid, email: 'x@example.com\r\nBcc: attacker@example.com' },
  ]) {
    assert.equal(validateContact(input).ok, false);
  }
});

test('includes a general inquiry option', () => {
  assert.equal(validateContact({ ...valid, service: 'a-definir' }).ok, true);
});

test('preserves multiline project descriptions, accents and punctuation', () => {
  const message =
    'Mon projet & mes idées : été, photo + vidéo !\nUn second paragraphe pour présenter mon activité.';
  const result = validateContact({
    ...valid,
    message,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.message, message);
  assert.equal(result.value.email, valid.email);
});
