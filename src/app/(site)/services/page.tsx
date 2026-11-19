import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { CtaBand } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { site } from "@/config/site";
import { getProductOptions } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services — Support, Warranty & Installation",
  description: "Service support, warranty, installation and care for ELON HARDWARE products.",
};

const installSteps = [
  { title: "Choose the spot", text: "Pick a dry, discreet place — inside a wardrobe, cabinet or against a solid wall or floor." },
  { title: "Site check", text: "Our technician confirms wall or floor strength, door clearance and fixing points." },
  { title: "Secure fixing", text: "The product is anchored with the supplied bolts so it cannot be removed or carried away." },
  { title: "Set up & walkthrough", text: "We register fingerprints and codes with you and explain every feature and alarm." },
];

const care = [
  "Replace batteries as soon as the low‑battery alert appears; keep spare batteries at home.",
  "Store mechanical override keys away from the locker, in a place only you know.",
  "Change default PIN codes on day one and update them periodically.",
  "Wipe keypads and handles with a soft, dry cloth — avoid abrasive or acidic cleaners.",
  "Keep fingerprint sensors clean and dry for reliable reads.",
  "For door hardware, check and tighten screws once a year to keep the action smooth.",
];

export default async function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
        ]}
        eyebrow="Services"
        title="Product support "
        accent="& customer assistance"
        text="ELON HARDWARE supports trade customers with product information, selection guidance and assistance with
              product-related enquiries. Support availability and warranty coverage depend on the product and its applicable
              terms."
      >
        <nav aria-label="Services" className="mt-9 flex flex-wrap gap-3 text-[14px] font-bold">
          {[
            ["#support", "Service support"],
            ["#warranty", "Warranty"],
            ["#installation", "How to install"],
            ["#care", "Care & maintenance"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="rounded-full border border-white/30 px-4 py-2 hover:border-gold hover:text-gold">
              {label}
            </a>
          ))}
        </nav>
      </PageHero>

      <section id="support" className="container-site grid scroll-mt-6 gap-10 py-16 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <div className="eyebrow">01 / Service support</div>
          <h2 className="display-md mt-3">Need product assistance?</h2>
          <p className="mt-5 max-w-[440px] text-[16px] leading-[1.75] text-muted">
            For product questions, installation guidance or an issue with a supplied item, share the product name or code,
            purchase details and a description of your requirement. Our team will guide you on the next steps.
          </p>
          <ul className="mt-6 space-y-2 text-[15px]">
            {site.phoneHref && <li>Call: <a className="font-bold" href={site.phoneHref}>{site.phone}</a></li>}
            {site.whatsappHref && <li>WhatsApp: <a className="font-bold" href={site.whatsappHref}>{site.whatsapp}</a></li>}
            {site.emailHref && <li>Email: <a className="font-bold" href={site.emailHref}>{site.email}</a></li>}
          </ul>
        </div>
        <div className="rounded-[4px] border border-line p-6 md:p-8">
          <EnquiryForm products={await getProductOptions()} defaultType="service" showTypeTabs={false} variant="full" />
        </div>
      </section>

      <section id="warranty" className="scroll-mt-6 bg-mist">
        <div className="container-site grid gap-10 py-16 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <div className="eyebrow">02 / Warranty</div>
            <h2 className="display-md mt-3">Product warranty</h2>
          </div>
          <div className="space-y-4 text-[16px] leading-[1.75] text-muted">
            <p>
              Warranty coverage, duration and conditions vary by product.
            </p>
            <p> Please refer to the warranty terms supplied with the
                relevant product or contact our team with your product code and invoice details.</p>
            
          </div>
        </div>
      </section>

      <section id="installation" className="container-site scroll-mt-6 py-16">
  <div className="grid gap-10 border-t border-line pt-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
    {/* Left: heading */}
    <div>
      <div className="eyebrow">03 / How to install</div>
      <h2 className="mt-3 font-serif text-[28px] leading-[1.2] font-normal md:text-[36px]">
        Installation information.
      </h2>
      <span aria-hidden="true" className="mt-6 block h-[3px] w-12 bg-gold" />
    </div>

    {/* Right: content */}
    <div>
      <p className="max-w-[560px] text-[16px] leading-[1.75] text-muted md:text-[17px]">
        Installation requirements differ by product. Please review the product instructions and confirm compatibility,
        dimensions and fitting requirements before installation.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["01", "Compatibility", "Confirm the product suits your application."],
          ["02", "Dimensions", "Check sizes and clearances before fitting."],
          ["03", "Fitting requirements", "Follow the product instructions."],
        ].map(([n, t, s]) => (
          <li key={n} className="rounded-[4px] border border-line bg-white px-5 py-6">
            <span className="text-[12px] font-bold text-gold-text">{n}</span>
            <h3 className="mt-3 font-serif text-[20px] font-normal">{t}</h3>
            <p className="mt-2 text-[14px] leading-[1.6] text-muted">{s}</p>
          </li>
        ))}
      </ul>

      
    </div>
  </div>
</section>

      <section id="care" className="scroll-mt-6 bg-mist">
  <div className="container-site grid gap-10 py-16 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
    {/* Left: heading + intro */}
    <div>
      <div className="eyebrow">04 / Care &amp; maintenance</div>
      <h2 className="mt-3 font-serif text-[28px] leading-[1.2] font-normal md:text-[36px]">
        Care &amp; maintenance.
      </h2>
      <span aria-hidden="true" className="mt-6 block h-[3px] w-12 bg-gold" />
      <p className="mt-6 max-w-[460px] text-[16px] leading-[1.75] text-muted md:text-[17px]">
        Use and maintain each product according to its material, finish and manufacturer instructions.
      </p>

      <div className="mt-6 flex max-w-[460px] items-start gap-3 border-l-[3px] border-gold bg-white px-5 py-4 text-[14px] leading-[1.65]">
        <Icon name="shield" size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-gold-text" />
        <p className="m-0">
          Avoid harsh chemicals or abrasive cleaning methods unless specifically approved for the product.
        </p>
      </div>
    </div>

    {/* Right: care tips */}
    <ul className="grid content-start gap-4 sm:grid-cols-2">
      {care.map((c) => (
        <li key={c} className="flex gap-3 rounded-[4px] bg-white p-5 text-[15px] leading-[1.6]">
          <Icon name="check" size={18} strokeWidth={2.4} className="mt-0.5 shrink-0 text-gold-text" />
          {c}
        </li>
      ))}
    </ul>
  </div>
</section>

      {/* <CtaBand eyebrow="We're here to help" title="It starts with a conversation." href="/contact" label="Get in touch" variant="rect" /> */}
    </>
  );
}
