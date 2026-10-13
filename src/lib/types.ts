export type AccessMode = "fingerprint" | "pin" | "key" | "app";
export type CapacityBand = "compact" | "medium" | "large";
export type FinishKey = "black" | "gold" | "chrome" | "warm-metallic" | "graphite" | "steel" | "ivory" | "satin-steel";

/** Top-level product range, e.g. "Architectural Hardware". */
export interface Range {
  slug: string;
  name: string;
  /** One-line description used on cards and menus. */
  short: string;
  /** Paragraph used on the home page "One home. Every detail." rows. */
  description: string;
  image: string;
  /** Background behind the round range image (light blue for bath, etc.). */
  imageBg?: string;
  heroTitle?: string;
  heroAccent?: string;
  heroText?: string;
}

export interface GuideStep {
  title: string;
  text: string;
}

/** A product category inside a range, e.g. "Handles". */
export interface Category {
  slug: string;
  range: string;
  name: string;
  short: string;
  description: string;
  /** Small product cut-out used on tiles ("Shop according to your need"). */
  tile?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroAccent?: string;
  heroText?: string;
  heroImage?: string;
  heroCaption?: string;
  sectionEyebrow?: string;
  sectionTitle?: string;
  /** Word used for items in counts, e.g. "designs" or "models". */
  itemNoun?: string;
  guide?: GuideStep[];
}

export interface FeatureItem {
  title: string;
  text?: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  name: string;
  /** Model / product code, searchable. */
  code?: string;
  category: string;
  /** Short line under the name, e.g. "Wi‑Fi enabled digital safe". */
  subtitle: string;
  summary: string;
  description: string;
  /** Public image paths; the first one is the main image. */
  images: string[];
  finishes?: FinishKey[];
  specs: Spec[];
  features?: FeatureItem[];
  /** Extra titled bullet groups on the detail page (e.g. "Access modes", "Alarms"). */
  groups?: { title: string; items: string[] }[];
  suitableFor?: string[];
  badge?: string;
  featured?: boolean;
  /** Higher = earlier for "Featured" sort. */
  rank: number;
  /** YYYY-MM-DD, used for "Newest" sort. */
  addedOn: string;
  tags?: string[];
  /** Locker-only attributes used by filters and the locker finder. */
  locker?: {
    volume: number;
    dimensions: { h: number; w: number; d: number };
    access: AccessMode[];
    fireResistant?: boolean;
    laptopFit?: boolean;
  };
}

export interface ProductView extends Product {
  categoryName: string;
  rangeSlug: string;
  rangeName: string;
  href: string;
  capacityBand?: CapacityBand;
}

export type SortKey = "featured" | "name" | "newest" | "capacity-asc" | "capacity-desc";

export interface ProductQuery {
  q?: string;
  range?: string;
  category?: string;
  finish?: FinishKey[];
  access?: AccessMode[];
  capacity?: CapacityBand[];
  sort?: SortKey;
  page?: number;
  perPage?: number;
}
