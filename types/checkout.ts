import type { TranslatedText } from './index';

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface DeliveryAddress {
  fullName: string;
  email: string;
  phone: string;
  area: string;
  block: string;
  street: string;
  building: string;
  floor: string;
  flat: string;
  notes: string;
}

export interface ShippingMethod {
  id: string;
  name: TranslatedText;
  description: TranslatedText;
  estimatedDays: TranslatedText;
  price: number; // KWD
}

export interface PaymentMethod {
  id: string;
  name: TranslatedText;
  icon?: string;
}

export type CheckoutStep = 'details' | 'address' | 'shipping' | 'payment';

export interface CheckoutState {
  customer: CustomerDetails;
  address: DeliveryAddress;
  shippingMethodId: string;
  paymentMethodId: string;
  agreedToTerms: boolean;
  selectedAddressId: string;
}

export interface OrderConfirmation {
  orderId: string;
  orderDate: string;
  estimatedDelivery: string;
  total: number;
}
