import Image from "next/image";
import Link from "next/link";
import { ACCESS_LABELS, CAPACITY_BANDS, FINISHES, SORT_OPTIONS } from "@/lib/constants";
import type { AccessMode, CapacityBand, Category, FinishKey, GuideStep, ProductQuery, ProductView, Range } from "@/lib/types";
import { Breadcrumbs } from "./Breadcrumbs";
import { EnquiryForm } from "./EnquiryForm";
import { CtaBand } from "./Footer";
import { Icon } from "./Icon";
import { CheckFilter, ResetFilters, SearchField, SortSelect } from "./ListingControls";
import { ProductCard } from "./ProductCard";

type ProductListingResult = {
  items: ProductView[];
  total: number;
  page: number;
  pages: number;
  perPage: number;
};

type FacetsResult = {
  finish: Partial<Record<FinishKey, number>>;
  access: Partial<Record<AccessMode, number>>;
  capacity: Partial<Record<CapacityBand, number>>;
  hasLockers: boolean;
  total: number;
};

const DEFAULT_GUIDE: GuideStep[] = [
  { title: "Consider the setting", text: "Coordinate the piece with your space and interior style." },
  { title: "Explore the finish", text: "Compare finish options with your other hardware." },
  { title: "Check the fit", text: "Confirm dimensions and compatibility before ordering." },
];

type Props = {
  query: ProductQuery;
  range?: Range;
  category?: Category;
  basePath: string;
  ranges: (Range & { count: number; categories: (Category & { count: number; })[]; })[];
  result: ProductListingResult;
  facetsData: FacetsResult;
  productOptions: { slug: string; name: string; category: string; }[];
};

/** The product listing page from the design: hero card, search, filters sidebar, sort, grid, guide and CTA. */
export function ProductListing({ query, range, category, basePath, ranges, result, facetsData: f, productOptions }: Props) {
  const isLockers = f.hasLockers;
  const noun = category?.itemNoun ?? (isLockers && category ? "models" : "products");

  const heroTitle = category?.heroTitle ?? (category ? category.name : (range?.heroTitle ?? "Considered details."));
  const heroAccent = category?.heroAccent ?? (category ? "Thoughtfully chosen." : (range?.heroAccent ?? "Beautiful spaces."));
  const heroText =
    category?.heroText ??
    (category ? category.description : (range?.heroText ?? "Explore home lockers, digital access, door hardware and interior fittings."));
  const heroImage = category?.heroImage ?? category?.tile ?? range?.image ?? "/images/lockers/locker-premium.jpg";
  const heroEyebrow = category?.heroEyebrow ?? (category ? range?.name : range ? "The range" : "All products");
  const heroCaption = category?.heroCaption ?? (range ? range.short : "Hardware for the way you live.");
  const listTitle = query.q ? `Results for “${query.q}”` : (category?.name ?? range?.name ?? "All products");

  // Sidebar: sibling categories (inside a range) or all ranges.
  const navItems = range
    ? [
        { href: `/products/${range.slug}`, label: `All ${range.name.toLowerCase()}`, active: !category },
        ...ranges
          .find((r) => r.slug === range.slug)!
          .categories.map((c: Category & { count: number; }) => ({ href: `/products/${range.slug}/${c.slug}`, label: c.name, active: c.slug === category?.slug, count: c.count })),
      ]
    : [
        { href: "/products", label: "All products", active: true },
        ...ranges.map((r: Range & { count: number; }) => ({ href: `/products/${r.slug}`, label: r.name, active: false, count: r.count })),
      ];

  const finishOptions = (Object.keys(f.finish) as FinishKey[]).map((k) => ({
    value: k,
    label: FINISHES[k].label,
    swatch: FINISHES[k].swatch,
    count: f.finish[k],
  }));
  const accessOptions = (Object.keys(ACCESS_LABELS) as AccessMode[])
    .filter((k) => f.access[k])
    .map((k) => ({ value: k, label: ACCESS_LABELS[k], count: f.access[k] }));
  const capacityOptions = (Object.keys(CAPACITY_BANDS) as CapacityBand[])
    .filter((k) => f.capacity[k])
    .map((k) => ({ value: k, label: `${CAPACITY_BANDS[k].label} · ${CAPACITY_BANDS[k].range}`, count: f.capacity[k] }));
  const sortOptions = SORT_OPTIONS.filter((o) => isLockers || !o.value.startsWith("capacity"));

  const pageHref = (n: number) => {
    const sp = new URLSearchParams();
    if (query.q) sp.set("q", query.q);
    if (query.finish?.length) sp.set("finish", query.finish.join(","));
    if (query.access?.length) sp.set("access", query.access.join(","));
    if (query.capacity?.length) sp.set("capacity", query.capacity.join(","));
    if (query.sort && query.sort !== "featured") sp.set("sort", query.sort);
    if (n > 1) sp.set("page", String(n));
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    ...(range ? [{ href: `/products/${range.slug}`, label: range.name }] : []),
    ...(category ? [{ href: `/products/${range!.slug}/${category.slug}`, label: category.name }] : []),
  ];
  const guide = category?.guide ?? DEFAULT_GUIDE;
  const catalogEmpty = f.total === 0 && !query.q;

  return (
    <>
      <div className="container-site">
        <Breadcrumbs items={crumbs} />

        {/* Hero card */}
        <section className="mt-6 grid gap-6 rounded-[10px] bg-ink p-6 text-white md:p-10 lg:grid-cols-[1fr_509px] lg:items-center lg:py-6 lg:pr-6 lg:pl-11">
          <div className="lg:py-8">
            <div className="eyebrow-on-dark">{heroEyebrow}</div>
            <h1 className="display-lg mt-8">
              {heroTitle}
              <span className="block text-gold">{heroAccent}</span>
            </h1>
            <p className="mt-6 max-w-[430px] text-[16px] leading-[1.75] text-white/90">{heroText}</p>
            <a href="#collection" className="btn-rect-gold mt-11 min-w-[236px]">
              Explore the collection <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
            </a>
          </div>
          <div className="relative flex min-h-[300px] flex-col bg-white p-7 lg:h-[392px]">
            <div className="relative flex-1">
              <Image src={heroImage} alt={category?.name ?? range?.name ?? "ELON HARDWARE"} fill priority sizes="480px" className="object-contain" />
            </div>
            <div className="mt-4 flex items-end justify-between text-[11px]">
              <span className="font-bold tracking-[0.02em] text-gold-text uppercase">{heroCaption}</span>
              <span className="text-muted">01</span>
            </div>
          </div>
        </section>

        {/* Heading + search */}
        <section id="collection" className="scroll-mt-6 border-b border-line pt-16 pb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow">{category?.sectionEyebrow ?? (range ? `${range.name}, with character` : "Every detail, in one place")}</div>
              <h2 className="display-lg mt-3">{category?.sectionTitle ?? (range ? "Find your finishing touch." : "Explore all products.")}</h2>
            </div>
            <SearchField
              placeholder={`Search ${category ? category.name.toLowerCase() : range ? range.name.toLowerCase() : "products"} or product code`}
            />
          </div>
        </section>

        <div className="grid gap-12 pt-8 pb-20 lg:grid-cols-[236px_1fr] lg:gap-14">
          {/* Sidebar */}
          <aside aria-label="Filters" className="space-y-8">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[18px] font-bold">Refine your selection</h2>
              <ResetFilters />
            </div>
            <nav aria-label="Product category">
              <div className="eyebrow mb-4">{range ? "Product category" : "Product range"}</div>
              <ul className="-mx-3 space-y-1">
                {navItems.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      aria-current={n.active ? "page" : undefined}
                      className={`flex items-center justify-between rounded-[2px] px-3 py-2 text-[15px] ${
                        n.active ? "bg-ink font-bold text-white" : "text-muted hover:bg-mist hover:text-ink"
                      }`}
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {capacityOptions.length > 0 && <CheckFilter param="capacity" title="Capacity" options={capacityOptions} />}
            {accessOptions.length > 0 && <CheckFilter param="access" title="Access" options={accessOptions} />}
            {finishOptions.length > 0 && (
              <div>
                <CheckFilter param="finish" title="Finish preference" options={finishOptions} />
                <p className="mt-6 text-[12px] text-muted">Finish availability varies by model.</p>
              </div>
            )}
            <div className="border-t border-line pt-7">
              <div className="eyebrow">Planning a project?</div>
              <p className="mt-4 text-[15px] leading-[1.7]">Let&rsquo;s find the right details for your space.</p>
              <Link href={`/enquiry?type=quote${category ? `&interest=${category.slug}` : ""}`} className="btn-rect-dark mt-5 w-full">
                Get expert guidance <Icon name="arrowUpRight" size={18} strokeWidth={1.6} className="text-gold" />
              </Link>
            </div>
          </aside>

          {/* Results */}
          <section aria-labelledby="results-title">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 id="results-title" className="text-[20px] font-bold">
                  {listTitle}
                </h2>
                <p className="mt-1 text-[13px] text-muted" aria-live="polite">
                  {result.total} {result.total === 1 ? noun.replace(/s$/, "") : noun} shown
                </p>
              </div>
              <SortSelect options={sortOptions} value={query.sort ?? "featured"} />
            </div>

            {result.items.length > 0 ? (
              <ul className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                {result.items.map((p: ProductView, i: number) => (
                  <li key={p.slug}>
                    <ProductCard p={p} index={(result.page - 1) * result.perPage + i + 1} priority={i < 3} />
                  </li>
                ))}
              </ul>
            ) : catalogEmpty ? (
              <EmptyRange category={category} range={range} />
            ) : (
              <div className="mt-8 rounded-[4px] border border-line p-10 text-center">
                <p className="font-serif text-[24px]">Nothing matches those filters.</p>
                <p className="mt-2 text-muted">Try a different search or reset the filters.</p>
                <Link href={basePath} className="btn-rect-dark mt-6">
                  Reset filters <Icon name="arrowUpRight" size={18} strokeWidth={1.6} />
                </Link>
              </div>
            )}

            {result.total > 0 && (
              <div className="mt-12 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[13px] text-muted">
                  Showing {(result.page - 1) * result.perPage + 1}–{Math.min(result.page * result.perPage, result.total)} of {result.total}{" "}
                  {noun}
                </span>
                <div className="flex items-center gap-3">
                  {result.page > 1 && (
                    <Link href={pageHref(result.page - 1)} scroll={false} className="btn-rect-outline">
                      ← Previous
                    </Link>
                  )}
                  {result.page < result.pages ? (
                    <Link href={pageHref(result.page + 1)} scroll={false} className="btn-rect-dark min-w-[240px]">
                      Explore more {noun} <Icon name="arrowUpRight" size={18} strokeWidth={1.6} className="text-gold" />
                    </Link>
                  ) : (
                    <Link href={range ? `/products/${range.slug}` : "/products"} className="btn-rect-dark min-w-[240px]">
                      {category ? `Explore all ${range?.name.toLowerCase()}` : "Explore all products"}{" "}
                      <Icon name="arrowUpRight" size={18} strokeWidth={1.6} className="text-gold" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Choose with confidence */}
        <section className="mb-[58px] rounded-[4px] bg-mist-2 px-6 py-11 md:px-10">
          <div className="eyebrow">A few details make all the difference</div>
          <h2 className="display-md mt-4">Choose with confidence.</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {guide.map((g, i) => (
              <li key={g.title} className="flex gap-6">
                <span className="pt-1 text-[12px] font-bold text-gold-text">0{i + 1}</span>
                <div>
                  <h3 className="text-[19px] font-normal">{g.title}</h3>
                  <p className="mt-3 max-w-[260px] text-[15px] leading-[1.8] text-muted">{g.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <CtaBand
        eyebrow="For homes. For projects. For your vision."
        title="Bring every detail together."
        text="Share your requirements and explore the right hardware for your space."
        href={`/enquiry?type=quote${category ? `&interest=${category.slug}` : ""}`}
        label="Discuss your project"
        variant="rect"
      />
    </>
  );

  function EmptyRange({ category, range }: { category?: Category; range?: Range }) {
    return (
      <div className="mt-8 grid gap-8 rounded-[4px] border border-line p-6 md:p-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="eyebrow">Range being catalogued</div>
          <h3 className="mt-3 font-serif text-[30px] leading-tight">{category?.name ?? range?.name} — ask for the latest options.</h3>
          <p className="mt-4 text-[16px] leading-[1.75] text-muted">
            {category?.description ?? range?.description} Tell us what you need and our team will share available models, finishes and
            prices.
          </p>
        </div>
        <EnquiryForm
          products={productOptions}
          defaultType="quote"
          defaultInterest={category?.slug}
          variant="product"
          submitLabel="Send my requirement"
        />
      </div>
    );
  }
}
