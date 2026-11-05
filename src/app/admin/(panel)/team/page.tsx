import { adminListTeam } from "@/lib/admin-data";
import { deleteContentAction, saveTeamMemberAction } from "../../actions";
import { ActionForm, ConfirmButton } from "../../_components/ActionForm";
import { Field, input, textarea } from "../../_components/Field";

export const dynamic = "force-dynamic";

type Row = Record<string, string | number | null>;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

function Avatar({ photo, name, size = "size-14" }: { photo?: string | null; name: string; size?: string }) {
  return photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photo} alt="" className={`${size} shrink-0 rounded-full object-cover`} />
  ) : (
    <span className={`${size} flex shrink-0 items-center justify-center rounded-full bg-ink text-[14px] font-bold text-gold`}>
      {initials(name) || "?"}
    </span>
  );
}

function MemberFields({ m }: { m?: Row }) {
  const v = (k: string) => (m?.[k] ?? "") as string;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="id" value={(m?.id as number) ?? ""} />
      <input type="hidden" name="photo" value={v("photo")} />
      <Field label="Name *">
        <input name="name" required maxLength={255} defaultValue={v("name")} className={input} />
      </Field>
      <Field label="Designation" hint="e.g. Founder & MD, Sales Manager">
        <input name="designation" maxLength={255} defaultValue={v("designation")} className={input} />
      </Field>
      <Field label="About (short bio)" hint="1–3 sentences." className="md:col-span-2">
        <textarea name="bio" rows={3} maxLength={1500} defaultValue={v("bio")} className={textarea} />
      </Field>
      <Field label={v("photo") ? "Replace photo" : "Photo"} hint="Square portrait, at least 400 × 400 px. Initials are shown if empty.">
        <input name="photoUpload" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="text-[13px] font-normal" />
      </Field>
      <Field label="Sort order" hint="Lower numbers show first.">
        <input name="sort" type="number" defaultValue={(m?.sort as number) ?? 0} className={input} />
      </Field>
      <div className="flex flex-wrap items-center gap-6 md:col-span-2">
        {v("photo") && (
          <label className="flex items-center gap-2 text-[14px]">
            <Avatar photo={v("photo")} name={v("name")} size="size-10" />
            <input type="checkbox" name="removePhoto" className="accent-ink" /> Remove photo
          </label>
        )}
        <label className="flex items-center gap-2 text-[14px] font-bold">
          <input type="checkbox" name="published" defaultChecked={m ? !!Number(m.published) : true} className="accent-ink" />
          Show on the About page
        </label>
      </div>
    </div>
  );
}

export default async function AdminTeam({ searchParams }: PageProps<"/admin/team">) {
  const sp = await searchParams;
  const members = await adminListTeam();
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-[34px]">Team</h1>
      <p className="mt-2 text-[14px] text-muted">
        The “Meet our team” section on the{" "}
        <a href="/about#team" target="_blank" className="font-bold text-gold-text">
          About page ↗
        </a>
        . Click a person to view or edit their profile. The section is hidden while nobody is shown.
      </p>
      {sp.saved && <p className="mt-4 rounded bg-[#dcfce7] p-3 text-[14px] text-[#14532d]">Team member added.</p>}
      {sp.deleted && <p className="mt-4 rounded bg-[#dcfce7] p-3 text-[14px] text-[#14532d]">Team member deleted.</p>}

      <ul className="mt-8 space-y-3">
        {members.length === 0 && <li className="rounded-[6px] bg-white p-5 text-[14px] text-muted">No team members yet — add one below.</li>}
        {members.map((m) => (
          <li key={m.id as number} className="rounded-[6px] bg-white">
            <details>
              <summary className="flex cursor-pointer items-center gap-4 p-3">
                <Avatar photo={m.photo as string} name={m.name as string} />
                <span className="min-w-0 flex-1">
                  <span className="font-bold">{m.name}</span>
                  {m.designation && <span className="ml-2 text-[13px] text-gold-text">{m.designation}</span>}
                  <span className="ml-2 text-[13px] text-muted">{Number(m.published) ? "Visible" : "Hidden"}</span>
                  {m.bio && <span className="mt-0.5 block truncate text-[13px] text-muted">{m.bio}</span>}
                </span>
              </summary>
              <div className="border-t border-line p-5">
                <ActionForm action={saveTeamMemberAction}>
                  <MemberFields m={m} />
                </ActionForm>
                <form action={deleteContentAction}>
                  <input type="hidden" name="table" value="team" />
                  <input type="hidden" name="id" value={m.id as number} />
                  <ConfirmButton message={`Remove ${m.name} from the team?`} className="text-[13px] text-[#b42318] underline">
                    Delete team member
                  </ConfirmButton>
                </form>
              </div>
            </details>
          </li>
        ))}
      </ul>

      <section className="mt-12 rounded-[6px] bg-white p-6">
        <h2 className="text-[20px] font-bold">Add a team member</h2>
        <div className="mt-5">
          <ActionForm action={saveTeamMemberAction} submitLabel="Add team member">
            <MemberFields />
          </ActionForm>
        </div>
      </section>
    </div>
  );
}
