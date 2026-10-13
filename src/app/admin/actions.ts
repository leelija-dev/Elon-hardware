"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  adminGetProduct,
  deleteCategory,
  deleteProduct,
  saveProduct,
  saveUpload,
  slugExists,
  slugify,
  upsertCategory,
  updateRange,
  type AdminProduct,
} from "@/lib/admin-data";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { ACCESS_LABELS, FINISHES } from "@/lib/constants";
import { deleteEnquiry, rateLimited, updateEnquiry, type EnquiryStatus } from "@/lib/enquiries";
import type { AccessMode, FinishKey } from "@/lib/types";

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
  updateEnquiry(str(fd, "id"), status, str(fd, "notes") || undefined);
  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiryAction(fd: FormData) {
  await requireAdmin();
  deleteEnquiry(str(fd, "id"));
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
  if (slug !== original && slugExists(slug)) return { error: `Another product already uses the URL “${slug}”.` };
  const category = str(fd, "category");
  if (!category) return { error: "Choose a category." };

  // Images: keep the ones still listed (in the given order), then add new uploads.
  const images = lines(str(fd, "images"));
  try {
    for (const file of fd.getAll("upload")) {
      if (file instanceof File && file.size > 0) images.push(await saveUpload(file));
    }
  } catch (e) {
    return { error: (e as Error).message };
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

  const finishes = fd.getAll("finishes").map(String).filter((f): f is FinishKey => f in FINISHES);
  const volume = Number(str(fd, "volume"));
  const h = Number(str(fd, "h")),
    w = Number(str(fd, "w")),
    d = Number(str(fd, "d"));
  const access = fd.getAll("access").map(String).filter((a): a is AccessMode => a in ACCESS_LABELS);
  const locker =
    volume > 0
      ? {
          volume,
          dimensions: { h: h || 0, w: w || 0, d: d || 0 },
          access,
          fireResistant: fd.get("fireResistant") === "on",
          laptopFit: fd.get("laptopFit") === "on",
        }
      : undefined;

  const existing = original ? adminGetProduct(original) : null;
  const product: AdminProduct = {
    slug,
    name,
    code: str(fd, "code") || undefined,
    category,
    subtitle: str(fd, "subtitle"),
    summary: str(fd, "summary"),
    description: str(fd, "description"),
    images,
    finishes,
    specs,
    features,
    groups: groups.filter((g) => g.items.length),
    suitableFor: csv(str(fd, "suitableFor")),
    tags: csv(str(fd, "tags")),
    badge: str(fd, "badge") || undefined,
    featured: fd.get("featured") === "on",
    rank: Number(str(fd, "rank")) || 0,
    status: str(fd, "status") === "draft" ? "draft" : "published",
    addedOn: str(fd, "addedOn") || existing?.addedOn || new Date().toISOString().slice(0, 10),
    locker,
  };

  try {
    saveProduct(product, original);
  } catch (e) {
    return { error: `Could not save: ${(e as Error).message}` };
  }
  revalidatePath("/", "layout");
  if (!original || original !== slug) redirect(`/admin/products/${slug}?saved=1`);
  return { ok: "Saved." };
}

export async function deleteProductAction(fd: FormData) {
  await requireAdmin();
  deleteProduct(str(fd, "slug"));
  revalidatePath("/", "layout");
  redirect("/admin/products?deleted=1");
}

/* ---------------- categories & ranges ---------------- */

export async function saveCategoryAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const original = str(fd, "originalSlug") || undefined;
  const name = str(fd, "name");
  const slug = slugify(str(fd, "slug") || name);
  if (!name || !slug) return { error: "Name is required." };
  const range = str(fd, "range_slug");
  if (!range) return { error: "Choose a range." };

  let tile = str(fd, "tile") || null;
  let heroImage = str(fd, "hero_image") || null;
  try {
    const tileFile = fd.get("tileUpload");
    if (tileFile instanceof File && tileFile.size > 0) tile = await saveUpload(tileFile, "categories");
    const heroFile = fd.get("heroUpload");
    if (heroFile instanceof File && heroFile.size > 0) heroImage = await saveUpload(heroFile, "categories");
  } catch (e) {
    return { error: (e as Error).message };
  }

  const v = (k: string) => str(fd, k) || null;
  try {
    upsertCategory(
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
        sort: Number(str(fd, "sort")) || 0,
      },
      original,
    );
  } catch (e) {
    const msg = (e as Error).message;
    return { error: msg.includes("UNIQUE") ? `The URL “${slug}” is already used by another category.` : msg };
  }
  revalidatePath("/", "layout");
  if (!original) redirect(`/admin/categories?saved=${slug}`);
  return { ok: "Saved." };
}

export async function deleteCategoryAction(fd: FormData) {
  await requireAdmin();
  try {
    deleteCategory(str(fd, "slug"));
  } catch (e) {
    redirect(`/admin/categories?error=${encodeURIComponent((e as Error).message)}`);
  }
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function saveRangeAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  let image = str(fd, "image");
  try {
    const file = fd.get("imageUpload");
    if (file instanceof File && file.size > 0) image = await saveUpload(file, "categories");
  } catch (e) {
    return { error: (e as Error).message };
  }
  updateRange({
    slug: str(fd, "slug"),
    name: str(fd, "name"),
    short: str(fd, "short"),
    description: str(fd, "description"),
    image,
    image_bg: str(fd, "image_bg") || null,
    hero_title: str(fd, "hero_title") || null,
    hero_accent: str(fd, "hero_accent") || null,
    hero_text: str(fd, "hero_text") || null,
    sort: Number(str(fd, "sort")) || 0,
  });
  revalidatePath("/", "layout");
  return { ok: "Saved." };
}
