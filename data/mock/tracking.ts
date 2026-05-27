import type { TrackingShipment } from '@/types/tracking';

export const mockTrackingData: Record<string, TrackingShipment> = {
  'MYR-2024-001': {
    trackingId: 'MYR-2024-001',
    orderId: 'ORD-78452',
    currentStatus: { en: 'Out for Delivery', ar: 'في الطريق للتوصيل' },
    estimatedDelivery: '2024-03-18',
    lastUpdated: '2024-03-17T14:30:00Z',
    courierName: 'Mayar Express',
    packageType: 'Standard Parcel',
    paymentType: 'Prepaid',
    orderDate: '2024-03-12',
    dispatchDate: '2024-03-13',
    itemCount: 3,
    deliveryNotes: 'Call on arrival',
    address: {
      fullName: 'Sara Al-Mutairi',
      addressLine1: 'Block 5, Street 12, House 8',
      addressLine2: 'Near City Center Mall',
      area: 'Salmiya',
      city: 'Kuwait City',
      country: 'Kuwait',
      pinCode: '22034',
    },
    contact: {
      contactPerson: 'Sara Al-Mutairi',
      mobileNumber: '+965 5512 3456',
      alternateNumber: '+965 5598 7654',
    },
    steps: [
      { id: '1', label: { en: 'Order Confirmed', ar: 'تم تأكيد الطلب' }, status: 'completed', timestamp: '2024-03-12T10:00:00Z' },
      { id: '2', label: { en: 'Packed', ar: 'تم التغليف' }, status: 'completed', timestamp: '2024-03-12T16:30:00Z' },
      { id: '3', label: { en: 'Picked Up', ar: 'تم الاستلام' }, status: 'completed', timestamp: '2024-03-13T09:00:00Z' },
      { id: '4', label: { en: 'In Transit', ar: 'في الطريق' }, status: 'completed', timestamp: '2024-03-14T11:00:00Z' },
      { id: '5', label: { en: 'Arrived at Local Hub', ar: 'وصل إلى المركز المحلي' }, status: 'completed', timestamp: '2024-03-16T08:00:00Z' },
      { id: '6', label: { en: 'Out for Delivery', ar: 'في الطريق للتوصيل' }, status: 'active', timestamp: '2024-03-17T14:30:00Z', note: { en: 'Driver en route to destination', ar: 'السائق في الطريق' } },
      { id: '7', label: { en: 'Delivered', ar: 'تم التوصيل' }, status: 'pending' },
    ],
  },
  'MYR-2024-002': {
    trackingId: 'MYR-2024-002',
    orderId: 'ORD-78510',
    currentStatus: { en: 'In Transit', ar: 'في الطريق' },
    estimatedDelivery: '2024-03-20',
    lastUpdated: '2024-03-16T09:15:00Z',
    courierName: 'Mayar Express',
    packageType: 'Fragile Parcel',
    paymentType: 'Cash on Delivery',
    orderDate: '2024-03-14',
    dispatchDate: '2024-03-15',
    itemCount: 1,
    deliveryNotes: 'Fragile – handle with care',
    address: {
      fullName: 'Ahmed Hassan',
      addressLine1: 'Flat 12, Tower B, Pearl Residences',
      area: 'Hawally',
      city: 'Kuwait City',
      country: 'Kuwait',
      pinCode: '32001',
    },
    contact: {
      contactPerson: 'Ahmed Hassan',
      mobileNumber: '+965 5501 2345',
    },
    steps: [
      { id: '1', label: { en: 'Order Confirmed', ar: 'تم تأكيد الطلب' }, status: 'completed', timestamp: '2024-03-14T12:00:00Z' },
      { id: '2', label: { en: 'Packed', ar: 'تم التغليف' }, status: 'completed', timestamp: '2024-03-14T18:00:00Z' },
      { id: '3', label: { en: 'Picked Up', ar: 'تم الاستلام' }, status: 'completed', timestamp: '2024-03-15T10:00:00Z' },
      { id: '4', label: { en: 'In Transit', ar: 'في الطريق' }, status: 'active', timestamp: '2024-03-16T09:15:00Z', note: { en: 'Package in transit via air freight', ar: 'الطرد في الطريق عبر الشحن الجوي' } },
      { id: '5', label: { en: 'Arrived at Local Hub', ar: 'وصل إلى المركز المحلي' }, status: 'pending' },
      { id: '6', label: { en: 'Out for Delivery', ar: 'في الطريق للتوصيل' }, status: 'pending' },
      { id: '7', label: { en: 'Delivered', ar: 'تم التوصيل' }, status: 'pending' },
    ],
  },
};

// Lookup map: phone -> tracking IDs
export const phoneTrackingMap: Record<string, string[]> = {
  '+96555123456': ['MYR-2024-001'],
  '55123456': ['MYR-2024-001'],
  '+96555012345': ['MYR-2024-002'],
  '55012345': ['MYR-2024-002'],
};
