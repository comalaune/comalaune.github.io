import { validateContact, serviceName } from '../lib/contact';

const form = document.querySelector<HTMLFormElement>('#contact-form');
if (form) {
  const status = form.querySelector<HTMLElement>('#form-status')!;
  form.addEventListener('submit', (event) => {
    const fields = Object.fromEntries(new FormData(form));
    const result = validateContact(fields);
    if (!result.ok) {
      event.preventDefault();
      status.textContent = result.error;
      status.dataset.state = 'error';
      status.hidden = false;
      (form.elements.namedItem(result.field) as HTMLElement)?.focus();
      return;
    }
    // Let the browser POST to FormSubmit, retaining its anti-spam verification.
    for (const name of ['name', 'email', 'message'] as const) {
      (
        form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement
      ).value = result.value[name];
    }
    (form.elements.namedItem('_subject') as HTMLInputElement).value =
      `Un projet avec Com’ à la une — ${serviceName(result.value.service)}`;
    status.hidden = true;
  });
}
