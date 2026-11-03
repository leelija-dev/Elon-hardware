import Link from "next/link";
import Image from "next/image";
import { site } from "@/config/site";
import { getSettings, SOCIALS, type SocialKey } from "@/lib/content";
import { Icon, Star } from "./Icon";

const SOCIAL: Record<SocialKey, { label: string; icon: React.ReactNode }> = {
  facebook: {
    label: "Facebook",
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  instagram: {
    label: "Instagram",
    icon: (
      <>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
  },
  linkedin: {
    label: "LinkedIn",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  youtube: {
    label: "YouTube",
    icon: (
      <>
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </>
    ),
  },
};

const SOCIAL_ORDER: SocialKey[] = ["youtube", "linkedin", "facebook", "instagram"];

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { href: "/products/digital-access-solutions/home-lockers", label: "Home lockers" },
      { href: "/products/digital-access-solutions/digital-door-locks", label: "Door locks" },
      { href: "/products/architectural-hardware", label: "Hardware" },
      { href: "/products", label: "All products" },
    ],
  },
  {
    title: "ELON HARDWARE",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/contact", label: "Contact" },
      { href: "/enquiry", label: "Product enquiries" },
      { href: "/downloads", label: "Downloads" },
    ],
  },
  {
    title: "Assistance",
    links: [
      { href: "/locker-finder", label: "Buying guide" },
      { href: "/services#support", label: "Support" },
      { href: "/services#care", label: "Care & maintenance" },
      { href: "/enquiry?type=demo", label: "Book a demo" },
    ],
  },
];

export async function Footer() {
  const { social } = await getSettings();
  const socials = SOCIAL_ORDER.filter((k) => SOCIALS.includes(k) && social[k]);
  return (
    <footer className="bg-ink text-white">
      <div className="container-site">
        <div className="grid gap-10 border-t border-ink-line pt-12 pb-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
              <Link
                  href="/"
                  aria-label="ELON HARDWARE — home"
                  className="inline-block rounded-xl px-2 py-2"
                >
                  <Image
                    src="/images/logo/footer-logo.png"
                    alt="ELON HARDWARE logo"
                    width={448}
                    height={250}
                    className="h-16 w-auto sm:h-20"
                  />
              </Link>
            <p className="mt-6 text-[17px]">{site.tagline}</p>
            {socials.length > 0 && (
              <ul className="mt-6 flex gap-3" aria-label="Follow us">
                {socials.map((k) => (
                  <li key={k}>
                    <a
                      href={social[k]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${site.name} on ${SOCIAL[k].label}`}
                      title={SOCIAL[k].label}
                      className="flex size-11 items-center justify-center rounded-full border border-ink-line text-white transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="size-[18px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        {SOCIAL[k].icon}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <div className="eyebrow-on-dark mb-4">{c.title}</div>
              <ul className="space-y-2 text-[15px]">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-gold">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-line py-6 text-[13px] text-fog">
          <span>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
          <span className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of use
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

/** Black call-to-action band that sits directly above the footer (varies per page). */
export function CtaBand({
  eyebrow,
  title,
  text,
  href,
  label,
  variant = "pill",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  href: string;
  label: string;
  variant?: "pill" | "rect";
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {variant === "pill" && (
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-60px] hidden h-[400px] w-[440px] text-gold/70 md:block"
        viewBox="0 0 440 400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <circle cx="200" cy="140" r="190" />
        <circle cx="210" cy="140" r="168" />
        <circle cx="220" cy="140" r="150" />
        <circle cx="230" cy="140" r="134" />
      </svg>
      )}
      <div className="container-site relative flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-[72px]">
        <div>
          <div className="eyebrow-on-dark">{eyebrow}</div>
          <h2 className="display-lg mt-3">{title}</h2>
          {text && <p className="mt-4 text-[17px] text-white/90">{text}</p>}
        </div>
        <div className="flex items-center gap-8 md:mr-[120px]">
          <Link
            href={href}
            className={variant === "pill" ? "btn-pill-gold min-w-[260px]" : "btn-rect-gold min-w-[280px]"}
          >
            {label} <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
          </Link>
          {variant === "pill" && <Star size={78} className="hidden text-gold lg:block" />}
        </div>
      </div>
    </section>
  );
}
