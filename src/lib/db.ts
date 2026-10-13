import "server-only";
import fs from "node:fs";
import path from "node:path";
import { SCHEMA } from "./schema";
import { Database } from "./sqlite";
import { seedDatabase } from "./seed";

/**
 * SQLite database (single file, default ./data/elon.db).
 * Created and seeded automatically on first run from src/data/*.ts.
 */
export const DB_PATH = path.resolve(process.env.DATABASE_PATH || "./data/elon.db");



declare global {
  var __elonDb: Database | undefined;
}

function open(): Database {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM ranges").get() as { n: number };
  if (n === 0) seedDatabase(db);
  return db;
}

export function db(): Database {
  // Reuse one connection per server process (and across dev hot reloads).
  if (!globalThis.__elonDb) globalThis.__elonDb = open();
  return globalThis.__elonDb;
}

export const json = {
  parse<T>(v: unknown, fallback: T): T {
    if (typeof v !== "string" || !v) return fallback;
    try {
      return JSON.parse(v) as T;
    } catch {
      return fallback;
    }
  },
  str: (v: unknown) => JSON.stringify(v ?? null),
};
