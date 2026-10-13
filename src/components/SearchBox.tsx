"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./Icon";

type Hit = { slug: string; name: string; subtitle: string; category: string; image: string | null };

export function SearchBox({
  autoFocus = false,
  onNavigate,
  className = "",
}: {
  autoFocus?: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}&limit=6`, { signal: ctrl.signal });
        if (!res.ok) return;
        const data = (await res.json()) as { items: Hit[]; total: number };
        setHits(data.items);
        setTotal(data.total);
        setActive(-1);
        setOpen(true);
      } catch {
        /* aborted */
      }
    }, 180);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function go(href: string) {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (active >= 0 && hits[active]) return go(`/product/${hits[active].slug}`);
    const term = q.trim();
    go(term ? `/products?q=${encodeURIComponent(term)}` : "/products");
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || !hits.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % hits.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a <= 0 ? hits.length - 1 : a - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form role="search" onSubmit={submit} className="relative">
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search products
        </label>
        <input
          id={`${listId}-input`}
          type="search"
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => hits.length && setOpen(true)}
          onKeyDown={onKey}
          placeholder="Search products or product code"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          className="field pr-12"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute top-1/2 right-1 flex size-10 -translate-y-1/2 items-center justify-center rounded text-text hover:bg-mist"
        >
          <Icon name="search" size={18} />
        </button>
      </form>
      {open && q.trim().length >= 2 && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-[4px] border border-line bg-white shadow-[0_24px_48px_-20px_rgba(15,20,25,0.35)]">
          {hits.length && q.trim().length >= 2 ? (
            <ul id={listId} role="listbox" className="m-0 list-none p-1.5">
              {hits.map((h, i) => (
                <li key={h.slug} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                  <Link
                    href={`/product/${h.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(`/product/${h.slug}`);
                    }}
                    className={`flex items-center justify-between gap-3 rounded px-3 py-2.5 ${i === active ? "bg-mist" : "hover:bg-mist"}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded border border-line bg-white">
                        {h.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={h.image} alt="" className="max-h-full max-w-full object-contain" />
                        )}
                      </span>
                      <span>
                        <span className="block font-bold">{h.name}</span>
                        <span className="block text-[13px] text-muted">{h.subtitle}</span>
                      </span>
                    </span>
                    <span className="text-[12px] text-gold-text whitespace-nowrap">{h.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 px-4 py-3 text-sm text-muted">No products match “{q.trim()}”.</p>
          )}
          <button
            type="button"
            onClick={() => go(`/products?q=${encodeURIComponent(q.trim())}`)}
            className="flex w-full items-center justify-between border-t border-line bg-mist px-4 py-3 text-left text-sm font-bold hover:bg-mist-2"
          >
            {total > 0 ? `See all ${total} result${total === 1 ? "" : "s"}` : "Browse all products"}
            <Icon name="arrowUpRight" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
