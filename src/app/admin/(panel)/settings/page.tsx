import { getSettings, SOCIALS } from "@/lib/content";
import { saveSettingsAction } from "../../actions";
import { ActionForm } from "../../_components/ActionForm";
import { Field, input } from "../../_components/Field";

export const dynamic = "force-dynamic";

const LABELS: Record<(typeof SOCIALS)[number], string> = {
  facebook: "Facebook page URL",
  instagram: "Instagram profile URL",
  linkedin: "LinkedIn page URL",
  youtube: "YouTube channel URL",
};

export default async function AdminSettings() {
  const settings = await getSettings();
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-[34px]">Site settings</h1>
      <ActionForm action={saveSettingsAction} className="mt-8 space-y-8">
        <section className="grid gap-4 rounded-[6px] bg-white p-6">
          <h2 className="text-[18px] font-bold">Social media (footer icons)</h2>
          <p className="-mt-2 text-[13px] text-muted">An icon is shown in the footer for every link filled in. Leave empty to hide that icon.</p>
          {SOCIALS.map((k) => (
            <Field key={k} label={LABELS[k]}>
              <input name={`social_${k}`} type="url" defaultValue={settings.social[k]} placeholder={`https://www.${k}.com/…`} className={input} />
            </Field>
          ))}
        </section>

        <section className="grid gap-4 rounded-[6px] bg-white p-6 md:grid-cols-2">
          <h2 className="text-[18px] font-bold md:col-span-2">Home page products (below the slider)</h2>
          <Field label="Show" className="md:col-span-2">
            <select name="home_products_mode" defaultValue={settings.homeProducts.mode} className={input}>
              <option value="latest">Latest products — the 4 most recently added</option>
              <option value="bestsellers">Best sellers — products ticked “Best seller”</option>
            </select>
          </Field>
          <Field label="Small heading">
            <input name="home_products_eyebrow" defaultValue={settings.homeProducts.eyebrow} className={input} />
          </Field>
          <Field label="Title">
            <input name="home_products_title" defaultValue={settings.homeProducts.title} className={input} />
          </Field>
        </section>
      </ActionForm>
    </div>
  );
}
