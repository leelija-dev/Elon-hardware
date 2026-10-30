import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getRanges } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const ranges = (await getRanges()).map((r) => ({
    slug: r.slug,
    name: r.name,
    short: r.short,
    categories: r.categories.map((c) => ({ slug: c.slug, name: c.name, count: c.count })),
  }));
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header ranges={ranges} />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
