import type { SiteSettings, Currency, UserMenuItem, CartSummary } from '@/types';

export const siteSettings: SiteSettings = {
  siteName: { en: 'Mayar Shop', ar: 'متجر ميار' },
  trustMessage: {
    en: '100% Secure delivery without contacting the courier',
    ar: 'توصيل آمن 100% بدون التواصل مع المندوب',
  },
  defaultLanguage: 'en',
  defaultCurrency: 'KWD',
  supportedLanguages: ['en', 'ar'],
  supportedCurrencies: ['KWD', 'INR'],
};

export const currencies: Record<string, Currency> = {
  KWD: {
    code: 'KWD',
    symbol: 'KWD',
    name: { en: 'Kuwaiti Dinar', ar: 'دينار كويتي' },
    exchangeRate: 1,
    decimalPlaces: 3,
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: { en: 'Indian Rupee', ar: 'روبية هندية' },
    exchangeRate: 270.5, // 1 KWD ≈ 270.5 INR
    decimalPlaces: 0,
  },
};

export const userMenuItems: UserMenuItem[] = [
  { id: 'about', label: { en: 'About Us', ar: 'من نحن' }, href: '/about' },
  { id: 'account', label: { en: 'My Account', ar: 'حسابي' }, href: '/account' },
  { id: 'orders', label: { en: 'Order Tracking', ar: 'تتبع الطلب' }, href: '/orders' },
];

export const cartSummary: CartSummary = {
  itemCount: 3,
  totalAmount: 45.750,
};

export const authPageSettings = {
  login: {
    backgroundImage: '/src/assets/auth-login-bg.jpg',
    heading: { en: 'Welcome Back to Uniweb', ar: 'مرحباً بعودتك إلى ميار' },
    subheading: { en: 'Secure access to your premium shopping experience', ar: 'وصول آمن إلى تجربة تسوقك المميزة' },
  },
  signup: {
    backgroundImage: '/src/assets/auth-signup-bg.jpg',
    heading: { en: 'Join Uniweb', ar: 'انضم إلى ميار' },
    subheading: { en: 'Create your account for fashion, beauty, and lifestyle essentials', ar: 'أنشئ حسابك للأزياء والجمال وأساسيات نمط الحياة' },
  },
};
