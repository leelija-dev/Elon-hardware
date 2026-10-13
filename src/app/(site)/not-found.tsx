import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[60vh] flex-col items-start justify-center py-24">
      <div className="eyebrow">404 / Page not found</div>
      <h1 className="display-lg mt-4">
        This detail is missing.
        <span className="block text-gold-text">Let&rsquo;s find another.</span>
      </h1>
      <p className="mt-6 max-w-[460px] text-[17px] text-muted">The page you were looking for may have moved. Try searching our products or head back home.</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/products" className="btn-pill-dark min-w-[230px]">
          Explore products <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
        </Link>
        <Link href="/" className="btn-pill-gold min-w-[180px]">
          Go home <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
        </Link>
      </div>
    </section>
  );
}
