"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name, badge }: { images: string[]; name: string; badge?: string }) {
  const [i, setI] = useState(0);
  const main = images[i];
  return (
    <div>
      <div className="relative aspect-square border border-line bg-white">
        {main ? (
          <Image src={main} alt={name} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-10" />
        ) : (
          <div className="flex size-full items-center justify-center text-[13px] tracking-[0.04em] text-muted uppercase">
            Image coming soon
          </div>
        )}
        {badge && (
          <span className="absolute top-5 left-5 bg-ink px-3 py-1.5 text-[11px] font-bold tracking-[0.04em] text-gold uppercase">{badge}</span>
        )}
        <span className="absolute right-5 bottom-4 text-[11px] text-muted">
          {String(i + 1).padStart(2, "0")} / {String(Math.max(images.length, 1)).padStart(2, "0")}
        </span>
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3">
          {images.map((src, n) => (
            <li key={src + n}>
              <button
                type="button"
                onClick={() => setI(n)}
                aria-label={`Show image ${n + 1}`}
                aria-pressed={n === i}
                className={`relative block aspect-square w-full border bg-white ${n === i ? "border-ink" : "border-line hover:border-line-2"}`}
              >
                <Image src={src} alt="" fill sizes="120px" className="object-contain p-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
