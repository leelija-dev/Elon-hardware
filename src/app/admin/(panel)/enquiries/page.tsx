import Link from "next/link";
import { listEnquiries, enquiryCounts } from "@/lib/enquiries";
import { DEMO_SLOTS, ENQUIRY_TYPES } from "@/lib/enquiry-schema";
import { deleteEnquiryAction, updateEnquiryAction } from "../../actions";
import { ConfirmButton } from "../../_components/ActionForm";

const STATUS = ["new", "contacted", "closed"] as const;

export default async function EnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : undefined;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const items = listEnquiries({ status, q });
  const counts = enquiryCounts();
  const tab = (s?: string) =>
    `rounded-full px-4 py-2 text-[14px] ${status === s ? "bg-ink text-white" : "bg-white hover:bg-mist-2"}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-[34px]">Enquiries</h1>
        <a href={`/admin/export${status ? `?status=${status}` : ""}`} className="btn-rect-outline">
          Export CSV ↓
        </a>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link href="/admin/enquiries" className={tab(undefined)}>
          All ({counts.all})
        </Link>
        {STATUS.map((s) => (
          <Link key={s} href={`/admin/enquiries?status=${s}`} className={`capitalize ${tab(s)}`}>
            {s} ({counts[s]})
          </Link>
        ))}
        <form className="ml-auto flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Search name, phone, city, ref…" className="field min-h-10 w-64 text-[14px]" />
          <button className="btn-rect-dark min-h-10">Search</button>
        </form>
      </div>

      <ul className="mt-6 space-y-3">
        {items.length === 0 && <li className="rounded-[6px] bg-white p-6 text-muted">No enquiries found.</li>}
        {items.map((e) => (
          <li key={e.id} className="rounded-[6px] bg-white">
            <details>
              <summary className="grid cursor-pointer gap-2 p-5 md:grid-cols-[170px_1.2fr_1fr_1.2fr_110px] md:items-center">
                <span className="text-[13px] text-muted">
                  {new Date(e.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}
                  <br />
                  <span className="font-mono text-[12px]">{e.id}</span>
                </span>
                <span>
                  <span className="block font-bold">{e.name}</span>
                  <span className="block text-[14px] text-muted">
                    {e.phone} · {e.city}
                  </span>
                </span>
                <span className="text-[14px]">{ENQUIRY_TYPES[e.type]}</span>
                <span className="text-[14px]">{e.productName ?? e.interest ?? "—"}</span>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-[12px] font-bold capitalize ${
                    e.status === "new" ? "bg-gold text-ink" : e.status === "contacted" ? "bg-[#dbeafe] text-[#1e3a8a]" : "bg-mist-2 text-muted"
                  }`}
                >
                  {e.status}
                </span>
              </summary>
              <div className="grid gap-6 border-t border-line p-5 lg:grid-cols-[1.3fr_1fr]">
                <dl className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-2 text-[14px]">
                  <dt className="text-muted">Mobile</dt>
                  <dd>
                    <a href={`tel:${e.phone}`} className="font-bold underline">{e.phone}</a>
                    {e.whatsapp && <span className="ml-2 text-muted">(WhatsApp OK)</span>}
                  </dd>
                  {e.email && (<><dt className="text-muted">Email</dt><dd><a href={`mailto:${e.email}`} className="underline">{e.email}</a></dd></>)}
                  <dt className="text-muted">City / PIN</dt>
                  <dd>{e.city}{e.pincode ? ` · ${e.pincode}` : ""}</dd>
                  {e.slot && (<><dt className="text-muted">Demo slot</dt><dd>{DEMO_SLOTS[e.slot]}</dd></>)}
                  {e.product && (<><dt className="text-muted">Product</dt><dd><Link href={`/product/${e.product}`} target="_blank" className="underline">{e.productName}</Link></dd></>)}
                  {e.message && (<><dt className="text-muted">Message</dt><dd className="whitespace-pre-wrap">{e.message}</dd></>)}
                  <dt className="text-muted">Page</dt>
                  <dd className="text-muted">{e.page ?? "—"}</dd>
                </dl>
                <div>
                  <form action={updateEnquiryAction} className="space-y-3">
                    <input type="hidden" name="id" value={e.id} />
                    <label className="flex flex-col gap-1 text-[14px] font-bold">
                      Status
                      <select name="status" defaultValue={e.status} className="field min-h-10 text-[14px] font-normal">
                        {STATUS.map((s) => (<option key={s} value={s} className="capitalize">{s}</option>))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-[14px] font-bold">
                      Internal notes
                      <textarea name="notes" defaultValue={e.notes} rows={3} className="field py-2 text-[14px] font-normal" />
                    </label>
                    <button className="btn-rect-dark min-h-10">Update</button>
                  </form>
                  <form action={deleteEnquiryAction} className="mt-3">
                    <input type="hidden" name="id" value={e.id} />
                    <ConfirmButton message={`Delete enquiry ${e.id}? This cannot be undone.`} className="text-[13px] text-[#b42318] underline">
                      Delete enquiry
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
