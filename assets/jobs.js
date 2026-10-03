(() => {
  const list = document.getElementById('jobs-list');
  if (!list) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  fetch('jobs.json').then(response => { if (!response.ok) throw new Error('jobs.json unavailable'); return response.json(); }).then(jobs => {
    const active = Array.isArray(jobs) ? jobs.filter(job => job.active) : [];
    if (!active.length) { list.innerHTML = '<div class="empty-jobs"><span>✳</span><h3>No open positions today.</h3><p>We update this page as roles open. You can still send a general application for future opportunities.</p><a class="text-link" href="apply.html?role=general">Send a general application ↗</a></div>'; return; }
    list.innerHTML = active.map(job => `<article class="job-card"><div class="job-card-head"><span class="job-dept">${esc(job.department || 'Meridian careers')}</span><span class="job-active"><i></i> OPEN</span></div><h3>${esc(job.title)}</h3><div class="job-meta"><span>⌖ ${esc(job.location || 'India')}</span><span>◷ ${esc(job.type || 'Full time')}</span><span>Ref: ${esc(job.id)}</span></div><p>${esc(job.summary || '')}</p>${Array.isArray(job.requirements) && job.requirements.length ? `<details class="job-details"><summary>Role details <span>＋</span></summary><ul>${job.requirements.map(item => `<li>${esc(item)}</li>`).join('')}</ul></details>` : ''}<a class="button button-primary job-apply" href="apply.html?role=${encodeURIComponent(job.id)}">Apply for this role <span>↗</span></a></article>`).join('');
  }).catch(() => { list.innerHTML = '<div class="empty-jobs"><span>✳</span><h3>We are refreshing our listings.</h3><p>Send a general application and we will keep your introduction for future suitable opportunities.</p><a class="text-link" href="apply.html?role=general">Send a general application ↗</a></div>'; });
})();

