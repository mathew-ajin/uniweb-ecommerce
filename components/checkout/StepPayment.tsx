"use client"
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCheckout } from '@/context/CheckoutContext';
import { useCart } from '@/context/CartContext';
import { useLocale } from '@/hooks/useLocale';
import { shippingMethods } from '@/data/mock/checkout';
import { createMyFatoorahPayment } from '@/services/payment/myfatoorahService';
import { ArrowLeft, Shield, Loader2, Wallet } from 'lucide-react';

const StepPayment = () => {
  const { state, setPaymentMethod, setAgreedToTerms, resetCheckout } = useCheckout();
  const { items, subtotal, discount, promoCode, promoApplied } = useCart();
  const { t, formatPrice, lang } = useLocale();
  const router = useRouter();
  const isAr = lang === 'ar';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ship = shippingMethods.find(m => m.id === state.shippingMethodId);
  const shippingCost = ship?.price ?? 0;
  const total = subtotal - discount + shippingCost;

  // Auto-select MyFatoorah
  if (state.paymentMethodId !== 'myfatoorah') {
    setPaymentMethod('myfatoorah');
  }

  const placeOrder = async () => {
    setError('');
    if (!state.agreedToTerms) {
      setError(isAr ? 'يرجى الموافقة على الشروط والأحكام' : 'Please agree to Terms & Conditions');
      return;
    }

    setLoading(true);
    try {
      const orderId = crypto.randomUUID();
      const orderNumber = `MYR-${Date.now().toString(36).toUpperCase()}`;

      const result = await createMyFatoorahPayment({
        orderId,
        orderNumber,
        amount: total,
        currency: 'KWD',
        customerName: `${state.customer.firstName} ${state.customer.lastName}`,
        customerEmail: state.customer.email,
        customerMobile: state.customer.phone,
        callbackUrl: `${window.location.origin}/payment/callback`,
        errorUrl: `${window.location.origin}/payment/callback?status=FAILED`,
        items: items.map(item => ({
          name: t(item.name),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });

      // Redirect through interstitial then to hosted payment
      router.push(`/payment/redirecting?paymentUrl=${encodeURIComponent(result.paymentUrl)}`);
    } catch {
      setError(isAr ? 'فشل بدء الدفع. حاول مرة أخرى.' : 'Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* MyFatoorah — single payment method */}
      <div className="border-2 border-brand bg-brand/5 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-brand text-brand-foreground flex items-center justify-center flex-shrink-0">
            <Wallet size={18} />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-foreground">MyFatoorah</span>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isAr ? "دفع آمن عبر ماي فاتورة" : "Secure payment via MyFatoorah"}
            </p>
          </div>
          <Shield size={16} className="text-brand flex-shrink-0" />
        </div>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={state.agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-0.5 rounded border-border text-brand focus:ring-brand"
        />
        <span className="text-xs text-muted-foreground leading-relaxed">
          {isAr ? (
            <>
              أوافق على{" "}
              <Link href="/terms-conditions" target="_blank" className="text-brand underline hover:text-brand/80">
                الشروط والأحكام
              </Link>{" "}
              و{" "}
              <Link href="/privacy-policy" target="_blank" className="text-brand underline hover:text-brand/80">
                سياسة الخصوصية
              </Link>
            </>
          ) : (
            <>
              I agree to the{" "}
              <Link href="/terms-conditions" target="_blank" className="text-brand underline hover:text-brand/80">
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" target="_blank" className="text-brand underline hover:text-brand/80">
                Privacy Policy
              </Link>
            </>
          )}
        </span>
      </label>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/checkout/shipping")}
          className="h-11 px-5 border border-border text-foreground font-medium rounded-md hover:bg-secondary transition-colors flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} />
          {isAr ? "رجوع" : "Back"}
        </button>
        <button
          onClick={placeOrder}
          disabled={loading}
          className="flex-1 h-12 bg-brand text-brand-foreground font-semibold rounded-md hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {isAr ? "جاري التحويل للدفع..." : "Redirecting to payment..."}
            </>
          ) : (
            <>
              {isAr ? "ادفع الآن" : "Pay Now"} — {formatPrice(total)}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StepPayment;
