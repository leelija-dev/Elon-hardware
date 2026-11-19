import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { CtaBand } from "@/components/Footer";
import { Icon, type IconName } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { site } from "@/config/site";
import { getCategories, getProductOptions } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Talk to ELON HARDWARE about home lockers, door hardware and fittings for your space. Book a demo or request a quote.",
};

const faqs = [
  {
    q: "Who can enquire with ELON HARDWARE?",
    a: "Hardware dealers, furniture manufacturers, interior designers, architects and other trade buyers can contact us for product and supply enquiries.",
  },
  {
    q: "Which product categories do you supply?",
    a: "Our categories include furniture, kitchen, wardrobe, architectural, glass and selected digital hardware. Product availability may vary.",
  },
  {
    q: "Can I enquire about bulk or regular supply?",
    a: "Yes. Share your business details, product requirements and estimated quantities so our team can discuss the available supply options.",
  },
  {
    q: "Can interior designers enquire for project requirements?",
    a: "Yes. Share the product types, finishes, quantities and project location for assistance.",
  },
  {
    q: "How can I receive product details and pricing?",
    a: "Submit the enquiry form or contact our team by phone or WhatsApp.",
  },
];

export default async function ContactPage() {
  const channels: { icon: IconName; label: string; value: string; note: string; href?: string }[] = [
    { icon: "phone", label: "Call us", value: site.phone, note: "Call for Product & Trade Enquiries", href: site.phoneHref },
    { icon: "chat", label: "WhatsApp", value: site.whatsapp, note: "WhatsApp for Product Information", href: site.whatsappHref },
    { icon: "mail", label: "Email", value: site.email, note: "Email for Dealer & Business Enquiries", href: site.emailHref },
    { icon: "pin", label: "Showroom & Office", value: site.address, note: site.cityLine },
  ];

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/contact", label: "Contact Us" },
        ]}
        eyebrow="Let’s discuss your hardware requirements"
        title="Contact "
        accent="Elon Hardware"
        text="For product enquiries, dealer partnerships, furniture manufacturing requirements and interior projects, get in touch
with the ELON HARDWARE team."
        image="/images/lifestyle/hero-woman.jpg"
        imageAlt="Woman holding a jewellery box at home"
        caption="Personal. By design."
      />

      <section className="container-site grid gap-10 py-16 lg:grid-cols-[1.35fr_1fr]">
        <div className="rounded-[4px] border border-line p-6 md:p-10">
          <div className="eyebrow">Send us your enquiry</div>
          <h2 className="display-sm mt-3 mb-8">How can we help?</h2>
          <EnquiryForm products={await getProductOptions()} categories={await getCategories()} defaultType="quote" showTypeTabs={false} variant="full" />
        </div>
        <aside className="space-y-4">
          {channels.map((c) => {
            const body = (
              <>
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ink text-gold">
                  <Icon name={c.icon} size={20} strokeWidth={1.8} />
                </span>
                <span>
                  <span className="block text-[12px] font-bold tracking-[0.02em] text-gold-text uppercase">{c.label}</span>
                  <span className="mt-1 block font-serif text-[19px]">{c.value}</span>
                  <span className="block text-[14px] text-muted">{c.note}</span>
                </span>
              </>
            );
            return c.href ? (
              <a key={c.label} href={c.href} className="flex gap-4 rounded-[4px] bg-mist-2 p-5 hover:bg-[#eeeeee]">
                {body}
              </a>
            ) : (
              <div key={c.label} className="flex gap-4 rounded-[4px] bg-mist-2 p-5">
                {body}
              </div>
            );
          })}
          {site.mapEmbedUrl && (
            <iframe
              title="Map to our showroom"
              src={site.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[240px] w-full rounded-[4px] border-0"
            />
          )}
        </aside>
      </section>

      <section id="faq" className="scroll-mt-4 bg-mist">
        <div className="container-site grid gap-10 py-16 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <div className="eyebrow">Good to know</div>
            <h2 className="display-md mt-3">Questions before you choose.</h2>
          </div>
          <div>
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-line py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-6 font-serif text-[20px]">
                  {f.q}
                  <Icon name="plus" size={20} className="shrink-0 text-gold-text transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-3 max-w-[640px] text-[16px] leading-[1.75] text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* <CtaBand eyebrow="Prefer to see it first?" title="Book a free home demo." href="/enquiry?type=demo" label="Book a demo" /> */}
    </>
  );
}
