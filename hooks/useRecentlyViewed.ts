import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'mayar_recently_viewed';
const MAX_ITEMS = 12;

export function useRecentlyViewed() {
  const [viewedIds, setViewedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedIds));
    } catch { /* ignore */ }
  }, [viewedIds]);

  const addViewed = useCallback((productId: string) => {
    setViewedIds(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  return { viewedIds, addViewed };
}
