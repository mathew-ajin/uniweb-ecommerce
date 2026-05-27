"use client"
import { useLocale } from '@/hooks/useLocale';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/common/ProductCard';
import type { ProductItem } from '@/types/product';

interface ProductSectionProps {
  titleEn: string;
  titleAr: string;
  products: ProductItem[];
  viewAllHref?: string;
}

const ProductSection = ({ titleEn, titleAr, products, viewAllHref = '/shop' }: ProductSectionProps) => {
  const { lang } = useLocale();

  return (
    <section className="pt-6 pb-10 md:pt-8 md:pb-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
            {lang === 'ar' ? titleAr : titleEn}
          </h2>
          <Link href={viewAllHref} className="text-sm text-brand hover:underline flex items-center gap-1">
            {lang === 'ar' ? 'عرض الكل' : 'View All'}
            <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
