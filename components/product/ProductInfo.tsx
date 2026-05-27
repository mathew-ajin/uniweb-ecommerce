import { useState, useMemo } from 'react';
import { Star, Heart, Share2, Minus, Plus, ShoppingBag, Zap, Truck, RotateCcw, Shield, CheckCircle } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { useCart } from '@/context/CartContext';
import { useWishlist, type WishlistItem } from '@/context/WishlistContext';
import type { ProductItem } from '@/types/product';
import SizeGuideModal from './SizeGuideModal';
import ShareModal from './ShareModal';

interface ProductInfoProps {
  product: ProductItem;
  onColorChange?: (colorId: string) => void;
  initialColor?: string;
  initialSize?: string;
}

const ProductInfo = ({ product, onColorChange, initialColor, initialSize }: ProductInfoProps) => {
  const { t, formatPrice, lang } = useLocale();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState(initialColor || product.colors[0]?.id || '');
  const [selectedSize, setSelectedSize] = useState(initialSize || '');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const currentVariant = useMemo(() => {
    return product.variants.find(v =>
      v.colorId === selectedColor && (!selectedSize || v.sizeId === selectedSize)
    ) || product.variants[0];
  }, [product.variants, selectedColor, selectedSize]);

  const liked = isInWishlist(product.id, currentVariant?.id);

  const currentPrice = currentVariant?.price || product.basePrice;
  const comparePrice = currentVariant?.compareAtPrice || product.compareAtPrice;
  const discount = comparePrice ? Math.round((1 - currentPrice / comparePrice) * 100) : 0;
  const stock = currentVariant?.stock ?? 99;

  const services = [
    { icon: Truck, label: lang === 'ar' ? 'توصيل مجاني' : 'Free Delivery' },
    { icon: RotateCcw, label: lang === 'ar' ? 'إرجاع سهل' : 'Easy Returns' },
    { icon: Shield, label: lang === 'ar' ? 'دفع آمن' : 'Secure Payment' },
    { icon: CheckCircle, label: lang === 'ar' ? 'منتجات أصلية' : 'Authentic' },
  ];

  const handleAddToCart = () => {
    addToCart(product, { colorId: selectedColor || undefined, sizeId: selectedSize || undefined, quantity });
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground uppercase tracking-wider">{t(product.brand)}</p>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t(product.name)}</h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={14} className={s <= Math.round(product.rating) ? 'fill-brand text-brand' : 'text-border'} />
          ))}
        </div>
        <span className="text-sm text-muted-foreground tabular-nums">{product.rating.toFixed(1)} ({product.reviewCount} {lang === 'ar' ? 'تقييم' : 'reviews'})</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold text-foreground tabular-nums">{formatPrice(currentPrice)}</span>
        {comparePrice && (
          <>
            <span className="text-lg text-muted-foreground line-through tabular-nums">{formatPrice(comparePrice)}</span>
            <span className="text-sm font-bold text-destructive tabular-nums">-{discount}%</span>
          </>
        )}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{t(product.shortDescription)}</p>

      {/* Stock */}
      {stock > 0 && stock <= 5 && (
        <p className="text-sm text-destructive font-medium">{lang === 'ar' ? `باقي ${stock} فقط` : `Only ${stock} left in stock`}</p>
      )}

      {/* Colors */}
      {product.colors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2">
            {lang === 'ar' ? 'اللون' : 'Color'}: {product.colors.find(c => c.id === selectedColor)?.name?.[lang] || ''}
          </p>
          <div className="flex gap-2">
            {product.colors.map(color => (
              <button
                key={color.id}
                onClick={() => { setSelectedColor(color.id); onColorChange?.(color.id); }}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color.id ? 'border-foreground scale-110' : 'border-border hover:border-muted-foreground'
                }`}
                style={{ backgroundColor: color.hex }}
                title={t(color.name)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">{lang === 'ar' ? 'المقاس' : 'Size'}</p>
            <button onClick={() => setSizeGuideOpen(true)} className="text-xs text-brand hover:underline">{lang === 'ar' ? 'دليل المقاسات' : 'Size Guide'}</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map(size => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                disabled={size.stock === 0}
                className={`min-w-[40px] h-9 px-3 text-sm rounded-md border transition-colors ${
                  selectedSize === size.id
                    ? 'border-foreground bg-foreground text-background'
                    : size.stock === 0
                    ? 'border-border text-muted-foreground/40 cursor-not-allowed'
                    : 'border-border hover:border-foreground text-foreground'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">{lang === 'ar' ? 'الكمية' : 'Quantity'}</p>
        <div className="inline-flex items-center border border-border rounded-md">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 hover:bg-secondary transition-colors">
            <Minus size={16} />
          </button>
          <span className="w-12 text-center text-sm font-medium tabular-nums">{quantity}</span>
          <button onClick={() => setQuantity(q => Math.min(q + 1, stock))} className="p-2 hover:bg-secondary transition-colors">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={product.sizes.length > 0 && !selectedSize}
          className="flex-1 h-12 bg-header text-header-foreground font-medium rounded-md hover:bg-header/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag size={18} />
          {lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
        </button>
        <button
          onClick={handleAddToCart}
          disabled={product.sizes.length > 0 && !selectedSize}
          className="flex-1 h-12 bg-brand text-brand-foreground font-medium rounded-md hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap size={18} />
          {lang === 'ar' ? 'اشتر الآن' : 'Buy Now'}
        </button>
      </div>

      <div className="flex gap-4">
        <button onClick={() => {
          const color = product.colors.find(c => c.id === selectedColor);
          const size = product.sizes.find(s => s.id === selectedSize);
          const varImg = selectedColor ? product.images.find(img => img.colorId === selectedColor)?.url : undefined;
          const fallbackImg = product.images.find(i => i.isPrimary)?.url || product.images[0]?.url || '';
          const wishItem: WishlistItem = {
            id: currentVariant?.id ? `${product.id}__${currentVariant.id}` : product.id,
            productId: product.id,
            variantId: currentVariant?.id,
            name: product.name as { en: string; ar: string },
            brand: product.brand as { en: string; ar: string },
            colorName: color?.name?.[lang],
            colorHex: color?.hex,
            size: size?.label,
            image: varImg || fallbackImg,
            price: currentPrice,
            compareAtPrice: comparePrice,
          };
          toggleWishlist(wishItem);
        }} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Heart size={16} className={liked ? 'fill-destructive text-destructive' : ''} />
          {lang === 'ar' ? 'المفضلة' : 'Wishlist'}
        </button>
        <button onClick={() => setShareOpen(true)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Share2 size={16} />
          {lang === 'ar' ? 'مشاركة' : 'Share'}
        </button>
      </div>

      {/* Service highlights */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
        {services.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon size={16} className="text-brand flex-shrink-0" />
            {label}
          </div>
        ))}
      </div>

      {/* Modals */}
      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        product={product}
        selectedSize={product.sizes.find(s => s.id === selectedSize)?.label}
      />
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        currentPrice={currentPrice}
        productImage={
          (selectedColor ? product.images.find(img => img.colorId === selectedColor)?.url : undefined)
          || product.images.find(i => i.isPrimary)?.url
          || product.images[0]?.url
          || ''
        }
      />
    </div>
  );
};

export default ProductInfo;
