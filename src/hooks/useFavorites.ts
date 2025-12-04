import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'ev-lodz-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((stationId: string) => {
    setFavorites(prev => {
      if (prev.includes(stationId)) return prev;
      return [...prev, stationId];
    });
  }, []);

  const removeFavorite = useCallback((stationId: string) => {
    setFavorites(prev => prev.filter(id => id !== stationId));
  }, []);

  const toggleFavorite = useCallback((stationId: string) => {
    setFavorites(prev => {
      if (prev.includes(stationId)) {
        return prev.filter(id => id !== stationId);
      }
      return [...prev, stationId];
    });
  }, []);

  const isFavorite = useCallback((stationId: string) => {
    return favorites.includes(stationId);
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length,
  };
}
