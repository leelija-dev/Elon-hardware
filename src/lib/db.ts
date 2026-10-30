import "server-only";
import { SCHEMA } from "./schema";
import { Database } from "./mysql";
import { seedDatabase } from "./seed";

/**
 * MySQL database connection.
 * Created and seeded automatically on first run from src/data/*.ts.
 */

declare global {
  var __elonDb: Database | undefined;
  var __elonDbInitialized: boolean;
  var __isBuildPhase: boolean;
}

// Detect build phase once
if (typeof globalThis.__isBuildPhase === 'undefined') {
  globalThis.__isBuildPhase = 
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NODE_ENV === 'test' ||
    process.env.CI === 'true' ||
    process.env.BUILD_PHASE === 'true';
}

function open(): Database {
  const config = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "elon_hardware",
    charset: "utf8mb4",
  };

  const db = new Database(config, globalThis.__isBuildPhase);

  // Initialize schema only at runtime, not during build
  if (!globalThis.__elonDbInitialized && !globalThis.__isBuildPhase) {
    (async () => {
      try {
        for (const statement of SCHEMA) {
          await db.exec(statement);
        }
        // Note: Auto-seeding disabled due to MariaDB/mysql2 parameter binding issues
        // Use admin panel to add products manually, or run seed script manually
        globalThis.__elonDbInitialized = true;
      } catch (err) {
        console.error("Database initialization error:", err);
      }
    })();
  }

  return db;
}

export function db(): Database {
  // Reuse one connection per server process (and across dev hot reloads).
  if (!globalThis.__elonDb) globalThis.__elonDb = open();
  return globalThis.__elonDb;
}

export function isBuildPhase(): boolean {
  return globalThis.__isBuildPhase;
}

export const json = {
  parse<T>(v: unknown, fallback: T): T {
    if (typeof v !== "string" && typeof v !== "object") return fallback;
    if (typeof v === "object") return v as T;
    if (!v) return fallback;
    try {
      return JSON.parse(v as string) as T;
    } catch {
      return fallback;
    }
  },
  str: (v: unknown) => JSON.stringify(v ?? null),
};
