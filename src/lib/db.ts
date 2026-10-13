import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { SCHEMA } from "./schema";
import { seedDatabase } from "./seed";

/**
 * SQLite database (single file, default ./data/elon.db).
 * Created and seeded automatically on first run from src/data/*.ts.
 */
export const DB_PATH = path.resolve(process.env.DATABASE_PATH || "./data/elon.db");



declare global {
  var __elonDb: Database.Database | undefined;
}

function open(): Database.Database {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM ranges").get() as { n: number };
  if (n === 0) seedDatabase(db);
  return db;
}

export function db(): Database.Database {
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
