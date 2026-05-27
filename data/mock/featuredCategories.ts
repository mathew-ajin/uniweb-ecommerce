import { routes } from "@/lib/routes";
import blazerImg from "@/public/assets/products/blazer.jpg";
import dressImg from "@/public/assets/products/dress.jpg";
import handbagImg from "@/public/assets/products/handbag.jpg";
import jewelryImg from "@/public/assets/products/jewelry.jpg";
import perfumeImg from "@/public/assets/products/perfume.jpg";
import skincareImg from "@/public/assets/products/skincare.jpg";
import sneakersImg from "@/public/assets/products/sneakers.jpg";
import watchImg from "@/public/assets/products/watch.jpg";
import type { FeaturedCategory } from "@/types/product";


export const featuredCategories: FeaturedCategory[] = [
  {
    id: "fc-dresses",
    name: { en: "Dresses", ar: "فساتين" },
    image: dressImg,
    href: routes.subcategory("women", "dresses"),
  },
  {
    id: "fc-tshirts",
    name: { en: "T-Shirts", ar: "تيشيرتات" },
    image: blazerImg,
    href: routes.subcategory("men", "t-shirts"),
  },
  {
    id: "fc-handbags",
    name: { en: "Handbags", ar: "حقائب يد" },
    image: handbagImg,
    href: routes.subcategory("accessories", "handbags"),
  },
  { id: "fc-watches", name: { en: "Watches", ar: "ساعات" }, image: watchImg, href: routes.category("watches") },
  {
    id: "fc-perfumes",
    name: { en: "Perfumes", ar: "عطور" },
    image: perfumeImg,
    href: routes.subcategory("fragrance", "perfumes"),
  },
  {
    id: "fc-skincare",
    name: { en: "Skincare", ar: "عناية بالبشرة" },
    image: skincareImg,
    href: routes.subcategory("beauty", "skincare"),
  },
  {
    id: "fc-sneakers",
    name: { en: "Sneakers", ar: "سنيكرز" },
    image: sneakersImg,
    href: routes.subcategory("men", "sneakers"),
  },
  {
    id: "fc-jewelry",
    name: { en: "Jewellery", ar: "مجوهرات" },
    image: jewelryImg,
    href: routes.subcategory("accessories", "jewellery"),
  },
];
