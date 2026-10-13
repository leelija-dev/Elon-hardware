import type { Category, GuideStep, Range } from "@/lib/types";

/**
 * Product ranges and categories.
 * Menus, the home page, listing pages, filters and the sitemap are all
 * generated from these two lists — edit here to change the catalogue structure.
 */

export const ranges: Range[] = [
  {
    slug: "digital-access-solutions",
    name: "Digital Access Solutions",
    short: "Home lockers, digital door locks and furniture locks.",
    description: "Explore digital door locks, home safes and furniture locks for more considered everyday access.",
    image: "/images/ranges/digital-access.jpg",
    heroTitle: "Your world. Your treasures.",
    heroAccent: "Your safe place.",
    heroText: "Home lockers and digital locks for the pieces you cherish and the memories you keep.",
  },
  {
    slug: "architectural-hardware",
    name: "Architectural Hardware",
    short: "Handles, locks, hinges and accessories for your doors.",
    description: "Bring the details together with handles, locks, hinges and accessories for your doors.",
    image: "/images/ranges/architectural-hardware.jpg",
    heroTitle: "A beautiful entrance",
    heroAccent: "starts with a detail.",
    heroText: "Handles, locks, hinges and accessories for the spaces you call home.",
  },
  {
    slug: "kitchen-wardrobe-fittings",
    name: "Kitchen & Wardrobe Fittings",
    short: "Fittings for kitchens, wardrobes and everyday storage.",
    description: "Make room for better organisation with fittings for kitchens, wardrobes and everyday storage.",
    image: "/images/ranges/kitchen-wardrobe.jpg",
    heroTitle: "Room for everything,",
    heroAccent: "in its place.",
    heroText: "Fittings that make kitchens and wardrobes work beautifully every day.",
  },
  {
    slug: "inspiring-bath-concepts",
    name: "Inspiring Bath Concepts",
    short: "Fixtures and accessories that complement your bathroom.",
    description: "Complete your bathroom with thoughtful fixtures and accessories that complement your space.",
    image: "/images/ranges/bath.jpg",
    imageBg: "#EAF6FC",
    heroTitle: "Everyday rituals,",
    heroAccent: "beautifully finished.",
    heroText: "Thoughtful fixtures and accessories that complete your bathroom.",
  },
  {
    slug: "glass-hardware-fittings",
    name: "Glass Hardware Fittings",
    short: "Fittings for glass doors, partitions and shower spaces.",
    description: "Explore fittings for glass doors, partitions and shower spaces with a clean, coordinated finish.",
    image: "/images/ranges/glass-hardware.jpg",
    heroTitle: "Clear spaces.",
    heroAccent: "Considered fittings.",
    heroText: "Hardware for glass doors, partitions and shower enclosures with a clean, coordinated finish.",
  },
];

const hardwareGuide: GuideStep[] = [
  { title: "Consider the setting", text: "Coordinate the piece with your door and interior style." },
  { title: "Explore the finish", text: "Compare finish options with your other hardware." },
  { title: "Check the fit", text: "Confirm dimensions and compatibility before ordering." },
];

export const lockerGuide: GuideStep[] = [
  { title: "What matters?", text: "Jewellery, important papers or everyday valuables." },
  { title: "Where will it live?", text: "Find a format that suits your available space." },
  { title: "How will you access it?", text: "Review access options across available models." },
];

export const categories: Category[] = [
  /* ---------- Digital Access Solutions ---------- */
  {
    slug: "home-lockers",
    range: "digital-access-solutions",
    name: "Home Lockers",
    short: "A dedicated place for your valuables.",
    description:
      "Digital home lockers with fingerprint, PIN, mechanical key and app access — built to protect jewellery, cash and documents.",
    tile: "/images/lockers/locker-everyday.jpg",
    heroEyebrow: "The home locker collection",
    heroTitle: "Your world. Your treasures.",
    heroAccent: "Your safe place.",
    heroText: "For the pieces you cherish and the memories you keep. Find a home locker that fits your life, beautifully.",
    heroImage: "/images/lockers/locker-premium.jpg",
    heroCaption: "Personal valuables. Considered spaces.",
    sectionEyebrow: "Home lockers, made for what matters",
    sectionTitle: "Find your safe place.",
    itemNoun: "models",
    guide: lockerGuide,
  },
  {
    slug: "digital-door-locks",
    range: "digital-access-solutions",
    name: "Digital Door Locks",
    short: "Keyless entry for main doors.",
    description: "Digital door locks with fingerprint, PIN, card and app access for more considered everyday entry.",
    tile: "/images/ranges/digital-access.jpg",
    heroImage: "/images/ranges/digital-access.jpg",
  },
  {
    slug: "digital-furniture-locks",
    range: "digital-access-solutions",
    name: "Digital Furniture Locks",
    short: "Keyless locks for drawers and cabinets.",
    description: "Digital locks for wardrobes, drawers and cabinets — at home, in the office or in hospitality spaces.",
  },

  /* ---------- Architectural Hardware ---------- */
  {
    slug: "handles",
    range: "architectural-hardware",
    name: "Handles",
    short: "The finishing touch for your doors.",
    description: "Distinctive lever handles for the spaces you call home, in finishes that complement your interiors.",
    tile: "/images/hardware/tile-handles.jpg",
    heroEyebrow: "The signature handle collection",
    heroTitle: "A beautiful entrance",
    heroAccent: "starts with a detail.",
    heroText: "Explore distinctive handles for the spaces you call home. Find your style. Refine your finish. Make it personal.",
    heroImage: "/images/handles/handle-hero.jpg",
    heroCaption: "Sculpted form. Everyday connection.",
    sectionEyebrow: "Handles, with character",
    sectionTitle: "Find your finishing touch.",
    itemNoun: "designs",
    guide: hardwareGuide,
  },
  { slug: "mortise-locks", range: "architectural-hardware", name: "Mortise Locks", short: "Lock bodies for interior and main doors.", description: "Mortise lock bodies engineered for smooth, dependable everyday use.", tile: "/images/hardware/tile-mortise-locks.jpg", heroImage: "/images/hardware/banner-mortise.jpg", guide: hardwareGuide },
  { slug: "door-hinges", range: "architectural-hardware", name: "Door Hinges", short: "Ball-bearing hinges for quiet, smooth doors.", description: "Hinges built for quiet, smooth movement and long life.", tile: "/images/hardware/tile-door-hinges.jpg", heroImage: "/images/hardware/hinge-collage.jpg", guide: hardwareGuide },
  { slug: "main-door-set", range: "architectural-hardware", name: "Main Door Set", short: "Coordinated handle and lock sets for main doors.", description: "Coordinated main door sets that make a confident first impression.", tile: "/images/hardware/tile-main-door-set.jpg", guide: hardwareGuide },
  { slug: "main-door-locks", range: "architectural-hardware", name: "Main Door Locks", short: "Secure locking for your main entrance.", description: "Main door locks for secure, reliable entry.", tile: "/images/hardware/tile-main-door-locks.jpg", guide: hardwareGuide },
  { slug: "cylindrical-locks", range: "architectural-hardware", name: "Cylindrical Locks", short: "Knob locks for interior doors.", description: "Cylindrical knob locks for bedrooms, bathrooms and interior doors.", tile: "/images/hardware/tile-cylindrical-locks.jpg", guide: hardwareGuide },
  { slug: "furniture-locks", range: "architectural-hardware", name: "Furniture Locks", short: "Locks for drawers, cabinets and wardrobes.", description: "Furniture locks for drawers, cabinets and wardrobes.", tile: "/images/hardware/tile-furniture-locks.jpg", guide: hardwareGuide },
  { slug: "euro-profile-cylinder", range: "architectural-hardware", name: "Euro Profile Cylinder", short: "Key and knob cylinders for mortise locks.", description: "Euro profile cylinders with key and thumb-turn options.", tile: "/images/hardware/tile-euro-profile-cylinder.jpg", guide: hardwareGuide },
  { slug: "door-closers", range: "architectural-hardware", name: "Door Closers", short: "Controlled, quiet closing for every door.", description: "Door closers for controlled, quiet closing.", tile: "/images/hardware/tile-door-closers.jpg", guide: hardwareGuide },
  { slug: "door-accessories", range: "architectural-hardware", name: "Door Accessories", short: "Stoppers, bolts, indicators and more.", description: "Door stoppers, tower bolts, indicator bolts and finishing accessories.", tile: "/images/hardware/tile-door-accessories.jpg", guide: hardwareGuide },

  /* ---------- Kitchen & Wardrobe ---------- */
  { slug: "kitchen-fittings", range: "kitchen-wardrobe-fittings", name: "Kitchen Fittings", short: "Baskets, drawers and corner solutions.", description: "Kitchen fittings that make every cabinet work harder.", heroImage: "/images/ranges/kitchen-wardrobe.jpg", guide: hardwareGuide },
  { slug: "wardrobe-fittings", range: "kitchen-wardrobe-fittings", name: "Wardrobe Fittings", short: "Lifts, pull-outs and organisers.", description: "Wardrobe fittings for better organisation and everyday ease.", guide: hardwareGuide },
  { slug: "hinges-channels", range: "kitchen-wardrobe-fittings", name: "Hinges & Channels", short: "Soft-close hinges and drawer channels.", description: "Soft-close hinges and drawer channels for smooth, quiet movement.", guide: hardwareGuide },

  /* ---------- Bath ---------- */
  { slug: "faucets-mixers", range: "inspiring-bath-concepts", name: "Faucets & Mixers", short: "Basin, sink and wall-mounted faucets.", description: "Faucets and mixers with exquisite contours and minimalist design.", guide: hardwareGuide },
  { slug: "showers", range: "inspiring-bath-concepts", name: "Showers", short: "Overhead, hand and shower systems.", description: "Showers that turn bathing into a daily ritual.", guide: hardwareGuide },
  { slug: "bath-accessories", range: "inspiring-bath-concepts", name: "Bath Accessories", short: "Holders, shelves and finishing pieces.", description: "Bath accessories that complete your space with understated sophistication.", tile: "/images/ranges/bath.jpg", heroImage: "/images/ranges/bath.jpg", guide: hardwareGuide },

  /* ---------- Glass ---------- */
  { slug: "floor-springs", range: "glass-hardware-fittings", name: "Floor Springs", short: "Concealed closing for glass doors.", description: "Floor springs for smooth, controlled closing of glass doors.", guide: hardwareGuide },
  { slug: "patch-fittings", range: "glass-hardware-fittings", name: "Patch Fittings", short: "Top, bottom and lock patches.", description: "Patch fittings for frameless glass doors.", guide: hardwareGuide },
  { slug: "glass-door-handles", range: "glass-hardware-fittings", name: "Glass Door Handles", short: "Pull handles and knobs for glass doors.", description: "Pull handles and knobs designed for glass doors.", guide: hardwareGuide },
  { slug: "sliding-systems", range: "glass-hardware-fittings", name: "Sliding Systems", short: "Sliding hardware, handles and locks.", description: "Sliding systems, handles and locks for glass partitions.", guide: hardwareGuide },
  { slug: "spider-fittings", range: "glass-hardware-fittings", name: "Spider Fittings", short: "Point-fixed glazing hardware.", description: "Spider fittings for point-fixed glass facades and canopies.", tile: "/images/ranges/glass-hardware.jpg", heroImage: "/images/ranges/glass-hardware.jpg", guide: hardwareGuide },
  { slug: "shower-hinges-connectors", range: "glass-hardware-fittings", name: "Shower Hinges & Connectors", short: "Hinges and connectors for shower glass.", description: "Shower hinges and glass connectors with a clean, coordinated finish.", guide: hardwareGuide },
];
