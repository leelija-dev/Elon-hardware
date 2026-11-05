import "server-only";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { rowToProduct, type ProductRow } from "./catalog";
import { db } from "./db";
import type { Product } from "./types";
import { UPLOAD_DIR } from "./uploads";

export type AdminProduct = Product & { status: string; updatedAt?: string };

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[‐-―]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Turns MySQL duplicate-key / foreign-key errors into readable messages. */
export function dbErrorMessage(e: unknown, what = "item"): string {
  const err = e as { code?: string; message?: string };
  if (err.code === "ER_DUP_ENTRY") return `Another ${what} already uses this URL / name.`;
  if (err.code === "ER_NO_REFERENCED_ROW_2" || err.code === "ER_NO_REFERENCED_ROW") return `The selected parent no longer exists.`;
  if (err.code === "ER_ROW_IS_REFERENCED_2" || err.code === "ER_ROW_IS_REFERENCED") return `This ${what} is still in use.`;
  if (err.code === "ECONNREFUSED" || err.code === "ER_ACCESS_DENIED_ERROR") return "Cannot connect to the database — check the DB_* settings in .env.";
  return err.message ?? "Unknown database error.";
}

/* ---------------- products ---------------- */

export async function adminListProducts(filter: { q?: string; category?: string; status?: string } = {}) {
  const where: string[] = [];
  const args: string[] = [];
  if (filter.category) {
    where.push("category_slug = ?");
    args.push(filter.category);
  }
  if (filter.status) {
    where.push("status = ?");
    args.push(filter.status);
  }
  if (filter.q) {
    where.push("(name LIKE ? OR code LIKE ? OR slug LIKE ?)");
    args.push(`%${filter.q}%`, `%${filter.q}%`, `%${filter.q}%`);
  }
  const rows = (await db()
    .prepare(`SELECT * FROM products ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY category_slug, \`rank\` DESC, name`)
    .all(...args)) as ProductRow[];
  return rows.map((r) => ({ ...rowToProduct(r), updatedAt: r.updated_at as string }));
}

export async function adminGetProduct(slug: string): Promise<AdminProduct | null> {
  const r = (await db().prepare("SELECT * FROM products WHERE slug = ?").get(slug)) as ProductRow | undefined;
  return r ? { ...rowToProduct(r), updatedAt: r.updated_at as string } : null;
}

export async function slugExists(slug: string) {
  return !!(await db().prepare("SELECT 1 FROM products WHERE slug = ?").get(slug));
}

export async function saveProduct(p: AdminProduct, originalSlug?: string) {
  const row = {
    slug: p.slug,
    name: p.name,
    code: p.code ?? null,
    category: p.category,
    subtitle: p.subtitle,
    summary: p.summary,
    description: p.description,
    images: JSON.stringify(p.images),
    finishes: JSON.stringify(p.finishes ?? []),
    specs: JSON.stringify(p.specs),
    features: JSON.stringify(p.features ?? []),
    groups: JSON.stringify(p.groups ?? []),
    suitableFor: JSON.stringify(p.suitableFor ?? []),
    tags: JSON.stringify(p.tags ?? []),
    locker: p.locker ? JSON.stringify(p.locker) : null,
    extraDetails: JSON.stringify(p.extraDetails ?? []),
    accessModes: JSON.stringify(p.accessModes ?? []),
    colors: JSON.stringify(p.colors ?? []),
    sizeChart: p.sizeChart ? JSON.stringify(p.sizeChart) : null,
    badge: p.badge ?? null,
    featured: p.featured ? 1 : 0,
    bestSeller: p.bestSeller ? 1 : 0,
    rank: p.rank,
    status: p.status,
    addedOn: p.addedOn,
    now: new Date().toISOString(),
    original: originalSlug ?? p.slug,
  };
  if (originalSlug) {
    await db()
      .prepare(
        `UPDATE products SET slug=@slug,name=@name,code=@code,category_slug=@category,subtitle=@subtitle,summary=@summary,description=@description,
         images=@images,finishes=@finishes,specs=@specs,features=@features,groups_json=@groups,suitable_for=@suitableFor,tags=@tags,locker=@locker,
         extra_details=@extraDetails,access_modes=@accessModes,colors=@colors,size_chart=@sizeChart,
         badge=@badge,featured=@featured,best_seller=@bestSeller,\`rank\`=@rank,status=@status,added_on=@addedOn,updated_at=@now WHERE slug=@original`,
      )
      .run(row);
  } else {
    await db()
      .prepare(
        `INSERT INTO products (slug,name,code,category_slug,subtitle,summary,description,images,finishes,specs,features,groups_json,suitable_for,tags,locker,
           extra_details,access_modes,colors,size_chart,badge,featured,best_seller,\`rank\`,status,added_on,updated_at)
         VALUES (@slug,@name,@code,@category,@subtitle,@summary,@description,@images,@finishes,@specs,@features,@groups,@suitableFor,@tags,@locker,
           @extraDetails,@accessModes,@colors,@sizeChart,@badge,@featured,@bestSeller,@rank,@status,@addedOn,@now)`,
      )
      .run(row);
  }
}

export async function deleteProduct(slug: string) {
  await db().prepare("DELETE FROM products WHERE slug = ?").run(slug);
}

/* ---------------- categories & ranges ---------------- */

type Row = Record<string, string | number | null>;

export async function adminListCategories() {
  return (await db()
    .prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_slug = c.slug) AS product_count
       FROM categories c ORDER BY (SELECT sort FROM ranges r WHERE r.slug = c.range_slug), c.sort, c.name`,
    )
    .all()) as Row[];
}

export async function adminListRanges() {
  return (await db()
    .prepare(
      `SELECT r.*, (SELECT COUNT(*) FROM categories c WHERE c.range_slug = r.slug) AS category_count
       FROM ranges r ORDER BY r.sort, r.name`,
    )
    .all()) as Row[];
}

export async function categoryExists(slug: string) {
  return !!(await db().prepare("SELECT 1 FROM categories WHERE slug = ?").get(slug));
}

export async function upsertCategory(c: Record<string, string | number | null>, originalSlug?: string) {
  if (originalSlug) {
    await db()
      .prepare(
        `UPDATE categories SET slug=@slug,range_slug=@range_slug,name=@name,short=@short,description=@description,tile=@tile,
         hero_eyebrow=@hero_eyebrow,hero_title=@hero_title,hero_accent=@hero_accent,hero_text=@hero_text,hero_image=@hero_image,
         hero_caption=@hero_caption,section_eyebrow=@section_eyebrow,section_title=@section_title,item_noun=@item_noun,sort=@sort
         WHERE slug=@original`,
      )
      .run({ ...c, original: originalSlug });
  } else {
    await db()
      .prepare(
        `INSERT INTO categories (slug,range_slug,name,short,description,tile,hero_eyebrow,hero_title,hero_accent,hero_text,hero_image,hero_caption,section_eyebrow,section_title,item_noun,sort)
         VALUES (@slug,@range_slug,@name,@short,@description,@tile,@hero_eyebrow,@hero_title,@hero_accent,@hero_text,@hero_image,@hero_caption,@section_eyebrow,@section_title,@item_noun,@sort)`,
      )
      .run(c);
  }
}

export async function deleteCategory(slug: string) {
  const { n } = (await db().prepare("SELECT COUNT(*) AS n FROM products WHERE category_slug = ?").get(slug)) as { n: number };
  if (Number(n) > 0) throw new Error(`Move or delete the ${n} product(s) in this category first.`);
  await db().prepare("DELETE FROM categories WHERE slug = ?").run(slug);
}

export async function rangeExists(slug: string) {
  return !!(await db().prepare("SELECT 1 FROM ranges WHERE slug = ?").get(slug));
}

export async function upsertRange(r: Record<string, string | number | null>, originalSlug?: string) {
  if (originalSlug) {
    await db()
      .prepare(
        `UPDATE ranges SET slug=@slug,name=@name,short=@short,description=@description,image=@image,image_bg=@image_bg,
         hero_title=@hero_title,hero_accent=@hero_accent,hero_text=@hero_text,sort=@sort WHERE slug=@original`,
      )
      .run({ ...r, original: originalSlug });
  } else {
    await db()
      .prepare(
        `INSERT INTO ranges (slug,name,short,description,image,image_bg,hero_title,hero_accent,hero_text,sort)
         VALUES (@slug,@name,@short,@description,@image,@image_bg,@hero_title,@hero_accent,@hero_text,@sort)`,
      )
      .run(r);
  }
}

export async function deleteRange(slug: string) {
  const { n } = (await db().prepare("SELECT COUNT(*) AS n FROM categories WHERE range_slug = ?").get(slug)) as { n: number };
  if (Number(n) > 0) throw new Error(`Move or delete the ${n} categor${Number(n) === 1 ? "y" : "ies"} in this range first.`);
  await db().prepare("DELETE FROM ranges WHERE slug = ?").run(slug);
}

/* ---------------- slides, catalogues, testimonials ---------------- */

export async function adminListSlides() {
  return (await db().prepare("SELECT * FROM slides ORDER BY sort, id").all()) as Row[];
}

export async function upsertSlide(s: Record<string, string | number | null>, id?: number) {
  const cols = "image=@image,mobile_image=@mobile_image,eyebrow=@eyebrow,title=@title,accent=@accent,text=@text,button_label=@button_label,button_href=@button_href,link_label=@link_label,link_href=@link_href,layout=@layout,published=@published,sort=@sort";
  if (id) await db().prepare(`UPDATE slides SET ${cols} WHERE id=@id`).run({ ...s, id });
  else await db().prepare(`INSERT INTO slides SET ${cols}`).run(s);
}

export async function adminListCatalogues() {
  return (await db().prepare("SELECT * FROM catalogues ORDER BY sort, id").all()) as Row[];
}

export async function upsertCatalogue(c: Record<string, string | number | null>, id?: number) {
  if (id) {
    await db()
      .prepare("UPDATE catalogues SET title=@title,cover=@cover,file=@file,file_size=@file_size,published=@published,sort=@sort WHERE id=@id")
      .run({ ...c, id });
  } else {
    await db()
      .prepare(
        "INSERT INTO catalogues (title,cover,file,file_size,published,sort,created_at) VALUES (@title,@cover,@file,@file_size,@published,@sort,@now)",
      )
      .run({ ...c, now: new Date().toISOString() });
  }
}

export async function adminListTestimonials() {
  return (await db().prepare("SELECT * FROM testimonials ORDER BY sort, id").all()) as Row[];
}

export async function upsertTestimonial(t: Record<string, string | number | null>, id?: number) {
  if (id) {
    await db()
      .prepare("UPDATE testimonials SET name=@name,meta=@meta,quote=@quote,rating=@rating,photo=@photo,published=@published,sort=@sort WHERE id=@id")
      .run({ ...t, id });
  } else {
    await db()
      .prepare(
        "INSERT INTO testimonials (name,meta,quote,rating,photo,published,sort,created_at) VALUES (@name,@meta,@quote,@rating,@photo,@published,@sort,@now)",
      )
      .run({ ...t, now: new Date().toISOString() });
  }
}

export async function adminListTeam() {
  return (await db().prepare("SELECT * FROM team_members ORDER BY sort, id").all()) as Row[];
}

export async function upsertTeamMember(t: Record<string, string | number | null>, id?: number) {
  if (id) {
    await db()
      .prepare("UPDATE team_members SET name=@name,designation=@designation,bio=@bio,photo=@photo,published=@published,sort=@sort WHERE id=@id")
      .run({ ...t, id });
  } else {
    await db()
      .prepare(
        "INSERT INTO team_members (name,designation,bio,photo,published,sort,created_at) VALUES (@name,@designation,@bio,@photo,@published,@sort,@now)",
      )
      .run({ ...t, now: new Date().toISOString() });
  }
}

const CONTENT_TABLES = { slides: "slides", catalogues: "catalogues", testimonials: "testimonials", team: "team_members" } as const;
export type ContentTable = keyof typeof CONTENT_TABLES;

export async function getContentRow(table: ContentTable, id: number) {
  return (await db().prepare(`SELECT * FROM ${CONTENT_TABLES[table]} WHERE id = ?`).get(id)) as Row | undefined;
}

export async function deleteContentRow(table: ContentTable, id: number) {
  await db().prepare(`DELETE FROM ${CONTENT_TABLES[table]} WHERE id = ?`).run(id);
}

/* ---------------- settings ---------------- */

export async function saveSettings(values: Record<string, string>) {
  const st = db().prepare("INSERT INTO settings (name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)");
  for (const [k, v] of Object.entries(values)) await st.run(k, v);
}

/* ---------------- uploads ---------------- */

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

export type UploadFolder = "products" | "categories" | "slides" | "catalogues" | "testimonials" | "team";

async function writeUpload(buf: Buffer, originalName: string, ext: string, folder: UploadFolder) {
  const base = slugify(path.parse(originalName).name) || "file";
  const name = `${base}-${crypto.randomBytes(3).toString("hex")}${ext}`;
  const dir = path.join(UPLOAD_DIR, folder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), buf);
  return `/uploads/${folder}/${name}`;
}

/** Saves an uploaded image and returns its public URL (/uploads/...). */
export async function saveUpload(file: File, folder: UploadFolder = "products") {
  const ext = ALLOWED[file.type];
  if (!ext) throw new Error(`${file.name}: only JPG, PNG, WebP or AVIF images are allowed.`);
  if (file.size > 8 * 1024 * 1024) throw new Error(`${file.name}: images must be under 8 MB.`);
  const buf = Buffer.from(await file.arrayBuffer());
  const head = buf.subarray(0, 12).toString("hex");
  const looksLikeImage =
    head.startsWith("ffd8ff") ||
    head.startsWith("89504e47") ||
    buf.subarray(8, 12).toString() === "WEBP" ||
    buf.subarray(4, 12).toString().includes("ftypavi");
  if (!looksLikeImage) throw new Error(`${file.name}: the file is not a valid image.`);
  return writeUpload(buf, file.name, ext, folder);
}

export const MAX_PDF_MB = 50;

/** Saves an uploaded PDF (catalogues) and returns its public URL and size in bytes. */
export async function savePdf(file: File, folder: UploadFolder = "catalogues") {
  if (file.type && file.type !== "application/pdf") throw new Error(`${file.name}: only PDF files are allowed.`);
  if (file.size > MAX_PDF_MB * 1024 * 1024) throw new Error(`${file.name}: PDFs must be under ${MAX_PDF_MB} MB.`);
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.subarray(0, 5).toString() !== "%PDF-") throw new Error(`${file.name}: the file is not a valid PDF.`);
  return { url: await writeUpload(buf, file.name, ".pdf", folder), size: buf.length };
}

/** Deletes a file previously saved in the uploads folder (ignores anything else). */
export async function removeUpload(url: string | null | undefined) {
  if (!url || !url.startsWith("/uploads/")) return;
  const file = path.resolve(UPLOAD_DIR, url.slice("/uploads/".length));
  if (!file.startsWith(UPLOAD_DIR + path.sep)) return;
  await fs.unlink(file).catch(() => {});
}
