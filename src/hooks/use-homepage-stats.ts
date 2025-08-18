'use client';

import { useState, useEffect } from 'react';

export interface HomepageStats {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  activeCouriers: number;
  todayOrders: number;
  monthlyRevenue: number;
  popularRestaurants: Array<{
    id: string;
    name: string;
    rating: number;
    totalOrders: number;
    image?: string;
  }>;
  recentOrders: Array<{
    id: string;
    restaurantName: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: Date;
  }>;
  topCategories: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

export function useHomepageStats() {
  const [stats, setStats] = useState<HomepageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/homepage/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching homepage stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        
        // Fallback to mock data if API fails
        setStats({
          totalUsers: 1250,
          totalRestaurants: 85,
          totalOrders: 3420,
          activeCouriers: Math.floor(Math.random() * 20) + 8,
          todayOrders: 127,
          monthlyRevenue: 45600,
          popularRestaurants: [
            {
              id: '1',
              name: 'מסעדת הבית',
              rating: 4.8,
              totalOrders: 245,
              image: 'https://placehold.co/300x200.png'
            },
            {
              id: '2', 
              name: 'פיצה פלוס',
              rating: 4.6,
              totalOrders: 189,
              image: 'https://placehold.co/300x200.png'
            },
            {
              id: '3',
              name: 'סושי בר',
              rating: 4.9,
              totalOrders: 156,
              image: 'https://placehold.co/300x200.png'
            }
          ],
          recentOrders: [
            {
              id: '1',
              restaurantName: 'מסעדת הבית',
              customerName: 'יוסי כהן',
              total: 89.50,
              status: 'delivered',
              createdAt: new Date(Date.now() - 1000 * 60 * 15)
            },
            {
              id: '2',
              restaurantName: 'פיצה פלוס',
              customerName: 'שרה לוי',
              total: 65.00,
              status: 'preparing',
              createdAt: new Date(Date.now() - 1000 * 60 * 30)
            }
          ],
          topCategories: [
            { name: 'פיצה', count: 145, percentage: 35 },
            { name: 'סושי', count: 98, percentage: 24 },
            { name: 'המבורגר', count: 76, percentage: 18 },
            { name: 'סלטים', count: 45, percentage: 11 },
            { name: 'אחר', count: 50, percentage: 12 }
          ]
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error, refetch: () => fetchStats() };
}

export default useHomepageStats;