import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/ProductListing";
import { facets, getProductOptions, getRange, getRanges, parseQuery, searchProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/products/[range]">): Promise<Metadata> {
  const r = await getRange((await params).range);
  return r ? { title: r.name, description: r.description } : {};
}

export default async function RangePage({ params, searchParams }: PageProps<"/products/[range]">) {
  const range = await getRange((await params).range);
  if (!range) notFound();
  const query = parseQuery(await searchParams, { range: range.slug });
  const ranges = await getRanges();
  const result = await searchProducts({ ...query, perPage: 12 });
  const facetsData = await facets(query);
  const productOptions = await getProductOptions();
  return <ProductListing query={query} range={range} basePath={`/products/${range.slug}`} ranges={ranges} result={result} facetsData={facetsData} productOptions={productOptions} />;
}
