"use client"
import { useLocale } from '@/hooks/useLocale';
import Link from 'next/link';
import logoWhite from '@/public/assets/company/logo.png';
import Image from 'next/image';

const Footer = () => {
  const { lang } = useLocale();
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;

  const columns = [
    {
      title: t('Quick Links', 'روابط سريعة'),
      links: [
        { label: t('Home', 'الرئيسية'), href: '/' },
        { label: t('Shop', 'تسوق'), href: '/shop' },
        { label: t('New Arrivals', 'وصل حديثاً'), href: '/shop' },
        { label: t('Sale', 'تخفيضات'), href: '/sale' },
      ],
    },
    {
      title: t('Customer Service', 'خدمة العملاء'),
      links: [
        { label: t('Contact Us', 'اتصل بنا'), href: '/contact' },
        { label: t('Shipping Info', 'معلومات الشحن'), href: '/shipping-info' },
        { label: t('Returns & Exchange', 'الإرجاع والاستبدال'), href: '/returns-exchange' },
        { label: t('Terms & Conditions', 'الشروط والأحكام'), href: '/terms-conditions' },
      ],
    },
    {
      title: t('About', 'عن الشركة'),
      links: [
        { label: t('About Uniweb', 'عن ميار'), href: '/about' },
        { label: t('Careers', 'وظائف'), href: '/careers' },
        { label: t('Privacy Policy', 'سياسة الخصوصية'), href: '/privacy-policy' },
      ],
    },
  ];

  return (
    <footer className="bg-ring text-white">
      <div className="container py-6 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo / Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <Image src={logoWhite} alt="Uniweb Shop" width={100} height={100} className="mb-4 object-contain" />
            <p className="text-white text-sm leading-relaxed">
              {t(
                "Your premium destination for fashion, beauty, and lifestyle in Kuwait.",
                "وجهتك الفاخرة للأزياء والجمال ونمط الحياة في الكويت.",
              )}
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-medium text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white text-sm hover:text-header-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-header-muted/20" data-footer-bottom>
        <div className="container py-4 flex items-center justify-center text-xs text-white">
          <p className="text-center">
            © 2026{" "}
            <a
              href="https://uniwebonline.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-header-foreground/80 hover:text-brand transition-colors"
            >
              Uniweb
            </a>
            . {t("All rights reserved.", "جميع الحقوق محفوظة.")} {t("Powered by", "بواسطة")}{" "}
            <a
              href="https://www.uniwebonline.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-header-foreground/80 hover:text-brand transition-colors"
            >
              Uniweb IT Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
