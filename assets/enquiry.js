(() => {
  const form = document.getElementById('client-enquiry-form');
  if (!form) return;
  const status = document.getElementById('client-enquiry-status');
  const button = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    button.disabled = true;
    status.textContent = 'Sending your hiring enquiry…';
    try {
      const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Your enquiry could not be sent. Please try again or email admin@meridian-hr.in.');
      form.reset();
      status.textContent = 'Thank you. Your hiring enquiry has been sent to Meridian HR & Staffing.';
    } catch (error) {
      status.textContent = error.message || 'Something went wrong. Please email admin@meridian-hr.in.';
    } finally {
      button.disabled = false;
    }
  });
})();

