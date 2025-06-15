
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import type { Order, OrderStatus, CourierProfile, DeliveryVehicle } from '@/types';
import { getMockOrderById, mockCourierProfiles } from '@/lib/mock-data'; // We'll use mock data for now

import { MatchingCourierView } from '@/components/order/matching-courier-view';
import { CourierAssignedView } from '@/components/order/courier-assigned-view';
import { DeliveryCompleteView } from '@/components/order/delivery-complete-view';
import { TriviaChallengeCard } from '@/components/order/trivia-challenge-card'; // Added
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, Info } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


// Mock courier for CourierAssignedView - choose one from mock data
const getAssignedCourierDetails = (courierId: string): Order['assignedCourier'] => {
    const profile = mockCourierProfiles.find(c => c.id === courierId);
    if (!profile) return undefined;
    return {
        id: profile.id,
        name: profile.name,
        photoUrl: `https://placehold.co/100x100.png`, // Generic placeholder
        dataAiHint: "courier person",
        rating: profile.rating,
        vehicleType: profile.vehicleType,
        currentEtaMinutes: 12 + Math.floor(Math.random() * 8), // Random ETA
        vehicleDetails: profile.transportationModeDetails || `${profile.vehicleType}`,
        liveLocation: profile.currentLocation,
    };
};


export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const router = useRouter();

  const [order, setOrder] = useState<Order | null | undefined>(undefined); // undefined for loading, null for not found
  const [error, setError] = useState<string | null>(null);
  const [triviaAnswered, setTriviaAnswered] = useState(false); // Added for trivia state

  // Simulate order status changes for demo purposes
  const simulateStatusProgression = useCallback(() => {
    if (!order || order.status === 'DELIVERED' || order.status === 'CANCELLED') return;

    let nextStatus: OrderStatus | null = null;
    let delay = 5000 + Math.random() * 5000; // Base delay
    let newCourierInfo: Order['assignedCourier'] | undefined = order.assignedCourier;
    let newTimelineEvent: Order['orderTimeline'][0] | undefined;

    switch (order.status) {
      case 'MATCHING_COURIER':
        nextStatus = 'COURIER_ASSIGNED';
        // Pick a random courier from mock data for simulation
        const randomCourierProfile = mockCourierProfiles[Math.floor(Math.random() * mockCourierProfiles.length)];
        newCourierInfo = getAssignedCourierDetails(randomCourierProfile.id);
        newTimelineEvent = { status: nextStatus, timestamp: new Date().toISOString(), notes: `שליח ${newCourierInfo?.name} שובץ.` };
        delay = 8000; // Longer for matching
        break;
      case 'COURIER_ASSIGNED':
        nextStatus = 'PREPARING_AT_RESTAURANT';
        newTimelineEvent = { status: nextStatus, timestamp: new Date().toISOString(), notes: `${order.restaurantName} מכין/ה את ההזמנה שלך.` };
        break;
      case 'PREPARING_AT_RESTAURANT':
        nextStatus = 'AWAITING_PICKUP';
        newTimelineEvent = { status: nextStatus, timestamp: new Date().toISOString(), notes: `ההזמנה מוכנה. שליח ${order.assignedCourier?.name || 'לא ידוע'} בדרך אל ${order.restaurantName}.` };
        delay = 7000;
        break;
      case 'AWAITING_PICKUP':
        nextStatus = 'OUT_FOR_DELIVERY';
        newTimelineEvent = { status: nextStatus, timestamp: new Date().toISOString(), notes: `שליח ${order.assignedCourier?.name || 'לא ידוע'} אסף את ההזמנה.` };
        delay = 10000; // Simulate travel time
        break;
      case 'OUT_FOR_DELIVERY':
        nextStatus = 'DELIVERED';
        newTimelineEvent = { status: nextStatus, timestamp: new Date().toISOString(), notes: "ההזמנה נמסרה. בתאבון!" };
        delay = 15000 + ((order.assignedCourier?.currentEtaMinutes || 1) * 1000 * 0.5); // Shorter for demo
        break;
    }

    if (nextStatus) {
      const timer = setTimeout(() => {
        setOrder(prev => {
          if (!prev || prev.status !== order.status) return prev; // Stale update check
          const updatedOrder: Order = {
            ...prev,
            status: nextStatus!,
            assignedCourier: newCourierInfo || prev.assignedCourier,
            updatedAt: new Date().toISOString(),
            orderTimeline: newTimelineEvent ? [...(prev.orderTimeline || []), newTimelineEvent] : prev.orderTimeline,
          };
          if (nextStatus === 'OUT_FOR_DELIVERY' && updatedOrder.assignedCourier) {
            updatedOrder.assignedCourier.currentEtaMinutes = Math.max(5, (updatedOrder.assignedCourier.currentEtaMinutes || 15) - 5); // Simulate ETA decrease
          }
          return updatedOrder;
        });
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [order]);


  useEffect(() => {
    if (!orderId) return;
    const fetchedOrder = getMockOrderById(orderId);
    if (!fetchedOrder) {
      setOrder(null); // Not found
      return;
    }
    setOrder(fetchedOrder);
    // Reset trivia state for new order
    const storedTriviaState = localStorage.getItem(`triviaAnswered_${orderId}`);
    if (storedTriviaState === 'true') {
        setTriviaAnswered(true);
    } else {
        setTriviaAnswered(false);
    }

  }, [orderId]);

  useEffect(() => {
    const cleanup = simulateStatusProgression();
    return cleanup;
  }, [order, simulateStatusProgression]);


  // Simulate ETA countdown for OUT_FOR_DELIVERY and AWAITING_PICKUP (if courier assigned)
  useEffect(() => {
    if (order && (order.status === 'OUT_FOR_DELIVERY' || order.status === 'AWAITING_PICKUP') && order.assignedCourier && (order.assignedCourier.currentEtaMinutes || 0) > 0) {
      const etaInterval = setInterval(() => {
        setOrder(prev => {
          if (prev && (prev.status === 'OUT_FOR_DELIVERY' || prev.status === 'AWAITING_PICKUP') && prev.assignedCourier && (prev.assignedCourier.currentEtaMinutes || 0) > 1) {
            const newEta = (prev.assignedCourier.currentEtaMinutes || 0) - 1;
            return {
              ...prev,
              assignedCourier: {
                ...prev.assignedCourier,
                currentEtaMinutes: newEta,
              },
              estimatedDeliveryTime: `${newEta}-${newEta + 5} דק'`, // Update user-facing string too
              updatedAt: new Date().toISOString(),
            };
          } else if (prev && prev.assignedCourier && (prev.assignedCourier.currentEtaMinutes || 0) <= 1 && prev.status === 'OUT_FOR_DELIVERY') {
            // If ETA is 1 or less and out for delivery, force DELIVERED (or a step before)
            // This is a fallback if the main status progression is too slow
            // For now, just stop countdown. Main progression handles 'DELIVERED'.
          }
          return prev;
        });
      }, 60 * 1000); // Update ETA every minute
      return () => clearInterval(etaInterval);
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
     return (
      <div className="text-center py-20 max-w-xl mx-auto">
        <AlertTriangle className="h-24 w-24 mx-auto text-destructive mb-6" />
        <h1 className="text-3xl font-bold font-headline text-destructive mb-4">הזמנה לא נמצאה</h1>
        <p className="text-lg text-muted-foreground mb-8">
          {error || "לא הצלחנו למצוא את ההזמנה שאתה מחפש. ייתכן שהייתה בעיה עם מזהה הזמנה מדומיין או שהיא עדיין לא נוצרה."}
        </p>
        <Button asChild>
          <Link href="/"><span>חזרה לדף הבית</span></Link>
        </Button>
      </div>
    );
  }

  const renderOrderStatusView = () => {
    switch (order.status) {
      case 'MATCHING_COURIER':
        return <MatchingCourierView order={order} />;
      case 'COURIER_ASSIGNED':
      case 'PREPARING_AT_RESTAURANT':
      case 'AWAITING_PICKUP':
      case 'OUT_FOR_DELIVERY':
        return <CourierAssignedView order={order} />;
      case 'DELIVERED':
        return <DeliveryCompleteView order={order} />;
      case 'PENDING_PAYMENT':
         return (
            <Card className="shadow-xl text-center py-10">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-destructive">הזמנה ממתינה לתשלום</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">אנא השלם את התשלום כדי להמשיך עם ההזמנה.</p>
                    <Button onClick={() => router.push('/checkout')} className="mt-6">לתשלום</Button>
                </CardContent>
            </Card>
        );
      case 'CANCELLED':
        return (
            <Card className="shadow-xl text-center py-10">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-destructive">הזמנה בוטלה</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">הזמנה זו בוטלה.</p>
                    {order.orderTimeline?.find(t => t.status === 'CANCELLED')?.notes && (
                        <p className="text-sm mt-2">סיבה: {order.orderTimeline?.find(t => t.status === 'CANCELLED')?.notes}</p>
                    )}
                </CardContent>
            </Card>
        );
      default:
        return <p>סטטוס הזמנה לא ידוע: {order.status}</p>;
    }
  };

  const showTriviaForStatus: OrderStatus[] = ['COURIER_ASSIGNED', 'PREPARING_AT_RESTAURANT', 'AWAITING_PICKUP', 'OUT_FOR_DELIVERY'];
  const shouldShowTrivia = showTriviaForStatus.includes(order.status) && !triviaAnswered;

  const handleTriviaComplete = () => {
    setTriviaAnswered(true);
    localStorage.setItem(`triviaAnswered_${orderId}`, 'true');
  };


  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Button variant="outline" onClick={() => router.push('/')} className="mb-0">
        <ArrowLeft className="mr-2 h-4 w-4" /> חזרה לדף הבית
      </Button>

      {renderOrderStatusView()}

      {shouldShowTrivia && (
        <TriviaChallengeCard
          imageUrl="https://placehold.co/600x400.png"
          imageHint="פיצה פפרוני חריפה"
          questionText="מה המנה שבתמונה?"
          options={["פיצה פפרוני", "המבורגר קלאסי", "סלט קיסר עשיר"]}
          correctAnswer="פיצה פפרוני"
          onTriviaComplete={handleTriviaComplete}
        />
      )}

      <Card>
        <CardHeader>
            <CardTitle className="text-lg font-semibold">ציר זמן הזמנה</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-3">
                {order.orderTimeline?.slice().reverse().map((event, index) => (
                    <li key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                        <Info className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-medium capitalize">{event.status.replace(/_/g, ' ').toLowerCase()}</p>
                            <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString('he-IL')}</p>
                            {event.notes && <p className="text-sm text-muted-foreground italic">{event.notes}</p>}
                        </div>
                    </li>
                ))}
                 {!order.orderTimeline?.length && <p className="text-muted-foreground">אין עדיין אירועים בציר הזמן.</p>}
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
