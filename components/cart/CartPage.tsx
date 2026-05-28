"use client"
import { useState } from "react";
import  Link  from "next/link";
import { ChevronRight, Minus, Plus, Trash2, ShoppingBag, Tag, X, ArrowRight, CreditCard, ShieldCheck } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import MainHeader from "@/components/layout/MainHeader";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { useLocale } from "@/hooks/useLocale";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

const paymentMethods = ["KNET", "Visa", "Mastercard", "MyFatoorah"];

const CartPage = () => {
  const { t, formatPrice, lang } = useLocale();
  const {
    items,
    count,
    subtotal,
    discount,
    shipping,
    total,
    promoCode,
    promoApplied,
    promoError,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromo,
    removePromo,
  } = useCart();
  const [promoInput, setPromoInput] = useState("");

  const isAr = lang === "ar";

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainHeader />
      <NavBar />

      <main className="container py-6 md:py-10 relative z-[65]">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            {isAr ? "الرئيسية" : "Home"}
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{isAr ? "سلة التسوق" : "Shopping Cart"}</span>
        </nav>

        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
          {isAr ? "سلة التسوق" : "Shopping Cart"}
          {count > 0 && (
            <span className="text-base font-normal text-muted-foreground ms-2">
              ({count} {isAr ? "منتج" : count === 1 ? "item" : "items"})
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          /* ---- Empty State ---- */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
              <ShoppingBag size={40} strokeWidth={1.2} className="text-muted-foreground" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
              {isAr ? "سلتك فارغة" : "Your cart is empty"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {isAr
                ? "يبدو أنك لم تضف أي منتجات بعد. تصفح مجموعتنا المميزة!"
                : "Looks like you haven't added anything yet. Browse our premium collection!"}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 h-11 px-8 bg-brand text-brand-foreground font-medium rounded-md hover:bg-brand/90 transition-colors text-sm"
            >
              {isAr ? "تصفح المتجر" : "Continue Shopping"}
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* ---- Cart Content ---- */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Header row - desktop */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
                <span>{isAr ? "المنتج" : "Product"}</span>
                <span className="text-center">{isAr ? "السعر" : "Price"}</span>
                <span className="text-center">{isAr ? "الكمية" : "Quantity"}</span>
                <span className="text-end">{isAr ? "المجموع" : "Total"}</span>
                <span className="w-8" />
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-card border border-border/50 rounded-lg p-4 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:gap-4 md:items-center"
                >
                  {/* Product info */}
                  <div className="flex gap-4">
                    <div className="w-20 h-24 md:w-24 md:h-28 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                      <Image src={item.image} alt={t(item.name)} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      {item.brand && (
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{t(item.brand)}</p>
                      )}
                      <Link
                        href={`/product/${item.productId}`}
                        className="text-sm font-medium text-foreground hover:text-brand transition-colors line-clamp-2"
                      >
                        {t(item.name)}
                      </Link>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-muted-foreground">
                        {item.color && (
                          <span className="flex items-center gap-1">
                            {item.colorHex && (
                              <span
                                className="w-3 h-3 rounded-full border border-border"
                                style={{ backgroundColor: item.colorHex }}
                              />
                            )}
                            {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span>
                            {isAr ? "المقاس" : "Size"}: {item.size}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="hidden md:block text-center">
                    <span className="text-sm font-medium text-foreground">{formatPrice(item.unitPrice)}</span>
                    {item.compareAtPrice && (
                      <span className="block text-[11px] text-muted-foreground line-through">
                        {formatPrice(item.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  {/* Quantity stepper */}
                  <div className="flex items-center justify-between md:justify-center mt-3 md:mt-0">
                    <span className="md:hidden text-xs text-muted-foreground">{isAr ? "الكمية" : "Qty"}</span>
                    <div className="inline-flex items-center border border-border rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-secondary transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-9 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-secondary transition-colors"
                        aria-label="Increase"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="flex items-center justify-between md:justify-end mt-3 md:mt-0">
                    <span className="md:hidden text-xs text-muted-foreground">{isAr ? "المجموع" : "Total"}</span>
                    <span className="text-sm font-bold text-foreground">{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>

                  {/* Remove */}
                  <div className="hidden md:flex justify-center">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Mobile remove */}
                  <div className="flex md:hidden justify-end mt-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                      {isAr ? "إزالة" : "Remove"}
                    </button>
                  </div>
                </div>
              ))}

              {/* Cart actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                <Link
                  href="/shop"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight size={14} className="rotate-180" />
                  {isAr ? "متابعة التسوق" : "Continue Shopping"}
                </Link>
                <button
                  onClick={clearCart}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  {isAr ? "إفراغ السلة" : "Clear Cart"}
                </button>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border/50 rounded-lg p-5 sticky top-24 space-y-5">
                <h2 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-3">
                  {isAr ? "ملخص الطلب" : "Order Summary"}
                </h2>

                {/* Promo code */}
                <div>
                  {promoApplied ? (
                    <div className="flex items-center justify-between bg-brand/5 border border-brand/20 rounded-md px-3 py-2">
                      <span className="flex items-center gap-1.5 text-sm text-brand font-medium">
                        <Tag size={14} />
                        {promoCode}
                      </span>
                      <button onClick={removePromo} className="p-0.5 text-muted-foreground hover:text-destructive">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder={isAr ? "رمز الخصم" : "Promo code"}
                          className="flex-1 h-9 px-3 bg-secondary border-0 rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <button
                          onClick={() => {
                            applyPromo(promoInput);
                          }}
                          className="h-9 px-4 bg-header text-header-foreground text-sm font-medium rounded-md hover:bg-header/90 transition-colors"
                        >
                          {isAr ? "تطبيق" : "Apply"}
                        </button>
                      </div>
                      {promoError && <p className="text-xs text-destructive">{promoError}</p>}
                      <p className="text-[10px] text-muted-foreground">
                        {isAr ? "جرّب: MAYAR10, WELCOME20, VIP15" : "Try: MAYAR10, WELCOME20, VIP15"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Summary lines */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                    <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-brand">
                      <span>{isAr ? "الخصم" : "Discount"}</span>
                      <span className="font-medium">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isAr ? "الشحن" : "Shipping"}</span>
                    <span className="font-medium text-foreground">
                      {shipping === 0 ? (isAr ? "مجاني" : "Free") : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping === 0 && subtotal > 0 && (
                    <p className="text-[10px] text-brand">
                      {isAr ? "شحن مجاني للطلبات فوق 15 د.ك" : "Free shipping on orders over KWD 15"}
                    </p>
                  )}
                  <div className="flex justify-between pt-3 border-t border-border text-base">
                    <span className="font-semibold text-foreground">{isAr ? "الإجمالي" : "Total"}</span>
                    <span className="font-bold text-foreground">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout button */}
                <Link
                  href="/checkout/details"
                  className="flex items-center justify-center gap-2 w-full h-12 bg-brand text-brand-foreground font-medium rounded-md hover:bg-brand/90 transition-colors text-sm"
                >
                  {isAr ? "إتمام الشراء" : "Proceed to Checkout"}
                  <ArrowRight size={16} />
                </Link>

                {/* Security + payment */}
                <div className="space-y-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck size={14} className="text-brand flex-shrink-0" />
                    {isAr ? "دفع آمن ومشفّر" : "Secure & encrypted checkout"}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CreditCard size={14} className="text-brand flex-shrink-0" />
                    {isAr ? "طرق الدفع المقبولة" : "Accepted payments"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethods.map((m) => (
                      <span
                        key={m}
                        className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-1 rounded"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
