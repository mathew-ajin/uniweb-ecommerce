import type { TranslatedText } from './index';
import type { StaticImageData } from "next/image";
export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: TranslatedText;
  image: string | StaticImageData;
  brand?: TranslatedText;
  color?: string;
  colorHex?: string;
  size?: string;
  quantity: number;
  unitPrice: number; // KWD base
  compareAtPrice?: number; // KWD base
  inStock: boolean;
  maxQuantity: number;
}

export interface CartState {
  items: CartItem[];
  updatedAt: number;
}
