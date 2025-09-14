# Structure and Rules

These conventions are binding. Do not change the folder structure without updating this file.

## Directories

- `HTML_TEMPLATE/` — Active source for pages, CSS, JS, images, and PHP form handlers.
- `DOCUMENTATION/` — Demo and documentation assets; do not modify for production.

## Authoring rules

- British English only in copy and documentation.
- Keep navigation in a single row on all viewports. When tabs overflow, use a dropdown (desktop and mobile). Do not introduce a second row.
- Do not change visual design unless explicitly approved.
- Always consult this `structure.md` before adding features. New features must not change the folder structure.

## Assets

- Prefer WebP with PNG/JPEG fallbacks. Do not overwrite original assets; output optimised variants alongside originals.
- Dark/Light assets must both be provided where applicable. Keep existing filenames; only add suffixes like `-dark`/`-light` when needed.

## Forms

- PHP handlers live under `HTML_TEMPLATE/php/`. For local testing, use the PHP dev server (see README).
- Keep field names and endpoints unchanged unless back‑end integration requires it.

## Linting and formatting

- Use Prettier for formatting. ESLint for JS, Stylelint for CSS, HTMLHint for HTML. Do not auto‑fix changes that alter design semantics.

## Builds

- Build step should copy files from `HTML_TEMPLATE/` to `dist/` with minification, without restructuring directories.

## Accessibility

- Follow WCAG AA. Do not reduce contrast or remove focus styles.
