"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon, Star } from "./Icon";

const AUTO_MS = 4500;

export type TestimonialItem = { id: number; name: string; meta?: string; quote: string; rating: number; photo?: string };

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/** Customer reviews — a horizontally scrolling row of cards with arrow controls. */
export function Testimonials({ items }: { items: TestimonialItem[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touchedAt, setTouchedAt] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const start = el.scrollLeft <= 4;
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      setEdges((e) => (e.start === start && e.end === end ? e : { start, end }));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items.length]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setReduced(mq.matches);
    const onVis = () => setHidden(document.hidden);
    onMq();
    mq.addEventListener("change", onMq);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      mq.removeEventListener("change", onMq);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  /** Moves one card left/right; wraps around at either end. */
  const scroll = useCallback((dir: number) => {
    const el = track.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;
    if (dir > 0 && atEnd) return el.scrollTo({ left: 0, behavior: "smooth" });
    if (dir < 0 && atStart) return el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 360) + 24), behavior: "smooth" });
  }, []);

  // Auto-slide: one card every few seconds; pauses on hover, keyboard focus, touch, hidden tab or reduced motion.
  const scrollable = !(edges.start && edges.end);
  const paused = hovered || focused || hidden || reduced || !scrollable;
  useEffect(() => {
    if (paused) return;
    const wait = Math.max(0, touchedAt + 8000 - Date.now());
    const t = window.setTimeout(() => scroll(1), Math.max(AUTO_MS, wait));
    return () => window.clearTimeout(t);
  }, [paused, edges, touchedAt, scroll]);

  if (!items.length) return null;

  return (
    <section
      aria-labelledby="testimonials-title"
      aria-roledescription="carousel"
      className="overflow-hidden bg-mist"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e) => setFocused((e.target as HTMLElement).matches(":focus-visible"))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
      }}
      onTouchStart={() => setTouchedAt(Date.now())}
    >
      <div className="container-site py-[72px] md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="eyebrow">What our customers say</div>
            <h2 id="testimonials-title" className="display-lg mt-3">
              Trusted in homes
              <span className="block text-gold-text">like yours.</span>
            </h2>
          </div>
          {scrollable && (
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous reviews"
                onClick={() => scroll(-1)}
                className="flex size-12 items-center justify-center rounded-full border border-line-2 bg-white transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-35"
              >
                <Icon name="arrow" size={18} strokeWidth={1.6} className="rotate-180" />
              </button>
              <button
                type="button"
                aria-label="Next reviews"
                onClick={() => scroll(1)}
                className="flex size-12 items-center justify-center rounded-full border border-line-2 bg-white transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-35"
              >
                <Icon name="arrow" size={18} strokeWidth={1.6} />
              </button>
            </div>
          )}
        </div>

        <ul
          ref={track}
          className="-mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto scroll-smooth px-5 pb-2 md:scroll-px-8 [scrollbar-width:none] md:-mx-8 md:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((t) => (
            <li
              key={t.id}
              className="flex w-[86%] shrink-0 snap-start flex-col rounded-[10px] bg-white p-7 sm:w-[calc(50%-12px)] md:p-8 lg:w-[calc((100%-48px)/3)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex gap-0.5 text-gold" aria-label={`${t.rating} out of 5 stars`} role="img">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg key={i} viewBox="0 0 20 20" className={`size-[18px] ${i < t.rating ? "fill-current" : "fill-line-2"}`} aria-hidden="true">
                      <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z" />
                    </svg>
                  ))}
                </span>
                <span aria-hidden="true" className="font-serif text-[64px] leading-[0.6] text-gold">
                  &ldquo;
                </span>
              </div>
              <blockquote className="mt-6 flex-1 text-[16px] leading-[1.75] text-text">{t.quote}</blockquote>
              <div className="mt-8 flex items-center gap-4 border-t border-line pt-5">
                {t.photo ? (
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-full">
                    <Image src={t.photo} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                ) : (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ink text-[14px] font-bold text-gold">
                    {initials(t.name)}
                  </span>
                )}
                <span>
                  <span className="block text-[15px] font-bold">{t.name}</span>
                  {t.meta && <span className="mt-0.5 block text-[13px] text-muted">{t.meta}</span>}
                </span>
                <Star size={22} className="ml-auto shrink-0 text-gold" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
