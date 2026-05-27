import type { TranslatedText } from '@/types';

/* ─── Unified Saved Address ─── */
export interface SavedAddress {
  id: string;
  label: string;
  isDefault: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  area: string;
  block: string;
  street: string;
  building: string;
  floor?: string;
  flatOffice?: string;
  additionalNotes?: string;
}

export interface NotificationItem {
  id: string;
  type: 'order' | 'delivery' | 'promo' | 'account';
  title: TranslatedText;
  message: TranslatedText;
  date: string;
  read: boolean;
}

const ADDR_KEY = 'mayar_addresses';
const NOTIF_KEY = 'mayar_notifications';

const defaultAddresses: SavedAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    isDefault: true,
    firstName: 'Mayar',
    lastName: 'User',
    email: 'user@mayar.com',
    phone: '+965 5000 1234',
    area: 'Salmiya',
    block: '10',
    street: 'Salem Al Mubarak St',
    building: '22',
    floor: '3',
    flatOffice: '5A',
  },
  {
    id: 'addr-2',
    label: 'Office',
    isDefault: false,
    firstName: 'Mayar',
    lastName: 'User',
    email: 'work@mayar.com',
    phone: '+965 5000 5678',
    area: 'Kuwait City',
    block: '4',
    street: 'Fahad Al Salem St',
    building: '8',
    floor: '12',
    flatOffice: '1205',
  },
];

const defaultNotifications: NotificationItem[] = [
  { id: 'n1', type: 'order', title: { en: 'Order Confirmed', ar: 'تأكيد الطلب' }, message: { en: 'Your order has been confirmed and is being processed.', ar: 'تم تأكيد طلبك وهو قيد المعالجة.' }, date: '2026-03-17T10:30:00Z', read: false },
  { id: 'n2', type: 'delivery', title: { en: 'Out for Delivery', ar: 'في الطريق إليك' }, message: { en: 'Your package is out for delivery today.', ar: 'طردك في الطريق إليك اليوم.' }, date: '2026-03-16T08:15:00Z', read: false },
  { id: 'n3', type: 'promo', title: { en: 'Spring Sale 🌸', ar: 'تخفيضات الربيع 🌸' }, message: { en: 'Enjoy up to 40% off on new arrivals!', ar: 'استمتعي بخصم حتى 40% على الوصول الجديد!' }, date: '2026-03-15T12:00:00Z', read: true },
  { id: 'n4', type: 'account', title: { en: 'Welcome to Mayar!', ar: 'مرحباً في ميار!' }, message: { en: 'Your account has been created successfully.', ar: 'تم إنشاء حسابك بنجاح.' }, date: '2026-03-14T09:00:00Z', read: true },
];

export const loadAddresses = (): SavedAddress[] => {
  try {
    const raw = localStorage.getItem(ADDR_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultAddresses;
};

export const saveAddresses = (addresses: SavedAddress[]) => {
  localStorage.setItem(ADDR_KEY, JSON.stringify(addresses));
};

export const loadNotifications = (): NotificationItem[] => {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultNotifications;
};

export const saveNotifications = (notifications: NotificationItem[]) => {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
};
