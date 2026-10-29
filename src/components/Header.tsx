"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon, Logo } from "./Icon";
import { SearchBox } from "./SearchBox";
import Image from "next/image";
export type NavRange = {
  slug: string;
  name: string;
  short: string;
  categories: { slug: string; name: string; count: number }[];
};

const services = [
  { href: "/services#support", label: "Service Support" },
  { href: "/services#warranty", label: "Warranty" },
  { href: "/services#installation", label: "How To Install" },
  { href: "/services#care", label: "Care & Maintenance" },
];

export function Header({ ranges }: { ranges: NavRange[] }) {
  const pathname = usePathname();
  const topLine = pathname === "/" ? "A safe place for the life you love." : "Considered details. Beautiful spaces.";
  const [menu, setMenu] = useState<null | "products" | "services">(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenu(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const navLink = (on: boolean) =>
    `relative py-2 text-[15px] transition-colors hover:text-gold-text ${on ? "font-bold after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-gold" : ""}`;

  return (
    <header className="relative z-40">
      <div className="bg-ink text-[11px] tracking-[0.02em] text-gold uppercase">
        <div className="container-site flex items-center justify-between gap-4 py-2">
          <span className="truncate">{topLine}</span>
          <Link href="/services#support" className="shrink-0 normal-case hover:text-gold-soft">
            Support ↗
          </Link>
        </div>
      </div>

      <div className="border-b border-line bg-white">
        <div className="container-site flex items-center justify-between gap-6 py-4">
          <Link href="/" aria-label="ELON HARDWARE — home" className="shrink-0">
           <Image
            src="/images/logo/logo.png"
            alt="ELON HARDWARE logo"
            width={448}
            height={250}
            className="h-12 w-auto"
          />
  
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-7 xl:flex 2xl:gap-11">
            <Link href="/" className={navLink(active("/"))}>
              Home
            </Link>
            <Link href="/about" className={navLink(active("/about"))}>
              About Us
            </Link>
            <Dropdown
              label="Our Products"
              open={menu === "products"}
              on={active("/products") || active("/product/")}
              onToggle={(o) => setMenu(o ? "products" : null)}
              navLink={navLink}
            >
              <div className="grid w-[860px] grid-cols-3 gap-x-8 gap-y-6 p-7">
                {ranges.map((r) => (
                  <div key={r.slug}>
                    <Link href={`/products/${r.slug}`} className="font-serif text-[18px] hover:text-gold-text">
                      {r.name}
                    </Link>
                    <ul className="mt-2 space-y-1 text-[14px] text-muted">
                      {r.categories.map((c) => (
                        <li key={c.slug}>
                          <Link href={`/products/${r.slug}/${c.slug}`} className="hover:text-ink">
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link
                  href="/products"
                  className="flex items-center justify-between self-end rounded-full bg-ink px-5 py-3 text-[14px] font-bold text-white hover:bg-ink-3"
                >
                  View all products <Icon name="arrowUpRight" size={16} />
                </Link>
              </div>
            </Dropdown>
            <Dropdown
              label="Services"
              open={menu === "services"}
              on={active("/services")}
              onToggle={(o) => setMenu(o ? "services" : null)}
              navLink={navLink}
            >
              <ul className="w-60 p-2">
                {services.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="block rounded px-4 py-2.5 text-[15px] hover:bg-mist">
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Dropdown>
            <Link href="/downloads" className={navLink(active("/downloads"))}>
              Download
            </Link>
            <Link href="/enquiry?type=demo" className={navLink(false)}>
              Book A Demo
            </Link>
            <Link href="/services#odi" className={navLink(false)} title="One Day Installation">
              ODI
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label={searchOpen ? "Close search" : "Search products"}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((o) => !o)}
              className="flex size-12 items-center justify-center rounded-full border border-line hover:border-ink"
            >
              <Icon name={searchOpen ? "close" : "search"} size={18} />
            </button>
            <Link
              href="/contact"
              className={`${pathname === "/" ? "btn-pill-dark min-h-[54px]" : "btn-rect-dark text-[15px]"} hidden min-w-[194px] sm:inline-flex`}
            >
              Contact Us <Icon name="arrowUpRight" size={18} strokeWidth={1.6} className={pathname === "/" ? "" : "text-gold"} />
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="flex size-12 items-center justify-center rounded-full bg-ink text-white xl:hidden"
            >
              <Icon name="menu" size={20} />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-line bg-white">
            <div className="container-site py-5">
              <SearchBox autoFocus onNavigate={() => setSearchOpen(false)} className="mx-auto max-w-2xl" />
            </div>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-ink/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[min(380px,90vw)] flex-col overflow-y-auto bg-white">
            <div className="flex items-center justify-between border-b border-line p-5">
              <Link href="/" aria-label="ELON HARDWARE — home" onClick={() => setMobileOpen(false)}>
                <Image
                  src="/images/logo/logo.png"
                  alt="ELON HARDWARE logo"
                  width={448}
                  height={250}
                  className="h-14 w-auto"
                />
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="flex size-11 items-center justify-center rounded-full border border-line"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <div className="p-5 pb-2">
              <SearchBox onNavigate={() => setMobileOpen(false)} />
            </div>
            <nav aria-label="Mobile" className="flex flex-col px-5 pb-8 text-[17px]">
              <MobileLink href="/">Home</MobileLink>
              <MobileLink href="/about">About Us</MobileLink>
              <details className="border-b border-line">
                <summary className="flex cursor-pointer items-center justify-between py-3.5">
                  Our Products <Icon name="chevron" size={18} />
                </summary>
                <div className="pb-3">
                  <Link href="/products" className="block py-2 pl-3 text-[15px] font-bold">
                    All products
                  </Link>
                  {ranges.map((r) => (
                    <Link key={r.slug} href={`/products/${r.slug}`} className="block py-2 pl-3 text-[15px] text-muted">
                      {r.name}
                    </Link>
                  ))}
                </div>
              </details>
              <details className="border-b border-line">
                <summary className="flex cursor-pointer items-center justify-between py-3.5">
                  Services <Icon name="chevron" size={18} />
                </summary>
                <div className="pb-3">
                  {services.map((s) => (
                    <Link key={s.href} href={s.href} className="block py-2 pl-3 text-[15px] text-muted">
                      {s.label}
                    </Link>
                  ))}
                </div>
              </details>
              <MobileLink href="/downloads">Download</MobileLink>
              <MobileLink href="/enquiry?type=demo">Book A Demo</MobileLink>
              <MobileLink href="/services#odi">ODI — One Day Installation</MobileLink>
              <MobileLink href="/enquiry">Submit a Query</MobileLink>
              <Link href="/contact" className="btn-pill-dark mt-6">
                Contact Us <Icon name="arrowUpRight" size={18} />
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function Dropdown({
  label,
  open,
  on,
  onToggle,
  navLink,
  children,
}: {
  label: string;
  open: boolean;
  on: boolean;
  onToggle: (open: boolean) => void;
  navLink: (on: boolean) => string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative" onMouseEnter={() => onToggle(true)} onMouseLeave={() => onToggle(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => onToggle(!open)}
        className={`flex items-center gap-1 ${navLink(on)}`}
      >
        {label} <Icon name="chevron" size={14} strokeWidth={2.4} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 z-50 -translate-x-1/2 pt-4">
          <div className="rounded-2xl border border-line bg-white shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]">{children}</div>
        </div>
      )}
    </div>
  );
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="border-b border-line py-3.5">
      {children}
    </Link>
  );
}
