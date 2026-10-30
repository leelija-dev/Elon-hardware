import "server-only";
import crypto from "node:crypto";
import { site } from "@/config/site";
import { getCategory, getProduct } from "./catalog";
import { db } from "./db";
import { DEMO_SLOTS, ENQUIRY_TYPES, type EnquiryData, type EnquiryType } from "./enquiry-schema";

export type EnquiryStatus = "new" | "contacted" | "closed";

export type StoredEnquiry = {
  id: string;
  createdAt: string;
  type: EnquiryType;
  name: string;
  phone: string;
  email?: string;
  city: string;
  pincode?: string;
  product?: string;
  productName?: string;
  interest?: string;
  slot?: keyof typeof DEMO_SLOTS;
  message?: string;
  whatsapp: boolean;
  page?: string;
  ip?: string;
  userAgent?: string;
  status: EnquiryStatus;
  notes?: string;
};

function newId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `EH-${date}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

/* ---------- small in-memory rate limiter (per server process) ---------- */
const hits = new Map<string, number[]>();
export function rateLimited(key: string, max = 6, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}

/* ---------- notification channels ---------- */

export function enquirySummary(e: StoredEnquiry) {
  const rows: [string, string | undefined][] = [
    ["Reference", e.id],
    ["Type", ENQUIRY_TYPES[e.type]],
    ["Product", e.productName ? `${e.productName} (${e.product})` : undefined],
    ["Interested in", e.interest],
    ["Name", e.name],
    ["Mobile", e.phone],
    ["Email", e.email],
    ["City", e.city],
    ["Pin code", e.pincode],
    ["Preferred slot", e.slot ? DEMO_SLOTS[e.slot] : undefined],
    ["WhatsApp updates", e.whatsapp ? "Yes" : "No"],
    ["Message", e.message],
    ["Submitted from", e.page],
    ["Received", new Date(e.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
  ];
  return rows
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

async function sendEmail(e: StoredEnquiry) {
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  await transporter.sendMail({
    from: process.env.ENQUIRY_FROM || `${site.name} Website <no-reply@localhost>`,
    to: process.env.ENQUIRY_TO,
    replyTo: e.email || undefined,
    subject: `New enquiry ${e.id}: ${ENQUIRY_TYPES[e.type]}${e.productName ? ` — ${e.productName}` : ""} (${e.city})`,
    text: enquirySummary(e),
  });
}

async function postWebhook(e: StoredEnquiry) {
  const res = await fetch(process.env.ENQUIRY_WEBHOOK_URL!, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...e, summary: enquirySummary(e) }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

/**
 * Saves the enquiry in the database, then notifies by email / webhook if configured.
 * The database write is the source of truth; notification failures are logged only.
 */
export async function submitEnquiry(data: EnquiryData, meta: { ip?: string; userAgent?: string }) {
  const product = data.product ? await getProduct(data.product) : null;
  const interestCat = data.interest ? await getCategory(data.interest) : null;
  const e: StoredEnquiry = {
    id: newId(),
    createdAt: new Date().toISOString(),
    type: data.type,
    name: data.name,
    phone: data.phone,
    email: data.email,
    city: data.city,
    pincode: data.pincode,
    product: product?.slug,
    productName: product?.name,
    interest: interestCat?.name ?? (product ? product.categoryName : data.interest),
    slot: data.type === "demo" ? data.slot : undefined,
    message: data.message,
    whatsapp: !!data.whatsapp,
    page: data.page,
    ip: meta.ip,
    userAgent: meta.userAgent?.slice(0, 250),
    status: "new",
  };

  await db()
    .prepare(
      `INSERT INTO enquiries (id,created_at,type,name,phone,email,city,pincode,product_slug,product_name,interest,slot,message,whatsapp,page,ip,user_agent,status)
       VALUES (@id,@createdAt,@type,@name,@phone,@email,@city,@pincode,@product,@productName,@interest,@slot,@message,@whatsapp,@page,@ip,@userAgent,'new')`,
    )
    .run({
      ...e,
      email: e.email ?? null,
      pincode: e.pincode ?? null,
      product: e.product ?? null,
      productName: e.productName ?? null,
      interest: e.interest ?? null,
      slot: e.slot ?? null,
      message: e.message ?? null,
      whatsapp: e.whatsapp ? 1 : 0,
      page: e.page ?? null,
      ip: e.ip ?? null,
      userAgent: e.userAgent ?? null,
    });

  const jobs: Promise<void>[] = [];
  if (process.env.SMTP_HOST && process.env.ENQUIRY_TO) jobs.push(sendEmail(e));
  if (process.env.ENQUIRY_WEBHOOK_URL) jobs.push(postWebhook(e));
  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === "rejected" && console.error(`[enquiry ${e.id}] notification failed:`, r.reason));
  return e;
}

type Row = Record<string, string | number | null>;
function toEnquiry(r: Row): StoredEnquiry {
  return {
    id: r.id as string,
    createdAt: r.created_at as string,
    type: r.type as EnquiryType,
    name: r.name as string,
    phone: r.phone as string,
    email: (r.email as string) || undefined,
    city: r.city as string,
    pincode: (r.pincode as string) || undefined,
    product: (r.product_slug as string) || undefined,
    productName: (r.product_name as string) || undefined,
    interest: (r.interest as string) || undefined,
    slot: (r.slot as StoredEnquiry["slot"]) || undefined,
    message: (r.message as string) || undefined,
    whatsapp: !!r.whatsapp,
    page: (r.page as string) || undefined,
    ip: (r.ip as string) || undefined,
    userAgent: (r.user_agent as string) || undefined,
    status: (r.status as EnquiryStatus) ?? "new",
    notes: (r.notes as string) || undefined,
  };
}

export async function listEnquiries(filter: { status?: string; q?: string } = {}): Promise<StoredEnquiry[]> {
  const where: string[] = [];
  const args: string[] = [];
  if (filter.status && ["new", "contacted", "closed"].includes(filter.status)) {
    where.push("status = ?");
    args.push(filter.status);
  }
  if (filter.q) {
    where.push("(name LIKE ? OR phone LIKE ? OR email LIKE ? OR city LIKE ? OR id LIKE ? OR product_name LIKE ?)");
    const like = `%${filter.q}%`;
    args.push(like, like, like, like, like, like);
  }
  const rows = await db()
    .prepare(`SELECT * FROM enquiries ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY created_at DESC`)
    .all(...args) as Row[];
  return rows.map(toEnquiry);
}

export async function enquiryCounts() {
  const rows = await db().prepare("SELECT status, COUNT(*) AS n FROM enquiries GROUP BY status").all() as {
    status: string;
    n: number;
  }[];
  const out = { new: 0, contacted: 0, closed: 0, all: 0 };
  for (const r of rows) {
    out[r.status as EnquiryStatus] = r.n;
    out.all += r.n;
  }
  return out;
}

export async function updateEnquiry(id: string, status: EnquiryStatus, notes?: string) {
  await db().prepare("UPDATE enquiries SET status = ?, notes = ? WHERE id = ?").run(status, notes ?? null, id);
}

export async function deleteEnquiry(id: string) {
  await db().prepare("DELETE FROM enquiries WHERE id = ?").run(id);
}
