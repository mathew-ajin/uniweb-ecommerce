import CartPage from "@/components/cart/CartPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <CartPage />
    </Suspense>
  );
}
