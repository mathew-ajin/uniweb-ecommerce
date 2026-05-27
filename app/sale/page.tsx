import SalePage from "@/features/Sale/SalePage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <SalePage />
    </Suspense>
  );
}
