import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Terms of Use" };

// ⚠️ Have the client's legal adviser review this before launch.
export default function TermsPage() {
  return (
    <>
      <PageHero crumbs={[{ href: "/", label: "Home" }, { href: "/terms", label: "Terms of Use" }]} eyebrow="Legal" title="Terms of use" />
      <article className="container-site max-w-3xl space-y-5 py-16 text-[16px] leading-[1.8] text-muted [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-[24px] [&_h2]:text-ink">
        <p>
          These terms govern your use of the {site.name} website. The website provides general information about product
          categories and enables users to submit product, trade and project enquiries.
        </p>

        <h2>Product information</h2>
        <p>
          Product specifications, images, finishes, dimensions, availability and other details are provided for general
          reference and may vary by model or supply batch. Please confirm the final specifications and commercial terms with{" "}
          {site.name} before placing an order.
        </p>

        <h2>Enquiries and orders</h2>
        <p>
          Submitting an enquiry does not constitute an order confirmation. Orders are subject to written confirmation of
          product, quantity, pricing, taxes, payment terms and delivery conditions by {site.name}.
        </p>

        <h2>Content</h2>
        <p>Website content belongs to {site.name} or its licensors and may not be reused without permission.</p>
      </article>
    </>
  );
}