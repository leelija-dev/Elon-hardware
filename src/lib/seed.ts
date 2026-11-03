import type { Database } from "./mysql";
import { categories, ranges } from "@/data/catalogue";
import { products } from "@/data/products";

const nul = <T>(v: T | undefined) => (v === undefined ? null : v);

/** Inserts the starter catalogue from src/data into an empty database (runs once, sequentially). */
export async function seedDatabase(db: Database) {
  const now = new Date().toISOString();
  const insRange = db.prepare(
    `INSERT INTO ranges (slug,name,short,description,image,image_bg,hero_title,hero_accent,hero_text,sort)
     VALUES (@slug,@name,@short,@description,@image,@imageBg,@heroTitle,@heroAccent,@heroText,@sort)
     ON DUPLICATE KEY UPDATE name=VALUES(name)`,
  );
  const insCat = db.prepare(
    `INSERT INTO categories (slug,range_slug,name,short,description,tile,hero_eyebrow,hero_title,hero_accent,hero_text,hero_image,hero_caption,section_eyebrow,section_title,item_noun,guide,sort)
     VALUES (@slug,@range,@name,@short,@description,@tile,@heroEyebrow,@heroTitle,@heroAccent,@heroText,@heroImage,@heroCaption,@sectionEyebrow,@sectionTitle,@itemNoun,@guide,@sort)
     ON DUPLICATE KEY UPDATE name=VALUES(name)`,
  );
  const insProd = db.prepare(
    `INSERT INTO products (slug,name,code,category_slug,subtitle,summary,description,images,finishes,specs,features,groups_json,suitable_for,tags,locker,badge,featured,\`rank\`,status,added_on,updated_at)
     VALUES (@slug,@name,@code,@category,@subtitle,@summary,@description,@images,@finishes,@specs,@features,@groups,@suitableFor,@tags,@locker,@badge,@featured,@rank,'published',@addedOn,@now)
     ON DUPLICATE KEY UPDATE name=VALUES(name)`,
  );

  for (const [i, r] of ranges.entries()) {
    await insRange.run({
      slug: r.slug,
      name: r.name,
      short: r.short,
      description: r.description,
      image: r.image,
      imageBg: nul(r.imageBg),
      heroTitle: nul(r.heroTitle),
      heroAccent: nul(r.heroAccent),
      heroText: nul(r.heroText),
      sort: i,
    });
  }
  for (const [i, c] of categories.entries()) {
    await insCat.run({
      slug: c.slug,
      range: c.range,
      name: c.name,
      short: c.short,
      description: c.description,
      tile: nul(c.tile),
      heroEyebrow: nul(c.heroEyebrow),
      heroTitle: nul(c.heroTitle),
      heroAccent: nul(c.heroAccent),
      heroText: nul(c.heroText),
      heroImage: nul(c.heroImage),
      heroCaption: nul(c.heroCaption),
      sectionEyebrow: nul(c.sectionEyebrow),
      sectionTitle: nul(c.sectionTitle),
      itemNoun: nul(c.itemNoun),
      guide: c.guide ? JSON.stringify(c.guide) : null,
      sort: i,
    });
  }
  for (const p of products) {
    await insProd.run({
      slug: p.slug,
      name: p.name,
      code: nul(p.code),
      category: p.category,
      subtitle: p.subtitle,
      summary: p.summary,
      description: p.description,
      images: JSON.stringify(p.images),
      finishes: JSON.stringify(p.finishes ?? []),
      specs: JSON.stringify(p.specs),
      features: JSON.stringify(p.features ?? []),
      groups: JSON.stringify(p.groups ?? []),
      suitableFor: JSON.stringify(p.suitableFor ?? []),
      tags: JSON.stringify(p.tags ?? []),
      locker: p.locker ? JSON.stringify(p.locker) : null,
      badge: nul(p.badge),
      featured: p.featured ? 1 : 0,
      rank: p.rank,
      addedOn: p.addedOn,
      now,
    });
  }
}

/** Starter slides for the home page slider (editable in Admin → Home slider). */
export async function seedSlides(db: Database) {
  const ins = db.prepare(
    `INSERT INTO slides (image,eyebrow,title,accent,text,button_label,button_href,link_label,link_href,layout,published,sort)
     VALUES (@image,@eyebrow,@title,@accent,@text,@buttonLabel,@buttonHref,@linkLabel,@linkHref,'split',1,@sort)`,
  );
  const slides = [
    {
      image: "/images/lifestyle/hero-woman.jpg",
      eyebrow: "Home lockers. Beautifully considered.",
      title: "Your world. Your treasures.",
      accent: "Your safe place.",
      text: "For the pieces you cherish and the memories you keep. Find a home locker that fits your life, beautifully.",
      buttonLabel: "Explore home lockers",
      buttonHref: "/products/digital-access-solutions/home-lockers",
      linkLabel: "Help me choose",
      linkHref: "/locker-finder",
    },
    {
      image: "/images/lifestyle/jewellery.jpg",
      eyebrow: "More than storage",
      title: "Some things",
      accent: "are priceless.",
      text: "The first gift. The family keepsake. The documents that open new doors — give them a place of their own.",
      buttonLabel: "Find your locker",
      buttonHref: "/products/digital-access-solutions/home-lockers",
      linkLabel: "Book a demo",
      linkHref: "/enquiry?type=demo",
    },
    {
      image: "/images/handles/handle-hero.jpg",
      eyebrow: "Architectural hardware",
      title: "The details make",
      accent: "the difference.",
      text: "Handles, locks, hinges and closers finished to complement every door in your home.",
      buttonLabel: "Explore hardware",
      buttonHref: "/products/architectural-hardware",
      linkLabel: "Get a quote",
      linkHref: "/enquiry?type=quote",
    },
  ];
  for (const [i, s] of slides.entries()) await ins.run({ ...s, sort: i });
}
