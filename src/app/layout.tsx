import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/config/site";

// Content is read from the database on every request, so admin edits show immediately.
export const dynamic = "force-dynamic";

const dejavu = localFont({
  src: "../fonts/DejaVuSerif-latin.woff2",
  variable: "--font-dejavu",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Home Lockers & Architectural Hardware`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    images: [{ url: "/images/lifestyle/hero-woman.jpg", width: 670, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#080808" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={dejavu.variable}>
      <body>{children}</body>
    </html>
  );
}
