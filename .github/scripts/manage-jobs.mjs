import { readFile, writeFile } from 'node:fs/promises';

const file = 'jobs.json';
const jobs = JSON.parse(await readFile(file, 'utf8'));
const operation = (process.env.JOB_OPERATION || '').trim();
const id = (process.env.JOB_ID || '').trim();
const title = (process.env.JOB_TITLE || '').trim();
const text = name => (process.env[name] || '').trim();
const requirements = text('JOB_REQUIREMENTS').split(/\r?\n/).map(value => value.trim()).filter(Boolean);

if (!Array.isArray(jobs)) throw new Error('jobs.json must contain a JSON list.');

if (operation === 'Add a position') {
  if (!title) throw new Error('Add a job title before publishing.');
  const baseId = title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'position';
  let newId = baseId;
  let suffix = 2;
  while (jobs.some(job => job.id === newId)) newId = `${baseId}-${suffix++}`;
  jobs.push({
    id: newId,
    title,
    department: text('JOB_DEPARTMENT'),
    location: text('JOB_LOCATION') || 'India',
    type: text('JOB_TYPE') || 'Full time',
    summary: text('JOB_SUMMARY'),
    requirements,
    active: true,
  });
} else if (['Edit a position', 'Close a position', 'Reopen a position'].includes(operation)) {
  if (!id) throw new Error('Enter the existing job ID for this action.');
  const job = jobs.find(item => item.id === id);
  if (!job) throw new Error(`No position found with ID "${id}".`);
  if (operation === 'Close a position') job.active = false;
  else if (operation === 'Reopen a position') job.active = true;
  else {
    if (!title) throw new Error('Add a job title before publishing.');
    Object.assign(job, {
      title,
      department: text('JOB_DEPARTMENT'),
      location: text('JOB_LOCATION') || 'India',
      type: text('JOB_TYPE') || 'Full time',
      summary: text('JOB_SUMMARY'),
      requirements,
    });
  }
} else {
  throw new Error('Choose Add, Edit, Close or Reopen.');
}

await writeFile(file, `${JSON.stringify(jobs, null, 2)}\n`, 'utf8');
console.log(`Updated ${jobs.length} public job listing(s).`);
