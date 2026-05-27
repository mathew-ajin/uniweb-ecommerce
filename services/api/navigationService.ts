/**
 * Navigation API Service — updated to use shared catalog service
 */

import { generateNavbarItems, type GeneratedMegaMenu } from '@/services/catalogService';

const delay = <T>(data: T, ms = 80): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const navigationApi = {
  getNavigationMenu: () => delay<GeneratedMegaMenu[]>(generateNavbarItems()),

  getMegaMenuBySlug: (slug: string) =>
    delay(generateNavbarItems().find(i => i.slug === `/${slug}` || i.slug === slug)),
};
