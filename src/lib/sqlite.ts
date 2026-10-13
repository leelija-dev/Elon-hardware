import { DatabaseSync, type StatementSync } from "node:sqlite";

/**
 * Thin wrapper over Node's built-in SQLite (node:sqlite, Node 22.13+).
 * No native modules to compile — works the same on Windows, macOS and Linux hosting.
 */

type Param = string | number | bigint | null | Uint8Array;
type Bindable = Record<string, unknown> | unknown;

function clean(v: unknown): Param {
  if (v === undefined || v === null) return null;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "string" || typeof v === "number" || typeof v === "bigint" || v instanceof Uint8Array) return v;
  return JSON.stringify(v);
}

function bind(args: Bindable[]): Param[] | [Record<string, Param>] {
  if (args.length === 1 && args[0] && typeof args[0] === "object" && !(args[0] instanceof Uint8Array)) {
    const obj: Record<string, Param> = {};
    for (const [k, v] of Object.entries(args[0] as Record<string, unknown>)) obj[k] = clean(v);
    return [obj];
  }
  return args.map(clean);
}

export class Statement {
  constructor(private s: StatementSync) {
    s.setAllowUnknownNamedParameters(true);
  }
  get(...args: Bindable[]) {
    return this.s.get(...(bind(args) as Param[])) as Record<string, unknown> | undefined;
  }
  all(...args: Bindable[]) {
    return this.s.all(...(bind(args) as Param[])) as Record<string, unknown>[];
  }
  run(...args: Bindable[]) {
    return this.s.run(...(bind(args) as Param[]));
  }
}

export class Database {
  private db: DatabaseSync;
  constructor(file: string) {
    this.db = new DatabaseSync(file);
  }
  prepare(sql: string) {
    return new Statement(this.db.prepare(sql));
  }
  exec(sql: string) {
    this.db.exec(sql);
  }
  pragma(p: string) {
    this.db.exec(`PRAGMA ${p}`);
  }
  /** Returns a function that runs `fn` inside a transaction (like better-sqlite3). */
  transaction<T>(fn: () => T): () => T {
    return () => {
      this.db.exec("BEGIN");
      try {
        const r = fn();
        this.db.exec("COMMIT");
        return r;
      } catch (e) {
        this.db.exec("ROLLBACK");
        throw e;
      }
    };
  }
  close() {
    this.db.close();
  }
}
