"use client"
import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { useCart } from "@/context/CartContext";
import type { CheckoutStep } from "@/types/checkout";
import TopBar from "../layout/TopBar";
import MainHeader from "../layout/MainHeader";
import CheckoutStepper from "./CheckoutStepper";
import StepDetails from "./StepDetails";
import StepAddress from "./StepAddress";
import StepShipping from "./StepShipping";
import StepPayment from "./StepPayment";
import OrderSummary from "./OrderSummary";
import Footer from "../layout/Footer";

const pathToStep: Record<string, CheckoutStep> = {
  "/checkout/details": "details",
  "/checkout/address": "address",
  "/checkout/shipping": "shipping",
  "/checkout/payment": "payment",
};

const CheckoutPage = () => {
  const { lang } = useLocale();
  const { items } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const isAr = lang === "ar";

    //   const step = pathToStep[location.pathname] || "details";
    const step = pathToStep[pathname] || "details";

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainHeader />

      <main className="container py-6 md:py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            {isAr ? "الرئيسية" : "Home"}
          </Link>
          <ChevronRight size={12} />
          <Link href="/cart" className="hover:text-foreground">
            {isAr ? "السلة" : "Cart"}
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{isAr ? "إتمام الشراء" : "Checkout"}</span>
        </nav>

        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
          {isAr ? "إتمام الشراء" : "Checkout"}
        </h1>

        <CheckoutStepper current={step} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main form area */}
          <div className="lg:col-span-2">
            {step === "details" && <StepDetails />}
            {step === "address" && <StepAddress />}
            {step === "shipping" && <StepShipping />}
            {step === "payment" && <StepPayment />}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
