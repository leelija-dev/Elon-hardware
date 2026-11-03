import "server-only";
import { COLUMNS, INDEXES, SCHEMA } from "./schema";
import { Database } from "./mysql";
import { seedDatabase, seedSlides } from "./seed";

/**
 * MySQL / MariaDB connection (settings in .env: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME).
 * On first use the tables are created, new columns are added to older tables, and an empty database
 * is filled with the starter catalogue. Every query waits for this to finish.
 */

declare global {
  var __elonDb: Database | undefined;
  var __elonDbInit: Promise<void> | undefined;
  var __isBuildPhase: boolean;
}

if (typeof globalThis.__isBuildPhase === "undefined") {
  globalThis.__isBuildPhase =
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NODE_ENV === "test" ||
    process.env.CI === "true" ||
    process.env.BUILD_PHASE === "true";
}

const IGNORABLE = new Set(["ER_DUP_KEYNAME", "ER_DUP_FIELDNAME"]);

async function migrate(raw: Database) {
  for (const sql of SCHEMA) await raw.exec(sql);
  for (const sql of INDEXES) {
    try {
      await raw.exec(sql);
    } catch (e) {
      if (!IGNORABLE.has((e as { code?: string }).code ?? "")) throw e;
    }
  }
  for (const c of COLUMNS) {
    const exists = await raw
      .prepare(
        "SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
      )
      .get(c.table, c.column);
    if (!exists) {
      try {
        await raw.exec(`ALTER TABLE ${c.table} ADD COLUMN ${c.column} ${c.ddl}`);
      } catch (e) {
        if (!IGNORABLE.has((e as { code?: string }).code ?? "")) throw e;
      }
    }
  }

  const flag = async (name: string) => !!(await raw.prepare("SELECT 1 FROM settings WHERE name = ?").get(name));
  const setFlag = (name: string) =>
    raw.prepare("INSERT INTO settings (name, value) VALUES (?, '1') ON DUPLICATE KEY UPDATE value = '1'").run(name);

  // Starter catalogue — only into an empty database.
  const ranges = (await raw.prepare("SELECT COUNT(*) AS n FROM ranges").get()) as { n: number };
  if (Number(ranges.n) === 0 && !(await flag("seeded_catalogue"))) {
    await seedDatabase(raw);
    await setFlag("seeded_catalogue");
  }
  // Starter home page slides — once (deleting all slides later will not bring them back).
  if (!(await flag("seeded_slides"))) {
    const slides = (await raw.prepare("SELECT COUNT(*) AS n FROM slides").get()) as { n: number };
    if (Number(slides.n) === 0) await seedSlides(raw);
    await setFlag("seeded_slides");
  }
}

function open(): Database {
  const db = new Database(
    {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "elon_hardware",
      charset: "utf8mb4",
    },
    globalThis.__isBuildPhase,
  );
  const raw = db.ungated();
  db.setGate(() => {
    if (!globalThis.__elonDbInit) {
      globalThis.__elonDbInit = migrate(raw).catch((err) => {
        console.error("Database initialisation failed:", err);
        globalThis.__elonDbInit = undefined; // retry on the next request
        throw err;
      });
    }
    return globalThis.__elonDbInit;
  });
  return db;
}

export function db(): Database {
  // Reuse one pool per server process (and across dev hot reloads).
  if (!globalThis.__elonDb) globalThis.__elonDb = open();
  return globalThis.__elonDb;
}

export function isBuildPhase(): boolean {
  return globalThis.__isBuildPhase;
}

export const json = {
  parse<T>(v: unknown, fallback: T): T {
    if (v === null || v === undefined || v === "") return fallback;
    if (typeof v === "object") return v as T;
    if (typeof v !== "string") return fallback;
    try {
      const parsed = JSON.parse(v);
      return (parsed ?? fallback) as T;
    } catch {
      return fallback;
    }
  },
  str: (v: unknown) => JSON.stringify(v ?? null),
};
