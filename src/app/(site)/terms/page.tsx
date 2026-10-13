import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Terms of Use" };

// ⚠️ Placeholder wording — have the client's legal adviser review and replace before launch.
export default function TermsPage() {
  return (
    <>
      <PageHero crumbs={[{ href: "/", label: "Home" }, { href: "/terms", label: "Terms of Use" }]} eyebrow="Legal" title="Terms of use" />
      <article className="container-site max-w-3xl space-y-5 py-16 text-[16px] leading-[1.8] text-muted [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-[24px] [&_h2]:text-ink">
        <p>By using this website you agree to these terms.</p>
        <h2>Product information</h2>
        <p>We work to keep product details, images and specifications accurate, but products may change. Images may be representative. Please confirm specifications, finishes and prices with our team before ordering.</p>
        <h2>Enquiries</h2>
        <p>Submitting an enquiry does not create an order or a contract. Prices and availability are confirmed by {site.name} in writing.</p>
        <h2>Content</h2>
        <p>Website content belongs to {site.name} or its licensors and may not be reused without permission.</p>
      </article>
    </>
  );
}
