/**
 * Business details shown across the site.
 * ⚠️  Replace every value in [square brackets] with the client's real details before launch.
 */
export const site = {
  name: "ELON HARDWARE",
  tagline: "A place for everything that matters.",
  description:
    "Home lockers, digital access solutions, architectural hardware, kitchen & wardrobe fittings, bath and glass hardware — thoughtfully chosen for the way you live.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  phone: "[Phone number]",
  phoneHref: "", // e.g. "tel:+919800000000"
  whatsapp: "[WhatsApp number]",
  whatsappHref: "", // e.g. "https://wa.me/919800000000"
  email: "[sales@elonhardware.in]",
  emailHref: "", // e.g. "mailto:sales@elonhardware.in"
  hours: "Mon–Sat, [opening hours]",
  address: "[Showroom / office address]",
  cityLine: "[City, State, PIN]",
  /** Google Maps → Share → Embed a map → copy the src URL */
  mapEmbedUrl: "",
  warranty: "[warranty period]",
  responseTime: "one working day",

  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  },
};

/** Brochures and catalogues listed on /downloads. Put files in /public/downloads. */
export const downloads: { title: string; description: string; file: string; size?: string }[] = [
  // { title: "Home Lockers Catalogue", description: "All home locker models and specifications.", file: "/downloads/home-lockers.pdf", size: "4.2 MB" },
];

export type Testimonial = { quote: string; name: string; meta: string };
/** Only add genuine reviews (with the customer's permission). Hidden while empty. */
export const testimonials: Testimonial[] = [];

/**
 * About page — company figures and story timeline.
 * Leave a value empty ("") to show the gold placeholder dash from the design.
 */
export const aboutStats: { label: string; value: string }[] = [
  { label: "Team members", value: "" },
  { label: "Dealer network", value: "" },
  { label: "Distribution partners", value: "" },
  { label: "Service reach", value: "" },
];

export const aboutTimeline: { title: string; text: string; year?: string }[] = [
  { title: "The beginning", text: "Founding year and the original vision." },
  { title: "First milestones", text: "First collection and early achievements." },
  { title: "Growing together", text: "Product expansion and partner milestones." },
  { title: "The next chapter", text: "Upcoming plans and future ambitions." },
];
