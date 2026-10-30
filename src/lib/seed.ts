import type { Database } from "./mysql";
import { categories, ranges } from "@/data/catalogue";
import { products } from "@/data/products";

/** Inserts the starter catalogue from src/data into an empty database. */
export async function seedDatabase(db: Database) {
  const now = new Date().toISOString();
  const insRange = db.prepare(
    `INSERT INTO ranges (slug,name,short,description,image,image_bg,hero_title,hero_accent,hero_text,sort)
     VALUES (@slug,@name,@short,@description,@image,@imageBg,@heroTitle,@heroAccent,@heroText,@sort)
     ON DUPLICATE KEY UPDATE name=VALUES(name), short=VALUES(short), description=VALUES(description), image=VALUES(image), image_bg=VALUES(image_bg), hero_title=VALUES(hero_title), hero_accent=VALUES(hero_accent), hero_text=VALUES(hero_text), sort=VALUES(sort)`,
  );
  const insCat = db.prepare(
    `INSERT INTO categories (slug,range_slug,name,short,description,tile,hero_eyebrow,hero_title,hero_accent,hero_text,hero_image,hero_caption,section_eyebrow,section_title,item_noun,guide,sort)
     VALUES (@slug,@range,@name,@short,@description,@tile,@heroEyebrow,@heroTitle,@heroAccent,@heroText,@heroImage,@heroCaption,@sectionEyebrow,@sectionTitle,@itemNoun,@guide,@sort)
     ON DUPLICATE KEY UPDATE name=VALUES(name), short=VALUES(short), description=VALUES(description), tile=VALUES(tile), hero_eyebrow=VALUES(hero_eyebrow), hero_title=VALUES(hero_title), hero_accent=VALUES(hero_accent), hero_text=VALUES(hero_text), hero_image=VALUES(hero_image), hero_caption=VALUES(hero_caption), section_eyebrow=VALUES(section_eyebrow), section_title=VALUES(section_title), item_noun=VALUES(item_noun), guide=VALUES(guide), sort=VALUES(sort)`,
  );
  const insProd = db.prepare(
    `INSERT INTO products (slug,name,code,category_slug,subtitle,summary,description,images,finishes,specs,features,groups_json,suitable_for,tags,locker,badge,featured,rank,status,added_on,updated_at)
     VALUES (@slug,@name,@code,@category,@subtitle,@summary,@description,@images,@finishes,@specs,@features,@groups,@suitableFor,@tags,@locker,@badge,@featured,@rank,'published',@addedOn,@now)
     ON DUPLICATE KEY UPDATE name=VALUES(name), code=VALUES(code), subtitle=VALUES(subtitle), summary=VALUES(summary), description=VALUES(description), images=VALUES(images), finishes=VALUES(finishes), specs=VALUES(specs), features=VALUES(features), groups_json=VALUES(groups_json), suitable_for=VALUES(suitable_for), tags=VALUES(tags), locker=VALUES(locker), badge=VALUES(badge), featured=VALUES(featured), rank=VALUES(rank), updated_at=VALUES(updated_at)`,
  );
  const nul = <T>(v: T | undefined) => (v === undefined ? null : v);

  const tx = db.transaction(async () => {
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
  });

  await tx();
}
