import CareersPage from "@/components/careers/CareersPage";
import { Suspense } from "react";


export default function Page() {
  return (
    <Suspense>
      <CareersPage />
    </Suspense>
  );
}
