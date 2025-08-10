import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  const { orderId } = params;

  try {
    // Fetch order details for bidding from the database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        restaurant: true,
        courierBids: {
          include: {
            courier: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Transform data to match the expected structure
    const orderDetails = {
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
      bids: order.courierBids.map((bid: any) => ({
        bidId: bid.id,
        courierId: bid.courierId,
        courierName: bid.courier.name,
        bidAmount: bid.amount,
        proposedEtaMinutes: bid.etaMinutes,
        courierRating: bid.courier.rating,
        courierTrustScore: bid.courier.trustScore,
        vehicleType: bid.courier.vehicleType,
        timestamp: bid.createdAt,
        isFastPickup: bid.isFastPickup,
        status: bid.status,
      })),
    };

    return NextResponse.json(orderDetails);
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}