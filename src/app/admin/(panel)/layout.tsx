import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Icon";
import { requireAdmin } from "@/lib/auth";
import { enquiryCounts } from "@/lib/enquiries";
import { logoutAction } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/ranges", label: "Ranges" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const counts = enquiryCounts();
  return (
    <div className="min-h-screen bg-mist lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="bg-ink p-6 text-white lg:sticky lg:top-0 lg:h-screen">
        <Link href="/admin">
          <Logo dark />
        </Link>
        <nav aria-label="Admin" className="mt-10 flex flex-wrap gap-1 lg:flex-col">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="flex items-center justify-between rounded px-3 py-2.5 text-[15px] hover:bg-ink-3">
              {n.label}
              {n.label === "Enquiries" && counts.new > 0 && (
                <span className="rounded-full bg-gold px-2 text-[12px] font-bold text-ink">{counts.new}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-10 flex flex-col gap-2 border-t border-ink-line pt-6 text-[14px] text-fog">
          <Link href="/" target="_blank" className="hover:text-white">
            View website ↗
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="hover:text-white">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 p-5 md:p-10">{children}</main>
    </div>
  );
}
