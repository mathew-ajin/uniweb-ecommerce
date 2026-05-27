"use client";

import { usePathname } from "next/navigation";

import FloatingTrackingBar from "./FloatingTrackingBar";

export default function HomeOnlyTrackingBar() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return <FloatingTrackingBar />;
}
