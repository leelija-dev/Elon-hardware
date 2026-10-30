import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EnquiryForm } from "@/components/EnquiryForm";
import { CtaBand } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { site } from "@/config/site";
import { FINISHES } from "@/lib/constants";
import { getCategory, getProduct, getProductOptions, getRelatedProducts } from "@/lib/catalog";

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.subtitle}`,
    description: p.summary,
    openGraph: { images: p.images[0] ? [{ url: p.images[0] }] : undefined },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const category = await getCategory(p.category);
  const related = await getRelatedProducts(p, 4);
  const keySpecs = p.locker
    ? [
        { label: "Capacity", value: `${p.locker.volume} L` },
        { label: "H × W × D (mm)", value: `${p.locker.dimensions.h}×${p.locker.dimensions.w}×${p.locker.dimensions.d}` },
        { label: "Access", value: `${p.locker.access.length}-way` },
      ]
    : p.specs.slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.code,
    description: p.summary,
    image: p.images.map((i) => new URL(i, site.url).toString()),
    brand: { "@type": "Brand", name: site.name },
    category: p.categoryName,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="container-site">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: `/products/${p.rangeSlug}`, label: p.rangeName },
            { href: `/products/${p.rangeSlug}/${p.category}`, label: p.categoryName },
            { href: p.href, label: p.name },
          ]}
        />

        <section className="grid gap-10 pt-8 pb-16 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={p.images} name={p.name} badge={p.badge} />

          <div>
            <div className="eyebrow">
              {p.categoryName}
              {p.code && <span className="ml-2 font-normal text-muted">· {p.code}</span>}
            </div>
            <h1 className="display-lg mt-4">{p.name}</h1>
            <p className="mt-3 text-[19px] text-muted">{p.subtitle}</p>
            <p className="mt-6 text-[16px] leading-[1.75]">{p.summary}</p>

            {keySpecs.length > 0 && (
              <dl className="mt-8 grid grid-cols-3 border border-line">
                {keySpecs.map((s, i) => (
                  <div key={s.label} className={`p-4 ${i ? "border-l border-line" : ""}`}>
                    <dt className="text-[12px] text-muted">{s.label}</dt>
                    <dd className="mt-1 font-serif text-[19px] leading-tight md:text-[22px]">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {p.finishes && p.finishes.length > 0 && (
              <div className="mt-7">
                <div className="eyebrow mb-3">Finish</div>
                <ul className="flex flex-wrap gap-4">
                  {p.finishes.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[15px]">
                      <span className="size-5 rounded-full border border-black/10" style={{ background: FINISHES[f]?.swatch }} />
                      {FINISHES[f]?.label ?? f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              <a href="#enquire" className="btn-rect-dark">
                Enquire about this product <Icon name="arrowUpRight" size={18} strokeWidth={1.6} className="text-gold" />
              </a>
              <Link href={`/enquiry?type=demo&product=${p.slug}`} className="btn-rect-gold">
                Book a demo <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-bold">
              {site.whatsappHref && (
                <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-gold-text">
                  Chat on WhatsApp ↗
                </a>
              )}
              {site.phoneHref && (
                <a href={site.phoneHref} className="hover:text-gold-text">
                  Call {site.phone}
                </a>
              )}
              <Link href="/downloads" className="hover:text-gold-text">
                Download brochure ↗
              </Link>
            </div>

            {p.suitableFor && p.suitableFor.length > 0 && (
              <p className="mt-8 border-t border-line pt-5 text-[14px] text-muted">
                <span className="font-bold text-ink">Suitable for:</span> {p.suitableFor.join(" · ")}
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="border-t border-line bg-mist">
        <div className="container-site grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="eyebrow">About this product</div>
            <h2 className="display-md mt-3">Considered in every detail.</h2>
            <p className="mt-6 max-w-[560px] text-[16px] leading-[1.8] text-muted">{p.description}</p>
            {p.features && p.features.length > 0 && (
              <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                {p.features.map((f, i) => (
                  <li key={f.title} className="rounded-[4px] bg-white p-5">
                    <span className="text-[12px] font-bold text-gold-text">0{i + 1}</span>
                    <h3 className="mt-2 text-[17px] font-bold">{f.title}</h3>
                    {f.text && <p className="mt-1 text-[14px] leading-[1.6] text-muted">{f.text}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-[28px]">Specifications</h2>
              <table className="mt-5 w-full border-collapse bg-white text-[15px]">
                <tbody>
                  {p.specs.map((s) => (
                    <tr key={s.label} className="border-b border-line last:border-b-0">
                      <th scope="row" className="w-[44%] px-5 py-3.5 text-left font-normal text-muted">
                        {s.label}
                      </th>
                      <td className="px-5 py-3.5 font-bold">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {p.groups?.map((g) => (
              <div key={g.title}>
                <h3 className="eyebrow">{g.title}</h3>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {g.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[15px]">
                      <Icon name="check" size={18} strokeWidth={2.4} className="mt-0.5 shrink-0 text-gold-text" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="enquire" className="container-site scroll-mt-6 py-16">
        <div className="grid gap-10 rounded-[10px] bg-ink p-6 text-white md:p-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="eyebrow-on-dark">Submit a query</div>
            <h2 className="display-md mt-3">
              Interested in {p.name}?
              <span className="block text-gold">Let&rsquo;s talk.</span>
            </h2>
            <p className="mt-6 max-w-[380px] text-[16px] leading-[1.75] text-white/85">
              Share a few details and our team will get back to you within {site.responseTime} with prices, availability and the right
              recommendation for your space.
            </p>
          </div>
          <div className="rounded-[4px] bg-white p-6 text-text md:p-8">
            <EnquiryForm products={await getProductOptions()} defaultType="quote" defaultProduct={p.slug} variant="product" />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-site pb-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="eyebrow">{category?.name ?? "More"}, considered</div>
              <h2 className="display-md mt-3">You may also like.</h2>
            </div>
            <Link href={`/products/${p.rangeSlug}/${p.category}`} className="text-[15px] font-bold hover:text-gold-text">
              View all {p.categoryName.toLowerCase()} ↗
            </Link>
          </div>
          <ul className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r, i) => (
              <li key={r.slug}>
                <ProductCard p={r} index={i + 1} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <CtaBand
        eyebrow="Let’s create a more considered space"
        title="It starts with a conversation."
        href="/contact"
        label="Get in touch"
        variant="rect"
      />
    </>
  );
}
