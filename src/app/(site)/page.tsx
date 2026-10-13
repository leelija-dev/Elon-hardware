import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/Footer";
import { Icon, Star } from "@/components/Icon";
import { ShopByNeed } from "@/components/ShopByNeed";
import { lockerGuide } from "@/data/catalogue";
import { getRanges } from "@/lib/catalog";

const LOCKERS = "/products/digital-access-solutions/home-lockers";

const lockerEdit = [
  { title: "Compact living", text: "Small spaces. Meaningful essentials.", img: "/images/lockers/locker-compact.jpg", href: `${LOCKERS}?capacity=compact`, w: 150 },
  { title: "Everyday essentials", text: "Your personal world, kept together.", img: "/images/lockers/locker-everyday.jpg", href: `${LOCKERS}?capacity=medium`, w: 200 },
  { title: "Room for more", text: "Explore more generous storage formats.", img: "/images/lockers/locker-premium.jpg", href: `${LOCKERS}?capacity=large`, w: 200 },
];

const tabCopy: Record<string, { title: string; text: string; images: string[] }> = {
  "architectural-hardware": {
    title: "The details make the difference.",
    text: "Explore door hardware by product type.",
    images: ["/images/hardware/banner-handle.jpg", "/images/hardware/banner-mortise.jpg"],
  },
  "inspiring-bath-concepts": {
    title: "Everyday rituals, beautifully finished.",
    text: "Explore bath fittings by product type.",
    images: ["/images/ranges/bath.jpg"],
  },
  "glass-hardware-fittings": {
    title: "Clear spaces, considered fittings.",
    text: "Explore glass hardware by product type.",
    images: ["/images/ranges/glass-hardware.jpg"],
  },
};

export default function HomePage() {
  const ranges = getRanges();
  const tabs = ranges
    .filter((r) => tabCopy[r.slug])
    .map((r) => ({
      slug: r.slug,
      name: r.name,
      bannerTitle: tabCopy[r.slug].title,
      bannerText: tabCopy[r.slug].text,
      bannerImages: tabCopy[r.slug].images,
      categories: r.categories.map((c) => ({ slug: c.slug, name: c.name, tile: c.tile, count: c.count })),
    }));

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="grid bg-ink text-white lg:grid-cols-[675fr_765fr]">
        <div className="flex flex-col justify-center px-5 pt-14 pb-10 md:px-8 lg:pt-[70px] lg:pr-4 lg:pb-12 lg:pl-[max(32px,calc((100vw-1312px)/2))]">
          <div className="eyebrow-on-dark">Home lockers. Beautifully considered.</div>
          <h1 className="display-xl mt-8 xl:whitespace-nowrap">
            Your world.
            <br />
            Your treasures.
            <span className="mt-3 block text-gold">Your safe place.</span>
          </h1>
          <p className="mt-8 max-w-[440px] text-[17px] leading-[1.75]">
            For the pieces you cherish and the memories you keep. Find a home locker that fits your life, beautifully.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-8">
            <Link href={LOCKERS} className="btn-pill-gold min-w-[250px]">
              Explore home lockers <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
            </Link>
            <Link href="/locker-finder" className="text-[15px] font-bold hover:text-gold">
              Help me choose →
            </Link>
          </div>
          <div className="mt-11 flex max-w-[560px] items-end justify-between border-t border-ink-line pt-6">
            <div className="flex gap-16 text-[11px] font-bold tracking-[0.02em] text-gold uppercase">
              <span>Personal valuables</span>
              <span>Considered spaces</span>
            </div>
            <Star size={40} className="-mb-1 text-gold" />
          </div>
        </div>
        <div className="relative min-h-[460px] lg:min-h-[681px]">
          <Image
            src="/images/lifestyle/hero-woman.jpg"
            alt="Woman holding a jewellery box in a sunlit home"
            fill
            priority
            sizes="(min-width: 1024px) 53vw, 100vw"
            className="object-cover object-[60%_30%]"
          />
          <svg
            aria-hidden="true"
            className="absolute top-11 left-[42px] hidden h-[590px] w-[220px] text-gold lg:block"
            viewBox="0 0 220 590"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M3 590V200C3 90 90 5 215 3" />
            <path d="M15 590V206C15 100 98 18 215 15" />
          </svg>
          <Link
            href={LOCKERS}
            className="absolute right-5 bottom-10 flex items-center gap-8 rounded-[6px] bg-white px-7 py-6 text-ink shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] sm:right-[54px]"
          >
            <span className="relative block h-[66px] w-[70px]">
              <Image src="/images/lockers/locker-everyday.jpg" alt="" fill sizes="70px" className="object-contain" />
            </span>
            <span>
              <span className="block text-[9px] font-bold tracking-[0.02em] text-gold-text uppercase">The edit</span>
              <span className="mt-1 block font-serif text-[22px] leading-[1.1]">
                Home
                <br />
                lockers
              </span>
              <span className="mt-2 block text-[11px] font-bold">Explore ↗</span>
            </span>
          </Link>
        </div>
      </section>

      {/* ---------- Gold band ---------- */}
      <section className="bg-gold text-ink">
        <ul className="container-site grid grid-cols-2 gap-y-4 py-6 text-[13px] font-bold tracking-[0.02em] uppercase md:grid-cols-4 md:text-[14px]">
          {["Jewellery", "Documents", "Keepsakes", "Everyday valuables"].map((t) => (
            <li key={t} className="flex items-center gap-4 xl:-ml-2.5">
              <Star size={18} className="shrink-0" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Made for what matters ---------- */}
      <section className="container-site pt-[84px] pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">01 / Explore the collection</div>
            <h2 className="display-lg mt-3">Made for what matters.</h2>
          </div>
          <Link href={LOCKERS} className="text-[15px] font-bold hover:text-gold-text md:mr-24">
            View all home lockers ↗
          </Link>
        </div>
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-[34px]">
          {lockerEdit.map((c, i) => (
            <Link key={c.title} href={c.href} className="group block">
              <div className="flex justify-between px-[22px] text-[11px] font-bold">
                <span className="tracking-[0.02em] text-gold-text uppercase">The home locker edit</span>
                <span className="font-normal text-muted">0{i + 1}</span>
              </div>
              <div className="relative mt-6 h-[230px]">
                <Image
                  src={c.img}
                  alt={c.title}
                  fill
                  sizes="(min-width: 768px) 30vw, 90vw"
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-8 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[24px] leading-tight font-normal">{c.title}</h3>
                  <p className="mt-2 text-[14px] text-muted">{c.text}</p>
                </div>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors group-hover:bg-gold group-hover:text-ink">
                  <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- About teaser ---------- */}
      <section className="overflow-hidden bg-mist">
        <div className="container-site grid items-center gap-14 py-[50px] lg:grid-cols-2">
          <div className="relative mx-auto h-[320px] w-[333px] sm:h-[480px] sm:w-[520px]">
            <div className="absolute top-0 left-0 h-[480px] w-[520px] origin-top-left scale-[0.64] sm:scale-100">
            <svg aria-hidden="true" className="absolute inset-0 size-full text-gold" viewBox="0 0 520 480" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="278" cy="240" r="238" />
              <circle cx="278" cy="240" r="222" />
              <circle cx="278" cy="240" r="206" />
              <circle cx="278" cy="240" r="190" />
            </svg>
            <div className="absolute top-[50px] left-[76px] h-[210px] w-[245px] bg-white">
              <Image src="/images/lockers/locker-collage.jpg" alt="Black digital home locker" fill sizes="245px" className="object-contain p-4" />
            </div>
            <div className="absolute top-[266px] left-[80px] h-[160px] w-[150px] bg-white">
              <Image src="/images/hardware/hinge-collage.jpg" alt="Stainless steel door hinge" fill sizes="150px" className="object-contain p-3" />
            </div>
            <div className="absolute top-[240px] left-[272px] h-[150px] w-[226px] bg-white">
              <Image src="/images/hardware/handle-collage.jpg" alt="Lever door handle" fill sizes="226px" className="object-contain p-3" />
            </div>
            </div>
          </div>
          <div className="lg:pl-6">
            <div className="eyebrow">About ELON HARDWARE</div>
            <h2 className="display-lg mt-4">
              Thoughtful details.
              <br />
              Beautifully connected.
            </h2>
            <p className="mt-10 max-w-[400px] text-[17px] leading-[1.65] text-muted">
              From a safe place for your valuables to the finishing touches throughout your home, explore hardware for the way you
              live. Discover home lockers, digital access solutions, door hardware and interior fittings.
            </p>
            <Link href="/about" className="btn-pill-dark mt-14 min-w-[280px]">
              Read more about us <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Ranges ---------- */}
      <section className="container-site pt-[74px] pb-6">
        <div className="eyebrow">Explore our product ranges</div>
        <h2 className="display-lg mt-3">One home. Every detail.</h2>
        <div className="mt-8 border-t border-line">
          {ranges.map((r, i) => (
            <div key={r.slug} className="grid items-center gap-8 border-b border-line py-10 md:grid-cols-2 md:py-5 last:border-b-0">
              <div className={`py-6 ${i % 2 ? "md:order-2 md:pl-0" : ""}`}>
                <div className="eyebrow">
                  0{i + 1} <span className="font-normal text-muted">/</span> The range
                </div>
                <h3 className="mt-4 font-serif text-[30px] leading-tight font-normal md:text-[36px]">{r.name}</h3>
                <p className="mt-4 max-w-[380px] text-[16px] leading-[1.7] text-muted">{r.description}</p>
                <Link href={`/products/${r.slug}`} className="btn-pill-dark mt-8 min-w-[213px]">
                  Explore more <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
                </Link>
              </div>
              <div className={`flex justify-center ${i % 2 ? "md:order-1 md:justify-start md:pl-24" : "md:justify-end md:pr-36"}`}>
                <Link
                  href={`/products/${r.slug}`}
                  aria-label={r.name}
                  className="relative block size-[220px] overflow-hidden rounded-full md:size-[262px]"
                  style={{ background: r.imageBg ?? "#f4f4f4" }}
                >
                  <Image src={r.image} alt="" fill sizes="262px" className="object-cover transition-transform duration-500 hover:scale-105" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Shop according to your need ---------- */}
      <section className="mt-16 bg-mist">
        <div className="container-site pt-[52px] pb-[72px]">
          <div className="eyebrow">Find the right detail</div>
          <h2 className="display-lg mt-3">Shop according to your need.</h2>
          <ShopByNeed tabs={tabs} />
        </div>
      </section>

      {/* ---------- Some things are priceless ---------- */}
      <section className="container-site relative grid rounded-[10px] bg-mist px-0! lg:grid-cols-[636fr_676fr]">
        <div className="relative min-h-[360px] lg:min-h-[564px]">
          <Image
            src="/images/lifestyle/jewellery.jpg"
            alt="Woman placing a bracelet in her jewellery box"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-top"
          />
          <div className="absolute right-4 bottom-7 z-10 min-w-[158px] rounded-full bg-ink px-[26px] py-4 text-[11px] leading-[1.75] font-bold tracking-[0.02em] text-gold uppercase lg:-right-[50px]">
            Personal.
            <br />
            By design.
          </div>
        </div>
        <div className="relative px-6 py-12 md:px-[70px] md:py-[50px]">
          <Star size={56} className="absolute top-8 right-10 text-gold" />
          <div className="eyebrow">02 / More than storage</div>
          <h2 className="display-lg mt-6">
            Some things
            <br />
            are priceless.
          </h2>
          <p className="mt-10 text-[17px] leading-[1.75] text-muted">
            The first gift. The family keepsake.
            <br />
            The documents that open new doors.
          </p>
          <p className="mt-5 max-w-[340px] text-[16px] leading-[1.7] text-muted">
            Give your personal valuables a dedicated place in a home that reflects who you are.
          </p>
          <Link href={LOCKERS} className="btn-pill-dark mt-8 min-w-[245px]">
            Find your locker <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
          </Link>
        </div>
      </section>

      {/* ---------- Locker finder teaser ---------- */}
      <section className="container-site pt-24 pb-24">
        <div className="eyebrow">03 / The locker finder</div>
        <h2 className="display-lg mt-3">A perfect fit starts with you.</h2>
        <p className="mt-5 text-[17px] text-muted">Three thoughtful choices to guide your search.</p>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {lockerGuide.map((g, i) => (
            <li key={g.title}>
              <Link href={`/locker-finder#step-${i + 1}`} className="group block h-full rounded-[10px] bg-mist-2 px-6 pt-6 pb-12 hover:bg-[#eeeeee]">
                <div className="flex items-center justify-between">
                  <span className="flex size-[46px] items-center justify-center rounded-full bg-ink text-[12px] font-bold text-gold">
                    0{i + 1}
                  </span>
                  <Icon name="arrowUpRight" size={24} strokeWidth={1.4} className="mr-6 text-gold-text transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <h3 className="mt-8 text-[24px] font-normal">{g.title}</h3>
                <p className="mt-4 max-w-[200px] text-[15px] leading-[1.6] text-muted">{g.text}</p>
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex justify-center">
          <Link href="/locker-finder" className="btn-pill-dark min-w-[260px]">
            Help me choose <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
          </Link>
        </div>
      </section>

      <CtaBand
        eyebrow="Let’s talk about your space"
        title="Find your safe place."
        text="A more personal approach to choosing your home locker."
        href="/enquiry?type=quote"
        label="Enquire now"
      />
    </>
  );
}
