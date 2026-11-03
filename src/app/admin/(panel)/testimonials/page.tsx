import { adminListTestimonials } from "@/lib/admin-data";
import { deleteContentAction, saveTestimonialAction } from "../../actions";
import { ActionForm, ConfirmButton } from "../../_components/ActionForm";
import { Field, input, textarea } from "../../_components/Field";

export const dynamic = "force-dynamic";

type Row = Record<string, string | number | null>;

function TestimonialFields({ t }: { t?: Row }) {
  const v = (k: string) => (t?.[k] ?? "") as string;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="id" value={(t?.id as number) ?? ""} />
      <input type="hidden" name="photo" value={v("photo")} />
      <Field label="Customer name *">
        <input name="name" required maxLength={255} defaultValue={v("name")} className={input} />
      </Field>
      <Field label="Location / detail" hint="e.g. Kolkata · Home locker owner">
        <input name="meta" maxLength={255} defaultValue={v("meta")} className={input} />
      </Field>
      <Field label="Review *" className="md:col-span-2">
        <textarea name="quote" required rows={3} maxLength={2000} defaultValue={v("quote")} className={textarea} />
      </Field>
      <Field label="Rating">
        <select name="rating" defaultValue={String(t?.rating ?? 5)} className={input}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {"★".repeat(n)} ({n})
            </option>
          ))}
        </select>
      </Field>
      <Field label="Sort order" hint="Lower numbers show first.">
        <input name="sort" type="number" defaultValue={(t?.sort as number) ?? 0} className={input} />
      </Field>
      <Field label="Photo (optional)" hint="Square image of the customer — initials are shown if empty.">
        <input name="photoUpload" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="text-[13px] font-normal" />
      </Field>
      <div className="flex flex-col justify-center gap-2">
        {v("photo") && (
          <label className="flex items-center gap-2 text-[14px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v("photo")} alt="" className="size-10 rounded-full object-cover" />
            <input type="checkbox" name="removePhoto" className="accent-ink" /> Remove photo
          </label>
        )}
        <label className="flex items-center gap-2 text-[14px] font-bold">
          <input type="checkbox" name="published" defaultChecked={t ? !!Number(t.published) : true} className="accent-ink" />
          Show on the website
        </label>
      </div>
    </div>
  );
}

export default async function AdminTestimonials({ searchParams }: PageProps<"/admin/testimonials">) {
  const sp = await searchParams;
  const items = await adminListTestimonials();
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-[34px]">Testimonials</h1>
      <p className="mt-2 text-[14px] text-muted">
        Customer reviews shown above the footer on the home page. Only add genuine reviews, with the customer&rsquo;s permission. The section is
        hidden while there are none.
      </p>
      {sp.saved && <p className="mt-4 rounded bg-[#dcfce7] p-3 text-[14px] text-[#14532d]">Review added.</p>}
      {sp.deleted && <p className="mt-4 rounded bg-[#dcfce7] p-3 text-[14px] text-[#14532d]">Review deleted.</p>}

      <ul className="mt-8 space-y-3">
        {items.length === 0 && <li className="rounded-[6px] bg-white p-5 text-[14px] text-muted">No reviews yet — add one below.</li>}
        {items.map((t) => (
          <li key={t.id as number} className="rounded-[6px] bg-white">
            <details>
              <summary className="cursor-pointer p-4">
                <span className="font-bold">{t.name}</span>
                <span className="ml-2 text-[13px] text-gold-text">{"★".repeat(Number(t.rating) || 0)}</span>
                <span className="ml-2 text-[13px] text-muted">{Number(t.published) ? "Visible" : "Hidden"}</span>
                <span className="mt-1 block truncate text-[13px] text-muted">“{t.quote}”</span>
              </summary>
              <div className="border-t border-line p-5">
                <ActionForm action={saveTestimonialAction}>
                  <TestimonialFields t={t} />
                </ActionForm>
                <form action={deleteContentAction}>
                  <input type="hidden" name="table" value="testimonials" />
                  <input type="hidden" name="id" value={t.id as number} />
                  <ConfirmButton message={`Delete the review from ${t.name}?`} className="text-[13px] text-[#b42318] underline">
                    Delete review
                  </ConfirmButton>
                </form>
              </div>
            </details>
          </li>
        ))}
      </ul>

      <section className="mt-12 rounded-[6px] bg-white p-6">
        <h2 className="text-[20px] font-bold">Add a review</h2>
        <div className="mt-5">
          <ActionForm action={saveTestimonialAction} submitLabel="Add review">
            <TestimonialFields />
          </ActionForm>
        </div>
      </section>
    </div>
  );
}
