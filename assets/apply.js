(() => {
  const form = document.getElementById('application-form');
  if (!form) return;
  const select = document.getElementById('application-role');
  const status = document.getElementById('application-status');
  const button = form.querySelector('button[type="submit"]');
  const requestedId = new URLSearchParams(location.search).get('role');
  fetch('jobs.json').then(response => {
    if (!response.ok) throw new Error('Open positions are unavailable.');
    return response.json();
  }).then(jobs => {
    const active = Array.isArray(jobs) ? jobs.filter(job => job.active) : [];
    select.innerHTML = '<option value="" disabled>Select an open role</option>' + active.map(job => {
      const option = document.createElement('option');
      option.value = job.id;
      option.textContent = job.title;
      option.selected = job.id === requestedId;
      return option.outerHTML;
    }).join('');
    if (!requestedId || !active.some(job => job.id === requestedId)) select.selectedIndex = 0;
    if (!active.length) {
      select.innerHTML = '<option value="" disabled selected>No open positions right now</option>';
      status.textContent = 'Please check the careers page again later or send the team a general introduction.';
    }
  }).catch(() => {
    select.innerHTML = '<option value="" disabled selected>Could not load open positions</option>';
    status.textContent = 'Please open the careers page or email admin@meridian-hr.in for current roles.';
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const upload = form.querySelector('input[type="file"]');
    if (upload?.files[0] && upload.files[0].size > 10 * 1024 * 1024) {
      status.textContent = 'Resume must be 10 MB or smaller.';
      return;
    }
    button.disabled = true;
    status.textContent = 'Sending your application…';
    try {
      const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('The application could not be sent. Check that file uploads are enabled in Formspree, or email admin@meridian-hr.in.');
      form.reset();
      status.textContent = 'Thank you. Your application has been sent to Meridian HR & Staffing.';
    } catch (error) {
      status.textContent = error.message || 'Something went wrong. Please email admin@meridian-hr.in.';
    } finally {
      button.disabled = false;
    }
  });
})();

