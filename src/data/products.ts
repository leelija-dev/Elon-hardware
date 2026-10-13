import type { AccessMode, FeatureItem, FinishKey, Product } from "@/lib/types";

/**
 * PRODUCT CATALOGUE
 * -----------------
 * Add a product by copying an entry below. `category` must match a category
 * slug in src/data/catalogue.ts. Put photos in /public/images/... and list
 * them in `images` (first = main image).
 *
 * NOTE: locker photos are reference images taken from the approved design
 * (three locker styles mapped by size). Replace them with each model's own
 * photography before launch.
 */

const IMG = {
  compact: "/images/lockers/locker-compact.jpg",
  everyday: "/images/lockers/locker-everyday.jpg",
  premium: "/images/lockers/locker-premium.jpg",
  collage: "/images/lockers/locker-collage.jpg",
};

const ACCESS_TEXT: Record<AccessMode, string> = {
  fingerprint: "Fingerprint",
  pin: "PIN code",
  key: "Mechanical key",
  app: "Mobile app (Wi‑Fi)",
};

type LockerInput = {
  slug: string;
  name: string;
  series: string;
  subtitle: string;
  summary: string;
  description: string;
  h: number;
  w: number;
  d: number;
  volume: number;
  weightKg?: number;
  finish: FinishKey;
  finishName?: string;
  access: AccessMode[];
  accessDetails: string[];
  features: FeatureItem[];
  wifi?: string[];
  alarms: string[];
  suitableFor?: string[];
  badge?: string;
  featured?: boolean;
  fireResistant?: boolean;
  laptopFit?: boolean;
  rank: number;
  addedOn: string;
  images?: string[];
};

function locker(i: LockerInput): Product {
  const image = i.images ?? [i.volume <= 20 ? IMG.compact : i.volume <= 45 ? IMG.everyday : IMG.premium];
  const specs = [
    { label: "Model", value: i.name },
    { label: "Series", value: i.series },
    { label: "Dimensions (H × W × D)", value: `${i.h} × ${i.w} × ${i.d} mm` },
    { label: "Volume", value: `${i.volume} litres` },
    ...(i.weightKg ? [{ label: "Weight", value: `${i.weightKg} kg` }] : []),
    { label: "Access", value: i.access.map((a) => ACCESS_TEXT[a]).join(", ") },
    ...(i.finishName ? [{ label: "Finish", value: i.finishName }] : []),
    ...(i.fireResistant ? [{ label: "Fire resistance", value: "Yes" }] : []),
  ];
  const groups = [
    { title: "Access modes", items: i.accessDetails },
    ...(i.wifi ? [{ title: "Wi‑Fi & app", items: i.wifi }] : []),
    { title: "Alarms", items: i.alarms },
  ];
  return {
    slug: i.slug,
    name: i.name,
    code: i.name.replace(/[‐-―]/g, "-"),
    category: "home-lockers",
    subtitle: i.subtitle,
    summary: i.summary,
    description: i.description,
    images: image,
    finishes: [i.finish],
    specs,
    features: i.features,
    groups,
    suitableFor: i.suitableFor,
    badge: i.badge,
    featured: i.featured,
    rank: i.rank,
    addedOn: i.addedOn,
    tags: [i.series],
    locker: {
      volume: i.volume,
      dimensions: { h: i.h, w: i.w, d: i.d },
      access: i.access,
      fireResistant: i.fireResistant,
      laptopFit: i.laptopFit,
    },
  };
}

/* ---------- shared series content ---------- */

const maximusFeatures: FeatureItem[] = [
  { title: "Touch keypad", text: "Responsive touch keypad with master and user passwords." },
  { title: "Smart freeze", text: "Temporarily locks the keypad after repeated wrong attempts." },
  { title: "LED light inside", text: "Interior light to find valuables easily." },
  { title: "C‑Type emergency jump‑start", text: "Power the lock from a power bank if batteries run out." },
];

const magnusFeatures: FeatureItem[] = [
  { title: "Smart freeze", text: "Locks the keypad temporarily against guessing." },
  { title: "Wrong password alarm", text: "Sounds an alert after repeated wrong entries." },
  { title: "LED inside", text: "Interior light to find valuables easily." },
  { title: "Dual authorisation", text: "Require PIN and fingerprint together." },
  { title: "Three locking bolts", text: "Solid bolts hold the door firmly shut." },
  { title: "C‑Type emergency jump‑start", text: "Power the lock from a power bank if batteries run out." },
];

const astrixWifi = [
  "Remote unlocking",
  "Holiday mode",
  "Real‑time notifications",
  "Wrong password alert",
  "Door‑open alert",
  "Audit trail history",
];

function maximus(n: number, h: number, w: number, d: number, volume: number, extra: Partial<LockerInput> = {}) {
  const code = String(n).padStart(3, "0");
  return locker({
    slug: `maximus-${code}`,
    name: `MAXIMUS‑${code}`,
    series: "Maximus Series",
    subtitle: n === 1 ? "Compact wardrobe safe" : "2‑way access digital safe",
    summary: `A ${volume}‑litre, 2‑way access digital safe with touch keypad and mechanical override keys.`,
    description:
      "Secure with confidence. The Maximus safe blends modern elegance with advanced security features for effortless operation and lasting peace of mind — ideal for homes, offices, hospitality and retail spaces.",
    h,
    w,
    d,
    volume,
    finish: "graphite",
    finishName: "Deep Grey",
    access: ["pin", "key"],
    accessDetails: ["Passwords (1 master + 1 user)", "Mechanical keys (2)"],
    features: maximusFeatures,
    alarms: ["Low battery alarm (keypad flashes with beep)", "Wrong access alarm"],
    suitableFor: ["Homes", "Offices", "Hospitality", "Retail"],
    rank: 60 - n,
    addedOn: "2025-08-18",
    ...extra,
  });
}

function magnus(n: number, h: number, w: number, d: number, volume: number, extra: Partial<LockerInput> = {}) {
  const code = String(n).padStart(3, "0");
  return locker({
    slug: `magnus-${code}`,
    name: `MAGNUS‑${code}`,
    series: "Magnus Eco Series",
    subtitle: "Biometric eco safe",
    summary: `A ${volume}‑litre Eco Series safe with fingerprint, PIN and key access.`,
    description:
      "Security packaged with style and convenience. The Magnus Eco Series brings fingerprint access, smart freeze, interior LED lighting and three locking bolts to everyday homes.",
    h,
    w,
    d,
    volume,
    finish: "steel",
    access: ["fingerprint", "pin", "key"],
    accessDetails: ["Fingerprint sensor", "Two passwords (6 digits)", "Mechanical keys (2)"],
    features: magnusFeatures,
    alarms: ["Low battery alarm", "Break‑in alarm"],
    suitableFor: ["Homes", "Offices"],
    rank: 40 - n,
    addedOn: "2023-11-01",
    ...extra,
  });
}

const lockers: Product[] = [
  locker({
    slug: "astrix-02",
    name: "ASTRIX‑02",
    series: "Astrix Series",
    subtitle: "Wi‑Fi enabled digital safe with fire resistance",
    summary:
      "A 60‑litre fire‑resistant locker you can control from your phone. Unlock remotely, get real‑time alerts and keep a full audit trail of every access.",
    description:
      "The Astrix Series Wi‑Fi enabled digital safe with fire resistance packages security with style and convenience — control it from the mobile app, get instant alerts and protect valuables from fire.",
    h: 451,
    w: 361,
    d: 370,
    volume: 60,
    weightKg: 25,
    finish: "graphite",
    access: ["fingerprint", "pin", "key", "app"],
    accessDetails: [
      "Fingerprint sensor (10 fingerprints)",
      "Two passwords (6 digits)",
      "In‑built Wi‑Fi (mobile app)",
      "Mechanical keys (2)",
      "Fire‑resistant body",
    ],
    features: [
      { title: "Wrong password alarm", text: "Sounds an alert after repeated wrong entries." },
      { title: "Smart freeze", text: "Locks the keypad temporarily against guessing." },
      { title: "LED inside", text: "Interior light to find valuables easily." },
      { title: "Dual authentication", text: "Require fingerprint and PIN together." },
      { title: "Laser‑cut finish", text: "Minimal door gap that resists prying tools." },
    ],
    wifi: astrixWifi,
    alarms: ["Low battery alarm", "Break‑in alarm", "Unlocking alarm"],
    suitableFor: ["Homes", "Offices", "Hotels", "Shops"],
    badge: "Fire resistant",
    featured: true,
    fireResistant: true,
    rank: 100,
    addedOn: "2025-12-13",
  }),
  locker({
    slug: "astrix-01",
    name: "ASTRIX‑01",
    series: "Astrix Series",
    subtitle: "Wi‑Fi enabled digital safe",
    summary:
      "A 41‑litre Wi‑Fi enabled safe with fingerprint, PIN, key and app access — remote unlocking and real‑time alerts on your phone.",
    description:
      "Pair ASTRIX‑01 with the mobile app over your home Wi‑Fi to unlock remotely, switch on holiday mode and review every access.",
    h: 225,
    w: 445,
    d: 410,
    volume: 41,
    finish: "graphite",
    access: ["fingerprint", "pin", "key", "app"],
    accessDetails: ["Fingerprint sensor", "Passwords", "In‑built Wi‑Fi (mobile app)", "Mechanical keys (2)"],
    features: [
      { title: "Wrong password alarm", text: "Sounds an alert after repeated wrong entries." },
      { title: "Smart freeze", text: "Locks the keypad temporarily against guessing." },
      { title: "LED inside", text: "Interior light to find valuables easily." },
      { title: "Dual authentication", text: "Require fingerprint and PIN together." },
    ],
    wifi: astrixWifi,
    alarms: ["Low battery alarm", "Break‑in alarm"],
    suitableFor: ["Homes", "Offices", "Hotels", "Shops"],
    badge: "Smart",
    featured: true,
    rank: 95,
    addedOn: "2024-07-24",
  }),
  locker({
    slug: "grace",
    name: "GRACE",
    series: "3‑Way Access",
    subtitle: "Biometric digital safe",
    summary: "A 70‑litre biometric safe with an impeccable finish, 100 fingerprints and dual authorisation.",
    description:
      "With an impeccable finish and intuitive safety features, the Grace digital safe is ideal for securing and storing all your precious belongings — a must‑have for your home, office or shop.",
    h: 414,
    w: 449,
    d: 380,
    volume: 70,
    finish: "steel",
    access: ["fingerprint", "pin", "key"],
    accessDetails: [
      "Capacitive fingerprints (100 users)",
      "PIN code (1 user password)",
      "Mechanical keys (2)",
      "Emergency jump‑start (USB)",
    ],
    features: [
      { title: "Invisible motion‑sensor display", text: "The display wakes only when you approach." },
      { title: "Laser‑cut door", text: "Thin door gap that resists any object." },
      { title: "High‑curve body", text: "Unique laser‑cut design for an elegant look." },
      { title: "Flexible storage", text: "Innovative interior for flexible storage." },
      { title: "Double shooting bolts", text: "Tool and torch resistant locking bolts." },
      { title: "Dual authorisation", text: "PIN code together with fingerprint." },
    ],
    alarms: ["Low battery alarm", "Alarm after 3 wrong passwords"],
    suitableFor: ["Homes", "Offices", "Hotels", "Shops"],
    badge: "Largest",
    featured: true,
    rank: 90,
    addedOn: "2023-09-18",
  }),
  locker({
    slug: "cleo",
    name: "CLEO",
    series: "3‑Way Access",
    subtitle: "Top‑keypad bedside safe",
    summary: "A 52‑litre biometric safe with a top‑mounted touchpad — elegant enough to double as a bedside table.",
    description:
      "Its touchpad mounted on top makes it user‑friendly and attractive — you can even use it as a bedside table. A laser‑cut design with minimal door gap and high‑resistance double shooting bolts ensure safety and durability.",
    h: 490,
    w: 390,
    d: 380,
    volume: 52,
    finish: "ivory",
    finishName: "Off‑white",
    access: ["fingerprint", "pin", "key"],
    accessDetails: [
      "Capacitive fingerprints (100 users)",
      "PIN code (1 user password)",
      "Mechanical keys (2)",
      "Emergency jump‑start (USB)",
    ],
    features: [
      { title: "Top‑mounted display", text: "Digital display on top for convenience." },
      { title: "Concealed pull handle", text: "Exclusive off‑white colour with hidden handle." },
      { title: "Matt‑finish curved body", text: "Specially designed soft curves." },
      { title: "Adjustable shelf", text: "Flexible storage for files and boxes." },
      { title: "Double shooting bolts", text: "Tool and torch resistant locking bolts." },
      { title: "Dual authorisation", text: "PIN code together with fingerprint." },
    ],
    alarms: ["Low battery alarm", "Alarm after 3 wrong passwords"],
    suitableFor: ["Homes", "Offices", "Shops"],
    featured: true,
    rank: 88,
    addedOn: "2025-04-01",
  }),
  maximus(4, 420, 350, 360, 42),
  maximus(3, 325, 400, 325, 30, { weightKg: 13.5 }),
  maximus(2, 250, 350, 250, 16),
  maximus(1, 200, 310, 200, 9, { badge: "Compact", featured: true }),
  locker({
    slug: "absolute",
    name: "ABSOLUTE",
    series: "2‑Way Access",
    subtitle: "Laptop‑size digital safe",
    summary: "A 31‑litre safe with a distinctive touchpad that shows locked and unlocked status — fits a 15\" laptop.",
    description:
      "Perfect for both home and business, Absolute offers a rare combination of aesthetics and technology. The distinct touchpad comes with a locked and unlocked status signal.",
    h: 195,
    w: 430,
    d: 370,
    volume: 31,
    finish: "graphite",
    access: ["pin", "key"],
    accessDetails: ["Passwords (1 master + 1 user)", "Mechanical keys (2)", "Emergency jump‑start (USB)"],
    features: [
      { title: "Status touch keypad", text: "Unique keypad with open and closed signal." },
      { title: "Motorised double‑stroke bolt", text: "Electronic lock with a strong double bolt." },
      { title: "Fits a 15\" laptop", text: "Matt‑finish curved body sized for laptops." },
    ],
    alarms: ["Low battery alarm", "Alarm after 3 wrong passwords"],
    suitableFor: ["Homes", "Offices"],
    laptopFit: true,
    rank: 70,
    addedOn: "2024-10-21",
    images: [IMG.everyday, IMG.collage],
  }),
  locker({
    slug: "pristine",
    name: "PRISTINE",
    series: "2‑Way Access",
    subtitle: "Laptop‑size digital safe",
    summary: "Great looks, user‑friendly functionality and a host of security features in a 31‑litre, laptop‑sized safe.",
    description:
      "Pristine is a 2‑way access digital safe with the perfect combination of great looks, user‑friendly functionality and a host of security features — suitable for both homes and businesses.",
    h: 195,
    w: 430,
    d: 370,
    volume: 31,
    finish: "ivory",
    access: ["pin", "key"],
    accessDetails: ["Passwords (1 master + 1 user)", "Mechanical keys (2)", "Emergency jump‑start (USB)"],
    features: [
      { title: "Programmable keypad", text: "State‑of‑the‑art programmable electronic keypad." },
      { title: "Motorised double‑stroke bolt", text: "Electronic lock with a strong double bolt." },
      { title: "Fits a 15\" laptop", text: "Matt‑finish curved body sized for laptops." },
    ],
    alarms: ["Low battery alarm", "Alarm after 3 wrong passwords"],
    suitableFor: ["Homes", "Offices", "Hotels", "Shops"],
    laptopFit: true,
    rank: 68,
    addedOn: "2025-12-13",
  }),
  magnus(6, 550, 350, 360, 57),
  magnus(5, 390, 350, 360, 40),
  magnus(4, 330, 350, 330, 30.5, {
    weightKg: 13.5,
    badge: "Best value",
    featured: true,
    accessDetails: ["Fingerprint sensor (30 fingerprints)", "Two passwords (6 digits)", "Mechanical keys (2)"],
  }),
  magnus(7, 200, 430, 350, 25),
  magnus(3, 250, 350, 250, 16.3),
  magnus(2, 200, 310, 200, 8.5),
  magnus(1, 200, 310, 200, 8.5),
];

/* ---------- Handles — Signature collection (from the approved design) ---------- */

function handle(
  n: number,
  name: string,
  finishes: FinishKey[],
  summary: string,
  extra: Partial<Product> = {},
): Product {
  const code = `EH-SC-${String(n).padStart(2, "0")}`;
  return {
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    code,
    category: "handles",
    subtitle: "Signature handle collection",
    summary,
    description:
      "Part of the Signature handle collection — distinctive levers for the spaces you call home. Coordinate the handle with your door and interior style, and compare finish options with your other hardware.",
    images: [`/images/handles/handle-${String(n).padStart(2, "0")}.jpg`],
    finishes,
    specs: [
      { label: "Collection", value: "Signature" },
      { label: "Type", value: "Lever handle on rose" },
      { label: "Product code", value: code },
    ],
    features: [
      { title: "Sculpted form", text: "A considered profile that feels good in the hand." },
      { title: "Coordinated finishes", text: "Pair with matching hinges, locks and accessories." },
      { title: "Made for everyday use", text: "A dependable action, day after day." },
    ],
    rank: 50 - n,
    addedOn: "2026-06-01",
    tags: ["lever", "door handle", "signature"],
    ...extra,
  };
}

const handles: Product[] = [
  handle(1, "Sculpted round lever", ["black"], "A sculpted round lever with turned details and a confident, classic silhouette.", { featured: true }),
  handle(2, "Linear statement lever", ["black"], "A slim, linear lever that brings quiet detail to modern doors."),
  handle(3, "Modern profile lever", ["black"], "A modern profile with a subtly textured grip.", { featured: true }),
  handle(4, "Soft contour lever", ["black", "warm-metallic"], "Fluted warm‑metallic grip set against a matte black rose.", { featured: true }),
  handle(5, "Architectural lever", ["black", "warm-metallic"], "A crisp architectural lever with a warm metallic collar."),
  handle(6, "Refined classic lever", ["gold"], "A refined classic in brushed gold with a finely ribbed grip.", { featured: true }),
];

export const products: Product[] = [...lockers, ...handles];
