import type { Metadata } from "next";
import { ProductListing } from "@/components/ProductListing";
import { parseQuery } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "All Products",
  description: "Explore home lockers, digital access solutions, architectural hardware, kitchen & wardrobe fittings, bath and glass hardware.",
};

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const query = parseQuery(await searchParams);
  return <ProductListing query={query} basePath="/products" />;
}
