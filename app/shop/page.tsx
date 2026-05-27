// "use client";



import ShopPage from "@/features/shop/ShopPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPage />
    </Suspense>
  );
}
