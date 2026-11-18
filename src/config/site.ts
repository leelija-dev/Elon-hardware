/**
 * Business details shown across the site.
 * ⚠️  Replace every value in [square brackets] with the client's real details before launch.
 */
export const site = {
  name: "ELON HARDWARE",
  tagline: "Precision. Quality. Trust.",
  description:
    "Home lockers, digital access solutions, architectural hardware, kitchen & wardrobe fittings, bath and glass hardware — thoughtfully chosen for the way you live.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  phone: "9051970488",
  phoneHref: "", // e.g. "tel:+919800000000"
  whatsapp: "9051970488",
  whatsappHref: "", // e.g. "https://wa.me/919800000000"
  email: "⁠info@elonhardware.com",
  emailHref: "", // e.g. "mailto:sales@elonhardware.in"
  hours: "",
  address: "Pinewood Industries Pvt. Ltd.",
  cityLine: "Suvas Apartment, Jatindra Sarani, Champadali, Barasat, Kolkata , West Bengal - 700124",
  /** Google Maps → Share → Embed a map → copy the src URL */
  mapEmbedUrl: "",
  warranty: "[warranty period]",
  responseTime: "one working day",

  /** Fallback social links — normally set in Admin → Settings. */
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  },
};

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
