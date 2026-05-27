import type { OrderRecord, PaymentResult } from '@/types/order';
import type { CartItem } from '@/types/cart';
import type { CheckoutState } from '@/types/checkout';
import type { ShippingMethod, PaymentMethod } from '@/types/checkout';

const ORDERS_KEY = 'mayar_orders';

// ── Helpers ──

const generateOrderNumber = (): string => {
  const prefix = 'MYR';
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
};

const generateTrackingId = (): string => {
  const prefix = 'TRK';
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${rand}`;
};

// ── Local storage ──

const loadOrders = (): OrderRecord[] => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

const saveOrders = (orders: OrderRecord[]): void => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

// ── Mock payment processing ──
// Future: replace with real gateway SDK (KNET / MyFatoorah / Stripe)

export const processPayment = async (
  paymentMethodId: string,
  _total: number
): Promise<PaymentResult> => {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 1200));

  // Mock: always succeed for now
  return {
    success: true,
    transactionId: `TXN-${Date.now().toString(36).toUpperCase()}`,
    gateway: paymentMethodId,
  };
};

// ── Order creation ──
// Future: POST /api/orders

export const createOrder = async (
  checkoutState: CheckoutState,
  cartItems: CartItem[],
  shippingMethod: ShippingMethod,
  paymentMethod: PaymentMethod,
  totals: { subtotal: number; discount: number; shippingCost: number; total: number; promoCode?: string }
): Promise<OrderRecord> => {
  // Simulate API call
  await new Promise(r => setTimeout(r, 800));

  const order: OrderRecord = {
    id: crypto.randomUUID(),
    orderNumber: generateOrderNumber(),
    trackingId: generateTrackingId(),
    createdAt: new Date().toISOString(),
    items: cartItems.map(item => ({
      productId: item.productId,
      name: item.name,
      image: typeof item.image === 'string' ? item.image : (item.image as any)?.src || '',
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.unitPrice * item.quantity,
    })),
    customer: { ...checkoutState.customer },
    address: {
      area: checkoutState.address.area,
      block: checkoutState.address.block,
      street: checkoutState.address.street,
      building: checkoutState.address.building,
      floor: checkoutState.address.floor || undefined,
      flatOffice: checkoutState.address.flat || undefined,
      notes: checkoutState.address.notes || undefined,
    },
    shipping: {
      id: shippingMethod.id,
      name: shippingMethod.name,
      fee: shippingMethod.price,
      estimate: shippingMethod.estimatedDays,
    },
    payment: {
      id: paymentMethod.id,
      name: paymentMethod.name,
    },
    subtotal: totals.subtotal,
    shippingTotal: totals.shippingCost,
    discountTotal: totals.discount,
    promoCode: totals.promoCode,
    total: totals.total,
    status: 'confirmed',
  };

  // Persist to local storage (mock DB)
  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);

  return order;
};

// ── Read operations ──
// Future: GET /api/orders/:id

export const getOrderById = async (orderId: string): Promise<OrderRecord | null> => {
  await new Promise(r => setTimeout(r, 300));
  const orders = loadOrders();
  return orders.find(o => o.id === orderId || o.orderNumber === orderId) || null;
};

// Future: GET /api/orders/:id/tracking

export const getOrderTracking = async (orderId: string): Promise<{
  trackingId: string;
  status: OrderRecord['status'];
  estimatedDelivery: string;
} | null> => {
  await new Promise(r => setTimeout(r, 300));
  const order = await getOrderById(orderId);
  if (!order) return null;
  return {
    trackingId: order.trackingId,
    status: order.status,
    estimatedDelivery: order.shipping.estimate.en,
  };
};

// Future: GET /api/orders?userId=...

export const getOrderHistory = async (): Promise<OrderRecord[]> => {
  await new Promise(r => setTimeout(r, 300));
  return loadOrders();
};
