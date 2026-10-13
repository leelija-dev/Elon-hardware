import Image from "next/image";
import { Breadcrumbs } from "./Breadcrumbs";

/** Black rounded hero card used on inner pages (follows the product listing design). */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  accent,
  text,
  image,
  imageAlt = "",
  caption,
  children,
}: {
  crumbs: { href: string; label: string }[];
  eyebrow: string;
  title: string;
  accent?: string;
  text?: string;
  image?: string;
  imageAlt?: string;
  caption?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="container-site">
      <Breadcrumbs items={crumbs} />
      <section
        className={`mt-6 grid gap-6 rounded-[10px] bg-ink p-6 text-white md:p-10 lg:items-center lg:py-6 lg:pr-6 lg:pl-11 ${image ? "lg:grid-cols-[1fr_440px]" : ""}`}
      >
        <div className="lg:py-8">
          <div className="eyebrow-on-dark">{eyebrow}</div>
          <h1 className="display-lg mt-7">
            {title}
            {accent && <span className="block text-gold">{accent}</span>}
          </h1>
          {text && <p className="mt-6 max-w-[520px] text-[16px] leading-[1.75] text-white/90">{text}</p>}
          {children}
        </div>
        {image && (
          <div className="relative flex min-h-[260px] flex-col overflow-hidden bg-white lg:h-[340px]">
            <div className="relative flex-1">
              <Image src={image} alt={imageAlt} fill priority sizes="440px" className="object-cover" />
            </div>
            {caption && (
              <div className="px-6 py-3 text-[11px] font-bold tracking-[0.02em] text-gold-text uppercase">{caption}</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
