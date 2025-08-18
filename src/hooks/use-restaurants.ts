'use client';

import { useState, useEffect } from 'react';
import type { Restaurant } from '@/types';

export interface RestaurantsData {
  restaurants: Restaurant[];
  recommendedForYou: Restaurant[];
  newInArea: Restaurant[];
  recentlyViewed: Restaurant[];
  totalCount: number;
}

export function useRestaurants() {
  const [data, setData] = useState<RestaurantsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/restaurants/homepage', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch restaurants');
        
        // Fallback to empty data if API fails
        setData({
          restaurants: [],
          recommendedForYou: [],
          newInArea: [],
          recentlyViewed: [],
          totalCount: 0
        });
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  return { data, loading, error, refetch: () => fetchRestaurants() };
}

export default useRestaurants;