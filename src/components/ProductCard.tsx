import Image from "next/image";
import Link from "next/link";
import { FINISHES } from "@/lib/constants";
import type { ProductView } from "@/lib/types";
import { Icon } from "./Icon";

export function ProductImage({
  src,
  alt,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw",
  priority = false,
  className = "p-6",
}: {
  src?: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div className="flex size-full items-center justify-center text-[13px] tracking-[0.04em] text-muted uppercase">
        Image coming soon
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-contain ${className}`} />;
}

/** Product card from the listing design: framed image, index number, quick-enquire "+", name and "View product". */
export function ProductCard({ p, index, priority = false }: { p: ProductView; index?: number; priority?: boolean }) {
  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[324/266] border border-line bg-white transition-colors group-hover:border-line-2">
        <Link href={p.href} aria-label={`${p.name} — view product`} className="absolute inset-0">
          <ProductImage src={p.images[0]} alt={p.name} priority={priority} className="p-5 transition-transform duration-300 group-hover:scale-[1.04]" />
        </Link>
        {index !== undefined && (
          <span className="pointer-events-none absolute top-4 left-4 text-[11px] text-muted">
            {String(index).padStart(2, "0")}
          </span>
        )}
        {p.badge && (
          <span className="pointer-events-none absolute bottom-3 left-3 bg-ink px-2.5 py-1 text-[11px] font-bold tracking-[0.04em] text-gold uppercase">
            {p.badge}
          </span>
        )}
        <Link
          href={`/enquiry?product=${p.slug}`}
          aria-label={`Enquire about ${p.name}`}
          title="Enquire about this product"
          className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-full bg-mist-2 text-ink transition-colors hover:bg-gold"
        >
          <Icon name="plus" size={15} strokeWidth={2} />
        </Link>
      </div>
      <h3 className="mt-4 text-[19px] leading-snug font-normal">
        <Link href={p.href} className="hover:text-gold-text">
          {p.name}
        </Link>
      </h3>
      <p className="mt-1 text-[13px] text-muted">
        {p.locker ? `${p.subtitle} · ${p.locker.volume} L` : `${p.categoryName} · ${finishText(p)}`}
      </p>
      <Link
        href={p.href}
        className="mt-3 flex items-center justify-between border-b border-line pb-3 text-[14px] font-bold hover:text-gold-text"
      >
        View product <Icon name="arrowUpRight" size={18} strokeWidth={1.6} className="text-gold-text" />
      </Link>
    </article>
  );
}

function finishText(p: ProductView) {
  const f = (p.finishes ?? []).map((k) => FINISHES[k]?.label ?? k);
  return f.length ? f.join(" / ") : p.subtitle;
}
