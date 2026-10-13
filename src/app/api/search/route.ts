import { NextResponse, type NextRequest } from "next/server";
import { searchProducts } from "@/lib/catalog";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 80);
  const limit = Math.min(Math.max(Number(req.nextUrl.searchParams.get("limit")) || 6, 1), 24);
  const { items, total } = searchProducts({ q, perPage: limit });
  return NextResponse.json({
    total,
    items: items.map((p) => ({
      slug: p.slug,
      name: p.name,
      subtitle: p.subtitle,
      category: p.categoryName,
      image: p.images[0] ?? null,
    })),
  });
}
