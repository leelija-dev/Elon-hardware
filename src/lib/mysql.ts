import mysql from "mysql2/promise";

/**
 * MySQL / MariaDB wrapper (async) with the same call style as the old SQLite wrapper:
 *   db().prepare("… WHERE slug = @slug").get({ slug })   // named
 *   db().prepare("… WHERE slug = ?").get(slug)           // positional
 *
 * Fixes vs. the first MySQL version:
 *  - `@name` placeholders are translated to mysql2's `:name` syntax (mysql2 does not understand `@name`,
 *    which is why adding products / categories failed after switching database).
 *  - ISO date strings / Date objects are written as `YYYY-MM-DD HH:MM:SS` (UTC) so strict mode accepts them,
 *    and DATETIME columns are read back as ISO strings (`…T…Z`), exactly like before.
 *  - Every query waits until the schema has been created / migrated (no start-up race).
 */

type Param = string | number | null;
type Bindable = Record<string, unknown> | unknown;

const ISO = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(?:\.\d+)?Z$/;

function toMysqlDate(d: Date) {
  return d.toISOString().slice(0, 19).replace("T", " ");
}

function clean(v: unknown): Param {
  if (v === undefined || v === null) return null;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "bigint") return Number(v);
  if (v instanceof Date) return toMysqlDate(v);
  if (typeof v === "string") {
    const m = ISO.exec(v);
    return m ? `${m[1]} ${m[2]}` : v;
  }
  return JSON.stringify(v);
}

/** `@name` → `:name` (mysql2 named placeholders). */
function toSql(sql: string) {
  return sql.replace(/@([A-Za-z_][A-Za-z0-9_]*)/g, ":$1");
}

function bind(args: Bindable[]): Param[] | Record<string, Param> {
  if (args.length === 1 && args[0] && typeof args[0] === "object" && !(args[0] instanceof Date)) {
    const obj: Record<string, Param> = {};
    for (const [k, v] of Object.entries(args[0] as Record<string, unknown>)) obj[k] = clean(v);
    return obj;
  }
  return args.map(clean);
}

export type Row = Record<string, unknown>;

export class Statement {
  private sql: string;
  constructor(
    sql: string,
    private database: Database,
  ) {
    this.sql = toSql(sql);
  }

  private async run_(args: Bindable[]) {
    if (this.database.isBuildPhase) return null;
    await this.database.ready();
    const [result] = await this.database.pool.execute(this.sql, bind(args));
    return result;
  }

  async get(...args: Bindable[]): Promise<Row | undefined> {
    const rows = (await this.run_(args)) as Row[] | null;
    return rows && rows.length ? rows[0] : undefined;
  }

  async all(...args: Bindable[]): Promise<Row[]> {
    return ((await this.run_(args)) as Row[] | null) ?? [];
  }

  async run(...args: Bindable[]): Promise<mysql.ResultSetHeader> {
    return ((await this.run_(args)) as mysql.ResultSetHeader | null) ?? ({ affectedRows: 0, insertId: 0 } as mysql.ResultSetHeader);
  }
}

export class Database {
  readonly pool: mysql.Pool;
  readonly isBuildPhase: boolean;
  private gate: () => Promise<void>;

  constructor(config: mysql.PoolOptions | mysql.Pool, isBuildPhase = false, gate?: () => Promise<void>) {
    this.isBuildPhase = isBuildPhase;
    this.gate = gate ?? (() => Promise.resolve());
    this.pool =
      "getConnection" in config && typeof config.getConnection === "function"
        ? (config as mysql.Pool)
        : mysql.createPool({
            ...(config as mysql.PoolOptions),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            namedPlaceholders: true,
            timezone: "Z",
            typeCast(field, next) {
              if (field.type === "DATETIME" || field.type === "TIMESTAMP") {
                const v = field.string();
                return v ? `${v.replace(" ", "T").slice(0, 19)}Z` : null;
              }
              if (field.type === "DATE") return field.string();
              return next();
            },
          });
  }

  /** Same pool, but queries do not wait for the start-up gate (used by the migration itself). */
  ungated() {
    return new Database(this.pool, this.isBuildPhase);
  }

  setGate(gate: () => Promise<void>) {
    this.gate = gate;
  }

  ready() {
    return this.gate();
  }

  prepare(sql: string) {
    return new Statement(sql, this);
  }

  async exec(sql: string) {
    if (this.isBuildPhase) return;
    await this.ready();
    await this.pool.query(sql);
  }

  /** Runs `fn` with a dedicated connection inside a transaction. */
  async transaction<T>(fn: (conn: mysql.PoolConnection) => Promise<T>): Promise<T> {
    await this.ready();
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();
      const r = await fn(conn);
      await conn.commit();
      return r;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

  async close() {
    await this.pool.end();
  }
}
