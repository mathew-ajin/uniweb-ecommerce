import type { TrackingShipment, TrackingStep } from '@/types/tracking';
import type { OrderRecord } from '@/types/order';
import { mockTrackingData } from '@/data/mock/tracking';

const delay = <T>(data: T, ms = 600): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

/**
 * Convert a placed OrderRecord into the TrackingShipment shape
 * used by the existing tracking page — no design changes needed.
 */
const orderToShipment = (order: OrderRecord): TrackingShipment => {
  const now = new Date();
  const orderDate = new Date(order.createdAt);

  // Build timeline steps based on order status
  const allSteps: { id: string; en: string; ar: string; minutesAfterOrder: number }[] = [
    { id: '1', en: 'Order Confirmed', ar: 'تم تأكيد الطلب', minutesAfterOrder: 0 },
    { id: '2', en: 'Packed', ar: 'تم التغليف', minutesAfterOrder: 30 },
    { id: '3', en: 'Picked Up', ar: 'تم الاستلام', minutesAfterOrder: 120 },
    { id: '4', en: 'In Transit', ar: 'في الطريق', minutesAfterOrder: 360 },
    { id: '5', en: 'Arrived at Local Hub', ar: 'وصل إلى المركز المحلي', minutesAfterOrder: 1440 },
    { id: '6', en: 'Out for Delivery', ar: 'في الطريق للتوصيل', minutesAfterOrder: 2880 },
    { id: '7', en: 'Delivered', ar: 'تم التوصيل', minutesAfterOrder: 4320 },
  ];

  const statusMap: Record<string, number> = {
    confirmed: 1,
    paid: 2,
    processing: 3,
    shipped: 5,
    delivered: 7,
  };

  const completedUpTo = statusMap[order.status] || 1;

  const steps: TrackingStep[] = allSteps.map((s, i) => {
    const stepTime = new Date(orderDate.getTime() + s.minutesAfterOrder * 60000);
    const idx = i + 1;
    let status: TrackingStep['status'];
    if (idx < completedUpTo) status = 'completed';
    else if (idx === completedUpTo) status = 'active';
    else status = 'pending';

    return {
      id: s.id,
      label: { en: s.en, ar: s.ar },
      status,
      ...(status !== 'pending' ? { timestamp: stepTime.toISOString() } : {}),
      ...(status === 'active' && idx === 1 ? { note: { en: 'Your order has been placed successfully', ar: 'تم تقديم طلبك بنجاح' } } : {}),
    };
  });

  const currentStep = steps.find(s => s.status === 'active') || steps[0];

  // Build address lines
  const addrParts = [
    `Block ${order.address.block}`,
    `Street ${order.address.street}`,
    `Building ${order.address.building}`,
  ];
  if (order.address.floor) addrParts.push(`Floor ${order.address.floor}`);

  // Estimated delivery: 3 days from order date for local, 10 for international
  const estDays = order.shipping.id === 'international' ? 10 : 3;
  const estDate = new Date(orderDate.getTime() + estDays * 86400000);

  return {
    trackingId: order.trackingId,
    orderId: order.orderNumber,
    currentStatus: currentStep.label,
    estimatedDelivery: estDate.toISOString().split('T')[0],
    lastUpdated: now.toISOString(),
    courierName: 'Mayar Express',
    packageType: 'Standard Parcel',
    paymentType: order.payment.name.en,
    orderDate: order.createdAt,
    dispatchDate: order.status !== 'confirmed' ? new Date(orderDate.getTime() + 120 * 60000).toISOString() : undefined,
    itemCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
    deliveryNotes: order.address.notes || undefined,
    address: {
      fullName: `${order.customer.firstName} ${order.customer.lastName}`,
      addressLine1: addrParts.join(', '),
      addressLine2: order.address.flatOffice || undefined,
      area: order.address.area,
      city: 'Kuwait City',
      country: 'Kuwait',
    },
    contact: {
      contactPerson: `${order.customer.firstName} ${order.customer.lastName}`,
      mobileNumber: order.customer.phone,
    },
    steps,
  };
};

export const trackingService = {
  /**
   * Look up a shipment by tracking ID.
   * Future: POST /api/tracking/lookup
   */
  trackShipment: async (
    _mobileNumber: string,
    trackingId: string
  ): Promise<TrackingShipment | null> => {
    const normalized = trackingId.trim().toUpperCase();
    // Check mock data first
    if (mockTrackingData[normalized]) {
      return delay(mockTrackingData[normalized]);
    }
    // Check placed orders
    const shipment = await trackingService.getTrackingFromOrders(normalized);
    return delay(shipment);
  },

  /**
   * Get tracking by ID alone.
   * Future: GET /api/tracking/{trackingId}
   */
  getTrackingById: async (
    trackingId: string
  ): Promise<TrackingShipment | null> => {
    const normalized = trackingId.trim().toUpperCase();
    if (mockTrackingData[normalized]) {
      return delay(mockTrackingData[normalized]);
    }
    return trackingService.getTrackingFromOrders(normalized);
  },

  /**
   * Look up tracking from placed orders by trackingId or orderId.
   * Future: GET /api/orders/{id}/tracking
   */
  getTrackingFromOrders: async (
    idOrTracking: string
  ): Promise<TrackingShipment | null> => {
    const { getOrderById } = await import('@/services/api/orderService');
    // Try by order number or tracking ID
    const order = await getOrderById(idOrTracking);
    if (order) return orderToShipment(order);

    // Also try searching all orders by trackingId
    const { getOrderHistory } = await import('@/services/api/orderService');
    const orders = await getOrderHistory();
    const match = orders.find(o => o.trackingId === idOrTracking);
    return match ? orderToShipment(match) : null;
  },
};
