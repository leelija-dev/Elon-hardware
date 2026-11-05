import Image from "next/image";
import type { SizeChart as SizeChartData } from "@/lib/types";

/** Product size guide, shown permanently on the product page (table, optional image and note). */
export function SizeChart({ chart, productName }: { chart: SizeChartData; productName: string }) {
  const title = chart.title || "Size chart";
  const hasTable = chart.columns.length > 0 && chart.rows.length > 0;
  if (!hasTable && !chart.image && !chart.note) return null;

  return (
    <section aria-labelledby="size-chart-title">
      <div className="mb-3 flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="size-[18px] text-gold-text" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M3 8h18v8H3zM7 8v3M11 8v4M15 8v3M19 8v4" />
        </svg>
        <h2 id="size-chart-title" className="eyebrow">
          {title}
        </h2>
      </div>
      {hasTable && (
        <div className="overflow-x-auto rounded-[4px] border border-line">
          <table className="w-full min-w-[360px] border-collapse text-[14px]">
            <caption className="sr-only">
              {title} — {productName}
            </caption>
            <thead className="bg-ink text-white">
              <tr>
                {chart.columns.map((c, i) => (
                  <th key={i} scope="col" className="px-4 py-2.5 text-left text-[13px] font-bold whitespace-nowrap">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((row, r) => (
                <tr key={r} className="border-t border-line odd:bg-white even:bg-mist">
                  {chart.columns.map((_, c) =>
                    c === 0 ? (
                      <th key={c} scope="row" className="px-4 py-2.5 text-left font-bold whitespace-nowrap">
                        {row[c]}
                      </th>
                    ) : (
                      <td key={c} className="px-4 py-2.5 whitespace-nowrap">
                        {row[c]}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {chart.image && (
        <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-[4px] border border-line bg-white ${hasTable ? "mt-4" : ""}`}>
          <Image src={chart.image} alt={`${title} — ${productName}`} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-contain p-2" />
        </div>
      )}
      {chart.note && <p className="mt-3 text-[13px] leading-[1.6] whitespace-pre-line text-muted">{chart.note}</p>}
    </section>
  );
}
