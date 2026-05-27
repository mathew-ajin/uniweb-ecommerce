"use client"
import { useLocale } from '@/hooks/useLocale';
import { featuredCategories } from '@/data/mock/featuredCategories';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

const FeaturedCategories = () => {
  const { t, lang } = useLocale();

  return (
    <section className="pt-10 pb-4 md:pt-16 md:pb-6">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
            {lang === "ar" ? "تسوق حسب الفئة" : "Shop by Category"}
          </h2>
          <Link href="/shop" className="text-sm text-brand hover:underline flex items-center gap-1">
            {lang === "ar" ? "عرض الكل" : "View All"}
            <ChevronRight size={14} />
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {featuredCategories.map((cat) => (
            <Link key={cat.id} href={cat.href} className="flex flex-col items-center gap-2 group w-20 md:w-24">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-border group-hover:border-brand transition-colors flex-shrink-0">
                <Image src={cat.image} alt={t(cat.name)} fill className="object-cover" loading="lazy" />
              </div>
              <span className="text-xs md:text-sm font-medium text-foreground group-hover:text-brand transition-colors text-center min-h-[2em] flex items-start justify-center">
                {t(cat.name)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
