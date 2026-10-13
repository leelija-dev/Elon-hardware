import { z } from "zod";

export const ENQUIRY_TYPES = {
  demo: "Book a free home demo",
  quote: "Get a quote",
  service: "Service request",
  general: "General query",
} as const;

export type EnquiryType = keyof typeof ENQUIRY_TYPES;

export const DEMO_SLOTS = {
  morning: "Morning · 10–1",
  afternoon: "Afternoon · 1–4",
  evening: "Evening · 4–7",
} as const;

const trimmed = (max: number) => z.string().trim().max(max);

export const enquirySchema = z
  .object({
    type: z.enum(Object.keys(ENQUIRY_TYPES) as [EnquiryType, ...EnquiryType[]]).default("general"),
    name: trimmed(80).min(2, "Please enter your name"),
    phone: trimmed(20)
      .transform((v) => v.replace(/[\s\-().]/g, ""))
      .refine((v) => /^\+?\d{10,13}$/.test(v), "Please enter a valid mobile number"),
    email: trimmed(120)
      .optional()
      .transform((v) => v || undefined)
      .refine((v) => !v || z.email().safeParse(v).success, "Please enter a valid email address"),
    city: trimmed(60).min(2, "Please enter your city"),
    pincode: trimmed(10)
      .optional()
      .transform((v) => v || undefined)
      .refine((v) => !v || /^\d{6}$/.test(v), "Pin code should be 6 digits"),
    product: trimmed(80).optional().transform((v) => v || undefined),
    /** Category of interest when no specific product is chosen. */
    interest: trimmed(80).optional().transform((v) => v || undefined),
    slot: z.enum(Object.keys(DEMO_SLOTS) as [keyof typeof DEMO_SLOTS, ...(keyof typeof DEMO_SLOTS)[]]).optional(),
    message: trimmed(1500).optional().transform((v) => v || undefined),
    whatsapp: z.boolean().optional().default(false),
    page: trimmed(200).optional(),
    /** Honeypot — real users never see or fill this field. */
    company: z.string().max(0, "Spam detected").optional(),
  })
  .superRefine((v, ctx) => {
    if (v.type === "service" && !v.message) {
      ctx.addIssue({ code: "custom", path: ["message"], message: "Please describe the issue" });
    }
  });

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryData = z.output<typeof enquirySchema>;
