
'use client';

import type { Order } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, MessageSquare, Phone, ShieldAlert, Star, Navigation, Bike, Car, Footprints } from 'lucide-react';
import Image from 'next/image'; // For map placeholder

interface CourierAssignedViewProps {
  order: Order;
}

const VehicleIcon = ({ type }: { type: Order['assignedCourier']['vehicleType'] | undefined }) => {
  if (type === 'motorcycle') return <Bike className="h-5 w-5 mr-2 text-primary" />;
  if (type === 'car') return <Car className="h-5 w-5 mr-2 text-primary" />;
  if (type === 'bicycle') return <Bike className="h-5 w-5 mr-2 text-primary" />; // Using Bike for bicycle too
  if (type === 'foot') return <Footprints className="h-5 w-5 mr-2 text-primary" />;
  return null;
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
              <VehicleIcon type={courier.vehicleType} /> {courier.vehicleType}
            </div>
          </div>
        </div>
        <CardDescription className="text-base">
          Your order from <span className="font-semibold text-primary">{order.restaurantName}</span> is {order.status === 'OUT_FOR_DELIVERY' ? 'out for delivery' : 'assigned and being prepared'}.
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
          <p className="text-xs text-center text-muted-foreground p-1 bg-background">Real-time map coming soon!</p>
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
