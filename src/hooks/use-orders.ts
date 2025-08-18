'use client';

import { useState, useEffect } from 'react';
import type { Order } from '@/types';

export interface OrdersData {
  recentOrders: Order[];
  totalOrders: number;
  todayOrders: number;
  monthlyRevenue: number;
}

export function useOrders() {
  const [data, setData] = useState<OrdersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/orders/homepage', {
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
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        
        // Fallback to empty data if API fails
        setData({
          recentOrders: [],
          totalOrders: 0,
          todayOrders: 0,
          monthlyRevenue: 0
        });
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
    
    // Refresh data every 2 minutes
    const interval = setInterval(fetchOrders, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchOrders };
}

export default useOrders;