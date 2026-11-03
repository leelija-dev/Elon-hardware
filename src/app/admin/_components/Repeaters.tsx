"use client";

import { useState } from "react";

type Col = { key: string; label: string; placeholder?: string; type?: "text" | "color"; width?: string; list?: string };
type RowData = Record<string, string>;

const cell = "field min-h-10 w-full text-[14px] font-normal";
const iconBtn = "flex size-9 shrink-0 items-center justify-center rounded border border-line text-[14px] hover:border-ink disabled:opacity-30";

/**
 * Generic dynamic list ("repeater"): add, edit, reorder and remove rows.
 * The rows are sent to the server action as JSON in a hidden input called `name`.
 * With `flat`, the value of that single column is sent as a plain string array.
 */
export function RowsEditor({
  name,
  columns,
  initial,
  addLabel = "Add row",
  flat,
  empty = "Nothing added yet.",
  suggestions,
}: {
  name: string;
  columns: Col[];
  initial: RowData[];
  addLabel?: string;
  flat?: string;
  empty?: string;
  /** Quick-add chips (rows that are added with one click). */
  suggestions?: RowData[];
}) {
  const blank = () => Object.fromEntries(columns.map((c) => [c.key, c.type === "color" ? "#000000" : ""]));
  const [rows, setRows] = useState<RowData[]>(initial);

  const update = (i: number, key: string, value: string) => setRows((r) => r.map((row, n) => (n === i ? { ...row, [key]: value } : row)));
  const move = (i: number, d: number) =>
    setRows((r) => {
      const next = [...r];
      const j = i + d;
      if (j < 0 || j >= next.length) return r;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const first = columns[0].key;
  const value = flat ? rows.map((r) => (r[flat] ?? "").trim()).filter(Boolean) : rows.filter((r) => (r[first] ?? "").trim());
  const unused = (suggestions ?? []).filter(
    (s) => !rows.some((r) => (r[first] ?? "").trim().toLowerCase() === (s[first] ?? "").toLowerCase()),
  );

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(value)} />
      {rows.length === 0 ? (
        <p className="rounded border border-dashed border-line-2 p-4 text-[13px] text-muted">{empty}</p>
      ) : (
        <div className="space-y-2">
          <div className="hidden gap-2 pr-[124px] text-[12px] font-bold text-muted md:flex">
            {columns.map((c) => (
              <span key={c.key} style={{ flex: c.width ?? "1" }}>
                {c.label}
              </span>
            ))}
          </div>
          {rows.map((row, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 rounded bg-mist p-2 md:flex-nowrap md:bg-transparent md:p-0">
              {columns.map((c) =>
                c.type === "color" ? (
                  <span key={c.key} className="flex items-center gap-2" style={{ flex: c.width ?? "1" }}>
                    <input
                      type="color"
                      aria-label={`${c.label} ${i + 1}`}
                      value={/^#[0-9a-f]{6}$/i.test(row[c.key] ?? "") ? row[c.key] : "#000000"}
                      onChange={(e) => update(i, c.key, e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded border border-line bg-white p-1"
                    />
                    <input
                      aria-label={`${c.label} code ${i + 1}`}
                      value={row[c.key] ?? ""}
                      onChange={(e) => update(i, c.key, e.target.value)}
                      placeholder="#000000"
                      maxLength={7}
                      className={`${cell} font-mono`}
                    />
                  </span>
                ) : (
                  <input
                    key={c.key}
                    aria-label={`${c.label} ${i + 1}`}
                    value={row[c.key] ?? ""}
                    placeholder={c.placeholder}
                    list={c.list}
                    onChange={(e) => update(i, c.key, e.target.value)}
                    className={cell}
                    style={{ flex: c.width ?? "1" }}
                  />
                ),
              )}
              <span className="flex gap-1">
                <button type="button" aria-label="Move up" className={iconBtn} disabled={i === 0} onClick={() => move(i, -1)}>
                  ↑
                </button>
                <button type="button" aria-label="Move down" className={iconBtn} disabled={i === rows.length - 1} onClick={() => move(i, 1)}>
                  ↓
                </button>
                <button
                  type="button"
                  aria-label="Remove"
                  className={`${iconBtn} text-[#b42318] hover:border-[#b42318]`}
                  onClick={() => setRows((r) => r.filter((_, n) => n !== i))}
                >
                  ✕
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setRows((r) => [...r, blank()])} className="btn-rect-outline min-h-10 px-4 text-[14px]">
          + {addLabel}
        </button>
        {unused.length > 0 && <span className="ml-2 text-[12px] text-muted">Quick add:</span>}
        {unused.map((s) => (
          <button
            key={s[first]}
            type="button"
            onClick={() => setRows((r) => [...r, { ...blank(), ...s }])}
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[12px] hover:border-ink"
          >
            {columns.some((c) => c.type === "color") && (
              <span
                className="size-3 rounded-full border border-black/10"
                style={{ background: s[columns.find((c) => c.type === "color")!.key] }}
              />
            )}
            {s[first]}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Size chart table builder: editable column headings and rows, plus a note and optional image. */
export function SizeChartEditor({
  initial,
}: {
  initial?: { title?: string; columns: string[]; rows: string[][]; note?: string; image?: string };
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [columns, setColumns] = useState<string[]>(initial?.columns?.length ? initial.columns : []);
  const [rows, setRows] = useState<string[][]>(initial?.rows ?? []);
  const [note, setNote] = useState(initial?.note ?? "");
  const [image, setImage] = useState(initial?.image ?? "");

  const hasChart = columns.length > 0 || image || note;
  const value = hasChart ? JSON.stringify({ title, columns, rows, note, image }) : "";

  const setCell = (r: number, c: number, v: string) =>
    setRows((all) => all.map((row, i) => (i === r ? Array.from({ length: columns.length }, (_, j) => (j === c ? v : (row[j] ?? ""))) : row)));
  const addColumn = () => {
    setColumns((c) => [...c, ""]);
    setRows((all) => all.map((r) => [...r, ""]));
  };
  const removeColumn = (c: number) => {
    setColumns((cols) => cols.filter((_, i) => i !== c));
    setRows((all) => all.map((r) => r.filter((_, i) => i !== c)));
  };
  const start = () => {
    setColumns(["Size", "Height (mm)", "Width (mm)", "Depth (mm)"]);
    setRows([["", "", "", ""]]);
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name="sizeChart" value={value} />
      {columns.length === 0 ? (
        <div className="flex flex-wrap items-center gap-3 rounded border border-dashed border-line-2 p-4 text-[13px] text-muted">
          No size chart table yet.
          <button type="button" onClick={start} className="btn-rect-outline min-h-10 px-4 text-[14px] text-ink">
            + Create size chart table
          </button>
        </div>
      ) : (
        <>
          <label className="flex max-w-md flex-col gap-1.5 text-[14px] font-bold">
            Chart title
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Size guide" className={cell} />
          </label>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-separate border-spacing-1 text-[14px]">
              <thead>
                <tr>
                  {columns.map((c, i) => (
                    <th key={i} className="text-left">
                      <span className="flex gap-1">
                        <input
                          aria-label={`Column ${i + 1} heading`}
                          value={c}
                          placeholder={`Column ${i + 1}`}
                          onChange={(e) => setColumns((cols) => cols.map((x, n) => (n === i ? e.target.value : x)))}
                          className={`${cell} bg-mist font-bold`}
                        />
                        <button type="button" aria-label="Remove column" className={iconBtn} onClick={() => removeColumn(i)}>
                          ✕
                        </button>
                      </span>
                    </th>
                  ))}
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, r) => (
                  <tr key={r}>
                    {columns.map((_, c) => (
                      <td key={c}>
                        <input
                          aria-label={`Row ${r + 1}, ${columns[c] || `column ${c + 1}`}`}
                          value={row[c] ?? ""}
                          onChange={(e) => setCell(r, c, e.target.value)}
                          className={cell}
                        />
                      </td>
                    ))}
                    <td>
                      <button
                        type="button"
                        aria-label="Remove row"
                        className={`${iconBtn} text-[#b42318]`}
                        onClick={() => setRows((all) => all.filter((_, i) => i !== r))}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setRows((all) => [...all, columns.map(() => "")])} className="btn-rect-outline min-h-10 px-4 text-[14px]">
              + Add row
            </button>
            <button type="button" onClick={addColumn} disabled={columns.length >= 12} className="btn-rect-outline min-h-10 px-4 text-[14px]">
              + Add column
            </button>
            <button
              type="button"
              onClick={() => {
                setColumns([]);
                setRows([]);
                setTitle("");
              }}
              className="min-h-10 px-3 text-[13px] text-[#b42318]"
            >
              Remove table
            </button>
          </div>
        </>
      )}
      <label className="flex flex-col gap-1.5 text-[14px] font-bold">
        Guidance note <span className="text-[12px] font-normal text-muted">Optional — e.g. how to measure, which size to choose.</span>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className={`${cell} py-2`} />
      </label>
      {image && (
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Size chart" className="h-20 rounded border border-line object-contain" />
          <button type="button" onClick={() => setImage("")} className="text-[13px] font-bold text-[#b42318]">
            Remove image
          </button>
        </div>
      )}
    </div>
  );
}
