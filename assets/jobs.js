(() => {
  const list = document.getElementById('jobs-list');
  if (!list) return;
  const search = document.getElementById('jobs-search');
  const locationFilter = document.getElementById('jobs-location');
  const typeFilter = document.getElementById('jobs-type');
  const clearButton = document.getElementById('jobs-clear-filters');
  const status = document.getElementById('jobs-results-status');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const normalize = value => String(value ?? '').toLowerCase().replace(/[()]/g, '').replace(/\s+/g, ' ').trim();
  const normalizeLocation = value => {
    const text = normalize(value);
    return text === 'delhi' || text === 'delhi ncr' || text === 'delhi n c r' ? 'delhi ncr' : text;
  };
  const normalizeType = value => {
    const text = normalize(value);
    if (/full[ -]?time/.test(text)) return 'full-time';
    if (text.includes('intern')) return 'internship';
    if (text.includes('contract')) return 'contract';
    return text;
  };
  const formatDate = value => {
    if (!value) return 'Not provided';
    const date = new Date(String(value).slice(0, 10) + 'T00:00:00');
    if (Number.isNaN(date.getTime())) return 'Not provided';
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };
  let activeJobs = [];

  function populateFilter(select, values, normalizeValue) {
    const existing = new Set(Array.from(select.options).map(option => normalizeValue(option.value)).filter(Boolean));
    values.forEach(value => {
      const label = String(value || '').trim();
      const key = normalizeValue(label);
      if (!label || existing.has(key)) return;
      const option = document.createElement('option');
      option.value = label;
      option.textContent = label;
      select.append(option);
      existing.add(key);
    });
  }

  function render() {
    const query = normalize(search.value);
    const location = normalizeLocation(locationFilter.value);
    const type = normalizeType(typeFilter.value);
    const matches = activeJobs.filter(job => {
      const searchable = normalize([job.title, job.department, job.category, job.location, job.type, job.summary, ...(job.requirements || [])].join(' '));
      return (!query || searchable.includes(query))
        && (!location || normalizeLocation(job.location || 'India') === location)
        && (!type || normalizeType(job.type || 'Full-time') === type);
    });
    status.textContent = activeJobs.length
      ? `Showing ${matches.length} of ${activeJobs.length} open ${activeJobs.length === 1 ? 'position' : 'positions'}.`
      : 'There are no open positions right now. You can still send a general application.';
    if (!matches.length) {
      list.innerHTML = activeJobs.length
        ? '<div class="empty-jobs"><span>⌕</span><h3>No roles match those filters.</h3><p>Try another keyword or clear the filters to see all current openings.</p></div>'
        : '<div class="empty-jobs"><span>✳</span><h3>No open positions today.</h3><p>We update this page as roles open. You can still send a general application for future opportunities.</p><a class="text-link" href="apply.html?role=general">Send a general application ↗</a></div>';
      return;
    }
    list.innerHTML = matches.map(job => {
      const title = esc(job.title || 'Open position');
      const category = esc(job.category || job.department || 'Meridian careers');
      const locationText = esc(job.location || 'India');
      const typeText = esc(job.type || 'Full-time');
      const experience = esc(job.experienceRange || job.experience || 'Not specified');
      const posted = esc(formatDate(job.postedDate || job.posted_at));
      const requirements = Array.isArray(job.requirements) ? job.requirements : [];
      return `<article class="job-card">
        <div class="job-card-head"><span class="job-dept">${category}</span><span class="job-active"><i></i> OPEN</span></div>
        <h3>${title}</h3>
        <div class="job-meta"><span>⌖ ${locationText}</span><span>◷ ${typeText}</span><span>Experience: ${experience}</span><span>Posted: ${posted}</span></div>
        <p>${esc(job.summary || '')}</p>
        ${requirements.length ? `<details class="job-details"><summary>Role details <span>＋</span></summary><ul>${requirements.map(item => `<li>${esc(item)}</li>`).join('')}</ul></details>` : ''}
        <a class="button button-primary job-apply" href="apply.html?role=${encodeURIComponent(job.id || job.title || '')}">Apply now <span>↗</span></a>
      </article>`;
    }).join('');
  }

  search.addEventListener('input', render);
  locationFilter.addEventListener('change', render);
  typeFilter.addEventListener('change', render);
  clearButton.addEventListener('click', () => {
    search.value = '';
    locationFilter.value = '';
    typeFilter.value = '';
    render();
    search.focus();
  });

  fetch('jobs.json').then(response => {
    if (!response.ok) throw new Error('Open positions are unavailable.');
    return response.json();
  }).then(jobs => {
    activeJobs = Array.isArray(jobs) ? jobs.filter(job => job.active) : [];
    populateFilter(locationFilter, activeJobs.map(job => job.location), normalizeLocation);
    populateFilter(typeFilter, activeJobs.map(job => job.type), normalizeType);
    render();
  }).catch(() => {
    activeJobs = [];
    list.innerHTML = '<div class="empty-jobs"><span>✳</span><h3>We are refreshing our listings.</h3><p>Send a general application and we will keep your introduction for future suitable opportunities.</p><a class="text-link" href="apply.html?role=general">Send a general application ↗</a></div>';
    status.textContent = 'Listings could not be loaded just now.';
  });
})();