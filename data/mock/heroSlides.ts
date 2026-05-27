import type { HeroSlide } from '@/types';
import heroSlideNew1 from '@/public/assets/hero-slide-new-1.jpg';
import heroSlideNew3 from '@/public/assets/hero-slide-new-3.jpg';
import heroSlideNew4 from '@/public/assets/hero-slide-new-4.jpg';
import heroSlide2 from '@/public/assets/hero-slide-2.jpg';
import heroSlide3 from '@/public/assets/hero-slide-3.jpg';
import heroSlide6 from '@/public/assets/hero-slide-6.jpg';
import heroSlide7 from '@/public/assets/hero-slide-7.jpg';
import heroSlide9 from '@/public/assets/hero-slide-9.jpg';
import { routes } from '@/lib/routes';

export const heroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    image: heroSlideNew1,
    productTitle: { en: 'Luxury Accessories Edit', ar: 'تشكيلة الإكسسوارات الفاخرة' },
    productSubtitle: { en: 'Exclusive Collection', ar: 'مجموعة حصرية' },
    oldPrice: 29.9,
    newPrice: 22.5,
    ctaLabel: { en: 'Shop now', ar: 'تسوق الآن' },
    ctaHref: routes.category('accessories'),
  },
  {
    id: 'slide-2',
    image: heroSlideNew3,
    productTitle: { en: 'Fashion Essentials', ar: 'أساسيات الموضة' },
    productSubtitle: { en: 'Trending Now', ar: 'رائج الآن' },
    oldPrice: 38.0,
    newPrice: 28.5,
    ctaLabel: { en: 'Shop now', ar: 'تسوق الآن' },
    ctaHref: routes.category('women'),
  },
  {
    id: 'slide-3',
    image: heroSlideNew4,
    productTitle: { en: 'Elegant Leather Collection', ar: 'مجموعة الجلود الأنيقة' },
    productSubtitle: { en: 'Handcrafted Luxury', ar: 'فخامة يدوية الصنع' },
    oldPrice: 45.0,
    newPrice: 35.0,
    ctaLabel: { en: 'Shop now', ar: 'تسوق الآن' },
    ctaHref: routes.subcategory('accessories', 'handbags'),
  },
  {
    id: 'slide-4',
    image: heroSlide2,
    productTitle: { en: 'Summer Accessories Edit', ar: 'تشكيلة إكسسوارات الصيف' },
    productSubtitle: { en: 'New Arrivals', ar: 'وصل حديثاً' },
    oldPrice: 35.0,
    newPrice: 27.5,
    ctaLabel: { en: 'Shop now', ar: 'تسوق الآن' },
    ctaHref: routes.category('accessories'),
  },
  {
    id: 'slide-5',
    image: heroSlide3,
    productTitle: { en: 'Home Comfort Essentials', ar: 'أساسيات الراحة المنزلية' },
    productSubtitle: { en: 'Lifestyle Collection', ar: 'مجموعة نمط الحياة' },
    oldPrice: 42.0,
    newPrice: 32.0,
    ctaLabel: { en: 'Shop now', ar: 'تسوق الآن' },
    ctaHref: routes.category('home-living'),
  },
  {
    id: 'slide-6',
    image: heroSlide6,
    productTitle: { en: 'Perfume & Beauty', ar: 'العطور والجمال' },
    productSubtitle: { en: 'Signature Scents', ar: 'عطور مميزة' },
    oldPrice: 48.0,
    newPrice: 36.0,
    ctaLabel: { en: 'Shop now', ar: 'تسوق الآن' },
    ctaHref: routes.category('fragrance'),
  },
  {
    id: 'slide-7',
    image: heroSlide7,
    productTitle: { en: 'Women\'s Style Edit', ar: 'تشكيلة أناقة المرأة' },
    productSubtitle: { en: 'Curated Selection', ar: 'اختيارات منسقة' },
    oldPrice: 55.0,
    newPrice: 42.0,
    ctaLabel: { en: 'Shop now', ar: 'تسوق الآن' },
    ctaHref: routes.category('women'),
  },
  {
    id: 'slide-8',
    image: heroSlide9,
    productTitle: { en: 'Footwear & Bags', ar: 'الأحذية والحقائب' },
    productSubtitle: { en: 'Premium Pairs', ar: 'أزواج فاخرة' },
    oldPrice: 62.0,
    newPrice: 48.0,
    ctaLabel: { en: 'Shop now', ar: 'تسوق الآن' },
    ctaHref: routes.subcategory('accessories', 'handbags'),
  },
];
