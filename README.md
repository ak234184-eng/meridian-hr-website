# Meridian HR & Staffing website

Responsive multi-page static website for Meridian HR & Staffing. It is designed for GitHub Pages and the custom domain in `CNAME` (`meridian-hr.in`).

## Pages

- `index.html` — homepage and service overview
- `about.html` — company profile and values
- `services.html` — recruitment, staffing, payroll and HR operations
- `jobs.html` — public careers page, populated from `jobs.json`
- `apply.html` — candidate application email draft; applicants attach a resume themselves
- `contact.html` — contact details and email handoff form
- `privacy.html` — website and application privacy notice
- `admin.html` — sign-in route to the GitHub editor for authorized job updates
- `.github/workflows/manage-jobs.yml` — authenticated form for adding, editing, closing, or reopening a role

## Publish on GitHub Pages

1. Upload these files and the `assets` folder to the root of the `main` branch in `ak234184-eng/meridian-hr-website`.
2. In the repository, open **Settings → Pages**. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
3. In the Pages custom-domain box, enter `meridian-hr.in` and save. Keep the `CNAME` file at the repository root. In GoDaddy DNS, use GitHub Pages' currently published custom-domain records and make sure `www` resolves/redirects consistently with the domain configured in Pages. HTTPS can be enabled in Pages after DNS is verified.
4. Visit the GitHub Actions **Pages build and deployment** workflow and wait for the first deploy to finish before checking the site. GitHub Pages can take some time to issue/refresh the certificate after DNS and custom-domain verification; turn on **Enforce HTTPS** when Pages makes the option available.

The `CNAME` already present in the repository appears to be at its root, according to the screenshot. This project uses ordinary HTML, CSS, JS and JSON; it has no build step or dependency installation.

This build includes the supplied brand images in `assets/logo.jpg` and `assets/cover-page.jpg`.

## Updating open positions

The careers page reads active listings from `jobs.json`. Open `admin.html` and choose **Sign in and manage jobs**. Sign in to the authorized GitHub account, open **Actions → Manage job listings → Run workflow**, choose Add/Edit/Close/Reopen, fill the fields, and run it. The workflow validates the request and opens a pull request with the proposed update. Review and merge that pull request to publish; the merge triggers GitHub Pages deployment. A GitHub account needs repository write access to run the workflow. Keep repository write access limited to the site administrator. Public visitors can read job listings but cannot publish them. Job changes in pull requests may be publicly visible before merge, so never include applicant data or confidential hiring notes.

## Contact form

The contact and application forms open a prefilled email addressed to `admin@meridian-hr.in`. Visitors review and send it from their own mail app. On the application page, they attach their resume themselves; this site does not upload or retain files. To accept web submissions centrally or collect resume uploads, create a Formspree form, verify the `admin@meridian-hr.in` recipient, choose a plan with file uploads if needed, then add its form endpoint to the forms and update `privacy.html` before publishing. Do not add a fake endpoint or expose private service API keys in frontend code.

## WhatsApp

The contact page and floating shortcut open a chat with the supplied business number, `+91 97167 27058`. Confirm that this number is currently monitored for business and candidate enquiries.

## Search visibility

`sitemap.xml`, `robots.txt`, canonical URLs, social sharing metadata, and homepage organization structured data are included. To monitor Google indexing, sign in to Google Search Console with the business Google account, add and verify `meridian-hr.in` (a domain property can be verified through a DNS record at GoDaddy), then submit `https://meridian-hr.in/sitemap.xml`. Verification and sitemap submission require the site owner’s Google and DNS accounts.

## Content notes

Company service, contact, staffing and registration details were taken from the supplied Meridian presentation and the numbers provided in the request. The two example roles from recruitment profile context are marked inactive because current vacancies were not confirmed. Add only verified openings through the admin workflow. No GST certificate scan, PAN, employee records or candidate resumes are included in the website files. No third-party claims about guaranteed compliance or specific outcome percentages are made.
