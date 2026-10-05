(() => {
  const form = document.getElementById('application-form');
  if (!form) return;
  const role = document.getElementById('target-role');
  const fileInput = document.getElementById('resume-file');
  const status = document.getElementById('application-status');
  const button = form.querySelector('button[type="submit"]');
  const phone = form.elements.phone;
  const email = form.elements.email;
  const maxFileSize = 5 * 1024 * 1024;
  const allowedExtensions = ['pdf', 'doc', 'docx'];
  const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  function validateFile() {
    const file = fileInput.files[0];
    if (!file) {
      fileInput.setCustomValidity('Please attach your resume.');
      return false;
    }
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension) || (file.type && !allowedMimeTypes.includes(file.type))) {
      fileInput.setCustomValidity('Upload a PDF, DOC or DOCX file.');
      return false;
    }
    if (file.size > maxFileSize) {
      fileInput.setCustomValidity('Your resume must be 5 MB or smaller.');
      return false;
    }
    fileInput.setCustomValidity('');
    return true;
  }

  const requestedRole = new URLSearchParams(location.search).get('role');
  if (requestedRole && requestedRole !== 'general') {
    role.value = requestedRole;
    fetch('jobs.json').then(response => response.ok ? response.json() : []).then(items => {
      const match = Array.isArray(items) && items.find(job => job.active && (job.id === requestedRole || job.title === requestedRole));
      if (match) role.value = match.title;
    }).catch(() => {});
  }

  fileInput.addEventListener('change', () => {
    validateFile();
    status.textContent = fileInput.validationMessage || '';
    status.dataset.state = fileInput.validationMessage ? 'error' : '';
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.textContent = '';
    status.removeAttribute('data-state');
    phone.setCustomValidity(/^\d{10}$/.test(phone.value.trim()) ? '' : 'Enter a phone number with exactly 10 digits.');
    email.setCustomValidity(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) ? '' : 'Enter a valid email address.');
    validateFile();
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
      if (!response.ok) throw new Error('Your application could not be sent. Please try again or email admin@meridian-hr.in.');
      form.reset();
      role.value = '';
      status.textContent = 'Thank you. Your application has been sent to Meridian HR & Staffing.';
      status.dataset.state = 'success';
    } catch (error) {
      status.textContent = error.message || 'Something went wrong. Please email admin@meridian-hr.in.';
      status.dataset.state = 'error';
    } finally {
      phone.setCustomValidity('');
      email.setCustomValidity('');
      fileInput.setCustomValidity('');
      button.disabled = false;
    }
  });
})();