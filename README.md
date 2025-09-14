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

This is a static site. If using the PHP forms, deploy to a PHP‑capable host. Use `npm run dev:php` for local testing. Ensure `form_process.php` and `newsletter_process.php` are accessible under `HTML_TEMPLATE/php/` on production.

## Licence

Copyright (c) 2025. All rights reserved.
