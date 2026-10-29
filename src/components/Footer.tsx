import Link from "next/link";
import Image from "next/image";
import { site } from "@/config/site";
import { Icon, Logo, Star } from "./Icon";

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

export function Footer() {
  const socials = Object.entries(site.social).filter(([, url]) => url);
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
              <div className="mt-5 flex gap-4 text-[14px] text-fog">
                {socials.map(([name, url]) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-gold">
                    {name}
                  </a>
                ))}
              </div>
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
