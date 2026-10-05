(() => {
  const form = document.getElementById('client-enquiry-form');
  if (!form) return;
  const status = document.getElementById('client-enquiry-status');
  const button = form.querySelector('button[type="submit"]');
  const phone = form.elements.phone;
  const email = form.elements.email;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.textContent = '';
    status.removeAttribute('data-state');
    phone.setCustomValidity(/^\d{10}$/.test(phone.value.trim()) ? '' : 'Enter a phone number with exactly 10 digits.');
    email.setCustomValidity(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) ? '' : 'Enter a valid email address.');
    if (!form.reportValidity()) {
      status.textContent = 'Please check the required fields and correct the highlighted details.';
      status.dataset.state = 'error';
      return;
    }
    button.disabled = true;
    status.textContent = 'Sending your hiring enquiry…';
    status.dataset.state = 'pending';
    try {
      const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Your enquiry could not be sent. Please try again or email admin@meridian-hr.in.');
      form.reset();
      status.textContent = 'Thank you. Your hiring enquiry has been sent to Meridian HR & Staffing.';
      status.dataset.state = 'success';
    } catch (error) {
      status.textContent = error.message || 'Something went wrong. Please email admin@meridian-hr.in.';
      status.dataset.state = 'error';
    } finally {
      phone.setCustomValidity('');
      email.setCustomValidity('');
      button.disabled = false;
    }
  });
})();