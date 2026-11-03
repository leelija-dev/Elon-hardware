import { adminListCatalogues, MAX_PDF_MB } from "@/lib/admin-data";
import { formatBytes } from "@/lib/content";
import { deleteContentAction, saveCatalogueAction } from "../../actions";
import { ActionForm, ConfirmButton } from "../../_components/ActionForm";
import { Field, input } from "../../_components/Field";

export const dynamic = "force-dynamic";

type Row = Record<string, string | number | null>;

function CatalogueFields({ c }: { c?: Row }) {
  const v = (k: string) => (c?.[k] ?? "") as string;
  return (
    <div className="grid gap-5 md:grid-cols-[150px_1fr]">
      <input type="hidden" name="id" value={(c?.id as number) ?? ""} />
      <div className="flex aspect-[7/9] items-center justify-center overflow-hidden rounded border border-line bg-mist text-center text-[12px] text-muted">
        {v("cover") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={v("cover")} alt="" className="size-full object-cover" />
        ) : (
          "Cover preview"
        )}
      </div>
      <div className="grid content-start gap-4 sm:grid-cols-2">
        <Field label="Catalogue title *" className="sm:col-span-2">
          <input name="title" required maxLength={255} defaultValue={v("title")} placeholder="e.g. Digital access solutions catalogue" className={input} />
        </Field>
        <Field label={c ? "Replace cover image" : "Cover image *"} hint="Portrait JPG / PNG / WebP, about 700 × 900 px.">
          <input name="coverUpload" type="file" required={!c} accept="image/jpeg,image/png,image/webp,image/avif" className="text-[13px] font-normal" />
        </Field>
        <Field label={c ? "Replace PDF" : "Catalogue document (PDF) *"} hint={`PDF up to ${MAX_PDF_MB} MB.`}>
          <input name="fileUpload" type="file" required={!c} accept="application/pdf,.pdf" className="text-[13px] font-normal" />
        </Field>
        {c && (
          <p className="text-[13px] text-muted sm:col-span-2">
            Current file:{" "}
            <a href={v("file")} target="_blank" className="font-bold text-gold-text">
              {v("file").split("/").pop()}
            </a>{" "}
            {formatBytes(Number(c.file_size))}
          </p>
        )}
        <Field label="Sort order" hint="Lower numbers show first.">
          <input name="sort" type="number" defaultValue={(c?.sort as number) ?? 0} className={input} />
        </Field>
        <label className="flex items-center gap-2 self-center text-[14px] font-bold">
          <input type="checkbox" name="published" defaultChecked={c ? !!Number(c.published) : true} className="accent-ink" />
          Show on the Downloads page
        </label>
      </div>
    </div>
  );
}

export default async function AdminCatalogues({ searchParams }: PageProps<"/admin/catalogues">) {
  const sp = await searchParams;
  const items = await adminListCatalogues();
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-[34px]">Catalogues</h1>
      <p className="mt-2 text-[14px] text-muted">
        Catalogues listed on the{" "}
        <a href="/downloads" target="_blank" className="font-bold text-gold-text">
          Downloads page ↗
        </a>
        . Each one needs a title, a cover image and a PDF.
      </p>
      {sp.saved && <p className="mt-4 rounded bg-[#dcfce7] p-3 text-[14px] text-[#14532d]">Catalogue added.</p>}
      {sp.deleted && <p className="mt-4 rounded bg-[#dcfce7] p-3 text-[14px] text-[#14532d]">Catalogue deleted.</p>}

      <ul className="mt-8 space-y-3">
        {items.length === 0 && <li className="rounded-[6px] bg-white p-5 text-[14px] text-muted">No catalogues yet — add one below.</li>}
        {items.map((c) => (
          <li key={c.id as number} className="rounded-[6px] bg-white">
            <details>
              <summary className="flex cursor-pointer items-center gap-4 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.cover as string} alt="" className="h-16 w-12 rounded object-cover" />
                <span className="flex-1">
                  <span className="font-bold">{c.title}</span>
                  <span className="mt-0.5 block text-[13px] text-muted">
                    PDF {formatBytes(Number(c.file_size))} · {Number(c.published) ? "Visible" : "Hidden"}
                  </span>
                </span>
              </summary>
              <div className="border-t border-line p-5">
                <ActionForm action={saveCatalogueAction}>
                  <CatalogueFields c={c} />
                </ActionForm>
                <form action={deleteContentAction}>
                  <input type="hidden" name="table" value="catalogues" />
                  <input type="hidden" name="id" value={c.id as number} />
                  <ConfirmButton message={`Delete “${c.title}”? The PDF and cover will be removed.`} className="text-[13px] text-[#b42318] underline">
                    Delete catalogue
                  </ConfirmButton>
                </form>
              </div>
            </details>
          </li>
        ))}
      </ul>

      <section className="mt-12 rounded-[6px] bg-white p-6">
        <h2 className="text-[20px] font-bold">Add a catalogue</h2>
        <div className="mt-5">
          <ActionForm action={saveCatalogueAction} submitLabel="Add catalogue">
            <CatalogueFields />
          </ActionForm>
        </div>
      </section>
    </div>
  );
}
