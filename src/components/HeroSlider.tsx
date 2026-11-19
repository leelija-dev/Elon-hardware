"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

export type HeroSlide = {
  id: number;
  image: string;
  mobileImage?: string;
  // Text fields are kept so existing data still type-checks, but they are no longer shown.
  eyebrow?: string;
  title?: string;
  accent?: string;
  text?: string;
  buttonLabel?: string;
  buttonHref?: string;
  linkLabel?: string;
  linkHref?: string;
  layout?: "split" | "full";
};

const INTERVAL = 5000;

/**
 * Full-width image-only banner slider with an endless loop.
 * Slides always move right-to-left. After the last slide it keeps moving to the first
 * (using a cloned first slide at the end), then silently resets, so it never rewinds.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const count = slides.length;
  // pos 0..count-1 = real slides, pos === count = clone of the first slide
  const [pos, setPos] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const index = count ? pos % count : 0;

  const next = useCallback(() => {
    if (count < 2) return;
    setAnimate(true);
    setPos((p) => (p >= count ? p : p + 1));
  }, [count]);

  const prev = useCallback(() => {
    if (count < 2) return;
    setPos((p) => {
      if (p > 0) {
        setAnimate(true);
        return p - 1;
      }
      // At the first slide: jump (no animation) to the clone, then slide back one step.
      setAnimate(false);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setAnimate(true);
          setPos(count - 1);
        }),
      );
      return count;
    });
  }, [count]);

  const goTo = useCallback((i: number) => {
    setAnimate(true);
    setPos(i);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Autoplay
  useEffect(() => {
    if (count < 2 || paused) return;
    const t = window.setTimeout(next, INTERVAL);
    return () => window.clearTimeout(t);
  }, [pos, paused, count, next]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // With reduced motion there is no transition, so reset the clone straight away.
  useEffect(() => {
    if (reduced && pos === count && count > 0) setPos(0);
  }, [reduced, pos, count]);

  // When the slide-to-clone animation ends, silently jump to the real first slide.
  const onTrackTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (pos === count) {
      setAnimate(false);
      setPos(0);
    }
  };

  if (!count) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative w-full overflow-hidden bg-white select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={(e) => {
        if ((e.target as HTMLElement).matches(":focus-visible")) setPaused(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }}
      onPointerDown={(e) => (touch.current = { x: e.clientX, y: e.clientY })}
      onPointerUp={(e) => {
        const s = touch.current;
        touch.current = null;
        if (!s || count < 2) return;
        const dx = e.clientX - s.x;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) (dx < 0 ? next : prev)();
      }}
    >
      {/* Sliding track */}
      <div
        className={`flex w-full ${animate && !reduced ? "transition-transform duration-700 ease-in-out" : ""}`}
        style={{ transform: `translateX(-${pos * 100}%)` }}
        onTransitionEnd={onTrackTransitionEnd}
      >
        {slides.map((s, i) => (
          <Slide key={s.id} s={s} active={i === index} first={i === 0} position={`${i + 1} of ${count}`} />
        ))}
        {/* Clone of the first slide: lets the last slide glide forward into the first. */}
        {count > 1 && <Slide key="clone" s={slides[0]} active={false} first={false} clone position="" />}
      </div>

      {count > 1 && (
        <>
          {/* Arrows */}
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="absolute top-1/2 left-3 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-ink/40 text-white backdrop-blur-sm transition-colors hover:border-gold hover:bg-gold hover:text-ink sm:flex lg:left-6"
          >
            <Icon name="arrow" size={18} strokeWidth={1.6} className="rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="absolute top-1/2 right-3 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-ink/40 text-white backdrop-blur-sm transition-colors hover:border-gold hover:bg-gold hover:text-ink sm:flex lg:right-6"
          >
            <Icon name="arrow" size={18} strokeWidth={1.6} />
          </button>

          {/* Dots */}
          <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center sm:bottom-5">
            <div className="flex gap-2 rounded-full bg-ink/40 px-3 py-2 backdrop-blur-sm" role="tablist" aria-label="Choose slide">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-gold" : "w-2 bg-white/60 hover:bg-white"}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Slide({
  s,
  active,
  first,
  position,
  clone = false,
}: {
  s: HeroSlide;
  active: boolean;
  first: boolean;
  position: string;
  clone?: boolean;
}) {
  const href = s.buttonHref || s.linkHref;
  const alt = clone ? "" : (s.title ?? "");

  // Fixed banner height per screen size. Change these numbers to taste.
  const frame =
    "relative block w-full h-[320px] sm:h-[400px] md:h-[460px] lg:h-[540px] xl:h-[600px]";

  // Which part of the image stays visible if it has to be trimmed.
  // object-top keeps heads/faces. Use object-center to centre, object-bottom for the bottom.
  const fit = "object-cover object-top";

  const image = (
    <>
      <Image
        src={s.image}
        alt={alt}
        fill
        priority={first}
        sizes="100vw"
        className={`${fit} ${s.mobileImage ? "hidden sm:block" : ""}`}
      />
      {s.mobileImage && (
        <Image src={s.mobileImage} alt={alt} fill priority={first} sizes="100vw" className={`${fit} sm:hidden`} />
      )}
    </>
  );

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={position || undefined}
      aria-hidden={clone || !active}
      className="w-full shrink-0 grow-0 basis-full"
    >
      {href ? (
        <Link href={href} tabIndex={active ? 0 : -1} className={frame}>
          {image}
        </Link>
      ) : (
        <div className={frame}>{image}</div>
      )}
    </div>
  );
}