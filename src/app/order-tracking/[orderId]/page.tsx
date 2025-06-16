
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, notFound, useRouter, useSearchParams } from 'next/navigation';
import type { Order, OrderStatus, CourierProfile, DeliveryVehicle } from '@/types';
import { getMockOrderById, mockCourierProfiles } from '@/lib/mock-data'; 

import { MatchingCourierView } from '@/components/order/matching-courier-view';
import { CourierAssignedView } from '@/components/order/courier-assigned-view';
import { DeliveryCompleteView } from '@/components/order/delivery-complete-view';
import { TriviaChallengeCard } from '@/components/order/trivia-challenge-card'; 
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, Info, Clock, Award, Gamepad2, Edit } from 'lucide-react'; 
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast'; 

const getOrderStatusHebrew = (status: OrderStatus): string => {
    const map: Record<OrderStatus, string> = {
        PENDING_PAYMENT: 'ממתין לתשלום',
        SCHEDULED: 'מתוכנן',
        MATCHING_COURIER: 'מחפש שליח',
        COURIER_ASSIGNED: 'שליח שובץ',
        PREPARING_AT_RESTAURANT: 'בהכנה במסעדה',
        AWAITING_PICKUP: 'ממתין לאיסוף',
        OUT_FOR_DELIVERY: 'בדרך ללקוח',
        DELIVERED: 'נמסר',
        CANCELLED: 'בוטל'
    };
    return map[status] || status.replace(/_/g, ' ').toLowerCase();
}

const getAssignedCourierDetails = (courierId: string): Order['assignedCourier'] => {
    const profile = mockCourierProfiles.find(c => c.id === courierId);
    if (!profile) return undefined;
    return {
        id: profile.id, name: profile.name, photoUrl: `https://placehold.co/100x100.png`, dataAiHint: "courier person", rating: profile.rating, vehicleType: profile.vehicleType, currentEtaMinutes: 12 + Math.floor(Math.random() * 8), vehicleDetails: profile.transportationModeDetails || `${profile.vehicleType}`, liveLocation: profile.currentLocation,
    };
};

export default function OrderTrackingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const router = useRouter();
  const { toast } = useToast(); 

  const [order, setOrder] = useState<Order | null | undefined>(undefined); 
  const [customerNotes, setCustomerNotes] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [triviaAnswered, setTriviaAnswered] = useState(false); 
  const [showGamificationHint, setShowGamificationHint] = useState(false);

  const simulateStatusProgression = useCallback(() => {
    if (!order || order.status === 'DELIVERED' || order.status === 'CANCELLED' || order.status === 'SCHEDULED') return;

    let nextStatus: OrderStatus | null = null;
    let delay = 5000 + Math.random() * 5000; 
    let newCourierInfo: Order['assignedCourier'] | undefined = order.assignedCourier;
    let newTimelineEvent: Order['orderTimeline'][0] | undefined;

    switch (order.status) {
      case 'MATCHING_COURIER':
        nextStatus = 'COURIER_ASSIGNED';
        const randomCourierProfile = mockCourierProfiles[Math.floor(Math.random() * mockCourierProfiles.length)];
        newCourierInfo = getAssignedCourierDetails(randomCourierProfile.id);
        newTimelineEvent = { status: nextStatus, timestamp: new Date().toISOString(), notes: `שליח ${newCourierInfo?.name} שובץ.` };
        delay = 8000; 
        setShowGamificationHint(true); 
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
        delay = 10000; 
        break;
      case 'OUT_FOR_DELIVERY':
        nextStatus = 'DELIVERED';
        newTimelineEvent = { status: nextStatus, timestamp: new Date().toISOString(), notes: "ההזמנה נמסרה. בתאבון!" };
        delay = 15000 + ((order.assignedCourier?.currentEtaMinutes || 1) * 1000 * 0.5); 
        setShowGamificationHint(false); 
        break;
    }

    if (nextStatus) {
      const timer = setTimeout(() => {
        setOrder(prev => {
          if (!prev || prev.status !== order.status) return prev; 
          const updatedOrder: Order = {
            ...prev, status: nextStatus!, assignedCourier: newCourierInfo || prev.assignedCourier, updatedAt: new Date().toISOString(), orderTimeline: newTimelineEvent ? [...(prev.orderTimeline || []), newTimelineEvent] : prev.orderTimeline,
          };
          if (nextStatus === 'OUT_FOR_DELIVERY' && updatedOrder.assignedCourier) {
            updatedOrder.assignedCourier.currentEtaMinutes = Math.max(5, (updatedOrder.assignedCourier.currentEtaMinutes || 15) - 5); 
          }
          return updatedOrder;
        });
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [order]);

  useEffect(() => {
    if (!orderId) return;
    const notesFromQuery = searchParams.get('notes');
    if (notesFromQuery) {
      setCustomerNotes(decodeURIComponent(notesFromQuery));
    }

    let extractedScheduledTime: string | undefined = undefined;
    if (orderId.includes('_scheduled_')) {
        const parts = orderId.split('_scheduled_');
        if (parts.length > 1 && parts[1]) {
            extractedScheduledTime = decodeURIComponent(parts[1]);
        }
    }
    const fetchedOrder = getMockOrderById(orderId, extractedScheduledTime);
    if (!fetchedOrder) {
      setOrder(null); 
      return;
    }
    if (notesFromQuery) {
        fetchedOrder.customerNotes = decodeURIComponent(notesFromQuery);
    }
    setOrder(fetchedOrder);
    
    const storedTriviaState = localStorage.getItem(`triviaAnswered_${orderId.split('_scheduled_')[0]}`); 
    if (storedTriviaState === 'true') {
        setTriviaAnswered(true);
    } else {
        setTriviaAnswered(false);
    }
    if (fetchedOrder.status === 'COURIER_ASSIGNED' || fetchedOrder.status === 'PREPARING_AT_RESTAURANT' || fetchedOrder.status === 'AWAITING_PICKUP' || fetchedOrder.status === 'OUT_FOR_DELIVERY') {
        setShowGamificationHint(true);
    }

  }, [orderId, searchParams]);

  useEffect(() => {
    const cleanup = simulateStatusProgression();
    return cleanup;
  }, [order, simulateStatusProgression]);

  useEffect(() => {
    if (order && (order.status === 'OUT_FOR_DELIVERY' || order.status === 'AWAITING_PICKUP') && order.assignedCourier && (order.assignedCourier.currentEtaMinutes || 0) > 0) {
      const etaInterval = setInterval(() => {
        setOrder(prev => {
          if (prev && (prev.status === 'OUT_FOR_DELIVERY' || prev.status === 'AWAITING_PICKUP') && prev.assignedCourier && (prev.assignedCourier.currentEtaMinutes || 0) > 1) {
            const newEta = (prev.assignedCourier.currentEtaMinutes || 0) - 1;
            return {
              ...prev, assignedCourier: { ...prev.assignedCourier, currentEtaMinutes: newEta, }, estimatedDeliveryTime: `${newEta}-${newEta + 5} דק'`, updatedAt: new Date().toISOString(),
            };
          }
          return prev;
        });
      }, 60 * 1000); 
      return () => clearInterval(etaInterval);
    }
  }, [order?.status, order?.assignedCourier?.currentEtaMinutes]);

  if (order === undefined) { 
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
      case 'SCHEDULED':
        return (
            <Card className="shadow-xl text-center py-10 bg-blue-50 border-blue-200">
                <CardHeader className="items-center">
                    <Clock className="h-12 w-12 text-blue-600 mb-3" />
                    <CardTitle className="text-2xl font-semibold text-blue-700">הזמנה מתוכננת</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg text-blue-600/90">
                        ההזמנה שלך מ<strong className="text-blue-700">{order.restaurantName}</strong> מתוכננת ל:
                    </p>
                    <p className="text-xl font-bold text-blue-700 mt-2">{order.scheduledDeliveryTime}</p>
                    <p className="text-sm text-blue-600/80 mt-4">אנו נתחיל לעבד אותה לקראת מועד זה.</p>
                </CardContent>
            </Card>
        );
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
  const shouldShowTrivia = showTriviaForStatus.includes(order.status) && !triviaAnswered && order.status !== 'SCHEDULED';

  const handleTriviaComplete = () => {
    setTriviaAnswered(true);
    localStorage.setItem(`triviaAnswered_${orderId.split('_scheduled_')[0]}`, 'true');
  };

  const handleGamificationTask = () => {
    toast({
        title: "משימת בונוס! (דמו)",
        description: "שתף תמונה של הטרנד שהזמנת עם #LivePick וצבור עוד כוכבים! (משימה תופיע כאן)",
        action: <Award className="text-yellow-500" />
    });
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Button variant="outline" onClick={() => router.push('/')} className="mb-0">
        <ArrowLeft className="mr-2 h-4 w-4" /> חזרה לדף הבית
      </Button>

      {renderOrderStatusView()}

      {customerNotes && (
        <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-md text-blue-700 flex items-center"><Edit className="mr-2 h-4 w-4"/>הערות שהוספת להזמנה:</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
                <p className="text-sm text-blue-600 whitespace-pre-line">{customerNotes}</p>
            </CardContent>
        </Card>
      )}

      {showGamificationHint && !triviaAnswered && order.status !== 'SCHEDULED' && (
        <Card className="bg-purple-50 border-purple-200 text-purple-700 animate-fadeIn">
            <CardHeader>
                <CardTitle className="flex items-center"><Gamepad2 className="mr-2 h-5 w-5"/> הרווח פרסים בזמן ההמתנה!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p>פתור את חידון הטריוויה שלנו (בהמשך העמוד אם זמין) או השלם משימת בונוס קטנה כדי לצבור נקודות וכוכבים!</p>
                <Button variant="link" onClick={handleGamificationTask} className="p-0 text-purple-700">
                    בדוק משימת בונוס (דמו)
                </Button>
            </CardContent>
        </Card>
      )}

      {shouldShowTrivia && (
        <TriviaChallengeCard
          imageUrl="https://placehold.co/600x400.png"
          imageHint={order.items[0]?.dataAiHint || order.items[0]?.name || "food item"}
          questionText={`מהי המנה הראשונה בהזמנה זו מ-${order.restaurantName}?`}
          options={order.items.length > 0 ? [order.items[0].name, "פיצה פטריות", "סלט יווני"] : ["לא ידוע", "צ'יפס", "שתייה קלה"]}
          correctAnswer={order.items.length > 0 ? order.items[0].name : "לא ידוע"}
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
                            <p className="font-medium capitalize">{getOrderStatusHebrew(event.status)}</p>
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
