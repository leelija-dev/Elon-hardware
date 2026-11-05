import Link from "next/link";
import { notFound } from "next/navigation";
import { adminGetProduct, adminListCategories, adminListRanges } from "@/lib/admin-data";
import { FINISHES } from "@/lib/constants";
import { productAccessModes, productColors, productExtraDetails } from "@/lib/product-fields";
import { deleteProductAction, saveProductAction } from "../../../actions";
import { ActionForm, ConfirmButton } from "../../../_components/ActionForm";
import { Field, input, textarea } from "../../../_components/Field";
import { RowsEditor, SizeChartEditor } from "../../../_components/Repeaters";
import { ImageList } from "./ImageList";

export const dynamic = "force-dynamic";

export default async function EditProduct({ params, searchParams }: PageProps<"/admin/products/[slug]">) {
  const { slug } = await params;
  const sp = await searchParams;
  const isNew = slug === "new";
  const p = isNew ? null : await adminGetProduct(slug);
  if (!isNew && !p) notFound();
  const cats = await adminListCategories();
  const ranges = await adminListRanges();
  const preselect = typeof sp.category === "string" ? sp.category : undefined;

  const specsText = (p?.specs ?? []).map((s) => `${s.label}: ${s.value}`).join("\n");
  const featuresText = (p?.features ?? []).map((f) => (f.text ? `${f.title} — ${f.text}` : f.title)).join("\n");
  const extraDetails = p ? productExtraDetails(p).map((d) => ({ label: d.label, value: d.value, unit: d.unit ?? "" })) : [];
  const accessModes = p ? productAccessModes(p).map((name) => ({ name })) : [];
  const colors = p ? productColors(p).map((c) => ({ name: c.name, hex: c.hex })) : [];
  const groupsText = (p?.groups ?? []).map((g) => `# ${g.title}\n${g.items.join("\n")}`).join("\n\n");

  return (
    <div className="max-w-5xl">
      <Link href="/admin/products" className="text-[14px] text-muted">
        ← All products
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-[34px]">{isNew ? "Add product" : `Edit ${p!.name}`}</h1>
        {p?.status === "published" && (
          <Link href={`/product/${p.slug}`} target="_blank" className="text-[14px] font-bold text-gold-text">
            View on website ↗
          </Link>
        )}
      </div>
      {sp.saved && <p className="mt-4 rounded bg-[#dcfce7] p-3 text-[14px] text-[#14532d]">Saved.</p>}

      <ActionForm action={saveProductAction} className="mt-8 space-y-8" submitLabel={isNew ? "Create product" : "Save changes"}>
        <input type="hidden" name="originalSlug" value={p?.slug ?? ""} />

        <section className="grid gap-5 rounded-[6px] bg-white p-6 md:grid-cols-2">
          <h2 className="text-[18px] font-bold md:col-span-2">Basics</h2>
          <Field label="Name *">
            <input name="name" required defaultValue={p?.name} className={input} />
          </Field>
          <Field label="Product / model code">
            <input name="code" defaultValue={p?.code} className={input} />
          </Field>
          <Field label="URL slug" hint="Leave empty to create from the name. Changing it changes the page address.">
            <input name="slug" defaultValue={p?.slug} className={input} />
          </Field>
          <Field label="Category *">
            <select name="category" required defaultValue={p?.category ?? preselect ?? ""} className={input}>
              <option value="" disabled>
                Choose…
              </option>
              {ranges.map((r) => (
                <optgroup key={r.slug as string} label={r.name as string}>
                  {cats
                    .filter((c) => c.range_slug === r.slug)
                    .map((c) => (
                      <option key={c.slug as string} value={c.slug as string}>
                        {c.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </Field>
          <Field label="Subtitle" hint="Short line under the name, e.g. “Wi‑Fi enabled digital safe”." className="md:col-span-2">
            <input name="subtitle" defaultValue={p?.subtitle} className={input} />
          </Field>
          <Field label="Summary" hint="1–2 sentences shown at the top of the product page." className="md:col-span-2">
            <textarea name="summary" rows={2} defaultValue={p?.summary} className={textarea} />
          </Field>
          <Field label="Description" className="md:col-span-2">
            <textarea name="description" rows={4} defaultValue={p?.description} className={textarea} />
          </Field>
        </section>

        <section className="rounded-[6px] bg-white p-6">
          <h2 className="text-[18px] font-bold">Images</h2>
          <p className="mt-1 text-[13px] text-muted">The first image is the main photo. Square photos on a white background look best.</p>
          <ImageList initial={p?.images ?? []} />
          <Field label="Upload new images" className="mt-5">
            <input name="upload" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="text-[14px] font-normal" />
          </Field>
        </section>

        <section className="grid gap-5 rounded-[6px] bg-white p-6 md:grid-cols-2">
          <h2 className="text-[18px] font-bold md:col-span-2">Details</h2>
          <Field label="Specifications" hint="One per line as “Label: Value”, e.g. “Weight: 25 kg”.">
            <textarea name="specs" rows={8} defaultValue={specsText} className={textarea} />
          </Field>
          <Field label="Key features" hint="One per line as “Title — short description”.">
            <textarea name="features" rows={8} defaultValue={featuresText} className={textarea} />
          </Field>
          <Field label="Feature groups" hint="Start a group with “# Title”, then one item per line (e.g. # Alarms)." className="md:col-span-2">
            <textarea name="groups" rows={6} defaultValue={groupsText} className={textarea} />
          </Field>
          <Field label="Suitable for" hint="Comma separated, e.g. Homes, Offices, Hotels">
            <input name="suitableFor" defaultValue={p?.suitableFor?.join(", ")} className={input} />
          </Field>
          <Field label="Search tags" hint="Comma separated extra words people may search for.">
            <input name="tags" defaultValue={p?.tags?.join(", ")} className={input} />
          </Field>
        </section>

        <section className="rounded-[6px] bg-white p-6">
          <h2 className="text-[18px] font-bold">Colours</h2>
          <p className="mt-1 mb-4 text-[13px] text-muted">Add, rename or remove the colours / finishes this product is available in. They power the colour filter.</p>
          <RowsEditor
            name="colors"
            addLabel="Add colour"
            empty="No colours added yet."
            columns={[
              { key: "name", label: "Colour name", placeholder: "e.g. Matt black", width: "2" },
              { key: "hex", label: "Swatch", type: "color", width: "2" },
            ]}
            initial={colors}
            suggestions={Object.values(FINISHES).map((f) => ({ name: f.label, hex: f.swatch }))}
          />
        </section>

        <section className="rounded-[6px] bg-white p-6">
          <h2 className="text-[18px] font-bold">Extra product details</h2>
          <p className="mt-1 mb-4 text-[13px] text-muted">
            Any product type. Shown in the key specs and the specification table. For lockers, “Volume” (litres) and “Height / Width / Depth” also
            power the capacity filter and the locker finder.
          </p>
          <RowsEditor
            name="extraDetails"
            addLabel="Add detail"
            empty="No extra details yet."
            columns={[
              { key: "label", label: "Label", placeholder: "e.g. Volume", width: "2", list: "detail-labels" },
              { key: "value", label: "Value", placeholder: "e.g. 10", width: "2" },
              { key: "unit", label: "Unit", placeholder: "e.g. Litres", width: "1.3", list: "detail-units" },
            ]}
            initial={extraDetails}
            suggestions={[
              { label: "Volume", unit: "Litres" },
              { label: "Height", unit: "mm" },
              { label: "Width", unit: "mm" },
              { label: "Depth", unit: "mm" },
              { label: "Weight", unit: "kg" },
              { label: "Thickness", unit: "mm" },
            ]}
          />
          <datalist id="detail-labels">
            {["Volume", "Height", "Width", "Depth", "Weight", "Length", "Thickness", "Material", "Warranty", "Battery"].map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
          <datalist id="detail-units">
            {["mm", "cm", "m", "Litres", "kg", "g", "inch", "years", "pcs", "V"].map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
        </section>

        <section className="rounded-[6px] bg-white p-6">
          <h2 className="text-[18px] font-bold">Access modes</h2>
          <p className="mt-1 mb-4 text-[13px] text-muted">
            Any product type. Add your own names (e.g. Biometric, Digital PIN, Mechanical Key) — shown on the product page and matched to the
            Access filter automatically.
          </p>
          <RowsEditor
            name="accessModes"
            flat="name"
            addLabel="Add access mode"
            empty="No access modes yet."
            columns={[{ key: "name", label: "Access mode", placeholder: "e.g. Biometric" }]}
            initial={accessModes}
            suggestions={["Biometric", "Digital PIN", "Mechanical Key", "Mobile app", "RFID card", "Bluetooth"].map((name) => ({ name }))}
          />
          <div className="mt-5 flex flex-wrap gap-5 border-t border-line pt-4">
            <label className="flex items-center gap-2 text-[14px]">
              <input type="checkbox" name="fireResistant" defaultChecked={p?.locker?.fireResistant} className="accent-ink" />
              Fire resistant (locker finder)
            </label>
            <label className="flex items-center gap-2 text-[14px]">
              <input type="checkbox" name="laptopFit" defaultChecked={p?.locker?.laptopFit} className="accent-ink" />
              Fits a laptop (locker finder)
            </label>
          </div>
        </section>

        <section className="rounded-[6px] bg-white p-6">
          <h2 className="text-[18px] font-bold">Size chart</h2>
          <p className="mt-1 mb-4 text-[13px] text-muted">
            Optional. Shown as a table on the product page, directly below the colours. Build a table, upload an image, or both.
          </p>
          <SizeChartEditor initial={p?.sizeChart} />
          <Field label="Upload size chart image" className="mt-4">
            <input name="sizeChartUpload" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="text-[14px] font-normal" />
          </Field>
        </section>

        <section className="grid gap-5 rounded-[6px] bg-white p-6 md:grid-cols-4">
          <h2 className="text-[18px] font-bold md:col-span-4">Display</h2>
          <Field label="Status">
            <select name="status" defaultValue={p?.status ?? "published"} className={input}>
              <option value="published">Published</option>
              <option value="draft">Draft (hidden)</option>
            </select>
          </Field>
          <Field label="Badge" hint="e.g. New, Best value">
            <input name="badge" defaultValue={p?.badge} className={input} />
          </Field>
          <Field label="Sort rank" hint="Higher shows first">
            <input name="rank" type="number" defaultValue={p?.rank ?? 0} className={input} />
          </Field>
          <Field label="Added on">
            <input name="addedOn" type="date" defaultValue={p?.addedOn} className={input} />
          </Field>
          <label className="flex items-center gap-2 text-[14px] font-bold md:col-span-2">
            <input type="checkbox" name="featured" defaultChecked={p?.featured} className="accent-ink" />
            Featured (shown first in listings)
          </label>
          <label className="flex items-center gap-2 text-[14px] font-bold md:col-span-2">
            <input type="checkbox" name="bestSeller" defaultChecked={p?.bestSeller} className="accent-ink" />
            Best seller (home page “Best sellers”)
          </label>
        </section>
      </ActionForm>

      {p && (
        <form action={deleteProductAction} className="mt-6 rounded-[6px] border border-[#f3c4c0] bg-white p-6">
          <input type="hidden" name="slug" value={p.slug} />
          <h2 className="text-[16px] font-bold text-[#b42318]">Delete product</h2>
          <p className="mt-1 text-[14px] text-muted">Tip: set the status to Draft to hide it without deleting.</p>
          <ConfirmButton message={`Delete ${p.name}? This cannot be undone.`} className="btn-rect-outline mt-4 border-[#b42318] text-[#b42318]">
            Delete {p.name}
          </ConfirmButton>
        </form>
      )}
    </div>
  );
}
