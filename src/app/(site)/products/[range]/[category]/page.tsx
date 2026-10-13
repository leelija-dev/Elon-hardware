import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/ProductListing";
import { getCategory, getRange, parseQuery } from "@/lib/catalog";

export async function generateMetadata({ params }: PageProps<"/products/[range]/[category]">): Promise<Metadata> {
  const c = getCategory((await params).category);
  return c ? { title: c.name, description: c.description } : {};
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/products/[range]/[category]">) {
  const p = await params;
  const range = getRange(p.range);
  const category = getCategory(p.category);
  if (!range || !category || category.range !== range.slug) notFound();
  const query = parseQuery(await searchParams, { range: range.slug, category: category.slug });
  return <ProductListing query={query} range={range} category={category} basePath={`/products/${range.slug}/${category.slug}`} />;
}
