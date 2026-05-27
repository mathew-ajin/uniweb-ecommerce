import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { CartItem } from '@/types/cart';
import type { ProductItem } from '@/types/product';
import { loadCart, saveCart, getCartCount, getCartSubtotal, getCartTotal } from '@/services/api/cartService';
import { toast } from '@/hooks/use-toast';
import type { StaticImageData } from "next/image";
interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode: string;
  promoApplied: boolean;
  promoError: string;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addToCart: (product: ProductItem, opts?: { colorId?: string; sizeId?: string; quantity?: number }) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => void;
  removePromo: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => loadCart().items);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const VALID_PROMOS: Record<string, number> = { 'MAYAR10': 0.10, 'WELCOME20': 0.20, 'VIP15': 0.15 };

  useEffect(() => {
    saveCart({ items, updatedAt: Date.now() });
  }, [items]);

  const addToCart = useCallback((product: ProductItem, opts?: { colorId?: string; sizeId?: string; quantity?: number }) => {
    const qty = opts?.quantity || 1;
    const color = product.colors.find(c => c.id === opts?.colorId);
    const size = product.sizes.find(s => s.id === opts?.sizeId);
    const variant = product.variants.find(v =>
      v.colorId === (opts?.colorId || '') && (!opts?.sizeId || v.sizeId === opts.sizeId)
    );
    const colorImg = opts?.colorId ? product.images.find(i => i.colorId === opts.colorId) : null;
    const primaryImg = colorImg || product.images.find(i => i.isPrimary) || product.images[0];
    const lineId = `${product.id}_${opts?.colorId || 'default'}_${opts?.sizeId || 'default'}`;

    setItems(prev => {
      const existing = prev.find(i => i.id === lineId);
      if (existing) {
        return prev.map(i =>
          i.id === lineId
            ? { ...i, quantity: Math.min(i.quantity + qty, i.maxQuantity) }
            : i
        );
      }
      const newItem: CartItem = {
        id: lineId,
        productId: product.id,
        variantId: variant?.id,
        name: product.name,
        image: primaryImg?.url || '',
        brand: product.brand,
        color: color?.name?.en,
        colorHex: color?.hex,
        size: size?.label,
        quantity: qty,
        unitPrice: variant?.price || product.basePrice,
        compareAtPrice: variant?.compareAtPrice || product.compareAtPrice,
        inStock: product.inStock,
        maxQuantity: variant?.stock || size?.stock || 99,
      };
      return [...prev, newItem];
    });

    toast({
      title: 'Added to Cart',
      description: product.name.en,
      duration: 2500,
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.id !== itemId));
      return;
    }
    setItems(prev => prev.map(i =>
      i.id === itemId ? { ...i, quantity: Math.min(quantity, i.maxQuantity) } : i
    ));
  }, []);

  const clearCart = useCallback(() => { setItems([]); removePromo(); }, []);

  const applyPromo = useCallback((code: string) => {
    const upper = code.trim().toUpperCase();
    if (VALID_PROMOS[upper]) {
      setPromoCode(upper);
      setPromoApplied(true);
      setPromoError('');
      toast({ title: 'Promo Applied', description: `${Math.round(VALID_PROMOS[upper] * 100)}% discount applied`, duration: 2500 });
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied(false);
    }
  }, []);

  const removePromo = useCallback(() => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoError('');
  }, []);

  const count = getCartCount(items);
  const subtotal = getCartSubtotal(items);
  const discountRate = promoApplied && VALID_PROMOS[promoCode] ? VALID_PROMOS[promoCode] : 0;
  const discount = subtotal * discountRate;
  const shipping = subtotal > 0 ? (subtotal >= 15 ? 0 : 2.5) : 0; // Free shipping over 15 KWD
  const total = subtotal - discount + shipping;

  return (
    <CartContext.Provider value={{ items, count, subtotal, discount, shipping, total, promoCode, promoApplied, promoError, drawerOpen, setDrawerOpen, addToCart, removeFromCart, updateQuantity, clearCart, applyPromo, removePromo }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
