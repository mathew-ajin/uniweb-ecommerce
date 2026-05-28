/**
 * Payment Redirecting Interstitial Page
 *
 * Shown briefly while the app prepares the MyFatoorah payment session
 * and redirects the user to the hosted payment page.
 */
"use client"
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale } from "@/hooks/useLocale";

const PaymentRedirectingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLocale();
  const isAr = lang === "ar";

    //   const paymentUrl = (location.state as any)?.paymentUrl as string | undefined;
    const paymentUrl = searchParams.get("paymentUrl");

  useEffect(() => {
    if (paymentUrl) {
      // Small delay for UX, then redirect
      const timer = setTimeout(() => {
        router.replace(paymentUrl);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [paymentUrl, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-5">
          <Shield size={28} className="text-brand" />
        </div>
        <Loader2 size={24} className="animate-spin text-brand mx-auto mb-4" />
        <h2 className="text-lg font-bold text-foreground mb-2">
          {isAr ? "جاري التحويل للدفع الآمن..." : "Redirecting to secure payment..."}
        </h2>
        <p className="text-xs text-muted-foreground">
          {isAr
            ? "يتم تحويلك إلى بوابة MyFatoorah الآمنة. لا تغلق هذه الصفحة."
            : "You are being redirected to the MyFatoorah secure gateway. Please do not close this page."}
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentRedirectingPage;
