import mysql from "mysql2/promise";

/**
 * MySQL database wrapper (async).
 * Provides a similar interface to the SQLite wrapper for easier migration.
 */

type Param = string | number | boolean | null | Date;
type Bindable = Record<string, unknown> | unknown;

function clean(v: unknown): Param {
  if (v === undefined || v === null) return null;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "string" || typeof v === "number" || v instanceof Date) return v;
  return JSON.stringify(v);
}

function bind(args: Bindable[]): (Param[] | Record<string, Param>)[] {
  if (args.length === 1 && args[0] && typeof args[0] === "object" && !(args[0] instanceof Date)) {
    const obj: Record<string, Param> = {};
    for (const [k, v] of Object.entries(args[0] as Record<string, unknown>)) obj[k] = clean(v);
    return [obj];
  }
  return [args.map(clean)];
}

export class Statement {
  constructor(private sql: string, private pool: mysql.Pool, private isBuildPhase = false) {}

  async get(...args: Bindable[]): Promise<Record<string, unknown> | undefined> {
    if (this.isBuildPhase) return undefined;
    const conn = await this.pool.getConnection();
    try {
      const [rows] = await conn.execute(this.sql, bind(args));
      const result = rows as any[];
      return result.length > 0 ? result[0] : undefined;
    } finally {
      conn.release();
    }
  }

  async all(...args: Bindable[]): Promise<Record<string, unknown>[]> {
    if (this.isBuildPhase) return [];
    const conn = await this.pool.getConnection();
    try {
      const [rows] = await conn.execute(this.sql, bind(args));
      return rows as Record<string, unknown>[];
    } finally {
      conn.release();
    }
  }

  async run(...args: Bindable[]): Promise<mysql.ResultSetHeader> {
    if (this.isBuildPhase) return { affectedRows: 0, insertId: 0 } as mysql.ResultSetHeader;
    const conn = await this.pool.getConnection();
    try {
      const [result] = await conn.execute(this.sql, bind(args));
      return result as mysql.ResultSetHeader;
    } finally {
      conn.release();
    }
  }
}

export class Database {
  private pool: mysql.Pool;
  public isBuildPhase: boolean;

  constructor(config: mysql.ConnectionOptions, isBuildPhase = false) {
    this.isBuildPhase = isBuildPhase;
    this.pool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      namedPlaceholders: true,
    });
  }

  prepare(sql: string) {
    return new Statement(sql, this.pool, this.isBuildPhase);
  }

  async exec(sql: string) {
    const conn = await this.pool.getConnection();
    try {
      await conn.query(sql);
    } finally {
      conn.release();
    }
  }

  async pragma(p: string) {
    // MySQL doesn't use PRAGMA - this is a no-op for compatibility
    console.warn(`PRAGMA ${p} is not supported in MySQL`);
  }

  /** Returns a function that runs `fn` inside a transaction. */
  transaction<T>(fn: () => Promise<T>): () => Promise<T> {
    return async () => {
      const conn = await this.pool.getConnection();
      try {
        await conn.beginTransaction();
        const r = await fn();
        await conn.commit();
        return r;
      } catch (e) {
        await conn.rollback();
        throw e;
      } finally {
        conn.release();
      }
    };
  }

  async close() {
    await this.pool.end();
  }
}
