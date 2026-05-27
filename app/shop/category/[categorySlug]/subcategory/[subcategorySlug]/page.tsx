import { fullCategories } from "@/data/mock/categories";
import ShopPage from "@/features/shop/ShopPage";
import { Suspense } from "react";

export function generateStaticParams() {
  const params: { categorySlug: string; subcategorySlug: string }[] = [];
  
  fullCategories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      params.push({
        categorySlug: category.slug,
        subcategorySlug: subcategory.slug,
      });
    });
  });

  return params;
}

export default function Page() {
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  );
}
