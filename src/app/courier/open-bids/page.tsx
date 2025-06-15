
import { mockOpenOrdersForBidding, getRestaurantById } from '@/lib/mock-data';
import type { OrderDetailsForBidding } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Clock, Package, DollarSign, ArrowRight } from 'lucide-react';

export default function OpenBidsPage() {
  const openOrders: OrderDetailsForBidding[] = mockOpenOrdersForBidding;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold font-headline text-primary">Open Delivery Bids</h1>
        <p className="text-lg text-muted-foreground">
          Find and bid on available delivery opportunities. New opportunities appear in real-time.
        </p>
      </header>

      {openOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openOrders.map((order) => {
            const restaurant = getRestaurantById(order.restaurantName === 'Pizza Palace' ? 'restaurant1' : 'restaurant2'); // Simplified mapping
            return (
            <Card key={order.orderId} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-headline text-primary truncate">Order from {order.restaurantName}</CardTitle>
                <CardDescription>Deliver to: {order.deliveryAddress}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-grow">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Package className="h-4 w-4 mr-2 text-accent" />
                  <span>{order.itemsDescription}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-accent" />
                  <span>Restaurant: {restaurant?.location || 'N/A'}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                  <span>Base Commission: ₪{order.baseCommission.toFixed(2)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-accent" />
                  <span>Est. Distance: {order.estimatedDistanceKm} km</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href={`/courier/bids/${order.orderId}`}>
                    View & Bid <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h2 className="text-2xl font-bold text-primary mb-4">No Open Bids Currently</h2>
          <p className="text-muted-foreground">Please check back soon for new delivery opportunities.</p>
        </div>
      )}
      <p className="text-center text-sm text-muted-foreground mt-8">
        Note: In a real application, this page would update in real-time with new orders.
      </p>
    </div>
  );
}
