import "server-only";
import { site } from "@/config/site";
import { db } from "./db";

type Row = Record<string, unknown>;
const s = (v: unknown) => (v == null ? "" : String(v));

export type Slide = {
  id: number;
  image: string;
  mobileImage?: string;
  eyebrow?: string;
  title?: string;
  accent?: string;
  text?: string;
  buttonLabel?: string;
  buttonHref?: string;
  linkLabel?: string;
  linkHref?: string;
  layout: "split" | "full";
};

export async function getSlides(): Promise<Slide[]> {
  const rows = (await db().prepare("SELECT * FROM slides WHERE published = 1 ORDER BY sort, id").all()) as Row[];
  return rows.map((r) => ({
    id: Number(r.id),
    image: s(r.image),
    mobileImage: s(r.mobile_image) || undefined,
    eyebrow: s(r.eyebrow) || undefined,
    title: s(r.title) || undefined,
    accent: s(r.accent) || undefined,
    text: s(r.text) || undefined,
    buttonLabel: s(r.button_label) || undefined,
    buttonHref: s(r.button_href) || undefined,
    linkLabel: s(r.link_label) || undefined,
    linkHref: s(r.link_href) || undefined,
    layout: r.layout === "full" ? "full" : "split",
  }));
}

export type Catalogue = { id: number; title: string; cover: string; file: string; size: number };

export async function getCatalogues(): Promise<Catalogue[]> {
  const rows = (await db().prepare("SELECT * FROM catalogues WHERE published = 1 ORDER BY sort, id").all()) as Row[];
  return rows.map((r) => ({ id: Number(r.id), title: s(r.title), cover: s(r.cover), file: s(r.file), size: Number(r.file_size) || 0 }));
}

export type Review = { id: number; name: string; meta?: string; quote: string; rating: number; photo?: string };

export async function getTestimonials(): Promise<Review[]> {
  const rows = (await db().prepare("SELECT * FROM testimonials WHERE published = 1 ORDER BY sort, id").all()) as Row[];
  return rows.map((r) => ({
    id: Number(r.id),
    name: s(r.name),
    meta: s(r.meta) || undefined,
    quote: s(r.quote),
    rating: Math.min(5, Math.max(0, Number(r.rating) || 0)),
    photo: s(r.photo) || undefined,
  }));
}

export const SOCIALS = ["facebook", "instagram", "linkedin", "youtube"] as const;
export type SocialKey = (typeof SOCIALS)[number];

export type Settings = {
  social: Record<SocialKey, string>;
  homeProducts: { mode: "latest" | "bestsellers"; eyebrow: string; title: string };
};

export async function getSettings(): Promise<Settings> {
  let map: Record<string, string> = {};
  try {
    const rows = (await db().prepare("SELECT name, value FROM settings").all()) as Row[];
    map = Object.fromEntries(rows.map((r) => [s(r.name), s(r.value)]));
  } catch (e) {
    console.error("Could not load settings:", e);
  }
  const social = Object.fromEntries(SOCIALS.map((k) => [k, map[`social_${k}`] ?? site.social[k] ?? ""])) as Record<SocialKey, string>;
  const best = map.home_products_mode === "bestsellers";
  return {
    social,
    homeProducts: {
      mode: best ? "bestsellers" : "latest",
      eyebrow: map.home_products_eyebrow || (best ? "01 / Customer favourites" : "01 / New in the collection"),
      title: map.home_products_title || (best ? "Best sellers." : "Latest products."),
    },
  };
}

export function formatBytes(n: number) {
  if (!n) return "";
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
