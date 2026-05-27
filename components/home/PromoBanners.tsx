"use client"
import { useLocale } from '@/hooks/useLocale';
import { promoBanners } from '@/data/mock/promotions';
import Link from 'next/link';
import Image from 'next/image';

const PromoBanners = () => {
  const { t } = useLocale();

  return (
    <section className="py-10 md:py-16 bg-secondary/50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {promoBanners.map((promo, i) => (
            <Link
              key={promo.id}
              href={promo.ctaHref}
              className={`group relative overflow-hidden rounded-lg ${i === 2 ? 'md:col-span-2' : ''}`}
            >
              <div className="aspect-[16/9] md:aspect-[2/1]">
                <Image
                  src={promo.image}
                  alt={t(promo.title)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-0 start-0 p-5 md:p-8">
                  {promo.subtitle && (
                    <p className="text-xs md:text-sm text-brand-warm font-medium mb-1">{t(promo.subtitle)}</p>
                  )}
                  <h3 className="text-lg md:text-2xl font-heading font-bold text-background mb-2">{t(promo.title)}</h3>
                  <span className="inline-flex items-center px-4 py-2 bg-background text-foreground text-xs md:text-sm font-medium rounded-md group-hover:bg-brand group-hover:text-brand-foreground transition-colors">
                    {t(promo.ctaLabel)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
