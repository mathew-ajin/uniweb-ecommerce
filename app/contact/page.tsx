import ContactPage from "@/components/contact/ContactPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <ContactPage />
    </Suspense>
  );
}
