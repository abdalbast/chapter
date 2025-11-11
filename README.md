# Marko Website Template

A static website template for a digital agency, prepared for development in Cursor.

## Getting Started

1. Install Node.js (LTS recommended).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

## Project Structure

- `HTML_TEMPLATE/` – Active source for pages, assets, CSS, JS, PHP (forms)
- `DOCUMENTATION/` – Documentation/demo assets only; do not modify for production.

Follow `structure.md` for conventions and non‑negotiable rules.

## Scripts

- `npm run dev` – Local dev server with live reload
- `npm run lint` – Lint HTML, CSS, JS
- `npm run format` – Format with Prettier
- `npm run build` – Production build (static copy and minify)

## Contributing

- Use British English in copy and docs
- Do not change the site’s visual design without approval
- Keep navigation to one row; overflow goes into a dropdown
- Do not alter the directory structure without updating `structure.md`

## Deployment

### GitHub Pages

The website is deployed to GitHub Pages from the `/docs` folder on the `main` branch.

**Live URL:** `https://abdalbast.github.io/chapter/`

**Deployment Process:**
1. Make changes in the `HTML_TEMPLATE/` directory (active development source)
2. Copy updated files to the `/docs` directory for deployment
3. Commit and push changes to the `main` branch
4. GitHub Pages will automatically update the live site

**Note:** The `/docs` folder is a deployment copy. Continue all development work in `HTML_TEMPLATE/` and copy changes to `/docs` when ready to deploy.

### Traditional Web Hosting (Hostinger/Namecheap)

For production deployment with PHP form functionality:
- Deploy contents of `HTML_TEMPLATE/` to a PHP‑capable host
- Use `npm run dev:php` for local testing
- Ensure `form_process.php` and `newsletter_process.php` are accessible under `php/` directory on production
- Configure custom domain and SSL certificate through your hosting provider

**Important:** GitHub Pages serves static files only. PHP forms will not function on GitHub Pages and require traditional web hosting for full functionality.

## Licence

Copyright (c) 2025. All rights reserved.
