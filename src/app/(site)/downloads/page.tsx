import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { CtaBand } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { downloads } from "@/config/site";
import { getCategories, getProductOptions } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Downloads — Catalogues & Brochures",
  description: "Download ELON HARDWARE catalogues and product brochures, or request one by email.",
};

export default async function DownloadsPage() {
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
      <section className="container-site py-16">
        {downloads.length > 0 ? (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {downloads.map((d) => (
              <li key={d.file}>
                <a href={d.file} download className="group flex h-full flex-col justify-between rounded-[4px] border border-line p-6 hover:border-ink">
                  <span>
                    <span className="eyebrow">PDF{d.size ? ` · ${d.size}` : ""}</span>
                    <span className="mt-3 block font-serif text-[24px]">{d.title}</span>
                    <span className="mt-2 block text-[15px] text-muted">{d.description}</span>
                  </span>
                  <span className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[14px] font-bold">
                    Download <Icon name="download" size={18} className="text-gold-text" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid gap-10 rounded-[4px] border border-line p-6 md:p-10 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <div className="eyebrow">Request a catalogue</div>
              <h2 className="display-sm mt-3">Our latest catalogues are on their way.</h2>
              <p className="mt-4 text-[16px] leading-[1.75] text-muted">
                Tell us which range you&rsquo;re interested in and we&rsquo;ll send you the current catalogue and price list.
              </p>
            </div>
            <EnquiryForm products={await getProductOptions()} categories={await getCategories()} defaultType="general" variant="product" submitLabel="Send me the catalogue" />
          </div>
        )}
      </section>
      <CtaBand eyebrow="Need help choosing?" title="Talk to our team." href="/contact" label="Get in touch" variant="rect" />
    </>
  );
}
