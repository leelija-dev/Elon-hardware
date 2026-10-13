import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/ProductListing";
import { getRange, parseQuery } from "@/lib/catalog";

export async function generateMetadata({ params }: PageProps<"/products/[range]">): Promise<Metadata> {
  const r = getRange((await params).range);
  return r ? { title: r.name, description: r.description } : {};
}

export default async function RangePage({ params, searchParams }: PageProps<"/products/[range]">) {
  const range = getRange((await params).range);
  if (!range) notFound();
  const query = parseQuery(await searchParams, { range: range.slug });
  return <ProductListing query={query} range={range} basePath={`/products/${range.slug}`} />;
}
