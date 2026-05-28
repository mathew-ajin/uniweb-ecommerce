import PaymentHostedPage from "@/components/payment/PaymentHostedPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <PaymentHostedPage />
    </Suspense>
  );
}
