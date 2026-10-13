import Link from "next/link";
import { adminListCategories, adminListRanges } from "@/lib/admin-data";
import { deleteCategoryAction, saveCategoryAction } from "../../actions";
import { ActionForm, ConfirmButton } from "../../_components/ActionForm";
import { Field, input, textarea } from "../../_components/Field";

type Row = Record<string, string | number | null>;

function CategoryFields({ c, ranges }: { c?: Row; ranges: Row[] }) {
  const v = (k: string) => (c?.[k] ?? "") as string;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="originalSlug" value={v("slug")} />
      <Field label="Name *">
        <input name="name" required defaultValue={v("name")} className={input} />
      </Field>
      <Field label="Range *">
        <select name="range_slug" required defaultValue={v("range_slug")} className={input}>
          {ranges.map((r) => (
            <option key={r.slug as string} value={r.slug as string}>
              {r.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="URL slug" hint="Leave empty to create from the name.">
        <input name="slug" defaultValue={v("slug")} className={input} />
      </Field>
      <Field label="Sort order">
        <input name="sort" type="number" defaultValue={(c?.sort as number) ?? 0} className={input} />
      </Field>
      <Field label="Short line" className="md:col-span-2">
        <input name="short" defaultValue={v("short")} className={input} />
      </Field>
      <Field label="Description" className="md:col-span-2">
        <textarea name="description" rows={2} defaultValue={v("description")} className={textarea} />
      </Field>
      <Field label="Tile image URL" hint="Small cut‑out shown on the home page tiles.">
        <input name="tile" defaultValue={v("tile")} className={input} />
      </Field>
      <Field label="…or upload tile image">
        <input name="tileUpload" type="file" accept="image/*" className="text-[13px] font-normal" />
      </Field>
      <Field label="Hero image URL">
        <input name="hero_image" defaultValue={v("hero_image")} className={input} />
      </Field>
      <Field label="…or upload hero image">
        <input name="heroUpload" type="file" accept="image/*" className="text-[13px] font-normal" />
      </Field>
      <Field label="Hero eyebrow">
        <input name="hero_eyebrow" defaultValue={v("hero_eyebrow")} className={input} />
      </Field>
      <Field label="Hero caption">
        <input name="hero_caption" defaultValue={v("hero_caption")} className={input} />
      </Field>
      <Field label="Hero title (white)">
        <input name="hero_title" defaultValue={v("hero_title")} className={input} />
      </Field>
      <Field label="Hero title (gold line)">
        <input name="hero_accent" defaultValue={v("hero_accent")} className={input} />
      </Field>
      <Field label="Hero text" className="md:col-span-2">
        <textarea name="hero_text" rows={2} defaultValue={v("hero_text")} className={textarea} />
      </Field>
      <Field label="Section eyebrow">
        <input name="section_eyebrow" defaultValue={v("section_eyebrow")} className={input} />
      </Field>
      <Field label="Section title">
        <input name="section_title" defaultValue={v("section_title")} className={input} />
      </Field>
      <Field label="Item word" hint="e.g. designs, models">
        <input name="item_noun" defaultValue={v("item_noun")} className={input} />
      </Field>
    </div>
  );
}

export default async function AdminCategories({ searchParams }: PageProps<"/admin/categories">) {
  const sp = await searchParams;
  const cats = adminListCategories();
  const ranges = adminListRanges();
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-[34px]">Categories</h1>
      {typeof sp.error === "string" && <p className="mt-4 rounded bg-[#fdecea] p-3 text-[14px] text-[#8a1c12]">{sp.error}</p>}
      {typeof sp.saved === "string" && <p className="mt-4 rounded bg-[#dcfce7] p-3 text-[14px] text-[#14532d]">Category created.</p>}

      {ranges.map((r) => (
        <section key={r.slug as string} className="mt-10">
          <h2 className="eyebrow">{r.name}</h2>
          <ul className="mt-3 space-y-2">
            {cats
              .filter((c) => c.range_slug === r.slug)
              .map((c) => (
                <li key={c.slug as string} className="rounded-[6px] bg-white">
                  <details>
                    <summary className="flex cursor-pointer items-center justify-between gap-4 p-4">
                      <span>
                        <span className="font-bold">{c.name}</span>
                        <span className="ml-2 text-[13px] text-muted">/{c.slug}</span>
                      </span>
                      <span className="text-[13px] text-muted">
                        {c.product_count} products ·{" "}
                        <Link href={`/admin/products?category=${c.slug}`} className="text-gold-text">
                          view
                        </Link>
                      </span>
                    </summary>
                    <div className="border-t border-line p-5">
                      <ActionForm action={saveCategoryAction}>
                        <CategoryFields c={c} ranges={ranges} />
                      </ActionForm>
                      <form action={deleteCategoryAction}>
                        <input type="hidden" name="slug" value={c.slug as string} />
                        <ConfirmButton message={`Delete category ${c.name}?`} className="text-[13px] text-[#b42318] underline">
                          Delete category
                        </ConfirmButton>
                      </form>
                    </div>
                  </details>
                </li>
              ))}
          </ul>
        </section>
      ))}

      <section className="mt-12 rounded-[6px] bg-white p-6">
        <h2 className="text-[20px] font-bold">Add a category</h2>
        <div className="mt-5">
          <ActionForm action={saveCategoryAction} submitLabel="Create category">
            <CategoryFields ranges={ranges} />
          </ActionForm>
        </div>
      </section>
    </div>
  );
}
