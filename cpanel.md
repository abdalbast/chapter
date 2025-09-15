# Admin Panel (cPanel) Implementation Plan

This document outlines a pragmatic, Hostinger‑ready plan to add a cPanel‑style admin interface for managing portfolio items and writing articles, while respecting the site’s existing constraints in `structure.md`.

## Goals

- Enable non‑technical owners to manage: Portfolio, Blog Articles (and optionally Team).
- Maintain the current visual design and single‑row navigation rules.
- Keep the existing build/deploy flow intact and static output in `dist/`.
- Be secure, performant, and straightforward to host on Hostinger.

## Structure Compliance (required)

Per `structure.md`:
- Do not change the folder structure without updating that file.
- Keep PHP handlers under `HTML_TEMPLATE/php/`.

You have two compliant paths. Choose one.

### Option A — Separate Admin App (Recommended to avoid structure changes)

- Host a separate admin app on a subdomain (e.g. `admin.example.com`) or a sibling folder outside this repository. The public site repo remains unchanged.
- The admin app writes content to a MySQL database on Hostinger and, on “Publish”, generates static HTML fragments/JSON that the public site consumes during build or via light PHP includes.
- Publication strategies:
  - Static build pull: a small script pulls content (JSON/HTML) and writes into `HTML_TEMPLATE/` before `npm run build`, without restructuring directories.
  - Lightweight PHP render: pages remain in `HTML_TEMPLATE/` and include read‑only PHP snippets from `HTML_TEMPLATE/php/api/` that fetch from the database.
- Pros: zero structural changes to this repo; safer rollout; easy rollback.

### Option B — In‑repository Admin (Requires updating `structure.md` first)

If you later decide to place admin inside this repo, do so without altering top‑level directories:

```
HTML_TEMPLATE/
  admin/                 # Admin UI (PHP views, assets)
  php/
    api/                 # Read‑only endpoints for the public site
    admin/               # Authenticated admin actions (CRUD)
  image/uploads/         # If needed, scoped subfolder for runtime uploads
```

Note: Creating these subfolders constitutes a structure change. Update `structure.md` first if you pick this path.

## Core Features

### Authentication
- Session‑based login, password hashing (`password_hash()` / `password_verify()`), 30‑minute inactivity timeout.
- CSRF tokens on all state‑changing forms, brute‑force protection, optional “remember me”.
- Roles: `admin`, `editor`.

### Portfolio Management
- Fields: title, slug, summary, rich description, client, project URL, technologies, project date/status, featured flag, SEO meta, featured image + gallery.
- Drag‑and‑drop image upload with server‑side validation and WebP generation (with JPEG/PNG fallbacks).
- Sort order controls and publish/draft states.

### Blog Management
- Rich text editor (TinyMCE/CKEditor), featured image, excerpt, categories/tags, SEO meta.
- Draft/Published, scheduled publishing, preview before publish.

### (Optional) Team Management
- Name, position, bio, photo, social links, active/featured, sort order.

### Media Library
- Upload (drag‑and‑drop), thumbnails, alt/caption, folder scoping, search/filter, bulk actions.

## Database Schema (MySQL)

These tables cover Portfolio, Blog, Team, Media, and Users. Adjust naming to your conventions.

```sql
CREATE TABLE admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','editor') DEFAULT 'editor',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE portfolio (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  summary TEXT,
  description LONGTEXT,
  client_name VARCHAR(120),
  project_url VARCHAR(255),
  technologies TEXT,
  project_date DATE,
  status ENUM('completed','in_progress','planning') DEFAULT 'completed',
  featured_image VARCHAR(255),
  gallery_images JSON,
  meta_title VARCHAR(200),
  meta_description TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE blog_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  description TEXT,
  parent_id INT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES blog_categories(id)
);

CREATE TABLE blog_articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  excerpt TEXT,
  content LONGTEXT,
  featured_image VARCHAR(255),
  category_id INT,
  tags JSON,
  meta_title VARCHAR(200),
  meta_description TEXT,
  author_id INT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES admin_users(id),
  FOREIGN KEY (category_id) REFERENCES blog_categories(id)
);

CREATE TABLE team_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  position VARCHAR(120),
  bio TEXT,
  photo VARCHAR(255),
  social_links JSON,
  sort_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE media_files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  file_path VARCHAR(500) NOT NULL,
  file_size INT,
  mime_type VARCHAR(100),
  alt_text VARCHAR(255),
  caption TEXT,
  folder VARCHAR(100),
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES admin_users(id)
);
```

## Application Modules

### Admin UI (both options)
- Responsive layout, single‑row top nav with overflow dropdown (desktop and mobile).
- Sections: Dashboard, Portfolio, Blog, Media, Settings, (Team optional).

### API/Endpoints (read‑only for the public site)
- Keep public‑facing reads separate from admin writes.
- In Option A, expose JSON endpoints from the admin app or generate static JSON files the public site consumes at build time.
- In Option B, place read‑only endpoints under `HTML_TEMPLATE/php/api/` and admin‑only actions under `HTML_TEMPLATE/php/admin/`.

### File Uploads
- Validate MIME and extension, size limits, randomised filenames, folder scoping by feature.
- Use server‑side image processing (e.g. `gd`/`imagick`) to create WebP plus fallbacks.

## Security Checklist

- Strong password hashing, rate‑limited login, session fixation protection, HTTPS‑only cookies.
- CSRF tokens on every POST/PUT/DELETE, input validation and output escaping.
- Prepared statements for all DB access.
- Strict file upload controls; disallow executable uploads; store outside web root where feasible.
- Admin area access rules and security headers.

## Hostinger Deployment

### Common Steps
1. Create a MySQL database and user in Hostinger hPanel.
2. Import the schema above.
3. Configure DB credentials via a single PHP config file (not committed to VCS).
4. Ensure PHP 8.0+ and enable required extensions (`mysqli`, `gd`/`imagick`).
5. Set correct file/dir permissions (644 files, 755 dirs; writable only where uploads occur).

### Option A — Separate Admin App
- Deploy admin to a subdomain (e.g. `admin.example.com`).
- Configure CORS (if serving JSON) or a publishing routine that writes static fragments/JSON into a storage the public site can pull during build.
- Keep this public site’s repo unchanged; content arrives via build or minimal PHP includes.

### Option B — In‑repository Admin
- After updating `structure.md`, upload `HTML_TEMPLATE/admin/` and new `HTML_TEMPLATE/php/*` subfolders.
- Point admin login to `HTML_TEMPLATE/admin/index.php`.
- Lock down `HTML_TEMPLATE/php/admin/` with session checks; expose read‑only endpoints in `HTML_TEMPLATE/php/api/`.

## UX Guidelines

- Match existing brand styles; reuse variables from `HTML_TEMPLATE/css/style.css` where possible.
- Keep navigation to a single row with overflow into a dropdown (desktop and mobile).
- Use clear status toasts, inline validation, accessible controls, and keyboard navigation.
- Provide preview and autosave for long‑form content.

## Phased Delivery

1. Foundation: DB + Auth + Admin shell + Uploads.
2. Portfolio + Blog CRUD with SEO fields.
3. Media library + read‑only public endpoints/static JSON generation.
4. Security hardening, performance, docs, and handover.

## Next Steps

1. Choose Option A (no structure changes) or Option B (update `structure.md`).
2. Provision Hostinger MySQL and PHP settings.
3. Implement Foundation phase and wire in a small sample workflow (add portfolio item → publish → visible on site).
4. Review and iterate on UX.

—

Document owner: Engineering
Language: British English
Last updated: September 2025