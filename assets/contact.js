(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const params = new URLSearchParams(location.search);
  const topic = params.get('topic');
  const topicMap = { recruitment: 'Recruitment and hiring', staffing: 'Contract staffing', payroll: 'Payroll management', compliance: 'Compliance support', 'hr-operations': 'Other business enquiry' };
  if (topic && topicMap[topic]) document.getElementById('topic-select').value = topicMap[topic];
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = `Website enquiry — ${data.get('topic')}`;
    const body = [`Name: ${data.get('name')}`, `Email: ${data.get('email')}`, `Enquiry: ${data.get('topic')}`, '', 'Message:', data.get('message'), '', 'I have read the privacy notice and agree to send these details to Meridian by email.'].join('\n');
    location.href = `mailto:admin@meridian-hr.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
