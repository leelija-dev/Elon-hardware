import "server-only";
import { ACCESS_LABELS, CAPACITY_BANDS, FINISHES, SORT_OPTIONS, capacityBand } from "./constants";
import { db, json } from "./db";
import type {
  AccessMode,
  CapacityBand,
  Category,
  FinishKey,
  Product,
  ProductQuery,
  ProductView,
  Range,
  SortKey,
} from "./types";

/* ---------------- row mapping ---------------- */

type RangeRow = Record<string, string | number | null>;

function toRange(r: RangeRow): Range {
  return {
    slug: r.slug as string,
    name: r.name as string,
    short: (r.short as string) ?? "",
    description: (r.description as string) ?? "",
    image: (r.image as string) ?? "",
    imageBg: (r.image_bg as string) || undefined,
    heroTitle: (r.hero_title as string) || undefined,
    heroAccent: (r.hero_accent as string) || undefined,
    heroText: (r.hero_text as string) || undefined,
  };
}

function toCategory(r: RangeRow): Category {
  return {
    slug: r.slug as string,
    range: r.range_slug as string,
    name: r.name as string,
    short: (r.short as string) ?? "",
    description: (r.description as string) ?? "",
    tile: (r.tile as string) || undefined,
    heroEyebrow: (r.hero_eyebrow as string) || undefined,
    heroTitle: (r.hero_title as string) || undefined,
    heroAccent: (r.hero_accent as string) || undefined,
    heroText: (r.hero_text as string) || undefined,
    heroImage: (r.hero_image as string) || undefined,
    heroCaption: (r.hero_caption as string) || undefined,
    sectionEyebrow: (r.section_eyebrow as string) || undefined,
    sectionTitle: (r.section_title as string) || undefined,
    itemNoun: (r.item_noun as string) || undefined,
    guide: json.parse(r.guide, undefined),
  };
}

export type ProductRow = Record<string, string | number | null>;

export function rowToProduct(r: ProductRow): Product & { status: string } {
  return {
    slug: r.slug as string,
    name: r.name as string,
    code: (r.code as string) || undefined,
    category: r.category_slug as string,
    subtitle: (r.subtitle as string) ?? "",
    summary: (r.summary as string) ?? "",
    description: (r.description as string) ?? "",
    images: json.parse(r.images, []),
    finishes: json.parse(r.finishes, []),
    specs: json.parse(r.specs, []),
    features: json.parse(r.features, []),
    groups: json.parse(r.groups_json, []),
    suitableFor: json.parse(r.suitable_for, []),
    tags: json.parse(r.tags, []),
    locker: json.parse(r.locker, undefined),
    badge: (r.badge as string) || undefined,
    featured: !!r.featured,
    rank: Number(r.rank) || 0,
    addedOn: r.added_on as string,
    status: (r.status as string) ?? "published",
  };
}

function view(p: Product, cats: Map<string, Category>, rangesBySlug: Map<string, Range>): ProductView {
  const cat = cats.get(p.category);
  const range = cat ? rangesBySlug.get(cat.range) : undefined;
  return {
    ...p,
    categoryName: cat?.name ?? p.category,
    rangeSlug: range?.slug ?? "",
    rangeName: range?.name ?? "",
    href: `/product/${p.slug}`,
    capacityBand: p.locker ? capacityBand(p.locker.volume) : undefined,
  };
}

/* ---------------- reads ---------------- */

export function getRanges(): (Range & { count: number; categories: (Category & { count: number })[] })[] {
  const ranges = (db().prepare("SELECT * FROM ranges ORDER BY sort, name").all() as RangeRow[]).map(toRange);
  const cats = getCategories();
  return ranges.map((r) => {
    const rc = cats.filter((c) => c.range === r.slug);
    return { ...r, categories: rc, count: rc.reduce((n, c) => n + c.count, 0) };
  });
}

export function getRange(slug: string) {
  return getRanges().find((r) => r.slug === slug) ?? null;
}

export function getCategories(rangeSlug?: string): (Category & { count: number })[] {
  const rows = db()
    .prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_slug = c.slug AND p.status = 'published') AS count
       FROM categories c ${rangeSlug ? "WHERE c.range_slug = ?" : ""} ORDER BY c.sort, c.name`,
    )
    .all(...(rangeSlug ? [rangeSlug] : [])) as RangeRow[];
  return rows.map((r) => ({ ...toCategory(r), count: Number(r.count) }));
}

export function getCategory(slug: string) {
  return getCategories().find((c) => c.slug === slug) ?? null;
}

function maps() {
  const cats = new Map(getCategories().map((c) => [c.slug, c as Category]));
  const ranges = new Map(
    (db().prepare("SELECT * FROM ranges").all() as RangeRow[]).map((r) => [r.slug as string, toRange(r)]),
  );
  return { cats, ranges };
}

export function getAllProducts(): ProductView[] {
  const { cats, ranges } = maps();
  return (db().prepare("SELECT * FROM products WHERE status = 'published'").all() as ProductRow[]).map((r) =>
    view(rowToProduct(r), cats, ranges),
  );
}

export function getProduct(slug: string): ProductView | null {
  const r = db().prepare("SELECT * FROM products WHERE slug = ? AND status = 'published'").get(slug) as
    | ProductRow
    | undefined;
  if (!r) return null;
  const { cats, ranges } = maps();
  return view(rowToProduct(r), cats, ranges);
}

export function getFeaturedProducts(limit = 8, categorySlug?: string): ProductView[] {
  return getAllProducts()
    .filter((p) => p.featured && (!categorySlug || p.category === categorySlug))
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit);
}

export function getRelatedProducts(p: ProductView, limit = 4): ProductView[] {
  const others = getAllProducts().filter((x) => x.slug !== p.slug);
  const same = others.filter((x) => x.category === p.category).sort((a, b) => b.rank - a.rank);
  const near = others
    .filter((x) => x.category !== p.category && x.rangeSlug === p.rangeSlug)
    .sort((a, b) => b.rank - a.rank);
  return [...same, ...near].slice(0, limit);
}

/** Products for dropdowns (enquiry forms). */
export function getProductOptions() {
  return getAllProducts()
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName) || a.name.localeCompare(b.name, "en", { numeric: true }))
    .map((p) => ({ slug: p.slug, name: p.name, category: p.categoryName }));
}

/* ---------------- search ---------------- */

function normalise(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[‐-―]/g, "-")
    .replace(/[^a-z0-9.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function haystack(p: ProductView): string {
  return normalise(
    [
      p.name,
      p.code ?? "",
      p.subtitle,
      p.categoryName,
      p.rangeName,
      p.summary,
      (p.tags ?? []).join(" "),
      (p.finishes ?? []).map((f) => FINISHES[f]?.label ?? f).join(" "),
      (p.features ?? []).map((f) => f.title).join(" "),
      (p.groups ?? []).flatMap((g) => g.items).join(" "),
      p.specs.map((s) => s.value).join(" "),
      p.locker ? `${p.locker.volume} l ${p.locker.volume}l litre locker safe` : "",
      p.locker?.fireResistant ? "fire resistant fireproof" : "",
      p.locker?.access.includes("app") ? "wifi wi-fi smart app mobile remote" : "",
      p.locker?.access.includes("fingerprint") ? "biometric fingerprint" : "",
      p.locker?.laptopFit ? "laptop" : "",
    ].join(" "),
  );
}

function score(p: ProductView, q: string): number {
  const terms = normalise(q).split(" ").filter(Boolean);
  if (!terms.length) return 1;
  const hay = haystack(p);
  const flatHay = hay.replace(/-/g, "");
  const name = normalise(p.name).replace(/-/g, "");
  const code = normalise(p.code ?? "").replace(/[-\s]/g, "");
  let total = 0;
  for (const t of terms) {
    const tt = t.replace(/-/g, "");
    if (name === tt || code === tt) total += 100;
    else if (name.startsWith(tt) || code.startsWith(tt)) total += 40;
    else if (name.includes(tt)) total += 25;
    if (hay.includes(t)) total += 10;
    else if (tt.length >= 2 && flatHay.includes(tt)) total += 6;
    else return 0;
  }
  return total;
}

export function searchProducts(query: ProductQuery) {
  const perPage = query.perPage ?? 12;
  let list = getAllProducts()
    .map((p) => ({ p, s: query.q ? score(p, query.q) : 1 }))
    .filter((x) => x.s > 0);

  if (query.range) list = list.filter((x) => x.p.rangeSlug === query.range);
  if (query.category) list = list.filter((x) => x.p.category === query.category);
  if (query.finish?.length) list = list.filter((x) => query.finish!.some((f) => x.p.finishes?.includes(f)));
  if (query.access?.length) list = list.filter((x) => query.access!.every((a) => x.p.locker?.access.includes(a)));
  if (query.capacity?.length) list = list.filter((x) => x.p.capacityBand && query.capacity!.includes(x.p.capacityBand));

  const sort = query.sort ?? "featured";
  const vol = (p: ProductView) => p.locker?.volume ?? Number.MAX_SAFE_INTEGER;
  list.sort((a, b) => {
    switch (sort) {
      case "capacity-asc":
        return vol(a.p) - vol(b.p) || a.p.name.localeCompare(b.p.name);
      case "capacity-desc":
        return (b.p.locker?.volume ?? -1) - (a.p.locker?.volume ?? -1) || a.p.name.localeCompare(b.p.name);
      case "name":
        return a.p.name.localeCompare(b.p.name, "en", { numeric: true });
      case "newest":
        return b.p.addedOn.localeCompare(a.p.addedOn) || b.p.rank - a.p.rank;
      default:
        return query.q
          ? b.s - a.s || b.p.rank - a.p.rank
          : b.p.rank - a.p.rank || a.p.name.localeCompare(b.p.name, "en", { numeric: true });
    }
  });

  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, query.page ?? 1), pages);
  return { items: list.slice((page - 1) * perPage, page * perPage).map((x) => x.p), total, page, pages, perPage };
}

/** Which filter options exist (and how many products) for the current listing. */
export function facets(query: ProductQuery) {
  const base = searchProducts({ q: query.q, range: query.range, category: query.category, perPage: 10_000 }).items;
  const finish: Partial<Record<FinishKey, number>> = {};
  const access: Partial<Record<AccessMode, number>> = {};
  const capacity: Partial<Record<CapacityBand, number>> = {};
  for (const p of base) {
    for (const f of p.finishes ?? []) finish[f] = (finish[f] ?? 0) + 1;
    for (const a of p.locker?.access ?? []) access[a] = (access[a] ?? 0) + 1;
    if (p.capacityBand) capacity[p.capacityBand] = (capacity[p.capacityBand] ?? 0) + 1;
  }
  const hasLockers = base.some((p) => p.locker);
  return { finish, access, capacity, hasLockers, total: base.length };
}

/* ---------------- URL <-> query ---------------- */

type SP = Record<string, string | string[] | undefined>;
const list = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v.join(",") : (v ?? ""))
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export function parseQuery(sp: SP, fixed: { range?: string; category?: string } = {}): ProductQuery {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : (sp[k] as string | undefined));
  const sort = one("sort") as SortKey | undefined;
  const page = Number(one("page"));
  return {
    q: one("q")?.trim().slice(0, 80) || undefined,
    range: fixed.range,
    category: fixed.category,
    finish: list(sp.finish).filter((f): f is FinishKey => f in FINISHES),
    access: list(sp.access).filter((a): a is AccessMode => a in ACCESS_LABELS),
    capacity: list(sp.capacity).filter((c): c is CapacityBand => c in CAPACITY_BANDS),
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : "featured",
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
  };
}
