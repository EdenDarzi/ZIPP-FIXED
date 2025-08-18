import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ApiResponse } from '@/lib/api-response';
import type { Restaurant } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Get all restaurants with their basic info
    const restaurantsData = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        rating: true,
        deliveryTime: true,
        deliveryFee: true,
        minimumOrder: true,
        cuisine: true,
        address: true,
        phone: true,
        isOpen: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            menuItems: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
    });

    // Transform data to match Restaurant type
    const restaurants: Restaurant[] = restaurantsData.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      description: restaurant.description || '',
      image: restaurant.image || 'https://placehold.co/400x300.png',
      rating: restaurant.rating || 0,
      deliveryTime: restaurant.deliveryTime || '30-45 דקות',
      deliveryFee: restaurant.deliveryFee || 0,
      minimumOrder: restaurant.minimumOrder || 0,
      cuisine: restaurant.cuisine || 'כללי',
      address: restaurant.address || '',
      phone: restaurant.phone || '',
      isOpen: restaurant.isOpen ?? true,
      tags: getRestaurantTags(restaurant, restaurant._count.orders),
      totalOrders: restaurant._count.orders,
      menuItemsCount: restaurant._count.menuItems,
    }));

    // Get recommended restaurants (top rated with good order count)
    const recommendedForYou = restaurants
      .filter(r => r.rating >= 4.5 && r.totalOrders > 10)
      .slice(0, 3);

    // Get new restaurants (created in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newInArea = restaurants
      .filter(r => {
        const restaurantData = restaurantsData.find(rd => rd.id === r.id);
        return restaurantData && restaurantData.createdAt >= thirtyDaysAgo;
      })
      .slice(0, 3);

    // Get recently viewed (for now, just popular ones as we don't have user session)
    const recentlyViewed = restaurants
      .filter(r => r.totalOrders > 5)
      .slice(1, 4);

    const result = {
      restaurants: restaurants.slice(0, 12), // Limit for homepage
      recommendedForYou,
      newInArea,
      recentlyViewed,
      totalCount: restaurants.length,
    };

    return ApiResponse.success(result);
  } catch (error) {
    console.error('Error fetching restaurants for homepage:', error);
    return ApiResponse.error('Failed to fetch restaurants', 500);
  }
}

// Helper function to generate tags based on restaurant data
function getRestaurantTags(restaurant: any, orderCount: number): string[] {
  const tags: string[] = [];
  
  // Add rating-based tags
  if (restaurant.rating >= 4.8) {
    tags.push('Top Rated');
  }
  if (restaurant.rating >= 4.5) {
    tags.push('Recommended');
  }
  
  // Add order-based tags
  if (orderCount > 100) {
    tags.push('Popular');
  }
  if (orderCount > 50) {
    tags.push('Trending');
  }
  
  // Add time-based tags
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  if (restaurant.createdAt >= thirtyDaysAgo) {
    tags.push('New');
  }
  
  // Add delivery-based tags
  if (restaurant.deliveryFee === 0) {
    tags.push('Free Delivery');
  }
  if (restaurant.minimumOrder <= 50) {
    tags.push('Low Minimum');
  }
  
  // Add cuisine-based tags
  if (restaurant.cuisine) {
    tags.push(restaurant.cuisine);
  }
  
  return tags;
}

// Add CORS headers for development
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}