import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import type { SortOption } from '@/types/product';

interface SortControlsProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'compact';
  onViewChange: (mode: 'grid' | 'compact') => void;
  resultCount: number;
  onFilterToggle?: () => void;
}

const SortControls = ({ sort, onSortChange, viewMode, onViewChange, resultCount, onFilterToggle }: SortControlsProps) => {
  const { lang } = useLocale();
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: t('Newest', 'الأحدث') },
    { value: 'popular', label: t('Most Popular', 'الأكثر شعبية') },
    { value: 'rating', label: t('Best Rated', 'الأعلى تقييماً') },
    { value: 'price-asc', label: t('Price: Low to High', 'السعر: من الأقل') },
    { value: 'price-desc', label: t('Price: High to Low', 'السعر: من الأعلى') },
  ];

  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-border">
      <div className="flex items-center gap-3">
        {onFilterToggle && (
          <button onClick={onFilterToggle} className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-foreground border border-border rounded-md px-3 h-9">
            <SlidersHorizontal size={14} />
            {t('Filter', 'تصفية')}
          </button>
        )}
        <span className="text-sm text-muted-foreground">
          {resultCount} {t('products', 'منتج')}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="h-9 px-3 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <div className="hidden md:flex items-center border border-border rounded-md overflow-hidden">
          <button
            onClick={() => onViewChange('grid')}
            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onViewChange('compact')}
            className={`p-2 transition-colors ${viewMode === 'compact' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortControls;
