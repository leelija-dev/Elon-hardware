import { ACCESS_LABELS, FINISHES } from "./constants";
import type { AccessMode, ExtraDetail, Product, ProductColor } from "./types";

/**
 * Helpers that connect the free-form admin fields (extra details, access modes, colours)
 * to the existing filters and locker finder.
 */

export function colorSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v);

/** Colours of a product — the admin colour list, or (older products) the fixed finishes. */
export function productColors(p: Pick<Product, "colors" | "finishes">): ProductColor[] {
  if (p.colors && p.colors.length) return p.colors;
  return (p.finishes ?? []).filter((f) => FINISHES[f]).map((f) => ({ name: FINISHES[f].label, hex: FINISHES[f].swatch }));
}

/** Extra details — the admin list, or (older lockers) volume and dimensions. */
export function productExtraDetails(p: Pick<Product, "extraDetails" | "locker">): ExtraDetail[] {
  if (p.extraDetails && p.extraDetails.length) return p.extraDetails;
  if (!p.locker) return [];
  const { volume, dimensions: d } = p.locker;
  return [
    { label: "Volume", value: String(volume), unit: "Litres" },
    ...(d.h ? [{ label: "Height", value: String(d.h), unit: "mm" }] : []),
    ...(d.w ? [{ label: "Width", value: String(d.w), unit: "mm" }] : []),
    ...(d.d ? [{ label: "Depth", value: String(d.d), unit: "mm" }] : []),
  ];
}

/** Access modes — the admin list, or (older lockers) the fixed access options. */
export function productAccessModes(p: Pick<Product, "accessModes" | "locker">): string[] {
  if (p.accessModes && p.accessModes.length) return p.accessModes;
  return (p.locker?.access ?? []).map((a) => ACCESS_LABELS[a] ?? a);
}

export function formatDetail(d: ExtraDetail) {
  return d.unit ? `${d.value} ${d.unit}` : d.value;
}

/** Maps free-text access mode names to the filter keys (fingerprint / pin / key / app). */
export function accessKeys(modes: string[]): AccessMode[] {
  const out = new Set<AccessMode>();
  for (const m of modes) {
    const s = m.toLowerCase();
    if (/finger|biometric|thumb/.test(s)) out.add("fingerprint");
    if (/pin|password|passcode|keypad|digital code|code/.test(s)) out.add("pin");
    if (/\bkey\b|mechanical|override/.test(s) && !/keypad/.test(s)) out.add("key");
    if (/app|mobile|wi-?fi|bluetooth|remote|smart/.test(s)) out.add("app");
  }
  return [...out];
}

function num(details: ExtraDetail[], re: RegExp, toMm = false): number {
  const d = details.find((x) => re.test(x.label.trim().toLowerCase()));
  if (!d) return 0;
  const n = parseFloat(d.value.replace(",", "."));
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (!toMm) {
    // Volume: convert ml / cubic cm to litres if needed.
    const u = (d.unit ?? "").toLowerCase();
    if (/^ml|millilit/.test(u)) return n / 1000;
    return n;
  }
  const u = (d.unit ?? "mm").toLowerCase();
  if (u.startsWith("cm")) return n * 10;
  if (u === "m" || u.startsWith("met")) return n * 1000;
  if (u.startsWith("in")) return Math.round(n * 25.4);
  return n;
}

/**
 * Builds the locker filter data from the extra details + access modes.
 * A product counts as a locker when it has a "Volume" / "Capacity" detail.
 */
export function deriveLocker(
  details: ExtraDetail[],
  modes: string[],
  flags: { fireResistant?: boolean; laptopFit?: boolean },
): Product["locker"] {
  const volume = num(details, /^(volume|capacity)/);
  if (!volume) return undefined;
  return {
    volume: Math.round(volume * 10) / 10,
    dimensions: {
      h: num(details, /^(height|h)\b/, true),
      w: num(details, /^(width|w)\b/, true),
      d: num(details, /^(depth|d)\b/, true),
    },
    access: accessKeys(modes),
    fireResistant: !!flags.fireResistant,
    laptopFit: !!flags.laptopFit,
  };
}
