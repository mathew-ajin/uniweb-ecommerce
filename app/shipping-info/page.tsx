import LegalPage from "@/components/shipping-info/LegalPage";
import { Suspense } from "react";


export default function Page() {
  return (
    <Suspense>
      <LegalPage />
    </Suspense>
  );
}
