import type { CartItem, CartState } from '@/types/cart';

const CART_STORAGE_KEY = 'mayar_cart';

export const loadCart = (): CartState => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { items: [], updatedAt: Date.now() };
};

export const saveCart = (state: CartState): void => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
};

export const getCartCount = (items: CartItem[]): number =>
  items.reduce((sum, i) => sum + i.quantity, 0);

export const getCartSubtotal = (items: CartItem[]): number =>
  items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

export const getCartTotal = (items: CartItem[]): number =>
  getCartSubtotal(items); // Future: add tax/shipping
