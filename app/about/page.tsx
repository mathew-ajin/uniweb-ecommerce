import AboutPage from "@/components/about/AboutPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <AboutPage />
    </Suspense>
  );
}
