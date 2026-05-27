import type { TranslatedText } from '@/types';

export interface TrackingInput {
  mobileNumber: string;
  trackingId: string;
}

export interface TrackingStep {
  id: string;
  label: TranslatedText;
  status: 'completed' | 'active' | 'pending';
  timestamp?: string;
  note?: TranslatedText;
}

export interface TrackingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  area: string;
  city: string;
  country: string;
  pinCode?: string;
}

export interface TrackingContact {
  contactPerson: string;
  mobileNumber: string;
  alternateNumber?: string;
}

export interface TrackingShipment {
  trackingId: string;
  orderId?: string;
  currentStatus: TranslatedText;
  estimatedDelivery?: string;
  lastUpdated?: string;
  courierName?: string;
  packageType?: string;
  paymentType?: string;
  orderDate?: string;
  dispatchDate?: string;
  itemCount?: number;
  deliveryNotes?: string;
  address: TrackingAddress;
  contact: TrackingContact;
  steps: TrackingStep[];
}
