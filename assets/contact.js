(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('contact-status');
  const button = form.querySelector('button[type="submit"]');
  const params = new URLSearchParams(location.search);
  const topic = params.get('topic');
  const topicMap = { recruitment: 'Recruitment and hiring', staffing: 'Contract staffing', payroll: 'Payroll management', compliance: 'Compliance support', 'hr-operations': 'Other business enquiry' };
  if (topic && topicMap[topic]) document.getElementById('topic-select').value = topicMap[topic];
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    button.disabled = true;
    status.textContent = 'Sending your enquiry…';
    try {
      const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('The enquiry could not be sent. Please try again or email admin@meridian-hr.in.');
      form.reset();
      status.textContent = 'Thank you. Your enquiry has been sent to Meridian HR & Staffing.';
    } catch (error) {
      status.textContent = error.message || 'Something went wrong. Please email admin@meridian-hr.in.';
    } finally {
      button.disabled = false;
    }
  });
})();

