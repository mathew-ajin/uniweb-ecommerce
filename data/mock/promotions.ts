import { routes } from "@/lib/routes";
import promoBagsImg from "@/public/assets/promo/promo-bags.jpg";
import promoBeautyImg from "@/public/assets/promo/promo-beauty.jpg";
import promoCollectionImg from "@/public/assets/promo/promo-collection.jpg";
import type { PromoBanner } from "@/types/product";

export const promoBanners: PromoBanner[] = [
  {
    id: "promo-1",
    title: { en: "Handbags Collection", ar: "مجموعة الحقائب" },
    subtitle: { en: "Up to 40% Off", ar: "خصم حتى 40%" },
    image: promoBagsImg,
    ctaLabel: { en: "Shop Now", ar: "تسوقي الآن" },
    ctaHref: routes.subcategory("accessories", "handbags"),
  },
  {
    id: "promo-2",
    title: { en: "Beauty Essentials", ar: "أساسيات الجمال" },
    subtitle: { en: "New Season Picks", ar: "اختيارات الموسم الجديد" },
    image: promoBeautyImg,
    ctaLabel: { en: "Explore", ar: "اكتشفي" },
    ctaHref: routes.category("beauty"),
  },
  {
    id: "promo-3",
    title: { en: "New Collection", ar: "المجموعة الجديدة" },
    subtitle: { en: "Autumn/Winter 2026", ar: "خريف/شتاء 2026" },
    image: promoCollectionImg,
    ctaLabel: { en: "Discover", ar: "اكتشف" },
    ctaHref: routes.sale,
  },
  {
    id: "promo-4",
    title: { en: "Footwear Sale", ar: "تخفيضات الأحذية" },
    subtitle: { en: "Starting from KWD 15", ar: "ابتداءً من 15 د.ك" },
    image: promoBagsImg,
    ctaLabel: { en: "Shop Shoes", ar: "تسوق الأحذية" },
    ctaHref: routes.category("accessories"),
  },
];
