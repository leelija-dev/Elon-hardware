import path from "node:path";

/** Admin uploads live here (default ./data/uploads) and are served at /uploads/... */
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "./data/uploads");
