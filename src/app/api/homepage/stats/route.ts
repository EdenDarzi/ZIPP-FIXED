import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ApiResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    // Get total users count
    const totalUsers = await prisma.user.count();

    // Get total restaurants count
    const totalRestaurants = await prisma.restaurant.count();

    // Get total orders count
    const totalOrders = await prisma.order.count();

    // Get today's orders count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Get monthly revenue (current month)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    
    const monthlyRevenueResult = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: 'delivered',
      },
      _sum: {
        totalPrice: true,
      },
    });

    const monthlyRevenue = monthlyRevenueResult._sum.totalPrice || 0;

    // Get popular restaurants (top 3 by order count)
    const popularRestaurantsData = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        rating: true,
        imageUrl: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        orders: {
          _count: 'desc',
        },
      },
      take: 3,
    });

    const popularRestaurants = popularRestaurantsData.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      rating: restaurant.rating || 0,
      totalOrders: restaurant._count.orders,
      image: restaurant.imageUrl || 'https://placehold.co/300x200.png',
    }));

    // Get recent orders (last 10)
    const recentOrdersData = await prisma.order.findMany({
      select: {
        id: true,
        totalPrice: true,
        status: true,
        createdAt: true,
        restaurant: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    const recentOrders = recentOrdersData.map(order => ({
      id: order.id,
      restaurantName: order.restaurant?.name || 'Unknown Restaurant',
      customerName: order.user?.fullName || 'Unknown Customer',
      total: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
    }));

    // Get top categories (this would need a categories table or field)
    // For now, we'll use mock data since the schema might not have categories
    const topCategories = [
      { name: 'פיצה', count: 145, percentage: 35 },
      { name: 'סושי', count: 98, percentage: 24 },
      { name: 'המבורגר', count: 76, percentage: 18 },
      { name: 'סלטים', count: 45, percentage: 11 },
      { name: 'אחר', count: 50, percentage: 12 }
    ];

    // Simulate active couriers (random number between 8-28)
    const activeCouriers = Math.floor(Math.random() * 20) + 8;

    const stats = {
      totalUsers,
      totalRestaurants,
      totalOrders,
      activeCouriers,
      todayOrders,
      monthlyRevenue: Number(monthlyRevenue),
      popularRestaurants,
      recentOrders,
      topCategories,
    };

    return ApiResponse.success(stats);
  } catch (error) {
    console.error('Error fetching homepage stats:', error);
    return ApiResponse.error('Failed to fetch homepage statistics', 500);
  }
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