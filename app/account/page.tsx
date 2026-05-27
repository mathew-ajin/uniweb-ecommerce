import AccountPage from "@/features/Account/AccountPage";
import { Suspense } from "react";



export default function Page() {
  return (
    <Suspense>
      <AccountPage />
    </Suspense>
  );
}