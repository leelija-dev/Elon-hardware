import type { Metadata } from "next";
import { ProductListing } from "@/components/ProductListing";
import { facets, getProductOptions, getRanges, parseQuery, searchProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Products",
  description: "Explore home lockers, digital access solutions, architectural hardware, kitchen & wardrobe fittings, bath and glass hardware.",
};

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const query = parseQuery(await searchParams);
  const ranges = await getRanges();
  const result = await searchProducts({ ...query, perPage: 12 });
  const facetsData = await facets(query);
  const productOptions = await getProductOptions();
  return <ProductListing query={query} basePath="/products" ranges={ranges} result={result} facetsData={facetsData} productOptions={productOptions} />;
}
