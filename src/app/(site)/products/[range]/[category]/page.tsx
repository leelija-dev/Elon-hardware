import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/ProductListing";
import { facets, getCategory, getProductOptions, getRange, getRanges, parseQuery, searchProducts } from "@/lib/catalog";

export async function generateMetadata({ params }: PageProps<"/products/[range]/[category]">): Promise<Metadata> {
  const c = await getCategory((await params).category);
  return c ? { title: c.name, description: c.description } : {};
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/products/[range]/[category]">) {
  const p = await params;
  const range = await getRange(p.range);
  const category = await getCategory(p.category);
  if (!range || !category || category.range !== range.slug) notFound();
  const query = parseQuery(await searchParams, { range: range.slug, category: category.slug });
  const ranges = await getRanges();
  const result = await searchProducts({ ...query, perPage: 12 });
  const facetsData = await facets(query);
  const productOptions = await getProductOptions();
  return <ProductListing query={query} range={range} category={category} basePath={`/products/${range.slug}/${category.slug}`} ranges={ranges} result={result} facetsData={facetsData} productOptions={productOptions} />;
}
