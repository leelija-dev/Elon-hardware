"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";

type Tab = {
  slug: string;
  name: string;
  bannerTitle: string;
  bannerText: string;
  bannerImages: string[];
  categories: { slug: string; name: string; tile?: string; count: number }[];
};

export function ShopByNeed({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.slug);
  const tab = tabs.find((t) => t.slug === active) ?? tabs[0];
  if (!tab) return null;
  return (
    <div>
      <div role="tablist" aria-label="Product ranges" className="mt-8 grid gap-3 md:grid-cols-[1fr_1.15fr_1.2fr] md:gap-5">
        {tabs.map((t) => (
          <button
            key={t.slug}
            type="button"
            role="tab"
            id={`tab-${t.slug}`}
            aria-selected={t.slug === tab.slug}
            aria-controls={`panel-${t.slug}`}
            onClick={() => setActive(t.slug)}
            className={`min-h-[50px] rounded-full px-6 text-left text-[16px] transition-colors ${
              t.slug === tab.slug ? "bg-ink text-white" : "bg-white text-text hover:bg-mist-2"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab.slug}`} aria-labelledby={`tab-${tab.slug}`}>
        <Link
          href={`/products/${tab.slug}`}
          className="mt-6 flex flex-col gap-6 rounded-[10px] bg-ink px-8 py-7 text-white md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h3 className="font-serif text-[28px] leading-tight font-normal md:text-[34px]">{tab.bannerTitle}</h3>
            <p className="mt-2 text-[16px] text-gold">{tab.bannerText}</p>
          </div>
          {tab.bannerImages.length > 0 && (
            <div className="flex gap-6 md:mr-14 md:gap-[72px]">
              {tab.bannerImages.map((src) => (
                <span key={src} className="relative block h-[98px] w-[130px] bg-white sm:w-[163px]">
                  <Image src={src} alt="" fill sizes="163px" className="object-contain p-1" />
                </span>
              ))}
            </div>
          )}
        </Link>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-[18px]">
          {tab.categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/products/${tab.slug}/${c.slug}`}
                className="group relative flex h-[110px] flex-col justify-end rounded-[6px] bg-white p-3.5 transition-shadow hover:shadow-[0_12px_28px_-16px_rgba(0,0,0,0.35)]"
              >
                {c.tile ? (
                  <span className="absolute top-2.5 right-3 block h-[66px] w-[80px]">
                    <Image src={c.tile} alt="" fill sizes="80px" className="object-contain object-right-top" />
                  </span>
                ) : (
                  <Icon name="arrowUpRight" size={20} strokeWidth={1.6} className="absolute top-3.5 right-3.5 text-gold-text" />
                )}
                <span className="text-[14px] group-hover:text-gold-text">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
