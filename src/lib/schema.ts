/**
 * MySQL / MariaDB schema — applied automatically on start-up (CREATE TABLE IF NOT EXISTS).
 * Written to work on both MySQL 8 and MariaDB 10.x:
 *  - `rank` is a reserved word in MySQL 8, so it is always quoted with backticks.
 *  - TEXT columns have no literal DEFAULT (MySQL 8 rejects it); the app always supplies a value.
 *  - Indexes are created separately and "already exists" errors are ignored.
 */
export const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS ranges (
  slug VARCHAR(191) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  short TEXT NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500) NOT NULL DEFAULT '',
  image_bg VARCHAR(500),
  hero_title VARCHAR(255),
  hero_accent VARCHAR(255),
  hero_text TEXT,
  sort INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS categories (
  slug VARCHAR(191) PRIMARY KEY,
  range_slug VARCHAR(191) NOT NULL,
  name VARCHAR(255) NOT NULL,
  short TEXT NOT NULL,
  description TEXT NOT NULL,
  tile VARCHAR(500),
  hero_eyebrow VARCHAR(255),
  hero_title VARCHAR(255),
  hero_accent VARCHAR(255),
  hero_text TEXT,
  hero_image VARCHAR(500),
  hero_caption TEXT,
  section_eyebrow VARCHAR(255),
  section_title VARCHAR(255),
  item_noun VARCHAR(255),
  guide LONGTEXT,
  sort INT NOT NULL DEFAULT 0,
  FOREIGN KEY (range_slug) REFERENCES ranges(slug) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS products (
  slug VARCHAR(191) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100),
  category_slug VARCHAR(191) NOT NULL,
  subtitle TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  images LONGTEXT,
  finishes LONGTEXT,
  specs LONGTEXT,
  features LONGTEXT,
  groups_json LONGTEXT,
  suitable_for LONGTEXT,
  tags LONGTEXT,
  locker LONGTEXT,
  extra_details LONGTEXT,
  access_modes LONGTEXT,
  colors LONGTEXT,
  size_chart LONGTEXT,
  badge VARCHAR(100),
  featured TINYINT NOT NULL DEFAULT 0,
  best_seller TINYINT NOT NULL DEFAULT 0,
  \`rank\` INT NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'published',
  added_on DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (category_slug) REFERENCES categories(slug) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS enquiries (
  id VARCHAR(50) PRIMARY KEY,
  created_at DATETIME NOT NULL,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  pincode VARCHAR(20),
  product_slug VARCHAR(255),
  product_name VARCHAR(255),
  interest VARCHAR(255),
  slot VARCHAR(50),
  message TEXT,
  whatsapp TINYINT NOT NULL DEFAULT 0,
  page VARCHAR(500),
  ip VARCHAR(50),
  user_agent TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  notes TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  /* Home page slider */
  `CREATE TABLE IF NOT EXISTS slides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(500) NOT NULL,
  mobile_image VARCHAR(500),
  eyebrow VARCHAR(255),
  title VARCHAR(255),
  accent VARCHAR(255),
  text TEXT,
  button_label VARCHAR(100),
  button_href VARCHAR(500),
  link_label VARCHAR(100),
  link_href VARCHAR(500),
  layout VARCHAR(10) NOT NULL DEFAULT 'split',
  published TINYINT NOT NULL DEFAULT 1,
  sort INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  /* Downloads page catalogues */
  `CREATE TABLE IF NOT EXISTS catalogues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  cover VARCHAR(500) NOT NULL,
  file VARCHAR(500) NOT NULL,
  file_size INT NOT NULL DEFAULT 0,
  published TINYINT NOT NULL DEFAULT 1,
  sort INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  /* Customer reviews */
  `CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  meta VARCHAR(255),
  quote TEXT NOT NULL,
  rating TINYINT NOT NULL DEFAULT 5,
  photo VARCHAR(500),
  published TINYINT NOT NULL DEFAULT 1,
  sort INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  /* About page — Meet our team */
  `CREATE TABLE IF NOT EXISTS team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(255),
  bio TEXT,
  photo VARCHAR(500),
  published TINYINT NOT NULL DEFAULT 1,
  sort INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  /* Simple key/value site settings (social links, home page options) */
  `CREATE TABLE IF NOT EXISTS settings (
  name VARCHAR(100) PRIMARY KEY,
  value TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

export const INDEXES = [
  `CREATE INDEX idx_products_category ON products(category_slug)`,
  `CREATE INDEX idx_enquiries_created ON enquiries(created_at)`,
];

/** Columns added after the first release — added to existing tables automatically. */
export const COLUMNS: { table: string; column: string; ddl: string }[] = [
  { table: "products", column: "extra_details", ddl: "LONGTEXT" },
  { table: "products", column: "access_modes", ddl: "LONGTEXT" },
  { table: "products", column: "colors", ddl: "LONGTEXT" },
  { table: "products", column: "size_chart", ddl: "LONGTEXT" },
  { table: "products", column: "best_seller", ddl: "TINYINT NOT NULL DEFAULT 0" },
];
