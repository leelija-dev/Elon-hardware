import Image from "next/image";
import Link from "next/link";
import { adminListCategories, adminListProducts } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminProducts({ searchParams }: PageProps<"/admin/products">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const products = await adminListProducts({ q, category });
  const cats = await adminListCategories();
  const catName = new Map(cats.map((c) => [c.slug as string, c.name as string]));
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-[34px]">Products</h1>
        <Link href="/admin/products/new" className="btn-rect-dark">
          + Add product
        </Link>
      </div>
      {sp.deleted && <p className="mt-4 rounded bg-white p-3 text-[14px]">Product deleted.</p>}
      <form className="mt-6 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Search name or code…" className="field min-h-10 w-64 text-[14px]" />
        <select name="category" defaultValue={category ?? ""} className="field min-h-10 w-64 text-[14px]">
          <option value="">All categories</option>
          {cats.map((c) => (
            <option key={c.slug as string} value={c.slug as string}>
              {c.name} ({c.product_count})
            </option>
          ))}
        </select>
        <button className="btn-rect-dark min-h-10">Filter</button>
      </form>
      <div className="mt-6 overflow-x-auto rounded-[6px] bg-white">
        <table className="w-full min-w-[720px] text-left text-[14px]">
          <thead className="border-b border-line text-[12px] text-muted uppercase">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Featured</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.slug} className="border-b border-line last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="relative block size-12 shrink-0 border border-line bg-white">
                      {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="48px" className="object-contain p-1" />}
                    </span>
                    <span>
                      <span className="block font-bold">{p.name}</span>
                      <span className="block text-muted">{p.code ?? p.slug}</span>
                    </span>
                  </div>
                </td>
                <td className="p-4">{catName.get(p.category) ?? p.category}</td>
                <td className="p-4">
                  <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${p.status === "published" ? "bg-[#dcfce7] text-[#14532d]" : "bg-mist-2 text-muted"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4">{p.featured ? "★" : ""}</td>
                <td className="p-4 text-right whitespace-nowrap">
                  <Link href={`/admin/products/${p.slug}`} className="font-bold text-gold-text">
                    Edit
                  </Link>
                  {p.status === "published" && (
                    <Link href={`/product/${p.slug}`} target="_blank" className="ml-4 text-muted">
                      View ↗
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
