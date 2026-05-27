'use client'
import { useState } from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLocale } from '@/hooks/useLocale';
import { useWishlist, type WishlistItem } from '@/context/WishlistContext';
import QuickAddPopup from '@/components/common/QuickAddPopup';
import type { ProductItem } from '@/types/product';
import Image from 'next/image';

interface ProductCardProps {
  product: ProductItem;
  compact?: boolean;
}

const ProductCard = ({ product, compact }: ProductCardProps) => {
  const { t, formatPrice } = useLocale();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const liked = isInWishlist(product.id);
  const primaryImg = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const discount = product.compareAtPrice
    ? Math.round((1 - product.basePrice / product.compareAtPrice) * 100)
    : 0;

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [wishlistPopupOpen, setWishlistPopupOpen] = useState(false);

  const hasVariants = product.colors.length > 0 || product.sizes.length > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickAddOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants && !liked) {
      setWishlistPopupOpen(true);
    } else {
      const baseItem: WishlistItem = {
        id: product.id,
        productId: product.id,
        name: product.name as { en: string; ar: string },
        brand: product.brand as { en: string; ar: string },
        image: primaryImg?.url || '',
        price: product.basePrice,
        compareAtPrice: product.compareAtPrice,
      };
      toggleWishlist(baseItem);
    }
  };

  return (
    <>
      <div className="group relative bg-card rounded-lg overflow-hidden border border-border/50 hover:shadow-md transition-shadow flex flex-col h-full">
        {/* Region A: Image – fixed aspect */}
        <Link
          href={`/product/${product.slug}`}
          className="block relative aspect-[3/4] overflow-hidden bg-secondary flex-shrink-0"
        >
          {primaryImg && (
            <Image
              src={primaryImg.url}
              alt={t(primaryImg.alt)}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          )}
          {/* Badges */}
          <div className="absolute top-2 start-2 flex flex-col gap-1">
            {product.isOnSale && discount > 0 && (
              <span className="bg-destructive text-destructive-foreground text-[11px] font-bold px-1.5 py-0.5 rounded">
                -{discount}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-header text-header-foreground text-[11px] font-bold px-1.5 py-0.5 rounded">NEW</span>
            )}
          </div>
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 end-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors z-10"
            aria-label="Wishlist"
          >
            <Heart size={15} className={liked ? "fill-primary text-destructive" : "text-muted-foreground"} />
          </button>
        </Link>

        {/* Region B-F: Info – flex-col to anchor bottom row */}
        <div className={`flex flex-col flex-1 ${compact ? "p-2" : "p-3"}`}>
          {/* Region B: Brand – fixed single line */}
          <p className="text-[12px] text-muted-foreground uppercase tracking-wider mb-0.5 truncate flex-shrink-0">
            {t(product.brand)}
          </p>

          {/* Region C: Title – reserved 2-line height */}
          <Link href={`/product/${product.slug}`} className="flex-shrink-0">
            <h3 className="text-[13px] font-medium text-foreground leading-tight min-h-[2.5em] line-clamp-2 hover:text-brand transition-colors">
              {t(product.name)}
            </h3>
          </Link>

          {/* Region D: Rating – fixed height */}
          <div className="flex items-center gap-1 h-5 mt-1 flex-shrink-0">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  className={star <= Math.round(product.rating) ? "fill-brand text-brand" : "text-border"}
                />
              ))}
            </div>
            <span className="text-[12px] text-muted-foreground tabular-nums">({product.reviewCount})</span>
          </div>

          {/* Region E: Price – fixed height */}
          <div className="flex items-center gap-2 h-6 mt-1 flex-shrink-0">
            <span className="text-sm font-bold text-foreground tabular-nums">{formatPrice(product.basePrice)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through tabular-nums">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Spacer pushes bottom row down */}
          <div className="flex-1" />

          {/* Region F: Swatches + Cart – anchored bottom */}
          <div className="flex items-center justify-between mt-2 h-7 flex-shrink-0">
            <div className="flex items-center gap-1 min-w-0">
              {product.colors.length > 0 && (
                <>
                  {product.colors.slice(0, 5).map((color) => (
                    <span
                      key={color.id}
                      className="w-3 h-3 rounded-full border border-border flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                      title={t(color.name)}
                    />
                  ))}
                  {product.colors.length > 5 && (
                    <span className="text-[12px] text-muted-foreground tabular-nums">+{product.colors.length - 5}</span>
                  )}
                </>
              )}
            </div>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleAddToCart}
                    className="p-1 rounded bg-brand-warm text-header-foreground hover:bg-header/90 transition-colors flex-shrink-0 ms-auto"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag size={13} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Add to Cart
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Quick Add Popup */}
      <QuickAddPopup product={product} open={quickAddOpen} onOpenChange={setQuickAddOpen} mode="cart" />

      {/* Wishlist Variant Popup */}
      {hasVariants && (
        <QuickAddPopup product={product} open={wishlistPopupOpen} onOpenChange={setWishlistPopupOpen} mode="wishlist" />
      )}
    </>
  );
};

export default ProductCard;
