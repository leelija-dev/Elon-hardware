import Link from "next/link";
import { adminListCategories, adminListProducts } from "@/lib/admin-data";
import { enquiryCounts, listEnquiries } from "@/lib/enquiries";
import { ENQUIRY_TYPES } from "@/lib/enquiry-schema";

export default function Dashboard() {
  const counts = enquiryCounts();
  const products = adminListProducts();
  const cats = adminListCategories();
  const recent = listEnquiries().slice(0, 6);
  const stats = [
    { label: "New enquiries", value: counts.new, href: "/admin/enquiries?status=new" },
    { label: "All enquiries", value: counts.all, href: "/admin/enquiries" },
    { label: "Published products", value: products.filter((p) => p.status === "published").length, href: "/admin/products" },
    { label: "Categories", value: cats.length, href: "/admin/categories" },
  ];
  return (
    <div>
      <h1 className="font-serif text-[34px]">Dashboard</h1>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="block rounded-[6px] bg-white p-6 hover:shadow">
              <div className="font-serif text-[40px] leading-none">{s.value}</div>
              <div className="mt-3 text-[14px] text-muted">{s.label}</div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-[20px] font-bold">Latest enquiries</h2>
        <Link href="/admin/enquiries" className="text-[14px] font-bold text-gold-text">
          View all →
        </Link>
      </div>
      <div className="mt-4 overflow-x-auto rounded-[6px] bg-white">
        <table className="w-full min-w-[640px] text-left text-[14px]">
          <thead className="border-b border-line text-[12px] text-muted uppercase">
            <tr>
              <th className="p-4">Received</th>
              <th className="p-4">Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Product / interest</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-muted">
                  No enquiries yet.
                </td>
              </tr>
            )}
            {recent.map((e) => (
              <tr key={e.id} className="border-b border-line last:border-0">
                <td className="p-4 whitespace-nowrap">{new Date(e.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}</td>
                <td className="p-4">
                  <div className="font-bold">{e.name}</div>
                  <div className="text-muted">{e.phone}</div>
                </td>
                <td className="p-4">{ENQUIRY_TYPES[e.type]}</td>
                <td className="p-4">{e.productName ?? e.interest ?? "—"}</td>
                <td className="p-4 capitalize">{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
