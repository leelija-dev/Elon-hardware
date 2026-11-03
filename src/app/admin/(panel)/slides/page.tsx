import { adminListSlides } from "@/lib/admin-data";
import { deleteContentAction, saveSlideAction } from "../../actions";
import { ActionForm, ConfirmButton } from "../../_components/ActionForm";
import { Field, input, textarea } from "../../_components/Field";

export const dynamic = "force-dynamic";

type Row = Record<string, string | number | null>;

function SlideFields({ s }: { s?: Row }) {
  const v = (k: string) => (s?.[k] ?? "") as string;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="id" value={(s?.id as number) ?? ""} />
      <input type="hidden" name="image" value={v("image")} />
      <input type="hidden" name="mobile_image" value={v("mobile_image")} />
      <div className="flex gap-4 md:col-span-2">
        {v("image") && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={v("image")} alt="" className="h-24 w-40 rounded border border-line object-cover" />
        )}
        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          <Field
            label={s ? "Replace slide image" : "Slide image *"}
            hint="Split layout: about 1200 × 1100 px. Full-width layout: at least 1920 × 900 px."
          >
            <input name="imageUpload" type="file" required={!s} accept="image/jpeg,image/png,image/webp,image/avif" className="text-[13px] font-normal" />
          </Field>
          <Field label="Mobile image (optional)" hint="Portrait image used on phones, e.g. 900 × 1100 px.">
            <input name="mobileUpload" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="text-[13px] font-normal" />
          </Field>
        </div>
      </div>
      <Field label="Layout">
        <select name="layout" defaultValue={v("layout") || "split"} className={input}>
          <option value="split">Split — black text panel + image (like the original banner)</option>
          <option value="full">Full width — text over the image</option>
        </select>
      </Field>
      <Field label="Sort order" hint="Lower numbers show first.">
        <input name="sort" type="number" defaultValue={(s?.sort as number) ?? 0} className={input} />
      </Field>
      <Field label="Eyebrow (small gold line)" className="md:col-span-2">
        <input name="eyebrow" defaultValue={v("eyebrow")} className={input} />
      </Field>
      <Field label="Title (white)">
        <input name="title" defaultValue={v("title")} className={input} />
      </Field>
      <Field label="Title (gold line)">
        <input name="accent" defaultValue={v("accent")} className={input} />
      </Field>
      <Field label="Text" className="md:col-span-2">
        <textarea name="text" rows={2} defaultValue={v("text")} className={textarea} />
      </Field>
      <Field label="Button label">
        <input name="button_label" defaultValue={v("button_label")} placeholder="e.g. Explore home lockers" className={input} />
      </Field>
      <Field label="Button link">
        <input name="button_href" defaultValue={v("button_href")} placeholder="/products/…" className={input} />
      </Field>
      <Field label="Second link label">
        <input name="link_label" defaultValue={v("link_label")} placeholder="e.g. Help me choose" className={input} />
      </Field>
      <Field label="Second link">
        <input name="link_href" defaultValue={v("link_href")} placeholder="/locker-finder" className={input} />
      </Field>
      <label className="flex items-center gap-2 text-[14px] font-bold">
        <input type="checkbox" name="published" defaultChecked={s ? !!Number(s.published) : true} className="accent-ink" />
        Show on the website
      </label>
    </div>
  );
}

export default async function AdminSlides({ searchParams }: PageProps<"/admin/slides">) {
  const sp = await searchParams;
  const slides = await adminListSlides();
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-[34px]">Home slider</h1>
      <p className="mt-2 text-[14px] text-muted">The banner slides at the top of the home page. They change automatically every few seconds.</p>
      {sp.saved && <p className="mt-4 rounded bg-[#dcfce7] p-3 text-[14px] text-[#14532d]">Slide added.</p>}
      {sp.deleted && <p className="mt-4 rounded bg-[#dcfce7] p-3 text-[14px] text-[#14532d]">Slide deleted.</p>}

      <ul className="mt-8 space-y-3">
        {slides.length === 0 && <li className="rounded-[6px] bg-white p-5 text-[14px] text-muted">No slides yet — add one below.</li>}
        {slides.map((s, i) => (
          <li key={s.id as number} className="rounded-[6px] bg-white">
            <details>
              <summary className="flex cursor-pointer items-center gap-4 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image as string} alt="" className="h-14 w-24 rounded object-cover" />
                <span className="flex-1">
                  <span className="font-bold">
                    {i + 1}. {[s.title, s.accent].filter(Boolean).join(" ") || "Untitled slide"}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-muted">
                    {s.layout === "full" ? "Full width" : "Split"} · {Number(s.published) ? "Visible" : "Hidden"}
                  </span>
                </span>
              </summary>
              <div className="border-t border-line p-5">
                <ActionForm action={saveSlideAction}>
                  <SlideFields s={s} />
                </ActionForm>
                <form action={deleteContentAction}>
                  <input type="hidden" name="table" value="slides" />
                  <input type="hidden" name="id" value={s.id as number} />
                  <ConfirmButton message="Delete this slide?" className="text-[13px] text-[#b42318] underline">
                    Delete slide
                  </ConfirmButton>
                </form>
              </div>
            </details>
          </li>
        ))}
      </ul>

      <section className="mt-12 rounded-[6px] bg-white p-6">
        <h2 className="text-[20px] font-bold">Add a slide</h2>
        <div className="mt-5">
          <ActionForm action={saveSlideAction} submitLabel="Add slide">
            <SlideFields />
          </ActionForm>
        </div>
      </section>
    </div>
  );
}
