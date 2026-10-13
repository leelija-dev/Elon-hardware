/**
 * Re-creates the database from src/data (catalogue + products).
 *   npm run db:reset            → wipes products/categories/ranges and re-seeds (keeps enquiries)
 *   npm run db:reset -- --all   → deletes the whole database file, including enquiries
 */
import fs from "node:fs";
import path from "node:path";
import { SCHEMA } from "../src/lib/schema";
import { seedDatabase } from "../src/lib/seed";
import { Database } from "../src/lib/sqlite";

const file = path.resolve(process.env.DATABASE_PATH || "./data/elon.db");
const all = process.argv.includes("--all");

if (all) for (const f of [file, `${file}-wal`, `${file}-shm`]) if (fs.existsSync(f)) fs.rmSync(f);
fs.mkdirSync(path.dirname(file), { recursive: true });
const db = new Database(file);
db.pragma("foreign_keys = ON");
db.exec(SCHEMA);
db.transaction(() => {
  db.exec("DELETE FROM products; DELETE FROM categories; DELETE FROM ranges;");
})();
seedDatabase(db);
const n = (t: string) => (db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get() as { n: number }).n;
console.log(`Database ready at ${file}`);
console.log(`  ranges: ${n("ranges")}, categories: ${n("categories")}, products: ${n("products")}, enquiries: ${n("enquiries")}`);
db.pragma("journal_mode = DELETE");
db.close();
