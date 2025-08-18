import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ApiResponse } from '@/lib/api-response';
import type { Order, OrderStatus } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    // Get current month range
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    // Get recent orders with restaurant and user info
    const recentOrdersData = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        status: true,
        totalPrice: true,
        deliveryFee: true,
        createdAt: true,
        estimatedDeliveryTime: true,
        deliveryAddress: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            tags: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            menuItem: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    // Transform data to match Order type
    const recentOrders: Order[] = recentOrdersData.map(order => ({
      id: order.id,
      userId: order.user?.id || '',
      items: order.orderItems.map(item => ({
        id: item.id,
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.unitPrice,
        quantity: item.quantity,
        imageUrl: item.menuItem.imageUrl || 'https://placehold.co/100x100.png',
        restaurantId: order.restaurant.id,
      })),
      totalAmount: order.totalPrice,
      deliveryPreference: 'fastest' as const,
      deliveryFee: order.deliveryFee || 0,
      discountAmount: 0,
      finalAmount: order.totalPrice + (order.deliveryFee || 0),
      status: mapPrismaStatusToOrderStatus(order.status),
      deliveryAddress: order.deliveryAddress || '',
      restaurantId: order.restaurant.id,
      restaurantName: order.restaurant.name,
      estimatedDeliveryTime: order.estimatedDeliveryTime?.toISOString(),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.createdAt.toISOString(),
    }));

    function mapPrismaStatusToOrderStatus(status: string): OrderStatus {
      const statusMap: Record<string, OrderStatus> = {
        'pending': 'PENDING_PAYMENT',
        'confirmed': 'PREPARING_AT_RESTAURANT',
        'preparing': 'PREPARING_AT_RESTAURANT',
        'ready': 'AWAITING_PICKUP',
        'delivered': 'DELIVERED',
        'cancelled': 'CANCELLED',
      };
      return statusMap[status] || 'PENDING_PAYMENT';
    }

    // Get total orders count
    const totalOrders = await prisma.order.count();

    // Get today's orders count
    const todayOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    // Get monthly revenue
    const monthlyRevenueResult = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
        status: {
          in: ['delivered', 'ready'], // Only count completed orders
        },
      },
      _sum: {
        total: true,
      },
    });

    const monthlyRevenue = monthlyRevenueResult._sum.total || 0;

    const result = {
      recentOrders,
      totalOrders,
      todayOrders,
      monthlyRevenue: Number(monthlyRevenue),
    };

    return ApiResponse.success(result);
  } catch (error) {
    console.error('Error fetching orders for homepage:', error);
    return ApiResponse.error('Failed to fetch orders', 500);
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