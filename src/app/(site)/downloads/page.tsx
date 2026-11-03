import type { Metadata } from "next";
import Image from "next/image";
import { EnquiryForm } from "@/components/EnquiryForm";
import { CtaBand } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { getCategories, getProductOptions } from "@/lib/catalog";
import { formatBytes, getCatalogues } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Downloads — Catalogues & Brochures",
  description: "Download ELON HARDWARE catalogues and product brochures, or request one by email.",
};

export default async function DownloadsPage() {
  const catalogues = await getCatalogues();
  const requestForm = (
    <EnquiryForm
      products={await getProductOptions()}
      categories={await getCategories()}
      defaultType="general"
      variant="product"
      submitLabel="Send me the catalogue"
    />
  );

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/downloads", label: "Download" },
        ]}
        eyebrow="Catalogues & brochures"
        title="Every detail,"
        accent="ready to share."
        text="Download our catalogues and product brochures — or ask us to send the latest edition to you."
      />

      {catalogues.length > 0 ? (
        <>
          <section className="container-site py-16 md:py-20" aria-labelledby="catalogues-title">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="eyebrow">
                  {String(catalogues.length).padStart(2, "0")} / Catalogue{catalogues.length === 1 ? "" : "s"}
                </div>
                <h2 id="catalogues-title" className="display-md mt-3">
                  Browse our collections.
                </h2>
              </div>
            </div>
            <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {catalogues.map((c) => (
                <li key={c.id} className="group flex flex-col items-center text-center">
                  <a
                    href={c.file}
                    target="_blank"
                    rel="noopener"
                    aria-label={`Open ${c.title} (PDF)`}
                    className="relative block aspect-[7/8] w-full overflow-hidden rounded-[6px] bg-mist shadow-[0_24px_50px_-28px_rgba(0,0,0,0.45)]"
                  >
                    <Image
                      src={c.cover}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute top-4 left-4 rounded-full bg-ink/85 px-3 py-1 text-[11px] font-bold tracking-[0.04em] text-gold uppercase backdrop-blur-sm">
                      PDF{c.size ? ` · ${formatBytes(c.size)}` : ""}
                    </span>
                  </a>
                  <h3 className="mt-7 font-serif text-[24px] leading-tight">{c.title}</h3>
                  <a href={c.file} download className="btn-rect-dark mt-5 min-w-[200px] justify-center gap-3">
                    Download <Icon name="download" size={18} className="text-gold" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <section className="bg-mist">
            <div className="container-site grid gap-10 py-16 lg:grid-cols-[1fr_1.3fr]">
              <div>
                <div className="eyebrow">Can&rsquo;t find what you need?</div>
                <h2 className="display-sm mt-3">Request a catalogue or price list.</h2>
                <p className="mt-4 text-[16px] leading-[1.75] text-muted">
                  Tell us which range you&rsquo;re interested in and we&rsquo;ll send you the current catalogue and price list.
                </p>
              </div>
              <div className="rounded-[4px] bg-white p-6 md:p-8">{requestForm}</div>
            </div>
          </section>
        </>
      ) : (
        <section className="container-site py-16">
          <div className="grid gap-10 rounded-[4px] border border-line p-6 md:p-10 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <div className="eyebrow">Request a catalogue</div>
              <h2 className="display-sm mt-3">Our latest catalogues are on their way.</h2>
              <p className="mt-4 text-[16px] leading-[1.75] text-muted">
                Tell us which range you&rsquo;re interested in and we&rsquo;ll send you the current catalogue and price list.
              </p>
            </div>
            {requestForm}
          </div>
        </section>
      )}
      <CtaBand eyebrow="Need help choosing?" title="Talk to our team." href="/contact" label="Get in touch" variant="rect" />
    </>
  );
}
