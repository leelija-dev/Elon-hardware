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
  const rows = await db()
    .prepare(`SELECT * FROM products ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY category_slug, rank DESC, name`)
    .all(...args) as ProductRow[];
  return rows.map((r) => ({ ...rowToProduct(r), updatedAt: r.updated_at as string }));
}

export async function adminGetProduct(slug: string): Promise<AdminProduct | null> {
  const r = await db().prepare("SELECT * FROM products WHERE slug = ?").get(slug) as ProductRow | undefined;
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
    badge: p.badge ?? null,
    featured: p.featured ? 1 : 0,
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
         badge=@badge,featured=@featured,rank=@rank,status=@status,added_on=@addedOn,updated_at=@now WHERE slug=@original`,
      )
      .run(row);
  } else {
    await db()
      .prepare(
        `INSERT INTO products (slug,name,code,category_slug,subtitle,summary,description,images,finishes,specs,features,groups_json,suitable_for,tags,locker,badge,featured,rank,status,added_on,updated_at)
         VALUES (@slug,@name,@code,@category,@subtitle,@summary,@description,@images,@finishes,@specs,@features,@groups,@suitableFor,@tags,@locker,@badge,@featured,@rank,@status,@addedOn,@now)`,
      )
      .run(row);
  }
}

export async function deleteProduct(slug: string) {
  await db().prepare("DELETE FROM products WHERE slug = ?").run(slug);
}

/* ---------- categories & ranges ---------- */

type Row = Record<string, string | number | null>;

export async function adminListCategories() {
  return await db()
    .prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_slug = c.slug) AS product_count
       FROM categories c ORDER BY (SELECT sort FROM ranges r WHERE r.slug = c.range_slug), c.sort, c.name`,
    )
    .all() as Row[];
}

export async function adminListRanges() {
  return await db().prepare("SELECT * FROM ranges ORDER BY sort, name").all() as Row[];
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
  const { n } = await db().prepare("SELECT COUNT(*) AS n FROM products WHERE category_slug = ?").get(slug) as { n: number };
  if (n > 0) throw new Error(`Move or delete the ${n} product(s) in this category first.`);
  await db().prepare("DELETE FROM categories WHERE slug = ?").run(slug);
}

export async function updateRange(r: Record<string, string | number | null>) {
  await db()
    .prepare(
      `UPDATE ranges SET name=@name,short=@short,description=@description,image=@image,image_bg=@image_bg,
       hero_title=@hero_title,hero_accent=@hero_accent,hero_text=@hero_text,sort=@sort WHERE slug=@slug`,
    )
    .run(r);
}

/* ---------- uploads ---------- */

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

/** Saves an uploaded image and returns its public URL (/uploads/...). */
export async function saveUpload(file: File, folder: "products" | "categories" = "products") {
  const ext = ALLOWED[file.type];
  if (!ext) throw new Error(`${file.name}: only JPG, PNG, WebP or AVIF images are allowed.`);
  if (file.size > 8 * 1024 * 1024) throw new Error(`${file.name}: images must be under 8 MB.`);
  const buf = Buffer.from(await file.arrayBuffer());
  const head = buf.subarray(0, 12).toString("hex");
  const looksLikeImage =
    head.startsWith("ffd8ff") || head.startsWith("89504e47") || buf.subarray(8, 12).toString() === "WEBP" || buf.subarray(4, 12).toString().includes("ftypavi");
  if (!looksLikeImage) throw new Error(`${file.name}: the file is not a valid image.`);
  const base = slugify(path.parse(file.name).name) || "image";
  const name = `${base}-${crypto.randomBytes(3).toString("hex")}${ext}`;
  const dir = path.join(UPLOAD_DIR, folder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), buf);
  return `/uploads/${folder}/${name}`;
}
