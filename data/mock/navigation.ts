import type { NavItem, Category } from '@/types';

export const navItems: NavItem[] = [
  { id: 'home', label: { en: 'Home', ar: 'الرئيسية' }, href: '/' },
  { id: 'shop', label: { en: 'Shop', ar: 'تسوق' }, href: '/shop' },
  { id: 'women', label: { en: 'Women', ar: 'نساء' }, href: '/women' },
  { id: 'men', label: { en: 'Men', ar: 'رجال' }, href: '/men' },
  { id: 'beauty', label: { en: 'Beauty', ar: 'جمال' }, href: '/beauty' },
  { id: 'accessories', label: { en: 'Accessories', ar: 'إكسسوارات' }, href: '/accessories' },
  {
    id: 'sale',
    label: { en: 'Sale', ar: 'تخفيضات' },
    href: '/sale',
    badge: { en: 'Hot', ar: 'عرض' },
  },
];

export const categories: Category[] = [
  {
    id: 'fashion',
    name: { en: 'Fashion', ar: 'أزياء' },
    slug: 'fashion',
    children: [
      { id: 'dresses', name: { en: 'Dresses', ar: 'فساتين' }, slug: 'dresses' },
      { id: 'bags', name: { en: 'Bags', ar: 'حقائب' }, slug: 'bags' },
      { id: 'shoes', name: { en: 'Shoes', ar: 'أحذية' }, slug: 'shoes' },
    ],
  },
  {
    id: 'beauty',
    name: { en: 'Beauty', ar: 'جمال' },
    slug: 'beauty',
    children: [
      { id: 'skincare', name: { en: 'Skincare', ar: 'العناية بالبشرة' }, slug: 'skincare' },
      { id: 'makeup', name: { en: 'Makeup', ar: 'مكياج' }, slug: 'makeup' },
    ],
  },
  {
    id: 'accessories',
    name: { en: 'Accessories', ar: 'إكسسوارات' },
    slug: 'accessories',
  },
  {
    id: 'watches',
    name: { en: 'Watches', ar: 'ساعات' },
    slug: 'watches',
  },
  {
    id: 'fragrance',
    name: { en: 'Fragrance', ar: 'عطور' },
    slug: 'fragrance',
  },
  {
    id: 'home-living',
    name: { en: 'Home & Living', ar: 'المنزل' },
    slug: 'home-living',
  },
];
