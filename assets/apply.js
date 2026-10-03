(() => {
  const form = document.getElementById('application-form');
  if (!form) return;
  const select = document.getElementById('application-role');
  const status = document.getElementById('application-status');
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
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const role = select.selectedOptions[0]?.textContent || 'General application';
    const subject = `Job application — ${role}`;
    const body = [
      `Position: ${role}`,
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Phone: ${data.get('phone') || 'Not provided'}`,
      `Current city: ${data.get('city')}`,
      `Notice period: ${data.get('notice') || 'Not provided'}`,
      '',
      'Introduction:',
      data.get('message') || 'Not provided',
      '',
      'I have attached my resume to this email.',
    ].join('\n');
    status.textContent = 'Your email draft is opening. Attach your resume before sending.';
    location.href = `mailto:admin@meridian-hr.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
