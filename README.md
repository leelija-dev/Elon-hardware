# ELON HARDWARE — Website

Dynamic website for **ELON HARDWARE** (home lockers, digital access solutions, architectural hardware, kitchen & wardrobe fittings, bath and glass hardware), built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4** and a **MySQL 8 / MariaDB** database.

## Features

- **Home, About, Contact** pages built to the approved designs (black / white / gold, serif headlines).
- **Product catalogue by range → category** (`/products`, `/products/[range]`, `/products/[range]/[category]`), as on qubaindia.com:
  - live **search** (name, model code, features, capacity…) with instant suggestions in the header;
  - **sort** (Featured, Newest, Name, Capacity);
  - **filters** — colour / finish, and for home lockers capacity and access type (fingerprint, PIN, key, app);
  - pagination, shareable filter URLs.
- **Home page slider** (managed in the admin) and a **Latest products / Best sellers** grid below it.
- **Product detail pages** (`/product/[slug]`) with gallery, key specs, colours, access modes, **size chart pop‑up**, features, specification table, feature groups, related products and an inline enquiry form. Product JSON‑LD for SEO.
- **Testimonials** above the footer on the home page, and **social media icons** in the footer.
- **Query submission** (`/enquiry`) — book a demo, get a quote, service request or general query; pre‑fills the product or category. Validation, spam honeypot and rate limiting.
- Every enquiry is **saved in the database**, and optionally **emailed** (SMTP) and/or sent to a **webhook**.
- **Locker finder** (`/locker-finder`) — 3 questions → recommended lockers.
- **Services** (support, warranty, installation, care), **Downloads** (catalogues managed in the admin), Privacy & Terms pages, 404 page, sitemap.xml and robots.txt.
- **Admin panel** (`/admin`, password protected):
  - Enquiries: list, search, filter by status, mark contacted/closed, internal notes, delete, **CSV export**.
  - Products: add / edit / delete / draft, **image upload** & reordering, specs, features, and dynamic lists for **colours**, **extra details** (label / value / unit), **access modes** and a **size chart**.
  - Categories and **ranges**: add, edit, reorder and remove.
  - **Home slider**, **Catalogues** (title + cover image + PDF), **Testimonials**, and **Settings** (social links, home page product grid).

No cart or payment — the site is for browsing and enquiries.

## Quick start

Requirements: **Node.js 22.13 or newer** (Node 24 LTS recommended) and **MySQL 8 or MariaDB 10.5+**.

```bash
npm install
cp .env.example .env        # then set DB_* and ADMIN_PASSWORD (and SMTP if you want email alerts)
npm run dev                 # http://localhost:3000
```

Create an empty database (e.g. `CREATE DATABASE elon_hardware CHARACTER SET utf8mb4;`) and a user for it. On first start the tables are created, new columns are added to older tables automatically, and an empty database is filled with the starter catalogue and home slides.

### Production

```bash
npm run build
npm start                   # PORT=3000 by default
```

Run behind Nginx/Apache (or a cPanel "Node.js app") with HTTPS. Use a process manager such as **PM2**:

```bash
pm2 start npm --name elon-hardware -- start
```

> **Hosting note:** uploaded images and catalogue PDFs are written to `UPLOAD_DIR` (default `data/uploads`). Use a host with a persistent disk — a VPS, cPanel Node.js hosting, Railway, Render with a disk, etc.
> Catalogue PDFs can be up to 50 MB: if you run behind Nginx, raise `client_max_body_size` (e.g. `60m`).

**Back up** the MySQL database and the `data/uploads` folder regularly.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript checks |

## Content you must fill in before launch

- **`src/config/site.ts`** — phone, WhatsApp, email, address, hours, map embed URL, warranty period, About page figures and timeline. Values in `[square brackets]` are placeholders.
- **Admin → Settings** — Facebook, Instagram, LinkedIn and YouTube links (footer icons).
- **Admin → Home slider / Catalogues / Testimonials** — banner slides, downloadable catalogues and genuine customer reviews.
- **Product photos** — the home locker and handle images were cropped from the approved design mock‑ups and are low resolution. Upload the original photography per product in **Admin → Products**.
- **Categories without products** (door locks, kitchen, bath, glass…) currently show a “range being catalogued” enquiry form. Add products in **Admin → Products** and they appear automatically.
- **Privacy policy / Terms** — placeholder wording; have them reviewed.

## Project structure

```
src/
  app/
    (site)/              public pages (home, about, products, product, contact, enquiry, services…)
    admin/               admin panel (enquiries, products, categories, ranges, slider, catalogues, testimonials, settings) + server actions
    api/enquiry          POST enquiry endpoint
    api/search           GET live search endpoint
    uploads/[...path]    serves admin-uploaded images and PDFs
  components/            Header, Footer, ProductCard, ProductListing, EnquiryForm, SearchBox…
  config/site.ts         business details & editable page content
  data/                  starter catalogue (seeds the database)
  lib/                   database, catalogue queries/search, enquiries, auth, schema
  fonts/                 DejaVu Serif (headline font, free licence)
public/images/           design imagery
data/uploads/            admin uploads (created at runtime, not in git)
```

## Database tables

`ranges`, `categories`, `products` (specs, features, images, colours, extra details, access modes and size chart stored as JSON text), `enquiries`, `slides`, `catalogues`, `testimonials` and `settings`. Schema and automatic migrations: `src/lib/schema.ts`, `src/lib/db.ts`.
