"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Icon } from "./Icon";

function useQueryUpdater() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    if (!("page" in changes)) next.delete("page");
    const qs = next.toString();
    start(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };
  return { params, update, pending };
}

export function SearchField({ placeholder }: { placeholder: string }) {
  const { params, update } = useQueryUpdater();
  const [value, setValue] = useState(params.get("q") ?? "");
  const first = useRef(true);

  // Keep the box in sync when the URL changes elsewhere (e.g. "Reset").
  const urlQ = params.get("q") ?? "";
  const [lastUrlQ, setLastUrlQ] = useState(urlQ);
  if (urlQ !== lastUrlQ) {
    setLastUrlQ(urlQ);
    setValue(urlQ);
  }

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => {
      if (value.trim() !== (params.get("q") ?? "")) update({ q: value.trim() || null });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        update({ q: value.trim() || null });
      }}
      className="relative w-full md:w-[372px]"
    >
      <label htmlFor="listing-search" className="sr-only">
        {placeholder}
      </label>
      <input
        id="listing-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="field min-h-[50px] pr-12 text-[14px]"
      />
      <button type="submit" aria-label="Search" className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center">
        <Icon name="search" size={16} strokeWidth={2.4} />
      </button>
    </form>
  );
}

export function SortSelect({ options, value }: { options: { value: string; label: string }[]; value: string }) {
  const { update, pending } = useQueryUpdater();
  const [current, setCurrent] = useState(value);
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setCurrent(value);
  }
  return (
    <label className="relative block">
      <span className="sr-only">Sort products</span>
      <select
        value={current}
        onChange={(e) => {
          setCurrent(e.target.value);
          update({ sort: e.target.value === "featured" ? null : e.target.value });
        }}
        className={`field min-h-[48px] w-[226px] appearance-none pr-10 text-[14px] ${pending ? "opacity-60" : ""}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            Sort by: {o.label}
          </option>
        ))}
      </select>
      <Icon name="chevron" size={14} strokeWidth={2.4} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2" />
    </label>
  );
}

export function CheckFilter({
  param,
  title,
  options,
}: {
  param: string;
  title: string;
  options: { value: string; label: string; swatch?: string; count?: number }[];
}) {
  const { params, update } = useQueryUpdater();
  const fromUrl = params.get(param) ?? "";
  // Optimistic: tick the box immediately, then sync with the URL once navigation finishes.
  const [value, setValue] = useState(fromUrl);
  const [lastUrl, setLastUrl] = useState(fromUrl);
  if (fromUrl !== lastUrl) {
    setLastUrl(fromUrl);
    setValue(fromUrl);
  }
  const selected = new Set(value.split(",").filter(Boolean));
  const toggle = (v: string) => {
    const next = new Set(selected);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    const joined = [...next].join(",");
    setValue(joined);
    update({ [param]: joined || null });
  };
  if (!options.length) return null;
  return (
    <fieldset className="border-t border-line pt-7">
      <legend className="eyebrow float-left mb-5 w-full">{title}</legend>
      <ul className="clear-both space-y-4">
        {options.map((o) => (
          <li key={o.value}>
            <label className="flex cursor-pointer items-center gap-3 text-[15px]">
              {o.swatch && <span className="size-[18px] shrink-0 rounded-full border border-black/10" style={{ background: o.swatch }} />}
              <span className="flex-1">
                {o.label}
                {o.count !== undefined && <span className="ml-1.5 text-[12px] text-muted">({o.count})</span>}
              </span>
              <input
                type="checkbox"
                checked={selected.has(o.value)}
                onChange={() => toggle(o.value)}
                className="size-4 cursor-pointer accent-ink"
              />
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

export function ResetFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const hasFilters = [...params.keys()].some((k) => k !== "page");
  return (
    <button
      type="button"
      disabled={!hasFilters}
      onClick={() => router.replace(pathname, { scroll: false })}
      className="text-[13px] text-muted hover:text-ink disabled:opacity-50"
    >
      Reset
    </button>
  );
}
