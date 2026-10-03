# Meridian HR & Staffing website

Responsive multi-page static website for Meridian HR & Staffing. It is designed for GitHub Pages and the custom domain in `CNAME` (`meridian-hr.in`).

## Pages

- `index.html` — homepage and service overview
- `about.html` — company profile and values
- `services.html` — recruitment, staffing, payroll and HR operations
- `jobs.html` — public careers page, populated from `jobs.json`
- `contact.html` — contact details and email handoff form
- `admin.html` — sign-in route to the GitHub editor for authorized job updates

## Publish on GitHub Pages

1. Upload these files and the `assets` folder to the root of the `main` branch in `ak234184-eng/meridian-hr-website`.
2. In the repository, open **Settings → Pages**. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
3. In the Pages custom-domain box, enter `meridian-hr.in` and save. Keep the `CNAME` file at the repository root. In GoDaddy DNS, use GitHub Pages' currently published custom-domain records and make sure `www` resolves/redirects consistently with the domain configured in Pages. HTTPS can be enabled in Pages after DNS is verified.
4. Visit the GitHub Actions **Pages build and deployment** workflow and wait for the first deploy to finish before checking the site. GitHub Pages can take some time to issue/refresh the certificate after DNS and custom-domain verification; turn on **Enforce HTTPS** when Pages makes the option available.

The `CNAME` already present in the repository appears to be at its root, according to the screenshot. This project uses ordinary HTML, CSS, JS and JSON; it has no build step or dependency installation.

This build includes the supplied brand images in `assets/logo.jpg` and `assets/cover-page.jpg`.

## Updating open positions

The careers page reads active listings from `jobs.json`. Open `admin.html` on the deployed site and continue to GitHub. GitHub requires sign-in and repository write permission before an edit can be committed to `main`; only those authorized commits update the live site. Keep the repository write-access list limited to the site administrator. Public visitors can still read public job listings, but cannot publish a change to them. Do not add passwords, access tokens, resumes or employee information to this site.

## Contact form

The contact form opens a prefilled email addressed to `admin@meridian-hr.in`; the visitor must send it from their own mail app. To accept enquiries in a hosted form inbox or save applications centrally, connect a form service with a published privacy notice or deploy a backend and database.

## Content notes

Company service, contact, staffing and registration details were taken from the supplied Meridian presentation and the numbers provided in the request. The two example job listings come from the supplied recruitment profile context and should be reviewed for current status before publication. No GST certificate scan, PAN, employee records or candidate resumes are included in the website files. No third-party claims about guaranteed compliance or specific outcome percentages are made.
