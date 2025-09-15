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

## Navbar Structure and Behaviour

### Layout and Sizing
- Logo: Uses `clamp(140px, 8vw, 180px)` for responsive scaling without breakpoint jumps
- Navbar padding: `8px 20px` for compact design
- Navbar wrapper padding: `20px 30px`
- Desktop logo/controls padding: `20px` each side at 1200px+ breakpoint

### Navigation Items
- **Desktop core items (always visible):** Home, About Us, Services, Portfolio, Testimonials, Contact Us
- **Overflow behaviour:** Items that don't fit move to hamburger menu (not second row)
- **Mobile:** All items accessible via hamburger menu collapse
- **Text wrapping:** Prevented with `white-space: nowrap` on `.nav-link`
- **Flex behaviour:** `flex-wrap: nowrap` and `overflow: hidden` on `.navbar-nav`

### Interactive Features
- **Logo animation:** `logoFadeInUp` keyframe with 600ms duration and `prefers-reduced-motion` support
- **Logo link:** Always points to `./index.html` (home page)
- **Hamburger menu:**
  - Icon transforms from bars to X when active
  - Closes on outside click or Escape key
  - Visible at all breakpoints
- **Dark mode toggle:** Positioned at far right with proper spacing

### CSS Classes and Structure
- `.site-logo, .logo-container img`: Logo sizing with `!important` to override conflicts
- `.nav-controls`: Flex container with `justify-content: flex-end` and `gap: 8px`
- `.navbar-brand`: Hover effects with `scale(1.05)` and filter brightness
- `.logo-reveal`: Animation class for entrance effect
- `.nav-btn`: Always visible (`display: inline-flex`) with transition effects

### JavaScript Functions
- `initNavOverflow()`: Dynamic overflow detection and item hiding
- `initNavbarToggle()`: Handles hamburger state, outside clicks, and Escape key
- Bootstrap Collapse integration for mobile menu behaviour

### Responsive Breakpoints
- `1200px+`: Desktop layout with full logo/controls padding
- `<1200px`: Mobile behaviour with Bootstrap collapse handling
- Dynamic overflow detection regardless of fixed breakpoints

### Design Principles
- Single-row navigation at all times (never wrap to second row)
- Smooth responsive scaling without abrupt size changes
- Accessible animations with reduced-motion support
- Clean, compact design with consistent spacing
