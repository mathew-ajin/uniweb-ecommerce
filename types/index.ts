import { StaticImageData } from "next/image";
// TypeScript interfaces for API-ready e-commerce data structures

export type LanguageCode = "en" | "ar";
export type CurrencyCode = "KWD" | "INR";
export type Direction = "ltr" | "rtl";

export interface TranslatedText {
  en: string;
  ar: string;
}

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: TranslatedText;
  exchangeRate: number; // relative to KWD as base (1)
  decimalPlaces: number;
}

export interface Price {
  amount: number; // in KWD base
  currency: CurrencyCode;
}

export interface NavItem {
  id: string;
  label: TranslatedText;
  href: string;
  children?: NavItem[];
  badge?: TranslatedText;
}

export interface HeroSlide {
  id: string;
  image: string | StaticImageData;
  productTitle: TranslatedText;
  productSubtitle?: TranslatedText;
  oldPrice: number; // KWD base
  newPrice: number; // KWD base
  ctaLabel: TranslatedText;
  ctaHref: string;
}

export interface Category {
  id: string;
  name: TranslatedText;
  slug: string;
  icon?: string;
  children?: Category[];
}

export interface SiteSettings {
  siteName: TranslatedText;
  trustMessage: TranslatedText;
  defaultLanguage: LanguageCode;
  defaultCurrency: CurrencyCode;
  supportedLanguages: LanguageCode[];
  supportedCurrencies: CurrencyCode[];
}

export interface UserMenuItem {
  id: string;
  label: TranslatedText;
  href: string;
  icon?: string;
}

export interface CartSummary {
  itemCount: number;
  totalAmount: number; // KWD base
}

export interface FeaturedProduct {
  id: string;
  name: TranslatedText;
  slug: string;
  image: string;
  price: number;
  oldPrice?: number;
  category: string;
  badge?: TranslatedText;
}
