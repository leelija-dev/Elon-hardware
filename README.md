# ELON HARDWARE — Website

Dynamic website for **ELON HARDWARE** (home lockers, digital access solutions, architectural hardware, kitchen & wardrobe fittings, bath and glass hardware), built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4** and a **SQLite** database (Node’s built-in `node:sqlite` — no native modules to compile).

## Features

- **Home, About, Contact** pages built to the approved designs (black / white / gold, serif headlines).
- **Product catalogue by range → category** (`/products`, `/products/[range]`, `/products/[range]/[category]`), as on qubaindia.com:
  - live **search** (name, model code, features, capacity…) with instant suggestions in the header;
  - **sort** (Featured, Newest, Name, Capacity);
  - **filters** — finish, and for home lockers capacity and access type (fingerprint, PIN, key, app);
  - pagination, shareable filter URLs.
- **Product detail pages** (`/product/[slug]`) with gallery, key specs, features, specification table, feature groups, related products and an inline enquiry form. Product JSON‑LD for SEO.
- **Query submission** (`/enquiry`) — book a demo, get a quote, service request or general query; pre‑fills the product or category. Validation, spam honeypot and rate limiting.
- Every enquiry is **saved in the database**, and optionally **emailed** (SMTP) and/or sent to a **webhook**.
- **Locker finder** (`/locker-finder`) — 3 questions → recommended lockers.
- **Services** (support, warranty, installation, ODI, care), **Downloads**, Privacy & Terms pages, 404 page, sitemap.xml and robots.txt.
- **Admin panel** (`/admin`, password protected):
  - Enquiries: list, search, filter by status, mark contacted/closed, internal notes, delete, **CSV export**.
  - Products: add / edit / delete / draft, **image upload** & reordering, specs, features, finishes, locker attributes.
  - Categories and ranges: edit names, texts and images; add or remove categories.

No cart or payment — the site is for browsing and enquiries.

## Quick start

Requirements: **Node.js 22.13 or newer** (Node 24 LTS recommended). Node may print an “SQLite is an experimental feature” warning on start-up — it is harmless.

```bash
npm install
cp .env.example .env        # then set ADMIN_PASSWORD (and SMTP if you want email alerts)
npm run dev                 # http://localhost:3000
```

The database (`data/elon.db`) is created and filled with the starter catalogue automatically on first run.

### Production

```bash
npm run build
npm start                   # PORT=3000 by default
```

Run behind Nginx/Apache (or a cPanel "Node.js app") with HTTPS. Use a process manager such as **PM2**:

```bash
pm2 start npm --name elon-hardware -- start
```

> **Hosting note:** the site writes to `data/` (SQLite database + uploaded images). Use a host with a persistent disk — a VPS, cPanel Node.js hosting, Railway, Render with a disk, etc. Serverless hosts with read‑only file systems (e.g. Vercel) are not suitable unless you swap SQLite for a hosted database.

**Back up** the `data/` folder regularly — it holds the database and uploaded photos.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript checks |
| `npm run db:reset` | Re‑seed ranges, categories and products from `src/data` (keeps enquiries) |
| `npm run db:reset -- --all` | Delete the whole database (including enquiries) and re‑seed |

## Content you must fill in before launch

- **`src/config/site.ts`** — phone, WhatsApp, email, address, hours, map embed URL, warranty period, social links, About page figures and timeline, downloadable brochures (files go in `public/downloads/`). Values in `[square brackets]` are placeholders.
- **Product photos** — the home locker and handle images were cropped from the approved design mock‑ups and are low resolution. Upload the original photography per product in **Admin → Products**.
- **Categories without products** (door locks, kitchen, bath, glass…) currently show a “range being catalogued” enquiry form. Add products in **Admin → Products** and they appear automatically.
- **Privacy policy / Terms** — placeholder wording; have them reviewed.

## Project structure

```
src/
  app/
    (site)/              public pages (home, about, products, product, contact, enquiry, services…)
    admin/               admin panel (login, enquiries, products, categories, ranges) + server actions
    api/enquiry          POST enquiry endpoint
    api/search           GET live search endpoint
    uploads/[...path]    serves admin-uploaded images
  components/            Header, Footer, ProductCard, ProductListing, EnquiryForm, SearchBox…
  config/site.ts         business details & editable page content
  data/                  starter catalogue (seeds the database)
  lib/                   database, catalogue queries/search, enquiries, auth, schema
  fonts/                 DejaVu Serif (headline font, free licence)
public/images/           design imagery
data/                    SQLite database + uploads (created at runtime, not in git)
```

## Database tables

`ranges`, `categories`, `products` (specs/features/images stored as JSON columns) and `enquiries`. Schema: `src/lib/schema.ts`.
