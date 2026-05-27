"use client"
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { LanguageCode, CurrencyCode, Direction, TranslatedText } from '@/types';
import { currencies } from '@/data/mock/siteSettings';

interface LocaleContextValue {
  lang: LanguageCode;
  currency: CurrencyCode;
  dir: Direction;
  setLang: (lang: LanguageCode) => void;
  setCurrency: (currency: CurrencyCode) => void;
  t: (text: TranslatedText) => string;
  formatPrice: (amountKWD: number) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LanguageCode>('en');
  const [currency, setCurrency] = useState<CurrencyCode>('KWD');

  const dir: Direction = lang === 'ar' ? 'rtl' : 'ltr';

  const setLang = useCallback((newLang: LanguageCode) => {
    setLangState(newLang);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }, [dir, lang]);

  const t = useCallback(
    (text: TranslatedText) => text[lang] || text.en,
    [lang]
  );

  const formatPrice = useCallback(
    (amountKWD: number) => {
      const curr = currencies[currency];
      const converted = amountKWD * curr.exchangeRate;
      const formatted = converted.toFixed(curr.decimalPlaces);
      return `${curr.symbol} ${formatted}`;
    },
    [currency]
  );

  return (
    <LocaleContext.Provider value={{ lang, currency, dir, setLang, setCurrency, t, formatPrice }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
};
