import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { aboutStats, aboutTimeline } from "@/config/site";
import { getTeam } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "At ELON HARDWARE, we help you explore hardware that connects your personal style with everyday needs — from home lockers to the finishing touches throughout your space.",
};

const values = [
  { title: "Purpose", text: "Begin with how a space is used, and what matters to the people in it." },
  { title: "Design", text: "Bring form, finish and proportion into the same conversation." },
  { title: "Clarity", text: "Make the next step easier with clear product enquiries and guidance." },
];

const world = [
  { title: "Home lockers", text: "A dedicated place for your valuables.", img: "/images/lockers/locker-premium.jpg", href: "/products/digital-access-solutions/home-lockers", round: false },
  { title: "Architectural hardware", text: "The finishing touch for your doors.", img: "/images/ranges/architectural-hardware.jpg", href: "/products/architectural-hardware", round: true },
  { title: "Interior fittings", text: "Details for the spaces you use daily.", img: "/images/ranges/kitchen-wardrobe.jpg", href: "/products/kitchen-wardrobe-fittings", round: true },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export default async function AboutPage() {
  const team = await getTeam();
  return (
    <>
      {/* Hero */}
      <section className="grid bg-ink text-white lg:grid-cols-[770fr_670fr]">
        <div className="flex flex-col px-5 pb-12 md:px-8 lg:pr-8 lg:pl-[max(32px,calc((100vw-1312px)/2))]">
          <Breadcrumbs dark items={[{ href: "/", label: "HOME" }, { href: "/about", label: "ABOUT ELON" }]} />
          <div className="eyebrow-on-dark mt-16">The details that make a home</div>
          <h1 className="display-xl mt-8 xl:whitespace-nowrap">
            Beautiful spaces.
            <span className="block text-gold">Meaningful details.</span>
          </h1>
          <p className="mt-10 max-w-[440px] text-[17px] leading-[1.75]">
            A handle you reach for. A safe place for your treasures. The thoughtful touches that make a space your own.
          </p>
          <a href="#story" className="btn-rect-gold mt-12 w-fit min-w-[240px]">
            Discover our world <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
          </a>
          <div className="mt-12 flex max-w-[608px] items-center justify-between border-t border-ink-line pt-6 text-[11px] tracking-[0.02em] uppercase">
            Hardware for the way you live.
            <Icon name="arrowDown" size={22} strokeWidth={1.4} className="text-gold" />
          </div>
        </div>
        <div className="relative min-h-[440px] lg:min-h-[630px]">
          <Image
            src="/images/lifestyle/hero-woman.jpg"
            alt="Woman holding a jewellery box at home"
            fill
            priority
            sizes="(min-width: 1024px) 47vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-gold text-ink">
        <ul className="container-site grid grid-cols-2 gap-y-3 py-7 text-[13px] font-bold tracking-[0.02em] uppercase md:grid-cols-4">
          {[
            ["Home lockers", "/products/digital-access-solutions/home-lockers"],
            ["Door hardware", "/products/architectural-hardware"],
            ["Interior fittings", "/products/kitchen-wardrobe-fittings"],
            ["Everyday details", "/products"],
          ].map(([t, href]) => (
            <li key={t}>
              <Link href={href} className="hover:underline">
                {t}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Intro */}
      <section id="story" className="container-site grid scroll-mt-4 gap-10 border-b border-line pt-[92px] pb-[74px] lg:grid-cols-2">
        <div>
          <div className="eyebrow">01 / About ELON HARDWARE</div>
          <h2 className="display-lg mt-5">
            Small details.
            <br />A lasting impression.
          </h2>
        </div>
        <div className="max-w-[460px] space-y-6 pt-2 text-[17px] leading-[1.72] text-muted">
          <p>
            A home comes together through the choices you make. Some make a statement. Others work quietly in the background. Every
            detail has a place.
          </p>
          <p>
            At ELON HARDWARE, our focus is simple: help you explore hardware that connects your personal style with everyday needs, from
            home lockers to the finishing touches throughout your space.
          </p>
        </div>
      </section>

      {/* Story / timeline */}
      <section className="mt-9 bg-mist">
        <div className="container-site pt-14 pb-16">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="eyebrow">
                Our journey <span className="font-normal">/</span> The ELON story
              </div>
              <h2 className="display-lg mt-5">Every detail has a beginning.</h2>
              <p className="mt-6 max-w-[460px] text-[17px] leading-[1.7] text-muted">
                A place to celebrate the people, partnerships and milestones that shape ELON HARDWARE.
              </p>
            </div>
            <div className="hidden md:mr-[180px] md:block">
              <div className="text-[48px] leading-none font-bold text-[#d9d9d9]">ELON</div>
              <div className="eyebrow mt-3 text-[10px]">A story in the making</div>
            </div>
          </div>

          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {aboutStats.map((s) => (
              <li key={s.label} className="rounded-[4px] bg-white px-6 pt-10 pb-8">
                {s.value ? (
                  <div className="font-serif text-[32px] leading-none text-gold-text">{s.value}</div>
                ) : (
                  <span aria-hidden="true" className="block h-[3px] w-10 bg-[#a07c1c]" />
                )}
                <div className="mt-8 text-[16px]">{s.label}</div>
              </li>
            ))}
          </ul>

          {/* Timeline */}
          <ol className="relative mt-12 grid gap-4 lg:mt-8 lg:grid-cols-4 lg:gap-8">
            <span aria-hidden="true" className="absolute top-1/2 right-[5%] left-[5%] hidden h-px bg-gold/70 lg:block" />
            {aboutTimeline.map((t, i) => {
              const up = i % 2 === 0;
              const card = (
                <div className="rounded-[4px] border border-line bg-white px-5 py-6">
                  {t.year && <div className="text-[12px] font-bold text-gold-text">{t.year}</div>}
                  <h3 className="font-serif text-[22px] font-normal">{t.title}</h3>
                  <p className="mt-2 max-w-[170px] text-[13px] leading-[1.7] text-muted">{t.text}</p>
                </div>
              );
              return (
                <li key={t.title} className="relative lg:grid lg:grid-rows-[150px_64px_150px]">
                  <div className="hidden lg:flex lg:flex-col lg:justify-end">{up && card}</div>
                  <div className="relative hidden lg:block">
                    <span aria-hidden="true" className={`absolute left-[150px] w-px bg-gold/70 ${up ? "top-0 h-4" : "bottom-0 h-4"}`} />
                    <span className="absolute top-1/2 left-[134px] flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-gold">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="hidden lg:block">{!up && card}</div>
                  <div className="lg:hidden">{card}</div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Meet our team (Admin → Team) */}
      {team.length > 0 && (
        <section id="team" aria-labelledby="team-title" className="container-site scroll-mt-4 pt-[84px] pb-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="eyebrow">
                The people <span className="font-normal">/</span> Meet our team
              </div>
              <h2 id="team-title" className="display-lg mt-5">
                The people behind
                <span className="block text-gold-text">every detail.</span>
              </h2>
            </div>
            <p className="max-w-[420px] text-[16px] leading-[1.7] text-muted">
              A dedicated team helping you choose, install and care for the hardware in your home.
            </p>
          </div>
          <ul className="mt-12 grid gap-x-6 gap-y-[104px] pt-[76px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            {team.map((m) => (
              <li key={m.id} className="group relative flex flex-col items-center rounded-[10px] bg-mist px-6 pt-[92px] pb-8 text-center transition-shadow hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.35)]">
                <span className="absolute -top-[76px] left-1/2 block size-[152px] -translate-x-1/2 overflow-hidden rounded-full border-[5px] border-white bg-ink shadow-[0_0_0_1px_var(--color-gold)]">
                  {m.photo ? (
                    <Image
                      src={m.photo}
                      alt={m.name}
                      fill
                      sizes="152px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center font-serif text-[40px] text-gold">{initials(m.name)}</span>
                  )}
                </span>
                <h3 className="font-serif text-[26px] leading-tight font-normal">{m.name}</h3>
                {m.designation && (
                  <p className="mt-2 text-[12px] font-bold tracking-[0.04em] text-gold-text uppercase">{m.designation}</p>
                )}
                {m.bio && (
                  <>
                    <span aria-hidden="true" className="mt-5 block h-px w-10 bg-gold" />
                    <p className="mt-5 text-[14px] leading-[1.7] text-muted">{m.bio}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Point of view */}
      <section className="container-site grid items-center gap-12 py-[76px] lg:grid-cols-[578fr_650fr] lg:gap-[84px]">
        <div className="relative">
          <div className="relative aspect-[578/519]">
            <Image src="/images/lifestyle/jewellery.jpg" alt="Woman placing a bracelet in her jewellery box" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-top" />
          </div>
          <div className="absolute right-[-14px] bottom-9 bg-ink px-6 py-8 text-[12px] leading-[2.5] font-bold tracking-[0.02em] text-gold uppercase">
            Personal.
            <br />
            By design.
          </div>
        </div>
        <div>
          <div className="eyebrow">02 / Our point of view</div>
          <h2 className="display-lg mt-6">
            Made part of
            <br />
            your everyday.
          </h2>
          <h3 className="mt-10 text-[19px] font-bold">Our vision</h3>
          <p className="mt-4 max-w-[380px] text-[17px] leading-[1.7] text-muted">
            To make thoughtfully chosen hardware a natural part of beautiful, practical spaces.
          </p>
          <hr className="my-6 border-line" />
          <h3 className="text-[19px] font-bold">Our mission</h3>
          <p className="mt-4 max-w-[420px] text-[17px] leading-[1.7] text-muted">
            To help homeowners and design professionals explore the right details, with a clear path from inspiration to product selection.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ink text-white">
        <div className="container-site pt-12 pb-24">
          <div className="eyebrow-on-dark">03 / What guides us</div>
          <h2 className="display-md mt-4">Considered in every detail.</h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {values.map((v, i) => (
              <li key={v.title}>
                <span className="text-[12px] text-gold">0{i + 1}</span>
                <h3 className="mt-6 font-serif text-[26px] font-normal">{v.title}</h3>
                <p className="mt-4 max-w-[270px] text-[15px] leading-[1.8] text-white/85">{v.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ELON world */}
      <section className="container-site pt-24 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">04 / The ELON world</div>
            <h2 className="display-lg mt-4">One home. Every detail.</h2>
          </div>
          <Link href="/products" className="text-[14px] hover:text-gold-text md:mr-24">
            Explore all products ↗
          </Link>
        </div>
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {world.map((w) => (
            <li key={w.title}>
              <Link href={w.href} className="group block">
                <div className="flex aspect-[416/279] items-center justify-center rounded-[4px] bg-mist-2">
                  <div className={`relative ${w.round ? "size-[222px] overflow-hidden rounded-full" : "h-[230px] w-[306px] bg-white"}`}>
                    <Image src={w.img} alt="" fill sizes="306px" className={w.round ? "object-cover" : "object-contain p-6"} />
                  </div>
                </div>
                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-[26px] font-normal group-hover:text-gold-text">{w.title}</h3>
                    <p className="mt-2 text-[14px]">{w.text}</p>
                  </div>
                  <Icon name="arrowUpRight" size={24} strokeWidth={1.8} className="mt-2 mr-3 text-gold-text" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-16 flex flex-col gap-6 rounded-[4px] bg-mist-2 px-7 py-8 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <h2 className="font-serif text-[28px] font-normal">Your space. Your perspective.</h2>
            <p className="mt-2 text-[15px] text-muted">For homeowners, architects and interior designers planning their next project.</p>
          </div>
          <Link href="/contact" className="btn-rect-dark min-w-[265px]">
            Talk to ELON <Icon name="arrowUpRight" size={18} strokeWidth={1.6} className="text-gold" />
          </Link>
        </div>
      </section>

      <CtaBand
        eyebrow="Let’s create a more considered space"
        title="It starts with a conversation."
        href="/contact"
        label="Get in touch"
        variant="rect"
      />
    </>
  );
}
