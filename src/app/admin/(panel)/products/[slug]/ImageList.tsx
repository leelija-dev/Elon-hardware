"use client";

import { useState } from "react";

/** Lets the admin reorder and remove existing product images; submits them as a hidden newline list. */
export function ImageList({ initial }: { initial: string[] }) {
  const [images, setImages] = useState(initial);
  const move = (i: number, d: number) => {
    const next = [...images];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setImages(next);
  };
  return (
    <div className="mt-4">
      <input type="hidden" name="images" value={images.join("\n")} />
      {images.length === 0 ? (
        <p className="text-[14px] text-muted">No images yet.</p>
      ) : (
        <ul className="flex flex-wrap gap-3">
          {images.map((src, i) => (
            <li key={src + i} className="w-[132px] rounded border border-line p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-[100px] w-full object-contain" />
              <div className="mt-2 flex items-center justify-between text-[12px]">
                <span className="text-muted">{i === 0 ? "Main" : `#${i + 1}`}</span>
                <span className="flex gap-1">
                  <button type="button" aria-label="Move left" onClick={() => move(i, -1)} className="rounded px-1.5 hover:bg-mist">
                    ←
                  </button>
                  <button type="button" aria-label="Move right" onClick={() => move(i, 1)} className="rounded px-1.5 hover:bg-mist">
                    →
                  </button>
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => setImages(images.filter((_, n) => n !== i))}
                    className="rounded px-1.5 text-[#b42318] hover:bg-mist"
                  >
                    ✕
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
