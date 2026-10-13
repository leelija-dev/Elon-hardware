import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { site } from "@/config/site";
import { getCategories, getCategory, getProduct, getProductOptions } from "@/lib/catalog";
import { ENQUIRY_TYPES, type EnquiryType } from "@/lib/enquiry-schema";

export const metadata: Metadata = {
  title: "Submit a Query",
  description: "Ask about a product, request a quote, book a free home demo or raise a service request with ELON HARDWARE.",
};

const steps = [
  { title: "Tell us what you need", text: "Choose a product or range and share a few details." },
  { title: "We call you back", text: `Our team responds within ${site.responseTime} with options and prices.` },
  { title: "See it, then decide", text: "Book a demo or visit — with no obligation to buy." },
];

export default async function EnquiryPage({ searchParams }: PageProps<"/enquiry">) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : (sp[k] as string | undefined));
  const typeParam = one("type");
  const type: EnquiryType = typeParam && typeParam in ENQUIRY_TYPES ? (typeParam as EnquiryType) : "quote";
  const product = one("product") ? getProduct(one("product")!) : null;
  const interest = one("interest") ? getCategory(one("interest")!) : null;

  const title =
    type === "demo" ? "Book a free" : type === "service" ? "Raise a" : product ? "Enquire about" : "Submit a";
  const accent =
    type === "demo" ? "home demo." : type === "service" ? "service request." : product ? `${product.name}.` : "product query.";

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/enquiry", label: "Submit a Query" },
        ]}
        eyebrow="Product enquiries"
        title={title}
        accent={accent}
        text="Share your requirement and our team will get back to you with the right options, prices and availability for your space."
      />

      <section className="container-site grid gap-10 py-14 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[4px] border border-line p-6 md:p-10">
          <EnquiryForm
            key={`${type}-${product?.slug ?? ""}-${interest?.slug ?? ""}`}
            products={getProductOptions()}
            categories={getCategories()}
            defaultType={type}
            defaultProduct={product?.slug}
            defaultInterest={interest?.slug}
            variant="full"
          />
        </div>

        <aside className="space-y-6">
          {product && (
            <Link href={product.href} className="flex gap-5 rounded-[4px] border border-line p-4 hover:border-ink">
              <span className="relative block size-24 shrink-0 bg-white">
                {product.images[0] && <Image src={product.images[0]} alt="" fill sizes="96px" className="object-contain p-1" />}
              </span>
              <span>
                <span className="eyebrow block">{product.categoryName}</span>
                <span className="mt-1 block font-serif text-[22px]">{product.name}</span>
                <span className="block text-[14px] text-muted">{product.subtitle}</span>
              </span>
            </Link>
          )}
          <div className="rounded-[4px] bg-ink p-7 text-white">
            <div className="eyebrow-on-dark">What happens next</div>
            <ol className="mt-6 space-y-6">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold text-[12px] font-bold text-gold">
                    0{i + 1}
                  </span>
                  <span>
                    <span className="block font-serif text-[19px]">{s.title}</span>
                    <span className="mt-1 block text-[14px] text-white/80">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-[4px] bg-mist-2 p-7">
            <div className="eyebrow">Prefer to talk?</div>
            <p className="mt-3 font-serif text-[22px]">{site.phone}</p>
            <p className="text-[14px] text-muted">{site.hours}</p>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-[14px] font-bold hover:text-gold-text">
              All contact options <Icon name="arrowUpRight" size={16} />
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
