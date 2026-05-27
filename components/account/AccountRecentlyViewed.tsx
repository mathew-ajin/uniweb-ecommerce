import { useMemo } from 'react';
import { Clock } from 'lucide-react';
import  Link  from 'next/link';
import { useLocale } from '@/hooks/useLocale';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { products } from '@/data/mock/products';
import ProductCard from '@/components/common/ProductCard';

const AccountRecentlyViewed = () => {
  const { lang } = useLocale();
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;
  const { viewedIds } = useRecentlyViewed();

  const viewedProducts = useMemo(
    () => viewedIds.map(id => products.find(p => p.id === id)).filter(Boolean) as typeof products,
    [viewedIds]
  );

  if (viewedProducts.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">{t('Recently Viewed', 'شوهد مؤخراً')}</h2>
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">{t('No recently viewed products', 'لا توجد منتجات شوهدت مؤخراً')}</p>
          <Link href="/shop" className="text-sm text-brand hover:underline">{t('Browse Products', 'تصفح المنتجات')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">{t('Recently Viewed', 'شوهد مؤخراً')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {viewedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AccountRecentlyViewed;
