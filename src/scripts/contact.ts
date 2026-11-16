import { validateContact, createMailto } from '../lib/contact';

const form = document.querySelector<HTMLFormElement>('#contact-form');
if (form) {
  const button = form.querySelector<HTMLButtonElement>('#contact-submit')!;
  const status = form.querySelector<HTMLElement>('#form-status')!;
  const fallback = form.querySelector<HTMLAnchorElement>('#fallback-email')!;
  let requestId = crypto.randomUUID();
  let lastPayload = '';
  let pending = false;
  const showStatus = (message: string, state: string) => {
    status.textContent = message;
    status.dataset.state = state;
    status.hidden = false;
    status.focus();
  };
  document
    .querySelectorAll<HTMLAnchorElement>('[data-service]')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const select = form.elements.namedItem('service') as HTMLSelectElement;
        select.value = link.dataset.service || '';
      });
    });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    const fields = Object.fromEntries(new FormData(form));
    const result = validateContact(fields);
    if (!result.ok) {
      showStatus(result.error, 'error');
      (form.elements.namedItem(result.field) as HTMLElement)?.focus();
      return;
    }
    fallback.href = createMailto(result.value);
    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      fallback.hidden = false;
      showStatus(
        'Votre e-mail est prêt. Ouvrez-le dans votre messagerie, puis envoyez-le après l’avoir relu.',
        'prepared',
      );
      return;
    }
    const payload = JSON.stringify(result.value);
    if (payload !== lastPayload) {
      requestId = crypto.randomUUID();
      lastPayload = payload;
    }
    pending = true;
    button.disabled = true;
    button.textContent = 'Envoi en cours…';
    form.setAttribute('aria-busy', 'true');
    fallback.hidden = true;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...result.value,
          website: fields.website,
          requestId,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (!response.ok || data.success !== true)
        throw new Error(
          response.status === 429
            ? 'Vous avez envoyé plusieurs demandes. Patientez une minute, puis réessayez.'
            : 'L’envoi n’a pas abouti. Réessayez ou utilisez le lien e-mail ci-dessous.',
        );
      showStatus(
        'Merci ! Votre message a bien été envoyé à Apolline.',
        'success',
      );
      form.reset();
      lastPayload = '';
      requestId = crypto.randomUUID();
    } catch (error) {
      const message =
        error instanceof Error && error.message.startsWith('Vous avez')
          ? error.message
          : 'L’envoi n’a pas abouti. Réessayez ou utilisez le lien e-mail ci-dessous.';
      showStatus(message, 'error');
      fallback.hidden = false;
    } finally {
      pending = false;
      button.disabled = false;
      button.innerHTML =
        'Envoyer mon message <span aria-hidden="true">↗</span>';
      form.removeAttribute('aria-busy');
    }
  });
}
