import PaymentRedirectingPage from "@/components/payment/PaymentRedirectingPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <PaymentRedirectingPage />
    </Suspense>
  );
}
