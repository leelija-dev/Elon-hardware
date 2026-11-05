"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  adminGetProduct,
  categoryExists,
  dbErrorMessage,
  deleteCategory,
  deleteContentRow,
  deleteProduct,
  deleteRange,
  getContentRow,
  rangeExists,
  removeUpload,
  savePdf,
  saveProduct,
  saveSettings,
  saveUpload,
  slugExists,
  slugify,
  upsertCatalogue,
  upsertCategory,
  upsertRange,
  upsertSlide,
  upsertTeamMember,
  upsertTestimonial,
  type AdminProduct,
  type ContentTable,
} from "@/lib/admin-data";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { SOCIALS } from "@/lib/content";
import { deleteEnquiry, rateLimited, updateEnquiry, type EnquiryStatus } from "@/lib/enquiries";
import { deriveLocker, isHex } from "@/lib/product-fields";
import type { ExtraDetail, ProductColor } from "@/lib/types";

export type FormState = { error?: string; ok?: string } | undefined;

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const lines = (s: string) =>
  s
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
const csv = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
const file = (fd: FormData, k: string) => {
  const f = fd.get(k);
  return f instanceof File && f.size > 0 ? f : null;
};
const intOr = (v: string, d = 0) => (Number.isFinite(Number(v)) && v !== "" ? Math.trunc(Number(v)) : d);

/** Parses a JSON array/object sent by the admin repeaters and validates it. */
function parseJson<T>(fd: FormData, key: string, schema: z.ZodType<T>, fallback: T): T {
  const raw = str(fd, key);
  if (!raw) return fallback;
  try {
    const r = schema.safeParse(JSON.parse(raw));
    return r.success ? r.data : fallback;
  } catch {
    return fallback;
  }
}

const text = (max: number) => z.string().trim().max(max);

const extraDetailsSchema = z
  .array(z.object({ label: text(80), value: text(120), unit: text(40).optional() }))
  .max(60)
  .transform((rows) =>
    rows
      .filter((r) => r.label && r.value)
      .map((r): ExtraDetail => ({ label: r.label, value: r.value, ...(r.unit ? { unit: r.unit } : {}) })),
  );

const accessModesSchema = z
  .array(text(60))
  .max(30)
  .transform((rows) => [...new Set(rows.filter(Boolean))]);

const colorsSchema = z
  .array(z.object({ name: text(60), hex: text(7) }))
  .max(40)
  .transform((rows) =>
    rows
      .filter((r) => r.name)
      .map((r): ProductColor => ({ name: r.name, hex: isHex(r.hex) ? r.hex.toLowerCase() : "#cccccc" }))
      .filter((r, i, all) => all.findIndex((x) => x.name.toLowerCase() === r.name.toLowerCase()) === i),
  );

const sizeChartSchema = z
  .object({
    title: text(120).optional(),
    note: text(1000).optional(),
    image: text(500).optional(),
    columns: z.array(text(60)).max(12),
    rows: z.array(z.array(text(120)).max(12)).max(60),
  })
  .nullable();

/* ---------------- auth ---------------- */

export async function loginAction(_: FormState, fd: FormData): Promise<FormState> {
  if (rateLimited("admin-login", 10, 15 * 60 * 1000)) return { error: "Too many attempts. Try again in 15 minutes." };
  if (!checkPassword(str(fd, "password"))) return { error: "Incorrect password." };
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------------- enquiries ---------------- */

export async function updateEnquiryAction(fd: FormData) {
  await requireAdmin();
  const status = str(fd, "status") as EnquiryStatus;
  if (!["new", "contacted", "closed"].includes(status)) return;
  await updateEnquiry(str(fd, "id"), status, str(fd, "notes") || undefined);
  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiryAction(fd: FormData) {
  await requireAdmin();
  await deleteEnquiry(str(fd, "id"));
  revalidatePath("/admin/enquiries");
}

/* ---------------- products ---------------- */

export async function saveProductAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const original = str(fd, "originalSlug") || undefined;
  const name = str(fd, "name");
  if (!name) return { error: "Name is required." };
  const slug = slugify(str(fd, "slug") || name);
  if (!slug) return { error: "Please enter a valid URL slug." };
  if (slug !== original && (await slugExists(slug))) return { error: `Another product already uses the URL “${slug}”.` };
  const category = str(fd, "category");
  if (!category) return { error: "Choose a category." };
  if (!(await categoryExists(category))) return { error: "The chosen category no longer exists — pick another one." };

  // Images: keep the ones still listed (in the given order), then add new uploads.
  const images = lines(str(fd, "images")).filter((u) => u.startsWith("/"));
  let sizeChart = parseJson(fd, "sizeChart", sizeChartSchema, null);
  try {
    for (const f of fd.getAll("upload")) {
      if (f instanceof File && f.size > 0) images.push(await saveUpload(f));
    }
    const chartImage = file(fd, "sizeChartUpload");
    if (chartImage) sizeChart = { columns: [], rows: [], ...(sizeChart ?? {}), image: await saveUpload(chartImage) };
  } catch (e) {
    return { error: (e as Error).message };
  }
  if (sizeChart) {
    const cols = sizeChart.columns.length;
    sizeChart.rows = sizeChart.rows.map((r) => Array.from({ length: cols }, (_, i) => r[i] ?? "")).filter((r) => r.some(Boolean));
    if (!sizeChart.rows.length && !sizeChart.image && !sizeChart.note) sizeChart = null;
  }

  const specs = lines(str(fd, "specs"))
    .map((l) => {
      const i = l.indexOf(":");
      return i > 0 ? { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() } : null;
    })
    .filter((x): x is { label: string; value: string } => !!x && !!x.label && !!x.value);

  const features = lines(str(fd, "features")).map((l) => {
    const [title, ...rest] = l.split(/\s+[—–-]\s+/);
    return { title: title.trim(), text: rest.join(" — ").trim() || undefined };
  });

  const groups: { title: string; items: string[] }[] = [];
  for (const l of lines(str(fd, "groups"))) {
    if (l.startsWith("#")) groups.push({ title: l.replace(/^#+\s*/, ""), items: [] });
    else if (groups.length) groups[groups.length - 1].items.push(l.replace(/^[-•*]\s*/, ""));
  }

  const extraDetails = parseJson(fd, "extraDetails", extraDetailsSchema, []);
  const accessModes = parseJson(fd, "accessModes", accessModesSchema, []);
  const colors = parseJson(fd, "colors", colorsSchema, []);
  const locker = deriveLocker(extraDetails, accessModes, {
    fireResistant: fd.get("fireResistant") === "on",
    laptopFit: fd.get("laptopFit") === "on",
  });

  const existing = original ? await adminGetProduct(original) : null;
  const addedOn = str(fd, "addedOn");
  const product: AdminProduct = {
    slug,
    name,
    code: str(fd, "code") || undefined,
    category,
    subtitle: str(fd, "subtitle"),
    summary: str(fd, "summary"),
    description: str(fd, "description"),
    images,
    finishes: [], // replaced by the colour list
    colors,
    extraDetails,
    accessModes,
    sizeChart: sizeChart ?? undefined,
    specs,
    features,
    groups: groups.filter((g) => g.items.length),
    suitableFor: csv(str(fd, "suitableFor")),
    tags: csv(str(fd, "tags")),
    badge: str(fd, "badge") || undefined,
    featured: fd.get("featured") === "on",
    bestSeller: fd.get("bestSeller") === "on",
    rank: intOr(str(fd, "rank")),
    status: str(fd, "status") === "draft" ? "draft" : "published",
    addedOn: /^\d{4}-\d{2}-\d{2}$/.test(addedOn) ? addedOn : existing?.addedOn || new Date().toISOString().slice(0, 10),
    locker,
  };

  try {
    await saveProduct(product, original);
  } catch (e) {
    console.error("saveProduct failed:", e);
    return { error: `Could not save: ${dbErrorMessage(e, "product")}` };
  }
  revalidatePath("/", "layout");
  if (!original || original !== slug) redirect(`/admin/products/${slug}?saved=1`);
  return { ok: "Saved." };
}

export async function deleteProductAction(fd: FormData) {
  await requireAdmin();
  await deleteProduct(str(fd, "slug"));
  revalidatePath("/", "layout");
  redirect("/admin/products?deleted=1");
}

/* ---------------- categories ---------------- */

export async function saveCategoryAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const original = str(fd, "originalSlug") || undefined;
  const name = str(fd, "name");
  const slug = slugify(str(fd, "slug") || name);
  if (!name || !slug) return { error: "Name is required." };
  const range = str(fd, "range_slug");
  if (!range) return { error: "Choose a range." };
  if (!(await rangeExists(range))) return { error: "The chosen range no longer exists — pick another one." };
  if (slug !== original && (await categoryExists(slug))) return { error: `The URL “${slug}” is already used by another category.` };

  let tile = str(fd, "tile") || null;
  let heroImage = str(fd, "hero_image") || null;
  try {
    const tileFile = file(fd, "tileUpload");
    if (tileFile) tile = await saveUpload(tileFile, "categories");
    const heroFile = file(fd, "heroUpload");
    if (heroFile) heroImage = await saveUpload(heroFile, "categories");
  } catch (e) {
    return { error: (e as Error).message };
  }

  const v = (k: string) => str(fd, k) || null;
  try {
    await upsertCategory(
      {
        slug,
        range_slug: range,
        name,
        short: str(fd, "short"),
        description: str(fd, "description"),
        tile,
        hero_eyebrow: v("hero_eyebrow"),
        hero_title: v("hero_title"),
        hero_accent: v("hero_accent"),
        hero_text: v("hero_text"),
        hero_image: heroImage,
        hero_caption: v("hero_caption"),
        section_eyebrow: v("section_eyebrow"),
        section_title: v("section_title"),
        item_noun: v("item_noun"),
        sort: intOr(str(fd, "sort")),
      },
      original,
    );
  } catch (e) {
    console.error("saveCategory failed:", e);
    return { error: `Could not save: ${dbErrorMessage(e, "category")}` };
  }
  revalidatePath("/", "layout");
  if (!original) redirect(`/admin/categories?saved=${slug}`);
  return { ok: "Saved." };
}

export async function deleteCategoryAction(fd: FormData) {
  await requireAdmin();
  let error = "";
  try {
    await deleteCategory(str(fd, "slug"));
  } catch (e) {
    error = (e as Error).message;
  }
  if (error) redirect(`/admin/categories?error=${encodeURIComponent(error)}`);
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

/* ---------------- ranges ---------------- */

export async function saveRangeAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const original = str(fd, "originalSlug") || undefined;
  const name = str(fd, "name");
  const slug = slugify(str(fd, "slug") || name);
  if (!name || !slug) return { error: "Name is required." };
  if (slug !== original && (await rangeExists(slug))) return { error: `The URL “${slug}” is already used by another range.` };

  let image = str(fd, "image");
  try {
    const f = file(fd, "imageUpload");
    if (f) image = await saveUpload(f, "categories");
  } catch (e) {
    return { error: (e as Error).message };
  }
  try {
    await upsertRange(
      {
        slug,
        name,
        short: str(fd, "short"),
        description: str(fd, "description"),
        image,
        image_bg: str(fd, "image_bg") || null,
        hero_title: str(fd, "hero_title") || null,
        hero_accent: str(fd, "hero_accent") || null,
        hero_text: str(fd, "hero_text") || null,
        sort: intOr(str(fd, "sort")),
      },
      original,
    );
  } catch (e) {
    console.error("saveRange failed:", e);
    return { error: `Could not save: ${dbErrorMessage(e, "range")}` };
  }
  revalidatePath("/", "layout");
  if (!original || original !== slug) redirect(`/admin/ranges?saved=${slug}`);
  return { ok: "Saved." };
}

export async function deleteRangeAction(fd: FormData) {
  await requireAdmin();
  let error = "";
  try {
    await deleteRange(str(fd, "slug"));
  } catch (e) {
    error = (e as Error).message;
  }
  if (error) redirect(`/admin/ranges?error=${encodeURIComponent(error)}`);
  revalidatePath("/", "layout");
  redirect("/admin/ranges?deleted=1");
}

/* ---------------- home slider ---------------- */

export async function saveSlideAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = intOr(str(fd, "id")) || undefined;
  let image = str(fd, "image");
  let mobileImage = str(fd, "mobile_image") || null;
  try {
    const f = file(fd, "imageUpload");
    if (f) image = await saveUpload(f, "slides");
    const m = file(fd, "mobileUpload");
    if (m) mobileImage = await saveUpload(m, "slides");
  } catch (e) {
    return { error: (e as Error).message };
  }
  if (!image) return { error: "Upload a slide image." };
  const v = (k: string) => str(fd, k) || null;
  try {
    await upsertSlide(
      {
        image,
        mobile_image: mobileImage,
        eyebrow: v("eyebrow"),
        title: v("title"),
        accent: v("accent"),
        text: v("text"),
        button_label: v("button_label"),
        button_href: v("button_href"),
        link_label: v("link_label"),
        link_href: v("link_href"),
        layout: str(fd, "layout") === "full" ? "full" : "split",
        published: fd.get("published") === "on" ? 1 : 0,
        sort: intOr(str(fd, "sort")),
      },
      id,
    );
  } catch (e) {
    return { error: `Could not save: ${dbErrorMessage(e, "slide")}` };
  }
  revalidatePath("/", "layout");
  if (!id) redirect("/admin/slides?saved=1");
  return { ok: "Saved." };
}

/* ---------------- catalogues (downloads page) ---------------- */

export async function saveCatalogueAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = intOr(str(fd, "id")) || undefined;
  const title = str(fd, "title");
  if (!title) return { error: "Catalogue title is required." };
  const existing = id ? await getContentRow("catalogues", id) : undefined;
  let cover = (existing?.cover as string) ?? "";
  let pdf = (existing?.file as string) ?? "";
  let size = Number(existing?.file_size) || 0;
  const created: string[] = [];
  try {
    // PDF first (largest / most likely to be rejected), then the cover.
    const d = file(fd, "fileUpload");
    if (d) {
      const saved = await savePdf(d);
      pdf = saved.url;
      size = saved.size;
      created.push(pdf);
    }
    const c = file(fd, "coverUpload");
    if (c) {
      cover = await saveUpload(c, "catalogues");
      created.push(cover);
    }
  } catch (e) {
    for (const u of created) await removeUpload(u);
    return { error: (e as Error).message };
  }
  const missing = !cover ? "Upload a cover image." : !pdf ? "Upload the catalogue PDF." : "";
  if (missing) {
    for (const u of created) await removeUpload(u);
    return { error: missing };
  }
  try {
    await upsertCatalogue(
      { title, cover, file: pdf, file_size: size, published: fd.get("published") === "on" ? 1 : 0, sort: intOr(str(fd, "sort")) },
      id,
    );
  } catch (e) {
    return { error: `Could not save: ${dbErrorMessage(e, "catalogue")}` };
  }
  // Remove replaced files.
  if (existing && existing.cover !== cover) await removeUpload(existing.cover as string);
  if (existing && existing.file !== pdf) await removeUpload(existing.file as string);
  revalidatePath("/downloads");
  revalidatePath("/admin/catalogues");
  if (!id) redirect("/admin/catalogues?saved=1");
  return { ok: "Saved." };
}

/* ---------------- testimonials ---------------- */

export async function saveTestimonialAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = intOr(str(fd, "id")) || undefined;
  const name = str(fd, "name");
  const quote = str(fd, "quote");
  if (!name || !quote) return { error: "Customer name and review are required." };
  let photo = str(fd, "photo") || null;
  try {
    const p = file(fd, "photoUpload");
    if (p) photo = await saveUpload(p, "testimonials");
  } catch (e) {
    return { error: (e as Error).message };
  }
  if (fd.get("removePhoto") === "on") photo = null;
  try {
    await upsertTestimonial(
      {
        name: name.slice(0, 255),
        meta: str(fd, "meta").slice(0, 255) || null,
        quote: quote.slice(0, 2000),
        rating: Math.min(5, Math.max(1, intOr(str(fd, "rating"), 5))),
        photo,
        published: fd.get("published") === "on" ? 1 : 0,
        sort: intOr(str(fd, "sort")),
      },
      id,
    );
  } catch (e) {
    return { error: `Could not save: ${dbErrorMessage(e, "review")}` };
  }
  revalidatePath("/", "layout");
  if (!id) redirect("/admin/testimonials?saved=1");
  return { ok: "Saved." };
}

/* ---------------- team (About page) ---------------- */

export async function saveTeamMemberAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = intOr(str(fd, "id")) || undefined;
  const name = str(fd, "name");
  if (!name) return { error: "Name is required." };
  const old = str(fd, "photo") || null;
  let photo = old;
  try {
    const p = file(fd, "photoUpload");
    if (p) photo = await saveUpload(p, "team");
  } catch (e) {
    return { error: (e as Error).message };
  }
  if (fd.get("removePhoto") === "on" && !file(fd, "photoUpload")) photo = null;
  try {
    await upsertTeamMember(
      {
        name: name.slice(0, 255),
        designation: str(fd, "designation").slice(0, 255) || null,
        bio: str(fd, "bio").slice(0, 1500) || null,
        photo,
        published: fd.get("published") === "on" ? 1 : 0,
        sort: intOr(str(fd, "sort")),
      },
      id,
    );
  } catch (e) {
    if (photo !== old) await removeUpload(photo);
    return { error: `Could not save: ${dbErrorMessage(e, "team member")}` };
  }
  if (old && photo !== old) await removeUpload(old);
  revalidatePath("/about");
  revalidatePath("/admin/team");
  if (!id) redirect("/admin/team?saved=1");
  return { ok: "Saved." };
}

/* ---------------- shared delete for slides / catalogues / testimonials ---------------- */

export async function deleteContentAction(fd: FormData) {
  await requireAdmin();
  const table = str(fd, "table") as ContentTable;
  if (!["slides", "catalogues", "testimonials", "team"].includes(table)) return;
  const id = intOr(str(fd, "id"));
  const row = await getContentRow(table, id);
  if (row) {
    await deleteContentRow(table, id);
    for (const k of ["image", "mobile_image", "cover", "file", "photo"]) await removeUpload(row[k] as string);
  }
  revalidatePath("/", "layout");
  redirect(`/admin/${table}?deleted=1`);
}

/* ---------------- settings ---------------- */

export async function saveSettingsAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const values: Record<string, string> = {};
  for (const k of SOCIALS) {
    const url = str(fd, `social_${k}`);
    if (url && !/^https?:\/\//i.test(url)) return { error: `The ${k} link must start with https://` };
    values[`social_${k}`] = url.slice(0, 500);
  }
  values.home_products_mode = str(fd, "home_products_mode") === "bestsellers" ? "bestsellers" : "latest";
  values.home_products_eyebrow = str(fd, "home_products_eyebrow").slice(0, 120);
  values.home_products_title = str(fd, "home_products_title").slice(0, 120);
  try {
    await saveSettings(values);
  } catch (e) {
    return { error: `Could not save: ${dbErrorMessage(e, "setting")}` };
  }
  revalidatePath("/", "layout");
  return { ok: "Saved." };
}
