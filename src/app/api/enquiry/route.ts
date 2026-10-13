import { NextResponse, type NextRequest } from "next/server";
import { enquirySchema } from "@/lib/enquiry-schema";
import { rateLimited, submitEnquiry } from "@/lib/enquiries";

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    // Honeypot hit: pretend success so bots learn nothing.
    if (fieldErrors.company) return NextResponse.json({ ok: true, id: "EH-RECEIVED" });
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries from this connection. Please call us or try again later." },
      { status: 429 },
    );
  }

  try {
    const saved = await submitEnquiry(parsed.data, { ip, userAgent: req.headers.get("user-agent") ?? undefined });
    return NextResponse.json({ ok: true, id: saved.id });
  } catch (err) {
    console.error("[enquiry] failed", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't send your enquiry right now. Please try again or call us." },
      { status: 500 },
    );
  }
}
