
'use client';

import type { Order, DeliveryVehicle } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, MessageSquare, Phone, ShieldAlert, Star, Navigation, Bike, Car, Footprints, Shirt } from 'lucide-react'; // Using Shirt for generic vehicle details
import Image from 'next/image'; // For map placeholder

interface CourierAssignedViewProps {
  order: Order;
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
          <CardTitle>Courier Information Unavailable</CardTitle>
        </CardHeader>
        <CardContent>
          <p>There was an issue loading courier details. Please refresh or contact support.</p>
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
            <CardTitle className="text-2xl font-headline text-primary">{courier.name} is on the way!</CardTitle>
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
          Your order from <span className="font-semibold text-primary">{order.restaurantName}</span> is <span className="font-medium">{order.status.replace(/_/g, ' ').toLowerCase()}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 border rounded-lg bg-muted/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Estimated Arrival</p>
              <p className="text-2xl font-semibold text-accent">
                {courier.currentEtaMinutes !== undefined ? `${courier.currentEtaMinutes} min` : order.estimatedDeliveryTime || 'Soon'}
              </p>
            </div>
            <Navigation className="h-10 w-10 text-primary" />
          </div>
           {order.status === 'AWAITING_PICKUP' && <p className="text-xs text-center mt-2 text-blue-600">Courier is heading to {order.restaurantName}.</p>}
           {order.status === 'PREPARING_AT_RESTAURANT' && <p className="text-xs text-center mt-2 text-orange-600">{order.restaurantName} is preparing your order.</p>}
        </div>

        {/* Map Placeholder */}
        <div className="aspect-video rounded-lg overflow-hidden border shadow-inner">
          <Image
            src={mapPlaceholderUrl}
            alt="Delivery map placeholder"
            width={800}
            height={400}
            layout="responsive"
            objectFit="cover"
            data-ai-hint="map delivery route"
          />
          <p className="text-xs text-center text-muted-foreground p-1 bg-background">Real-time map coming soon! (Courier live location: {courier.liveLocation ? `${courier.liveLocation.lat.toFixed(4)}, ${courier.liveLocation.lng.toFixed(4)}` : 'N/A'})</p>
        </div>

        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
          Delivering to: {order.deliveryAddress}
        </div>

      </CardContent>
      <CardFooter className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t pt-4">
        <Button variant="outline" className="w-full">
          <MessageSquare className="mr-2 h-4 w-4" /> Chat with Courier
        </Button>
        <Button variant="outline" className="w-full">
          <Phone className="mr-2 h-4 w-4" /> Call Courier
        </Button>
        <Button variant="destructive-outline" className="w-full">
          <ShieldAlert className="mr-2 h-4 w-4" /> Report Problem
        </Button>
      </CardFooter>
    </Card>
  );
}
