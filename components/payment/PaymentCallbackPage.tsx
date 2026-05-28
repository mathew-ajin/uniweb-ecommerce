/**
 * Payment Callback / Result Page
 *
 * Handles the redirect back from MyFatoorah hosted payment.
 * Reads paymentId + status from query string, verifies, and routes accordingly.
 */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock, AlertTriangle, Loader2, RotateCcw, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import TopBar from "@/components/layout/TopBar";
import MainHeader from "@/components/layout/MainHeader";
import Footer from "@/components/layout/Footer";
import { useLocale } from "@/hooks/useLocale";
import { useCart } from "@/context/CartContext";
import { useCheckout } from "@/context/CheckoutContext";
import { verifyMyFatoorahPayment, getPendingPayment, clearPendingPayment } from "@/services/payment/myfatoorahService";
import { createOrder } from "@/services/api/orderService";
import { shippingMethods, paymentMethods } from "@/data/mock/checkout";
import type { PaymentInvoiceStatus } from "@/types/payment";
import type { OrderRecord } from "@/types/order";

type PageState = "verifying" | "success" | "failed" | "pending" | "cancelled";

const PaymentCallbackPage = () => {
  const params = useSearchParams();
  const router = useRouter();
  const { lang, formatPrice } = useLocale();
  const { items, subtotal, discount, promoCode, promoApplied, clearCart } = useCart();
  const { state: checkoutState, resetCheckout } = useCheckout();
  const isAr = lang === "ar";

  const [pageState, setPageState] = useState<PageState>("verifying");
  const [order, setOrder] = useState<OrderRecord | null>(null);

  const paymentId = params.get("paymentId") || "";
  const statusParam = params.get("status") || "";

  useEffect(() => {
    const process = async () => {
      try {
        const result = await verifyMyFatoorahPayment(paymentId);
        const status = (statusParam || result.invoiceStatus) as PaymentInvoiceStatus;

        if (status === "PAID") {
          // Create order only on successful payment
          const pending = getPendingPayment();
          const ship = shippingMethods.find((m) => m.id === checkoutState.shippingMethodId) || shippingMethods[0];
          const pm = paymentMethods.find((m) => m.id === "myfatoorah") || paymentMethods[0];
          const shippingCost = ship.price;
          const total = subtotal - discount + shippingCost;

          const newOrder = await createOrder(checkoutState, items, ship, pm, {
            subtotal,
            discount,
            shippingCost,
            total,
            promoCode: promoApplied ? promoCode : undefined,
          });

          setOrder(newOrder);
          clearCart();
          resetCheckout();
          clearPendingPayment();
          setPageState("success");
        } else if (status === "PENDING") {
          setPageState("pending");
        } else if (status === "CANCELED") {
          setPageState("cancelled");
        } else {
          setPageState("failed");
        }
      } catch {
        setPageState("failed");
      }
    };

    process();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stateConfig: Record<
    Exclude<PageState, "verifying">,
    {
      icon: typeof CheckCircle;
      iconClass: string;
      bgClass: string;
      title: { en: string; ar: string };
      desc: { en: string; ar: string };
    }
  > = {
    success: {
      icon: CheckCircle,
      iconClass: "text-green-600",
      bgClass: "bg-green-50",
      title: { en: "Payment Successful!", ar: "تم الدفع بنجاح!" },
      desc: { en: "Your payment has been processed and your order is confirmed.", ar: "تمت معالجة الدفع وتم تأكيد طلبك." },
    },
    failed: {
      icon: XCircle,
      iconClass: "text-red-500",
      bgClass: "bg-red-50",
      title: { en: "Payment Failed", ar: "فشل الدفع" },
      desc: {
        en: "Your payment could not be processed. Please try again or use a different method.",
        ar: "لم يتم معالجة الدفع. يرجى المحاولة مرة أخرى أو استخدام طريقة أخرى.",
      },
    },
    pending: {
      icon: Clock,
      iconClass: "text-amber-500",
      bgClass: "bg-amber-50",
      title: { en: "Payment Pending", ar: "الدفع معلق" },
      desc: {
        en: "Your payment is being processed. We will notify you once it is confirmed.",
        ar: "جاري معالجة الدفع. سنعلمك فور تأكيده.",
      },
    },
    cancelled: {
      icon: AlertTriangle,
      iconClass: "text-gray-500",
      bgClass: "bg-gray-50",
      title: { en: "Payment Cancelled", ar: "تم إلغاء الدفع" },
      desc: {
        en: "You cancelled the payment. Your cart items are still saved.",
        ar: "لقد ألغيت الدفع. لا تزال سلة التسوق محفوظة.",
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainHeader />

      <main className="container py-10 md:py-16 max-w-lg mx-auto text-center">
        {pageState === "verifying" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20">
            <Loader2 size={40} className="animate-spin text-brand mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              {isAr ? "جاري التحقق من الدفع..." : "Verifying your payment..."}
            </p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {(() => {
              const cfg = stateConfig[pageState];
              const Icon = cfg.icon;
              return (
                <>
                  <div className={`w-20 h-20 rounded-full ${cfg.bgClass} flex items-center justify-center mx-auto mb-5`}>
                    <Icon size={40} className={cfg.iconClass} />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">{isAr ? cfg.title.ar : cfg.title.en}</h1>
                  <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">{isAr ? cfg.desc.ar : cfg.desc.en}</p>
                </>
              );
            })()}

            {/* Order info for success */}
            {pageState === "success" && order && (
              <div className="bg-card border border-border/50 rounded-lg p-5 mb-6 text-start">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">{isAr ? "رقم الطلب" : "Order Number"}</p>
                    <p className="font-bold text-foreground font-numeric">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{isAr ? "الإجمالي" : "Total Paid"}</p>
                    <p className="font-bold text-foreground font-numeric">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{isAr ? "رقم التتبع" : "Tracking ID"}</p>
                    <p className="font-bold text-foreground font-numeric">{order.trackingId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{isAr ? "الحالة" : "Status"}</p>
                    <span className="inline-flex text-[10px] font-bold uppercase bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                      {isAr ? "مدفوع" : "Paid"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment ref for pending */}
            {pageState === "pending" && paymentId && (
              <div className="bg-card border border-border/50 rounded-lg p-4 mb-6 text-xs">
                <span className="text-muted-foreground">{isAr ? "مرجع الدفع" : "Payment Ref"}: </span>
                <span className="font-bold text-foreground font-numeric">{paymentId}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {pageState === "success" && order && (
                <>
                  <button
                    onClick={() => router.push(`/checkout/success?orderId=${order.id}`)}
                    className="w-full sm:w-auto h-11 px-6 bg-brand text-brand-foreground font-semibold rounded-md hover:bg-brand/90 transition-colors text-sm"
                  >
                    {isAr ? "عرض تفاصيل الطلب" : "View Order Details"}
                  </button>
                  <Link
                    href="/shop"
                    className="w-full sm:w-auto h-11 px-6 border border-border text-foreground font-medium rounded-md hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingBag size={15} />
                    {isAr ? "متابعة التسوق" : "Continue Shopping"}
                  </Link>
                </>
              )}

              {(pageState === "failed" || pageState === "cancelled") && (
                <>
                  <button
                    onClick={() => router.push("/checkout/payment")}
                    className="w-full sm:w-auto h-11 px-6 bg-brand text-brand-foreground font-semibold rounded-md hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <RotateCcw size={15} />
                    {isAr ? "إعادة المحاولة" : "Retry Payment"}
                  </button>
                  <Link
                    href="/cart"
                    className="w-full sm:w-auto h-11 px-6 border border-border text-foreground font-medium rounded-md hover:bg-secondary transition-colors text-sm flex items-center justify-center"
                  >
                    {isAr ? "العودة للسلة" : "Back to Cart"}
                  </Link>
                </>
              )}

              {pageState === "pending" && (
                <>
                  <Link
                    href="/shop"
                    className="w-full sm:w-auto h-11 px-6 bg-brand text-brand-foreground font-semibold rounded-md hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingBag size={15} />
                    {isAr ? "متابعة التسوق" : "Continue Shopping"}
                  </Link>
                  <Link
                    href="/account"
                    className="w-full sm:w-auto h-11 px-6 border border-border text-foreground font-medium rounded-md hover:bg-secondary transition-colors text-sm flex items-center justify-center"
                  >
                    {isAr ? "حسابي" : "My Account"}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PaymentCallbackPage;
