import type { AccessMode, CapacityBand, FinishKey, SortKey } from "./types";

export const FINISHES: Record<FinishKey, { label: string; swatch: string }> = {
  black: { label: "Black", swatch: "#0b0b0b" },
  gold: { label: "Gold", swatch: "#c9a24a" },
  chrome: { label: "Chrome", swatch: "#c3c7cc" },
  "warm-metallic": { label: "Warm metallic", swatch: "#b0806a" },
  graphite: { label: "Graphite", swatch: "#2b3138" },
  steel: { label: "Steel grey", swatch: "#6f7781" },
  ivory: { label: "Ivory", swatch: "#e7e1d6" },
  "satin-steel": { label: "Satin steel", swatch: "#a9adb2" },
};

export const ACCESS_LABELS: Record<AccessMode, string> = {
  fingerprint: "Fingerprint",
  pin: "PIN code",
  key: "Mechanical key",
  app: "Mobile app",
};

export const CAPACITY_BANDS: Record<CapacityBand, { label: string; range: string; text: string }> = {
  compact: { label: "Compact", range: "up to 20 L", text: "Small spaces. Meaningful essentials." },
  medium: { label: "Everyday", range: "20–45 L", text: "Your personal world, kept together." },
  large: { label: "Room for more", range: "45 L +", text: "Explore more generous storage formats." },
};

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name: A to Z" },
  { value: "capacity-asc", label: "Capacity: low to high" },
  { value: "capacity-desc", label: "Capacity: high to low" },
];

export function capacityBand(volume: number): CapacityBand {
  if (volume <= 20) return "compact";
  if (volume <= 45) return "medium";
  return "large";
}
