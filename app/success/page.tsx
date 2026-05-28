import CheckoutSuccessPage from "@/components/success/CheckoutSuccessPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <CheckoutSuccessPage />
    </Suspense>
  );
}
