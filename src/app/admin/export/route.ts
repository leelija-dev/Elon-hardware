import { isAdmin } from "@/lib/auth";
import { listEnquiries } from "@/lib/enquiries";
import { DEMO_SLOTS, ENQUIRY_TYPES } from "@/lib/enquiry-schema";

export async function GET(req: Request) {
  if (!(await isAdmin())) return new Response("Unauthorised", { status: 401 });
  const status = new URL(req.url).searchParams.get("status") ?? undefined;
  const rows = listEnquiries({ status });
  const head = ["Reference", "Received", "Type", "Status", "Name", "Mobile", "Email", "City", "Pin code", "Product", "Interest", "Demo slot", "WhatsApp", "Message", "Notes", "Page"];
  // Prefix formula-like values so spreadsheets don't execute them.
  const cell = (v: unknown) => {
    let s = v === undefined || v === null ? "" : String(v);
    if (/^[=+\-@]/.test(s)) s = "'" + s;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const lines = rows.map((e) =>
    [e.id, e.createdAt, ENQUIRY_TYPES[e.type], e.status, e.name, e.phone, e.email, e.city, e.pincode, e.productName, e.interest, e.slot ? DEMO_SLOTS[e.slot] : "", e.whatsapp ? "Yes" : "No", e.message, e.notes, e.page]
      .map(cell)
      .join(","),
  );
  const body = "﻿" + [head.map(cell).join(","), ...lines].join("\r\n");
  return new Response(body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="elon-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
