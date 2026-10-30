import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/EnquiryForm";
import { CtaBand } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { site } from "@/config/site";
import { getProductOptions } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services — Support, Warranty & Installation",
  description: "Service support, warranty, installation and care for ELON HARDWARE products, including one-day installation.",
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
        title="Here for you,"
        accent="long after you choose."
        text="Installation, support, warranty and care — everything you need to enjoy your ELON HARDWARE products for years."
      >
        <nav aria-label="Services" className="mt-9 flex flex-wrap gap-3 text-[14px] font-bold">
          {[
            ["#support", "Service support"],
            ["#warranty", "Warranty"],
            ["#installation", "How to install"],
            ["#odi", "One Day Installation"],
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
          <h2 className="display-md mt-3">Something not right? Tell us.</h2>
          <p className="mt-5 max-w-[440px] text-[16px] leading-[1.75] text-muted">
            Raise a service request for access issues, alarms, batteries or installation. Mention the model and what&rsquo;s happening —
            our team will call you within {site.responseTime} and arrange a visit if needed.
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
            <h2 className="display-md mt-3">Covered with confidence.</h2>
          </div>
          <div className="space-y-4 text-[16px] leading-[1.75] text-muted">
            <p>
              ELON HARDWARE products come with a manufacturer warranty of {site.warranty} from the date of purchase. Keep your invoice —
              you&rsquo;ll need it for any warranty claim.
            </p>
            <p>To make a claim, raise a service request above with your model and invoice details and our team will guide you.</p>
            <p className="text-[13px]">Exact warranty terms vary by product — ask our team for the terms of your model.</p>
          </div>
        </div>
      </section>

      <section id="installation" className="container-site scroll-mt-6 py-16">
        <div className="eyebrow">03 / How to install</div>
        <h2 className="display-md mt-3">Professional installation, step by step.</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {installSteps.map((s, i) => (
            <li key={s.title} className="border-t-2 border-ink pt-5">
              <span className="text-[12px] font-bold text-gold-text">0{i + 1}</span>
              <h3 className="mt-2 font-serif text-[22px] font-normal">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.7] text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="odi" className="container-site scroll-mt-6 pb-16">
        <div className="grid gap-8 rounded-[10px] bg-ink p-8 text-white md:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <div className="eyebrow-on-dark">04 / ODI — One Day Installation</div>
            <h2 className="display-md mt-4">
              One visit.
              <span className="block text-gold">Fully set up.</span>
            </h2>
            <p className="mt-5 max-w-[520px] text-[16px] leading-[1.75] text-white/85">
              With One Day Installation, your digital lock or home locker is installed, set up and explained to you in a single visit,
              scheduled on a day that suits you — subject to stock and serviceable locations.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/enquiry?type=demo" className="btn-rect-gold">
              Book installation <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
            </Link>
            <Link href="/contact" className="btn rounded-[3px] border border-white/30 text-white hover:border-gold">
              Check my location <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </section>

      <section id="care" className="scroll-mt-6 bg-mist">
        <div className="container-site grid gap-10 py-16 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <div className="eyebrow">05 / Care &amp; maintenance</div>
            <h2 className="display-md mt-3">Small habits. Lasting performance.</h2>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {care.map((c) => (
              <li key={c} className="flex gap-3 rounded-[4px] bg-white p-5 text-[15px] leading-[1.6]">
                <Icon name="check" size={18} strokeWidth={2.4} className="mt-0.5 shrink-0 text-gold-text" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand eyebrow="We're here to help" title="It starts with a conversation." href="/contact" label="Get in touch" variant="rect" />
    </>
  );
}
