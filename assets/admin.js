(() => {
  const root = document.getElementById('admin-jobs');
  if (!root) return;
  let jobs = [];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const render = () => {
    if (!jobs.length) { root.innerHTML = '<div class="admin-empty">No positions yet. Add a position to get started.</div>'; return; }
    root.innerHTML = jobs.map((job, index) => `<article class="admin-job"><div class="admin-job-top"><b>Position ${String(index + 1).padStart(2, '0')}</b><label class="active-toggle"><input type="checkbox" data-field="active" data-index="${index}" ${job.active ? 'checked' : ''}><span>Shown on careers page</span></label><button class="remove-job" data-remove="${index}" type="button" aria-label="Remove position ${index + 1}">Remove</button></div><div class="admin-fields"><label>Job title<input data-field="title" data-index="${index}" value="${esc(job.title)}" placeholder="e.g. Talent Acquisition Executive"></label><label>Department<input data-field="department" data-index="${index}" value="${esc(job.department)}" placeholder="e.g. Recruitment"></label><label>Location<input data-field="location" data-index="${index}" value="${esc(job.location)}" placeholder="e.g. Delhi NCR"></label><label>Employment type<input data-field="type" data-index="${index}" value="${esc(job.type)}" placeholder="e.g. Full time"></label><label class="field-wide">Short description<textarea data-field="summary" data-index="${index}" rows="2" placeholder="A short, clear description of the role">${esc(job.summary)}</textarea></label><label class="field-wide">What candidates should bring <small>One requirement per line</small><textarea data-field="requirements" data-index="${index}" rows="3" placeholder="Relevant experience\nCommunication skills">${esc((job.requirements || []).join('\n'))}</textarea></label></div></article>`).join('');
  };
  fetch('jobs.json').then(response => response.json()).then(value => { jobs = Array.isArray(value) ? value : []; render(); }).catch(() => { jobs = []; render(); });
  root.addEventListener('input', event => { const target = event.target; const index = Number(target.dataset.index); const field = target.dataset.field; if (!field || !jobs[index]) return; jobs[index][field] = field === 'requirements' ? target.value.split('\n').map(line => line.trim()).filter(Boolean) : target.value; });
  root.addEventListener('change', event => { const target = event.target; if (target.dataset.field === 'active' && jobs[Number(target.dataset.index)]) jobs[Number(target.dataset.index)].active = target.checked; });
  root.addEventListener('click', event => { const index = event.target.dataset.remove; if (index !== undefined) { jobs.splice(Number(index), 1); render(); } });
  document.getElementById('add-job').addEventListener('click', () => { jobs.push({ id: `role-${Date.now()}`, title: '', department: '', location: 'India', type: 'Full time', summary: '', requirements: [], active: true }); render(); root.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  document.getElementById('download-jobs').addEventListener('click', () => {
    const invalid = jobs.some(job => !job.title.trim());
    if (invalid) { document.getElementById('admin-status').textContent = 'Please add a title to every position before downloading.'; root.querySelector('input[data-field="title"]')?.focus(); return; }
    jobs = jobs.map(job => ({ ...job, id: job.id || `role-${Date.now()}`, title: job.title.trim(), department: job.department.trim(), location: job.location.trim(), type: job.type.trim(), summary: job.summary.trim(), requirements: Array.isArray(job.requirements) ? job.requirements : [], active: Boolean(job.active) }));
    const blob = new Blob([`${JSON.stringify(jobs, null, 2)}\n`], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'jobs.json'; anchor.click(); URL.revokeObjectURL(url);
    document.getElementById('admin-status').textContent = 'Downloaded. Review the file, then replace jobs.json in your GitHub repository.';
  });
})();
