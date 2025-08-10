import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { Order, Restaurant } from '@prisma/client';

export async function GET() {
  try {
    // Fetch open orders for bidding from the database
    const openOrders = await prisma.order.findMany({
      where: { status: 'open' },
      include: {
        restaurant: true,
      },
    });

    // Transform data to match the expected structure
    const orders = openOrders.map((order: Order & { restaurant: Restaurant }) => ({
      orderId: order.id,
      restaurantName: order.restaurant.name,
      restaurantLocation: order.restaurant.location,
      deliveryAddress: order.deliveryAddress,
      deliveryLocation: order.deliveryLocation,
      estimatedDistanceKm: order.estimatedDistanceKm,
      estimatedRouteDistanceKm: order.estimatedRouteDistanceKm,
      baseCommission: order.baseCommission,
      itemsDescription: order.itemsDescription,
      expectedPickupTime: order.expectedPickupTime,
      orderValue: order.orderValue,
      customerNotes: order.customerNotes,
      requiredVehicleType: order.requiredVehicleType,
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching open orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}