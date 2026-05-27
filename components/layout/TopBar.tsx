"use client"
import { useLocale } from '@/hooks/useLocale';
import { siteSettings } from '@/data/mock/siteSettings';
import { useTrackingPopup } from '@/context/TrackingPopupContext';
import type { LanguageCode, CurrencyCode } from '@/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

const TopBar = () => {
  const { lang, currency, setLang, setCurrency, t } = useLocale();
  const { open: openTracking } = useTrackingPopup();

  return (
    <div className="bg-header text-header-foreground">
      <div className="container mx-auto max-w-7xl flex items-center justify-between h-9 text-xs px-4">
        {/* Trust message */}
        <p className="hidden md:block text-header-muted truncate">{t(siteSettings.trustMessage)}</p>

        {/* Right side links & switchers */}
        <div className="flex items-center gap-4 ms-auto">
          {/* Order Tracking link */}
          <nav className="hidden lg:flex items-center gap-4">
            <button onClick={openTracking} className="text-header-muted hover:text-header-foreground transition-colors">
              {lang === "ar" ? "تتبع الطلب" : "Order Tracking"}
            </button>
          </nav>

          {/* Divider */}
          <span className="hidden lg:block w-px h-3 bg-header-muted/30" />

          {/* Language switcher */}
          <div className="flex items-center gap-1">
            {(["en", "ar"] as LanguageCode[]).map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium uppercase transition-colors ${
                  lang === code
                    ? "bg-header-foreground/15 text-header-foreground"
                    : "text-header-muted hover:text-header-foreground"
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          {/* Currency switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-header-muted hover:text-header-foreground transition-colors outline-none focus:outline-none">
                {currency}
                <ChevronDown size={14} className="opacity-70" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-[110px] z-[100] p-1.5 rounded-xl shadow-xl border border-border/50 bg-popover/95 backdrop-blur-md">
              {(["KWD", "INR"] as CurrencyCode[]).map((code) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`text-xs cursor-pointer rounded-lg px-3 py-2 flex items-center justify-between mb-0.5 last:mb-0 transition-all duration-200 ${
                    currency === code 
                      ? "bg-primary/10 font-bold text-primary dark:bg-primary/20 dark:text-primary-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {code}
                  {currency === code && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
