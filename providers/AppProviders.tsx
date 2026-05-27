"use client";

import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";

import { LocaleProvider } from "@/hooks/useLocale";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
import { TrackingPopupProvider } from "@/context/TrackingPopupContext";
import { WishlistProvider } from "@/context/WishlistContext";

import CartDrawer from "@/components/cart/CartDrawer";
import TrackingPopupGlobal from "@/components/tracking/TrackingPopupGlobal";

import HomeOnlyTrackingBar from "@/components/tracking/HomeOnlyTrackingBar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <CheckoutProvider>
                <TrackingPopupProvider>
                  <TooltipProvider>
                    {children}

                    <Toaster />
                    <Sonner />

                    <HomeOnlyTrackingBar />
                    <CartDrawer />
                    <TrackingPopupGlobal />
                  </TooltipProvider>
                </TrackingPopupProvider>
              </CheckoutProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}
