import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Privacy Policy" };

// ⚠️ Placeholder wording — have the client's legal adviser review and replace before launch.
export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ href: "/", label: "Home" }, { href: "/privacy-policy", label: "Privacy Policy" }]} eyebrow="Legal" title="Privacy policy" />
      <article className="container-site max-w-3xl space-y-5 py-16 text-[16px] leading-[1.8] text-muted [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-[24px] [&_h2]:text-ink">
        <p>This page explains how {site.name} handles the information you share through this website.</p>
        <h2>Information we collect</h2>
        <p>When you submit an enquiry, book a demo or raise a service request, we collect the details you enter — such as your name, mobile number, email, city, pin code and message — along with basic technical information like your IP address and browser.</p>
        <h2>How we use it</h2>
        <p>We use these details only to respond to your enquiry, arrange demos, installation or service, and keep you updated about your request. If you opt in, we may contact you on WhatsApp about your enquiry.</p>
        <h2>Sharing and retention</h2>
        <p>We do not sell your information. We keep enquiry records only for as long as needed to serve you and meet legal obligations.</p>
        <h2>Contact</h2>
        <p>To access or delete your information, contact us at {site.email}.</p>
      </article>
    </>
  );
}
