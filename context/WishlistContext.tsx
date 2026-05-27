import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { StaticImageData } from "next/image";
const STORAGE_KEY = 'mayar_wishlist_v2';

export interface WishlistItem {
  id: string; // unique key: `${productId}` or `${productId}__${variantId}`
  productId: string;
  variantId?: string;
  name: { en: string; ar: string };
  brand?: { en: string; ar: string };
  colorName?: string;
  colorHex?: string;
  size?: string;
  image: string | StaticImageData;
  price: number;
  compareAtPrice?: number;
}

interface WishlistContextValue {
  items: WishlistItem[];
  isInWishlist: (productId: string, variantId?: string) => boolean;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isInWishlist = useCallback((productId: string, variantId?: string) => {
    if (variantId) {
      return items.some(i => i.productId === productId && i.variantId === variantId);
    }
    return items.some(i => i.productId === productId);
  }, [items]);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.filter(i => i.id !== item.id);
      return [...prev, item];
    });
  }, []);

  const clearWishlist = useCallback(() => setItems([]), []);

  return (
    <WishlistContext.Provider value={{ items, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
