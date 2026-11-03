import Link from "next/link";
import { adminListRanges } from "@/lib/admin-data";
import { deleteRangeAction, saveRangeAction } from "../../actions";
import { ActionForm, ConfirmButton } from "../../_components/ActionForm";
import { Field, input, textarea } from "../../_components/Field";

export const dynamic = "force-dynamic";

type Row = Record<string, string | number | null>;

function RangeFields({ r }: { r?: Row }) {
  const v = (k: string) => (r?.[k] ?? "") as string;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="originalSlug" value={v("slug")} />
      <Field label="Name *">
        <input name="name" required defaultValue={v("name")} className={input} />
      </Field>
      <Field label="URL slug" hint="Leave empty to create from the name. Changing it changes the page address.">
        <input name="slug" defaultValue={v("slug")} className={input} />
      </Field>
      <Field label="Sort order" hint="Lower numbers show first in the menu and on the home page.">
        <input name="sort" type="number" defaultValue={(r?.sort as number) ?? 0} className={input} />
      </Field>
      <span />
      <Field label="Short line" hint="Shown in the Products menu." className="md:col-span-2">
        <input name="short" defaultValue={v("short")} className={input} />
      </Field>
      <Field label="Home page description" className="md:col-span-2">
        <textarea name="description" rows={2} defaultValue={v("description")} className={textarea} />
      </Field>
      <Field label="Round image URL">
        <input name="image" defaultValue={v("image")} className={input} />
      </Field>
      <Field label="…or upload image">
        <input name="imageUpload" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="text-[13px] font-normal" />
      </Field>
      <Field label="Image background colour" hint="e.g. #EAF6FC">
        <input name="image_bg" defaultValue={v("image_bg")} className={input} />
      </Field>
      <span />
      <Field label="Hero title (white)">
        <input name="hero_title" defaultValue={v("hero_title")} className={input} />
      </Field>
      <Field label="Hero title (gold line)">
        <input name="hero_accent" defaultValue={v("hero_accent")} className={input} />
      </Field>
      <Field label="Hero text" className="md:col-span-2">
        <textarea name="hero_text" rows={2} defaultValue={v("hero_text")} className={textarea} />
      </Field>
    </div>
  );
}

export default async function AdminRanges({ searchParams }: PageProps<"/admin/ranges">) {
  const sp = await searchParams;
  const ranges = await adminListRanges();
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-[34px]">Product ranges</h1>
      <p className="mt-2 text-[14px] text-muted">
        {ranges.length} range{ranges.length === 1 ? "" : "s"} shown in the Products menu and on the home page (“One home. Every detail.”). Add,
        edit, reorder or remove ranges here.
      </p>
      {typeof sp.error === "string" && <p className="mt-4 rounded bg-[#fdecea] p-3 text-[14px] text-[#8a1c12]">{sp.error}</p>}
      {typeof sp.saved === "string" && <p className="mt-4 rounded bg-[#dcfce7] p-3 text-[14px] text-[#14532d]">Range saved.</p>}
      {sp.deleted && <p className="mt-4 rounded bg-[#dcfce7] p-3 text-[14px] text-[#14532d]">Range deleted.</p>}

      <ul className="mt-8 space-y-3">
        {ranges.map((r) => {
          const count = Number(r.category_count) || 0;
          return (
            <li key={r.slug as string} className="rounded-[6px] bg-white">
              <details open={sp.saved === r.slug}>
                <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3 p-4">
                  <span>
                    <span className="font-bold">{r.name}</span>
                    <span className="ml-2 text-[13px] font-normal text-muted">/products/{r.slug}</span>
                  </span>
                  <span className="text-[13px] text-muted">
                    {count} categor{count === 1 ? "y" : "ies"} ·{" "}
                    <Link href={`/products/${r.slug}`} target="_blank" className="text-gold-text">
                      view
                    </Link>
                  </span>
                </summary>
                <div className="border-t border-line p-5">
                  <ActionForm action={saveRangeAction}>
                    <RangeFields r={r} />
                  </ActionForm>
                  <form action={deleteRangeAction}>
                    <input type="hidden" name="slug" value={r.slug as string} />
                    {count > 0 ? (
                      <p className="text-[13px] text-muted">To delete this range, first move or delete its {count} categor{count === 1 ? "y" : "ies"}.</p>
                    ) : (
                      <ConfirmButton message={`Delete range ${r.name}?`} className="text-[13px] text-[#b42318] underline">
                        Delete range
                      </ConfirmButton>
                    )}
                  </form>
                </div>
              </details>
            </li>
          );
        })}
      </ul>

      <section className="mt-12 rounded-[6px] bg-white p-6">
        <h2 className="text-[20px] font-bold">Add a range</h2>
        <p className="mt-1 text-[13px] text-muted">After creating a range, add categories to it under Categories.</p>
        <div className="mt-5">
          <ActionForm action={saveRangeAction} submitLabel="Create range">
            <RangeFields />
          </ActionForm>
        </div>
      </section>
    </div>
  );
}
