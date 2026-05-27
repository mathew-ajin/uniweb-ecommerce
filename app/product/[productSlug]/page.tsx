import ProductPage from "@/features/Product/ProductPage";
import { Suspense } from "react";
import { products } from "@/data/mock/products";

export function generateStaticParams() {
  return products.map((product) => ({
    productSlug: product.slug,
  }));
}

export default function Page() {
  return (
    <Suspense>
      <ProductPage />
    </Suspense>
  );
}
