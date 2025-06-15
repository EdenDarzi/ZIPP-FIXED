
'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import type { Order, OrderStatus, CourierProfile } from '@/types';
import { getMockOrderById } from '@/lib/mock-data'; // We'll use mock data for now

import { MatchingCourierView } from '@/components/order/matching-courier-view';
import { CourierAssignedView } from '@/components/order/courier-assigned-view';
import { DeliveryCompleteView } from '@/components/order/delivery-complete-view';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// Mock courier for CourierAssignedView
const mockCourier: NonNullable<Order['assignedCourier']> = {
  id: 'courierAssigned1',
  name: 'Dave Driver',
  photoUrl: 'https://placehold.co/100x100.png',
  rating: 4.7,
  vehicleType: 'car',
  currentEtaMinutes: 12,
};


export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const router = useRouter();

  const [order, setOrder] = useState<Order | null | undefined>(undefined); // undefined for loading, null for not found
  const [error, setError] = useState<string | null>(null);

  // Simulate order status changes for demo purposes
  useEffect(() => {
    if (!orderId) return;

    const fetchedOrder = getMockOrderById(orderId); // In real app, fetch from backend
    if (!fetchedOrder) {
      setOrder(null); // Not found
      return;
    }
    
    setOrder(fetchedOrder);

    // Simulate status progression
    if (fetchedOrder.status === 'MATCHING_COURIER') {
      const timer1 = setTimeout(() => {
        setOrder(prev => prev ? {
          ...prev, 
          status: 'COURIER_ASSIGNED',
          assignedCourier: mockCourier,
          estimatedDeliveryTime: `${mockCourier.currentEtaMinutes}-${(mockCourier.currentEtaMinutes || 0) + 5} minutes`,
          updatedAt: new Date().toISOString(),
        } : null);
      }, 8000); // Match after 8 seconds

      return () => clearTimeout(timer1);
    }
  }, [orderId]);


  useEffect(() => {
    if (order?.status === 'COURIER_ASSIGNED') {
      const timer2 = setTimeout(() => {
         setOrder(prev => prev ? {
          ...prev, 
          status: 'OUT_FOR_DELIVERY',
          updatedAt: new Date().toISOString(),
        } : null);
      }, 10000); // Out for delivery after 10 more seconds

      // Simulate ETA countdown for OUT_FOR_DELIVERY
      const etaInterval = setInterval(() => {
        setOrder(prev => {
          if (prev && prev.status === 'OUT_FOR_DELIVERY' && prev.assignedCourier && (prev.assignedCourier.currentEtaMinutes || 0) > 0) {
            const newEta = (prev.assignedCourier.currentEtaMinutes || 0) - 1;
            return {
              ...prev,
              assignedCourier: {
                ...prev.assignedCourier,
                currentEtaMinutes: newEta,
              },
              estimatedDeliveryTime: `${newEta}-${newEta + 5} minutes`,
              updatedAt: new Date().toISOString(),
            };
          }
          return prev;
        });
      }, 60 * 1000); // Update ETA every minute


      const timer3 = setTimeout(() => {
        setOrder(prev => prev ? {
          ...prev, 
          status: 'DELIVERED',
          updatedAt: new Date().toISOString(),
        } : null);
        clearInterval(etaInterval);
      }, 25000 + ( (order.assignedCourier?.currentEtaMinutes || 1) * 1000 ) ); // Delivered after 25 more seconds (+ remaining ETA)

      return () => {
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearInterval(etaInterval);
      }
    }
  }, [order?.status, order?.assignedCourier?.currentEtaMinutes]);


  if (order === undefined) { // Loading state
    return (
      <div className="space-y-6 max-w-3xl mx-auto py-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (order === null || error) {
    // This will be caught by notFound() if desired, or render custom UI
    // For now, custom UI
     return (
      <div className="text-center py-20 max-w-xl mx-auto">
        <AlertTriangle className="h-24 w-24 mx-auto text-destructive mb-6" />
        <h1 className="text-3xl font-bold font-headline text-destructive mb-4">Order Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          {error || "We couldn't find the order you're looking for. It might have been an issue with a mock order ID."}
        </p>
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }


  const renderOrderStatusView = () => {
    switch (order.status) {
      case 'MATCHING_COURIER':
        return <MatchingCourierView order={order} />;
      case 'COURIER_ASSIGNED':
      case 'OUT_FOR_DELIVERY':
        return <CourierAssignedView order={order} />;
      case 'DELIVERED':
        return <DeliveryCompleteView order={order} />;
      case 'PENDING_PAYMENT':
         return (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold">Order Pending Payment</h2>
            <p className="text-muted-foreground">Please complete your payment to proceed.</p>
            <Button onClick={() => router.push('/checkout')} className="mt-4">Go to Checkout</Button>
          </div>
        );
      case 'CANCELLED':
        return (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold text-destructive">Order Cancelled</h2>
            <p className="text-muted-foreground">This order has been cancelled.</p>
          </div>
        );
      default:
        return <p>Unknown order status: {order.status}</p>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Button variant="outline" onClick={() => router.push('/')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>
      {renderOrderStatusView()}
    </div>
  );
}
