import { fullCategories } from "@/data/mock/categories";
import ShopPage from "@/features/shop/ShopPage";
import { Suspense } from "react";

export function generateStaticParams() {
  return fullCategories.map((category) => ({
    categorySlug: category.slug,
  }));
}

export default function Page() {
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  );
}
