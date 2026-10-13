import type Database from "better-sqlite3";
import { categories, ranges } from "@/data/catalogue";
import { products } from "@/data/products";

/** Inserts the starter catalogue from src/data into an empty database. */
export function seedDatabase(db: Database.Database) {
  const now = new Date().toISOString();
  const insRange = db.prepare(
    `INSERT OR REPLACE INTO ranges (slug,name,short,description,image,image_bg,hero_title,hero_accent,hero_text,sort)
     VALUES (@slug,@name,@short,@description,@image,@imageBg,@heroTitle,@heroAccent,@heroText,@sort)`,
  );
  const insCat = db.prepare(
    `INSERT OR REPLACE INTO categories (slug,range_slug,name,short,description,tile,hero_eyebrow,hero_title,hero_accent,hero_text,hero_image,hero_caption,section_eyebrow,section_title,item_noun,guide,sort)
     VALUES (@slug,@range,@name,@short,@description,@tile,@heroEyebrow,@heroTitle,@heroAccent,@heroText,@heroImage,@heroCaption,@sectionEyebrow,@sectionTitle,@itemNoun,@guide,@sort)`,
  );
  const insProd = db.prepare(
    `INSERT OR REPLACE INTO products (slug,name,code,category_slug,subtitle,summary,description,images,finishes,specs,features,groups_json,suitable_for,tags,locker,badge,featured,rank,status,added_on,updated_at)
     VALUES (@slug,@name,@code,@category,@subtitle,@summary,@description,@images,@finishes,@specs,@features,@groups,@suitableFor,@tags,@locker,@badge,@featured,@rank,'published',@addedOn,@now)`,
  );
  const nul = <T>(v: T | undefined) => (v === undefined ? null : v);

  db.transaction(() => {
    ranges.forEach((r, i) =>
      insRange.run({
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
      }),
    );
    categories.forEach((c, i) =>
      insCat.run({
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
      }),
    );
    for (const p of products) {
      insProd.run({
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
  })();
}
