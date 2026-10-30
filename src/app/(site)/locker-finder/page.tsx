import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { getAllProducts } from "@/lib/catalog";
import type { ProductView } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Locker Finder — Help Me Choose",
  description: "Answer three quick questions and find the home locker that fits what you store, where it will live and how you'll open it.",
};

const questions = [
  {
    name: "what",
    title: "What matters?",
    text: "What will you keep inside?",
    options: [
      { value: "jewellery", label: "Jewellery & watches" },
      { value: "documents", label: "Important papers & files" },
      { value: "laptop", label: "Laptop & devices" },
      { value: "everything", label: "A bit of everything" },
    ],
  },
  {
    name: "where",
    title: "Where will it live?",
    text: "Find a format that suits your available space.",
    options: [
      { value: "wardrobe", label: "Inside a wardrobe or cabinet" },
      { value: "bedroom", label: "On the floor in a bedroom" },
      { value: "office", label: "Office, shop or dedicated room" },
    ],
  },
  {
    name: "access",
    title: "How will you access it?",
    text: "Review access options across available models.",
    options: [
      { value: "fingerprint", label: "Fingerprint" },
      { value: "pin", label: "PIN code & key" },
      { value: "app", label: "Phone app (Wi‑Fi)" },
      { value: "any", label: "No preference" },
    ],
  },
] as const;

type Answers = { what?: string; where?: string; access?: string };

function recommend(lockers: ProductView[], a: Answers) {
  return lockers
    .map((p) => {
      const l = p.locker!;
      let score = p.rank / 100;
      const reasons: string[] = [];
      if (a.what === "documents" && l.volume >= 25) {
        score += 3;
        reasons.push("Room for files");
      }
      if (a.what === "laptop" && (l.laptopFit || l.volume >= 30)) {
        score += 3;
        reasons.push(l.laptopFit ? "Fits a 15\" laptop" : "Space for devices");
      }
      if (a.what === "jewellery" && l.volume <= 45) {
        score += 2;
        reasons.push("Ideal for jewellery");
      }
      if (a.what === "everything" && l.volume >= 30) {
        score += 2;
        reasons.push("Generous capacity");
      }
      if (a.where === "wardrobe" && l.dimensions.h <= 350 && l.dimensions.d <= 380) {
        score += 3;
        reasons.push("Fits inside a wardrobe");
      }
      if (a.where === "bedroom" && l.volume >= 25 && l.volume <= 60) {
        score += 3;
        reasons.push("Right size for a bedroom");
      }
      if (a.where === "office" && l.volume >= 40) {
        score += 3;
        reasons.push("Large format");
      }
      if (a.access && a.access !== "any") {
        if (l.access.includes(a.access as never)) {
        score += 4;
        reasons.push(a.access === "app" ? "App & remote unlock" : a.access === "fingerprint" ? "Fingerprint access" : "PIN & key access");
      }
        else score -= 5;
      }
      return { p, score, reasons };
    })
    .sort((x, y) => y.score - x.score)
    .slice(0, 6);
}

export default async function LockerFinderPage({ searchParams }: PageProps<"/locker-finder">) {
  const sp = await searchParams;
  const pick = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const answers: Answers = { what: pick("what"), where: pick("where"), access: pick("access") };
  const answered = Object.values(answers).some(Boolean);
  const lockers = (await getAllProducts()).filter((p) => p.locker);
  const results = answered ? recommend(lockers, answers) : [];

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/products/digital-access-solutions/home-lockers", label: "Home Lockers" },
          { href: "/locker-finder", label: "Locker finder" },
        ]}
        eyebrow="03 / The locker finder"
        title="A perfect fit"
        accent="starts with you."
        text="Three thoughtful choices to guide your search. Answer what you can — we'll suggest the lockers that suit you best."
      />

      <section className="container-site py-14">
        <form method="get" action="/locker-finder#results" className="grid gap-6 lg:grid-cols-3">
          {questions.map((q, i) => (
            <fieldset key={q.name} id={`step-${i + 1}`} className="scroll-mt-6 rounded-[10px] bg-mist-2 p-6">
              <legend className="sr-only">{q.title}</legend>
              <span className="flex size-[46px] items-center justify-center rounded-full bg-ink text-[12px] font-bold text-gold">0{i + 1}</span>
              <h2 className="mt-6 text-[24px] font-normal">{q.title}</h2>
              <p className="mt-2 text-[15px] text-muted">{q.text}</p>
              <div className="mt-5 space-y-2.5">
                {q.options.map((o) => (
                  <label
                    key={o.value}
                    className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[3px] border border-line-2 bg-white px-4 text-[15px] has-[:checked]:border-ink has-[:checked]:font-bold"
                  >
                    <input type="radio" name={q.name} value={o.value} defaultChecked={answers[q.name] === o.value} className="accent-ink" />
                    {o.label}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="flex flex-wrap items-center justify-center gap-6 lg:col-span-3">
            <button type="submit" className="btn-pill-dark min-w-[260px]">
              Show my lockers <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
            </button>
            {answered && (
              <Link href="/locker-finder" className="text-[14px] font-bold text-muted hover:text-ink">
                Start again
              </Link>
            )}
          </div>
        </form>
      </section>

      {answered && (
        <section id="results" className="scroll-mt-6 bg-mist">
          <div className="container-site py-16">
            <div className="eyebrow">Your recommendations</div>
            <h2 className="display-md mt-3">Lockers that fit your life.</h2>
            <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(({ p, reasons }, i) => (
                <li key={p.slug}>
                  <ProductCard p={p} index={i + 1} />
                  {reasons.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {reasons.slice(0, 3).map((r) => (
                        <li key={r} className="rounded-full bg-white px-3 py-1 text-[12px] text-muted">
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/products/digital-access-solutions/home-lockers" className="btn-rect-dark min-w-[240px]">
                See all home lockers <Icon name="arrowUpRight" size={18} strokeWidth={1.6} className="text-gold" />
              </Link>
              <Link href="/enquiry?type=demo" className="btn-rect-gold min-w-[240px]">
                Book a free home demo <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <CtaBand
        eyebrow="Let’s talk about your space"
        title="Find your safe place."
        text="A more personal approach to choosing your home locker."
        href="/enquiry?type=demo"
        label="Enquire now"
      />
    </>
  );
}
