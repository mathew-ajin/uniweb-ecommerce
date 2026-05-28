import PaymentCallbackPage from "@/components/payment/PaymentCallbackPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <PaymentCallbackPage />
    </Suspense>
  );
}
