
'use client';

import type { Order, DeliveryVehicle, OrderStatus } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, MessageSquare, Phone, ShieldAlert, Star, Navigation, Bike, Car, Footprints, Shirt } from 'lucide-react'; // Using Shirt for generic vehicle details
import Image from 'next/image'; // For map placeholder

interface CourierAssignedViewProps {
  order: Order;
}

const getOrderStatusHebrew = (status: OrderStatus): string => {
    const map: Record<OrderStatus, string> = {
        PENDING_PAYMENT: 'ממתין לתשלום',
        SCHEDULED: 'מתוכנן',
        MATCHING_COURIER: 'מחפש שליח',
        COURIER_ASSIGNED: 'שליח שובץ',
        PREPARING_AT_RESTAURANT: 'בהכנה במסעדה',
        AWAITING_PICKUP: 'ממתין לאיסוף',
        OUT_FOR_DELIVERY: 'בדרך אליך',
        DELIVERED: 'נמסר',
        CANCELLED: 'בוטל'
    };
    return map[status] || status.toString().replace(/_/g, ' ').toLowerCase();
}


const VehicleIcon = ({ type }: { type: DeliveryVehicle | undefined }) => {
  if (type === 'motorcycle') return <Bike className="h-5 w-5 mr-1 text-primary" />;
  if (type === 'scooter') return <Bike className="h-5 w-5 mr-1 text-primary" />; // Placeholder
  if (type === 'car') return <Car className="h-5 w-5 mr-1 text-primary" />;
  if (type === 'bicycle') return <Bike className="h-5 w-5 mr-1 text-primary" />;
  if (type === 'foot') return <Footprints className="h-5 w-5 mr-1 text-primary" />;
  return <Shirt className="h-5 w-5 mr-1 text-primary" />; // Default icon
};


export function CourierAssignedView({ order }: CourierAssignedViewProps) {
  const courier = order.assignedCourier;

  if (!courier) {
    return (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>פרטי השליח לא זמינים</CardTitle>
        </CardHeader>
        <CardContent>
          <p>אירעה שגיאה בטעינת פרטי השליח. אנא רענן/י או פנה/י לתמיכה.</p>
        </CardContent>
      </Card>
    );
  }

  const mapPlaceholderUrl = `https://placehold.co/800x400.png`; // Replace with actual map

  return (
    <Card className="shadow-xl animate-fadeIn">
      <CardHeader>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={courier.photoUrl || 'https://placehold.co/100x100.png'} alt={courier.name} data-ai-hint="courier person" />
            <AvatarFallback>{courier.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-headline text-primary">{courier.name} בדרך אליך!</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" /> {courier.rating.toFixed(1)}
              <span className="mx-2">|</span>
              <VehicleIcon type={courier.vehicleType} />
              <span className="capitalize">{courier.vehicleType}</span>
              {courier.vehicleDetails && <span className="ml-1 text-xs">({courier.vehicleDetails})</span>}
            </div>
          </div>
        </div>
        <CardDescription className="text-base">
          ההזמנה שלך מ<span className="font-semibold text-primary">{order.restaurantName}</span> נמצאת בסטטוס <span className="font-medium">{getOrderStatusHebrew(order.status)}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 border rounded-lg bg-muted/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">זמן הגעה משוער</p>
              <p className="text-2xl font-semibold text-accent">
                {courier.currentEtaMinutes !== undefined ? `${courier.currentEtaMinutes} דקות` : order.estimatedDeliveryTime || 'בקרוב'}
              </p>
            </div>
            <Navigation className="h-10 w-10 text-primary" />
          </div>
           {order.status === 'AWAITING_PICKUP' && <p className="text-xs text-center mt-2 text-blue-600">השליח בדרך אל {order.restaurantName}.</p>}
           {order.status === 'PREPARING_AT_RESTAURANT' && <p className="text-xs text-center mt-2 text-orange-600">{order.restaurantName} מכין/ה את הזמנתך.</p>}
        </div>

        {/* Map Placeholder */}
        <div className="aspect-video rounded-lg overflow-hidden border shadow-inner">
          <Image
            src={mapPlaceholderUrl}
            alt="מפת משלוח (Placeholder)"
            width={800}
            height={400}
            layout="responsive"
            objectFit="cover"
            data-ai-hint="map delivery route"
          />
          <p className="text-xs text-center text-muted-foreground p-1 bg-background">מפה בזמן אמת תופיע בקרוב! (מיקום שליח: {courier.liveLocation ? `${courier.liveLocation.lat.toFixed(4)}, ${courier.liveLocation.lng.toFixed(4)}` : 'לא זמין'})</p>
        </div>

        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
          משלוח לכתובת: {order.deliveryAddress}
        </div>

      </CardContent>
      <CardFooter className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t pt-4">
        <Button variant="outline" className="w-full">
          <MessageSquare className="mr-2 h-4 w-4" /> צ'אט עם השליח
        </Button>
        <Button variant="outline" className="w-full">
          <Phone className="mr-2 h-4 w-4" /> התקשר לשליח
        </Button>
        <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
          <ShieldAlert className="mr-2 h-4 w-4" /> דווח על בעיה
        </Button>
      </CardFooter>
    </Card>
  );
}
