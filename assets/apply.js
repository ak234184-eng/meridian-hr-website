(() => {
  const form = document.getElementById('application-form');
  if (!form) return;
  const role = document.getElementById('target-role');
  const status = document.getElementById('application-status');
  const button = form.querySelector('button[type="submit"]');
  const phone = form.elements.phone;
  const email = form.elements.email;

  const requestedRole = new URLSearchParams(location.search).get('role');
  if (requestedRole && requestedRole !== 'general') {
    role.value = requestedRole;
    fetch('jobs.json').then(response => response.ok ? response.json() : []).then(items => {
      const match = Array.isArray(items) && items.find(job => job.active && (job.id === requestedRole || job.title === requestedRole));
      if (match) role.value = match.title;
    }).catch(() => {});
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.textContent = '';
    status.removeAttribute('data-state');
    phone.setCustomValidity(/^\\d{10}$/.test(phone.value.trim()) ? '' : 'Enter a phone number with exactly 10 digits.');
    email.setCustomValidity(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(email.value.trim()) ? '' : 'Enter a valid email address.');
    if (!form.reportValidity()) {
      status.textContent = 'Please complete all required fields and fix the highlighted errors.';
      status.dataset.state = 'error';
      return;
    }

    button.disabled = true;
    status.textContent = 'Sending your application…';
    status.dataset.state = 'pending';
    try {
      const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const apiDetails = Array.isArray(payload?.errors)
          ? payload.errors.map(item => item.message).filter(Boolean).join(' ')
          : (payload?.error || '');
        const fallback = `Formspree rejected the submission (HTTP ${response.status}). Check the form settings and notification email, or contact admin@meridian-hr.in.`;
        throw new Error((apiDetails || fallback).slice(0, 400));
      }
      form.reset();
      role.value = '';
      status.textContent = 'Thank you. Your application has been sent to Meridian HR & Staffing.';
      status.dataset.state = 'success';
    } catch (error) {
      status.textContent = error instanceof TypeError ? 'Could not reach the form service. Check your internet connection and try again.' : (error.message || 'Something went wrong. Please email admin@meridian-hr.in.');
      status.dataset.state = 'error';
    } finally {
      phone.setCustomValidity('');
      email.setCustomValidity('');
      button.disabled = false;
    }
  });
})();