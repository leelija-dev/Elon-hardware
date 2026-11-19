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
  title: "ABOUT ELON HARDWARE",
  description:
    `ELON HARDWARE supplies a growing range of furniture, kitchen, wardrobe and architectural hardware for dealers,
    furniture manufacturers and interior designers.`,
};

const values = [
  { title: "Product Focus", text: "Understand the application and choose suitable hardware." },
  { title: "Reliability", text: `Communicate clearly about product specifications and availability.`},
  { title: "Partnerships", text: `Build long-term relationships with dealers, manufacturers and design professionals.` },
];

const world = [
  { title: "Architectural hardware", text: "Door and architectural hardware for projects.", img: "/images/ranges/architectural-hardware.jpg", href: "/products/architectural-hardware", round: true },
  { title: "Kitchen & wardrobe fittings", text: "Fittings for manufacturers and fit-out work.", img: "/images/ranges/kitchen-wardrobe.jpg", href: "/products/kitchen-wardrobe-fittings", round: true },
  { title: "Digital access solutions", text: "Home lockers and access products for the trade.", img: "/images/lockers/locker-premium.jpg", href: "/products/digital-access-solutions/home-lockers", round: false },
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
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="grid lg:grid-cols-[1fr_1fr]">
          {/* Text */}
          <div className="relative z-10 flex flex-col px-5 pb-14 md:px-8 lg:pr-12 lg:pl-[max(32px,calc((100vw-1312px)/2))]">
            <Breadcrumbs dark items={[{ href: "/", label: "HOME" }, { href: "/about", label: "ABOUT ELON" }]} />

            <div className="eyebrow-on-dark mt-12 lg:mt-16">ABOUT ELON HARDWARE</div>

            <h1 className="display-xl mt-6">
             Hardware solutions for the people 
              <span className="block text-gold">who build spaces.</span>
            </h1>

            <span aria-hidden="true" className="mt-8 block h-[3px] w-16 bg-gold" />

            <p className="mt-8 max-w-[500px] text-[17px] leading-[1.75] text-white/85">
              ELON HARDWARE supplies a growing range of furniture, kitchen, wardrobe and architectural hardware for dealers,
              furniture manufacturers and interior designers.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/contact" className="btn-rect-gold min-w-[220px]">
                Request a quote <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
              </Link>
              <Link
                href="/products"
                className="inline-flex min-w-[220px] items-center justify-center gap-2 border border-white/40 px-6 py-4 text-[14px] font-bold tracking-[0.02em] uppercase transition-colors hover:border-gold hover:text-gold"
              >
                Discover our world
              </Link>
            </div>

            {/* Trust strip */}
            <ul className="mt-12 grid max-w-[560px] grid-cols-3 gap-4 border-t border-ink-line pt-6">
              {[
                ["Dealers", "Reliable supply"],
                ["Manufacturers", "Consistent quality"],
                ["Designers", "Refined finishes"],
              ].map(([t, s]) => (
                <li key={t}>
                  <div className="text-[13px] font-bold tracking-[0.04em] text-gold uppercase">{t}</div>
                  <div className="mt-1 text-[12px] text-white/70">{s}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Image */}
          <div className="relative min-h-[360px] sm:min-h-[460px] lg:min-h-[680px]">
            <Image
              src="/images/ranges/architectural-hardware.jpg"
              alt="ELON HARDWARE architectural and door hardware range"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            {/* Blend image into the dark text side */}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-ink lg:via-ink/10 lg:to-transparent" />

            {/* Floating badge */}
            <div className="absolute bottom-6 left-5 bg-ink/90 px-6 py-5 backdrop-blur-sm sm:bottom-10 sm:left-8 lg:left-auto lg:right-8">
              <div className="text-[11px] font-bold tracking-[0.08em] text-gold uppercase">Multi-category supplier</div>
              <div className="mt-1 font-serif text-[22px]">Hardware that performs.</div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="bg-gold text-ink">
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
      </section> */}

      {/* Intro */}
      <section id="story" className="container-site grid scroll-mt-4 gap-10 border-b border-line pt-[92px] pb-[74px] lg:grid-cols-2">
        <div>
          {/* <div className="eyebrow">01 / About ELON HARDWARE</div> */}
          <h2 className="display-lg mt-5">
            One partner. 
            <br /> Multiple hardware categories.
          </h2>
        </div>
        <div className="max-w-[460px] space-y-6 pt-2 text-[17px] leading-[1.72] text-muted">
          <p>
            Our focus is to make hardware sourcing more convenient by bringing multiple product categories together under
            one brand. 
          </p>
          <p>
            From essential furniture fittings to kitchen, wardrobe and architectural hardware, we help trade
            customers explore suitable products for their business and projects.
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
              <h2 className="display-lg mt-5">Our Journey</h2>
              <p className="mt-6 max-w-[460px] text-[17px] leading-[1.7] text-muted">
               ELON HARDWARE is building its presence in the hardware industry with a focus on product range, trade
                relationships and service. We continue to develop our categories in response to the needs of our customers.
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
               The team behind 
                <span className="block text-gold-text">Elon Hardware.</span>
              </h2>
            </div>
            <p className="max-w-[420px] text-[16px] leading-[1.7] text-muted">
             Our team works to support product enquiries, trade relationships and customer requirements.
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
            <Image src="/images/ranges/kitchen-wardrobe.jpg" alt="ELON HARDWARE kitchen and wardrobe fittings" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-top" />
          </div>
          <div className="absolute right-[-14px] bottom-9 bg-ink px-6 py-8 text-[12px] leading-[2.5] font-bold tracking-[0.02em] text-gold uppercase">
            Practical.
            <br />
            Reliable.
          </div>
        </div>
        <div>
          <div className="eyebrow">02 / Our point of view</div>
          <h2 className="display-lg mt-6">
           Built for
            <br />
            the trade.
          </h2>
          <h3 className="mt-10 text-[19px] font-bold">Our vision</h3>
          <p className="mt-4 max-w-[380px] text-[17px] leading-[1.7] text-muted">
            To become a trusted multi-category hardware supply partner for the furniture and interior industry.
          </p>
          <hr className="my-6 border-line" />
          <h3 className="text-[19px] font-bold">Our mission</h3>
          <p className="mt-4 max-w-[420px] text-[17px] leading-[1.7] text-muted">
           To make quality hardware easier to source for dealers, furniture manufacturers and interior designers through a
            broad product range and dependable trade support.
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
            <div className="eyebrow">04 / Our range</div>
            <h2 className="display-lg mt-4">One partner. Every category.</h2>
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
            <h2 className="font-serif text-[28px] font-normal">Practical products. Responsive support.</h2>
            <p className="mt-2 text-[15px] text-muted">We believe good hardware should combine function, suitable design and dependable performance. We work to
support our trade customers with clear product information, responsive communication and solutions suited to their
requirements.</p>
          </div>
          <Link href="/contact" className="btn-rect-dark min-w-[265px]">
            Talk to ELON <Icon name="arrowUpRight" size={18} strokeWidth={1.6} className="text-gold" />
          </Link>
        </div>
      </section>

      <CtaBand
        eyebrow="Let’s build a stronger hardware partnership."
        title="Contact our team to discuss your requirements."
        href="/contact"
        label="Get in touch"
        variant="rect"
      />
    </>
  );
}
