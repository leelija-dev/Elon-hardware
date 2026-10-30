import { adminListRanges } from "@/lib/admin-data";
import { saveRangeAction } from "../../actions";
import { ActionForm } from "../../_components/ActionForm";
import { Field, input, textarea } from "../../_components/Field";

export default async function AdminRanges() {
  const ranges = await adminListRanges();
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-[34px]">Product ranges</h1>
      <p className="mt-2 text-[14px] text-muted">The five ranges shown in the menu and on the home page (“One home. Every detail.”).</p>
      <ul className="mt-8 space-y-3">
        {ranges.map((r) => {
          const v = (k: string) => (r[k] ?? "") as string;
          return (
            <li key={v("slug")} className="rounded-[6px] bg-white">
              <details>
                <summary className="cursor-pointer p-4 font-bold">
                  {v("name")} <span className="ml-2 text-[13px] font-normal text-muted">/products/{v("slug")}</span>
                </summary>
                <div className="border-t border-line p-5">
                  <ActionForm action={saveRangeAction}>
                    <input type="hidden" name="slug" value={v("slug")} />
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Name">
                        <input name="name" required defaultValue={v("name")} className={input} />
                      </Field>
                      <Field label="Sort order">
                        <input name="sort" type="number" defaultValue={r.sort as number} className={input} />
                      </Field>
                      <Field label="Short line" className="md:col-span-2">
                        <input name="short" defaultValue={v("short")} className={input} />
                      </Field>
                      <Field label="Home page description" className="md:col-span-2">
                        <textarea name="description" rows={2} defaultValue={v("description")} className={textarea} />
                      </Field>
                      <Field label="Round image URL">
                        <input name="image" defaultValue={v("image")} className={input} />
                      </Field>
                      <Field label="…or upload image">
                        <input name="imageUpload" type="file" accept="image/*" className="text-[13px] font-normal" />
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
                  </ActionForm>
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
