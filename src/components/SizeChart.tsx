"use client";

import Image from "next/image";
import { useRef } from "react";
import type { SizeChart as SizeChartData } from "@/lib/types";
import { Icon } from "./Icon";

/** "Size chart" button that opens the product's size guide in a modal dialog. */
export function SizeChart({ chart, productName }: { chart: SizeChartData; productName: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = chart.title || "Size chart";
  const hasTable = chart.columns.length > 0 && chart.rows.length > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="inline-flex items-center gap-2 border-b border-ink pb-0.5 text-[14px] font-bold hover:border-gold-text hover:text-gold-text"
      >
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M3 8h18v8H3zM7 8v3M11 8v4M15 8v3M19 8v4" />
        </svg>
        Size chart
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="size-chart-title"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
        className="m-auto max-h-[90vh] w-[min(760px,calc(100vw-32px))] overflow-hidden rounded-[10px] bg-white p-0 text-text shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[90vh] flex-col">
          <div className="flex items-start justify-between gap-6 border-b border-line px-6 py-5 md:px-8">
            <div>
              <div className="eyebrow">{productName}</div>
              <h2 id="size-chart-title" className="mt-1 font-serif text-[28px] leading-tight">
                {title}
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close size chart"
              onClick={() => dialog.current?.close()}
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line hover:border-ink"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-6 md:px-8">
            {hasTable && (
              <div className="overflow-x-auto rounded-[4px] border border-line">
                <table className="w-full min-w-[420px] border-collapse text-[14px]">
                  <thead className="bg-ink text-white">
                    <tr>
                      {chart.columns.map((c, i) => (
                        <th key={i} scope="col" className="px-4 py-3 text-left font-bold whitespace-nowrap">
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
                            <th key={c} scope="row" className="px-4 py-3 text-left font-bold">
                              {row[c]}
                            </th>
                          ) : (
                            <td key={c} className="px-4 py-3">
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
              <div className={`relative aspect-[4/3] w-full ${hasTable ? "mt-6" : ""}`}>
                <Image src={chart.image} alt={`${title} — ${productName}`} fill sizes="720px" className="object-contain" />
              </div>
            )}
            {chart.note && <p className="mt-5 text-[14px] leading-[1.7] whitespace-pre-line text-muted">{chart.note}</p>}
            <p className="mt-5 text-[12px] text-muted">Sizes are approximate. Ask our team to confirm the right size for your space.</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
