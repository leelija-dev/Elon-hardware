"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

export type HeroSlide = {
  id: number;
  image: string;
  mobileImage?: string;
  eyebrow?: string;
  title?: string;
  accent?: string;
  text?: string;
  buttonLabel?: string;
  buttonHref?: string;
  linkLabel?: string;
  linkHref?: string;
  layout: "split" | "full";
};

const INTERVAL = 6000;

/**
 * Home page banner slider: cross-fade with a slow zoom on the image and staggered text,
 * autoplay with a progress indicator, arrows, numbered pagination, swipe and keyboard support.
 * Pauses on hover / focus and when the tab is hidden.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const count = slides.length;
  const touch = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [index, paused, count, go]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!count) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="group/slider relative h-[640px] overflow-hidden bg-ink text-white select-none sm:h-[620px] lg:h-[681px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={(e) => {
        // Pause for keyboard users only — a mouse click on a dot should not stop autoplay.
        if ((e.target as HTMLElement).matches(":focus-visible")) setPaused(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(index - 1);
        if (e.key === "ArrowRight") go(index + 1);
      }}
      onPointerDown={(e) => (touch.current = { x: e.clientX, y: e.clientY })}
      onPointerUp={(e) => {
        const s = touch.current;
        touch.current = null;
        if (!s || count < 2) return;
        const dx = e.clientX - s.x;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      {slides.map((s, i) => (
        <Slide key={s.id} s={s} active={i === index} first={i === 0} position={`${i + 1} of ${count}`} reduced={reduced} />
      ))}

      {count > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
          <div className="container-site flex items-end justify-between gap-6 pb-6 lg:pb-8">
            <div className="pointer-events-auto flex items-center gap-4">
              <span className="font-serif text-[15px] text-gold tabular-nums">
                {String(index + 1).padStart(2, "0")}
                <span className="mx-1.5 text-white/40">/</span>
                <span className="text-white/60">{String(count).padStart(2, "0")}</span>
              </span>
              <div className="flex gap-2" role="tablist" aria-label="Choose slide">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Slide ${i + 1}${s.title ? `: ${s.title}` : ""}`}
                    onClick={() => go(i)}
                    className="relative h-[3px] w-8 overflow-hidden rounded-full bg-white/25 transition-[width] duration-300 hover:bg-white/40 sm:w-12"
                  >
                    {i === index && (
                      <span
                        key={`${index}-${paused}`}
                        className="absolute inset-y-0 left-0 bg-gold"
                        style={
                          reduced || paused
                            ? { width: "100%" }
                            : { width: "0%", animation: `hero-progress ${INTERVAL}ms linear forwards` }
                        }
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="pointer-events-auto flex gap-2">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => go(index - 1)}
                className="flex size-11 items-center justify-center rounded-full border border-white/30 bg-ink/40 backdrop-blur-sm transition-colors hover:border-gold hover:bg-gold hover:text-ink"
              >
                <Icon name="arrow" size={18} strokeWidth={1.6} className="rotate-180" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => go(index + 1)}
                className="flex size-11 items-center justify-center rounded-full border border-white/30 bg-ink/40 backdrop-blur-sm transition-colors hover:border-gold hover:bg-gold hover:text-ink"
              >
                <Icon name="arrow" size={18} strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes hero-progress { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  );
}

function Slide({ s, active, first, position, reduced }: { s: HeroSlide; active: boolean; first: boolean; position: string; reduced: boolean }) {
  const Heading = first ? "h1" : "h2";
  const reveal = `transition-all duration-700 ease-out ${active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`;
  const delay = (ms: number) => ({ transitionDelay: active && !reduced ? `${ms}ms` : "0ms" });

  const image = (
    <>
      <Image
        src={s.image}
        alt=""
        fill
        priority={first}
        sizes={s.layout === "full" ? "100vw" : "(min-width: 1024px) 53vw, 100vw"}
        className={`object-cover object-[60%_30%] ${s.mobileImage ? "hidden sm:block" : ""} ${
          reduced ? "" : "transition-transform duration-[7000ms] ease-out"
        } ${active ? "scale-100" : "scale-[1.08]"}`}
      />
      {s.mobileImage && (
        <Image
          src={s.mobileImage}
          alt=""
          fill
          priority={first}
          sizes="100vw"
          className={`object-cover sm:hidden ${reduced ? "" : "transition-transform duration-[7000ms] ease-out"} ${active ? "scale-100" : "scale-[1.08]"}`}
        />
      )}
    </>
  );

  const content = (
    <>
      {s.eyebrow && <div className={`eyebrow-on-dark ${reveal}`} style={delay(150)}>{s.eyebrow}</div>}
      {(s.title || s.accent) && (
        <Heading className={`display-xl mt-6 lg:mt-8 ${reveal}`} style={delay(300)}>
          {s.title}
          {s.accent && <span className="mt-2 block text-gold lg:mt-3">{s.accent}</span>}
        </Heading>
      )}
      {s.text && <p className={`mt-6 max-w-[460px] text-[16px] leading-[1.75] text-white/90 lg:mt-8 lg:text-[17px] ${reveal}`} style={delay(450)}>{s.text}</p>}
      {(s.buttonLabel || s.linkLabel) && (
        <div className={`mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 lg:mt-9 ${reveal}`} style={delay(600)}>
          {s.buttonLabel && s.buttonHref && (
            <Link href={s.buttonHref} tabIndex={active ? 0 : -1} className="btn-pill-gold min-w-[230px] sm:min-w-[250px]">
              {s.buttonLabel} <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
            </Link>
          )}
          {s.linkLabel && s.linkHref && (
            <Link href={s.linkHref} tabIndex={active ? 0 : -1} className="text-[15px] font-bold hover:text-gold">
              {s.linkLabel} →
            </Link>
          )}
        </div>
      )}
    </>
  );

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={position}
      aria-hidden={!active}
      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`}
    >
      {s.layout === "full" ? (
        <>
          <div className="absolute inset-0 overflow-hidden">{image}</div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/10 sm:bg-gradient-to-r sm:from-ink/85 sm:via-ink/50 sm:to-transparent" />
          <div className="relative flex h-full flex-col justify-end pb-24 sm:justify-center sm:pb-0">
            <div className="container-site">
              <div className="max-w-[640px]">{content}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="grid h-full lg:grid-cols-[675fr_765fr]">
          <div className="relative z-10 flex flex-col justify-end px-5 pb-24 md:px-8 lg:justify-center lg:pt-[40px] lg:pr-4 lg:pb-20 lg:pl-[max(32px,calc((100vw-1312px)/2))]">
            {content}
          </div>
          <div className="absolute inset-0 overflow-hidden lg:relative">
            {image}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20 lg:hidden" />
            <svg
              aria-hidden="true"
              className={`absolute top-11 left-[42px] hidden h-[590px] w-[220px] text-gold transition-opacity delay-300 duration-1000 lg:block ${active ? "opacity-100" : "opacity-0"}`}
              viewBox="0 0 220 590"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path d="M3 590V200C3 90 90 5 215 3" />
              <path d="M15 590V206C15 100 98 18 215 15" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
