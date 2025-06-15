
import { mockOpenOrdersForBidding, getRestaurantById } from '@/lib/mock-data';
import type { OrderDetailsForBidding, DeliveryVehicle } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Clock, Package, DollarSign, ArrowRight, AlertTriangle, Bike, Car, Footprints, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Helper to get vehicle icon
const VehicleIcon = ({ type }: { type: DeliveryVehicle | undefined }) => {
  if (type === 'motorcycle') return <Bike className="inline h-4 w-4" title="אופנוע" />;
  if (type === 'scooter') return <Bike className="inline h-4 w-4" title="קטנוע" />; 
  if (type === 'car') return <Car className="inline h-4 w-4" title="רכב" />;
  if (type === 'bicycle') return <Bike className="inline h-4 w-4" title="אופניים" />;
  if (type === 'foot') return <Footprints className="inline h-4 w-4" title="הולך רגל" />;
  return null;
};

export default function OpenBidsPage() {
  const openOrders: OrderDetailsForBidding[] = mockOpenOrdersForBidding;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold font-headline text-primary">הצעות משלוח פתוחות</h1>
        <p className="text-lg text-muted-foreground">
          מצא והגש הצעות להזדמנויות משלוח זמינות. הזדמנויות חדשות מופיעות בזמן אמת.
        </p>
      </header>

      {openOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openOrders.map((order) => {
            const restaurant = getRestaurantById(order.restaurantName === 'Pizza Palace' ? 'restaurant1' : 'restaurant2'); // Simplified mapping
            return (
            <Card key={order.orderId} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-headline text-primary truncate">הזמנה מ{order.restaurantName}</CardTitle>
                    <Badge variant="secondary">~{order.estimatedRouteDistanceKm || order.estimatedDistanceKm} ק"מ</Badge>
                </div>
                <CardDescription>משלוח אל: {order.deliveryAddress}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-grow">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Package className="h-4 w-4 mr-2 text-accent flex-shrink-0" />
                  <span className="truncate">{order.itemsDescription}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
                  <span>עמלה בסיסית: ₪{order.baseCommission.toFixed(2)} (ערך: ~₪{order.orderValue?.toFixed(2)})</span>
                </div>
                 <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-accent flex-shrink-0" />
                  <span>איסוף: {order.expectedPickupTime}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-accent flex-shrink-0" />
                  <span className="truncate">מסעדה: {restaurant?.location || 'לא זמין'}</span>
                </div>
                {order.requiredVehicleType && order.requiredVehicleType.length > 0 && (
                    <div className="flex items-center text-xs text-muted-foreground">
                        <AlertTriangle className="h-3 w-3 mr-1 text-yellow-600 flex-shrink-0" />
                        <span>רכב נדרש: {order.requiredVehicleType.map(v => <VehicleIcon key={v} type={v as DeliveryVehicle} />).reduce((prev, curr, idx) => <>{prev}{idx > 0 ? ', ' : ''}{curr}</>, <></>)}</span>
                    </div>
                )}
                {order.customerNotes && (
                  <div className="flex items-start text-xs text-muted-foreground p-1.5 bg-blue-50 border border-blue-100 rounded">
                    <Info className="h-3 w-3 mr-1.5 mt-0.5 text-blue-500 flex-shrink-0" />
                    <span className="italic truncate">הערה: {order.customerNotes}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href={`/courier/bids/${order.orderId}`}>
                    צפה והגש הצעה <ArrowRight className="ml-2 h-4 w-4" />
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
          <h2 className="text-2xl font-bold text-primary mb-4">אין כרגע הצעות פתוחות</h2>
          <p className="text-muted-foreground">אנא בדוק/י שוב בקרוב להזדמנויות משלוח חדשות.</p>
        </div>
      )}
      <p className="text-center text-sm text-muted-foreground mt-8">
        הערה: באפליקציה אמיתית, דף זה יתעדכן בזמן אמת עם הזמנות חדשות.
      </p>
    </div>
  );
}
