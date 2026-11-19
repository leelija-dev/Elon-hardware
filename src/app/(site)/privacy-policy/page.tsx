import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Privacy Policy" };

// ⚠️ Have the client's legal adviser review this and check it against the actual forms, analytics, cookies,
// WhatsApp integration, hosting and data-retention practices before launch.
export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ href: "/", label: "Home" }, { href: "/privacy-policy", label: "Privacy Policy" }]} eyebrow="Legal" title="Privacy policy" />
      <article className="container-site max-w-3xl space-y-5 py-16 text-[16px] leading-[1.8] text-muted [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-[24px] [&_h2]:text-ink">
        <p>
          This Privacy Policy explains how {site.name} collects, uses, stores and protects information submitted through this
          website, including product enquiries, dealer enquiries and requests for catalogues or support.
        </p>

        <h2>Information we collect</h2>
        <p>
          When you submit an enquiry, we collect the details you enter, such as your name, mobile number, email, city, pin code
          and message, along with basic technical information like your IP address and browser.
        </p>

        <h2>How we use it</h2>
        <p>
          We use submitted information to respond to product and business enquiries, share requested product information,
          prepare quotations, coordinate customer support and communicate about the enquiry where consent has been provided.
        </p>

        <h2>Sharing and retention</h2>
        <p>
          We do not sell your information. We keep enquiry records only for as long as needed to serve you and meet legal
          obligations.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy-related questions or requests concerning your personal information, contact {site.name} using the
          official contact details published on this website. You can also reach us through the{" "}
          <Link href="/contact" className="underline hover:text-ink">contact page</Link>.
        </p>
      </article>
    </>
  );
}