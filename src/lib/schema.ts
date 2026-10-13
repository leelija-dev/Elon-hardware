/** SQLite schema — applied automatically on start-up (CREATE IF NOT EXISTS). */
export const SCHEMA = `
CREATE TABLE IF NOT EXISTS ranges (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  image_bg TEXT,
  hero_title TEXT,
  hero_accent TEXT,
  hero_text TEXT,
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  range_slug TEXT NOT NULL REFERENCES ranges(slug) ON UPDATE CASCADE,
  name TEXT NOT NULL,
  short TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  tile TEXT,
  hero_eyebrow TEXT,
  hero_title TEXT,
  hero_accent TEXT,
  hero_text TEXT,
  hero_image TEXT,
  hero_caption TEXT,
  section_eyebrow TEXT,
  section_title TEXT,
  item_noun TEXT,
  guide TEXT,              -- JSON [{title,text}]
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  category_slug TEXT NOT NULL REFERENCES categories(slug) ON UPDATE CASCADE,
  subtitle TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  images TEXT NOT NULL DEFAULT '[]',        -- JSON string[]
  finishes TEXT NOT NULL DEFAULT '[]',      -- JSON FinishKey[]
  specs TEXT NOT NULL DEFAULT '[]',         -- JSON [{label,value}]
  features TEXT NOT NULL DEFAULT '[]',      -- JSON [{title,text}]
  groups_json TEXT NOT NULL DEFAULT '[]',   -- JSON [{title,items[]}]
  suitable_for TEXT NOT NULL DEFAULT '[]',  -- JSON string[]
  tags TEXT NOT NULL DEFAULT '[]',          -- JSON string[]
  locker TEXT,                              -- JSON locker attributes
  badge TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  rank INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published', -- published | draft
  added_on TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_slug);

CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  pincode TEXT,
  product_slug TEXT,
  product_name TEXT,
  interest TEXT,
  slot TEXT,
  message TEXT,
  whatsapp INTEGER NOT NULL DEFAULT 0,
  page TEXT,
  ip TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'new',       -- new | contacted | closed
  notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);
`;
