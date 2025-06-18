
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
import { ArrowLeft, AlertTriangle, Info, Clock, Award, Gamepad2, Edit, Gift, CalendarClock, ShoppingBag, Car } from 'lucide-react'; 
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast'; 
import { cn } from '@/lib/utils';

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

const getAssignedCourierDetails = (courierId: string): Order['assignedCourier'] => {
    const profile = mockCourierProfiles.find(c => c.id === courierId);
    if (!profile) return undefined;
    return {
        id: profile.id, name: profile.name, photoUrl: `https://placehold.co/100x100.png?text=${profile.name.substring(0,1)}`, dataAiHint: "courier person", rating: profile.rating, vehicleType: profile.vehicleType, currentEtaMinutes: 12 + Math.floor(Math.random() * 8), vehicleDetails: profile.transportationModeDetails || `${profile.vehicleType}`, liveLocation: profile.currentLocation,
    };
};

export default function OrderTrackingPage() {
  const paramsHook = useParams(); 
  const orderId = paramsHook.orderId as string;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast(); 

  const [order, setOrder] = useState<Order | null | undefined>(undefined); 
  const [customerNotes, setCustomerNotes] = useState<string | null>(null);
  const [isGiftOrderState, setIsGiftOrderState] = useState(false);
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
        if (order.deliveryPreference === 'takeaway' || order.deliveryPreference === 'curbside') {
            nextStatus = 'PREPARING_AT_RESTAURANT';
            newTimelineEvent = { status: nextStatus, timestamp: new Date().toISOString(), notes: `${order.restaurantName} מכין/ה את הזמנתך לאיסוף.` };
        } else {
            nextStatus = 'COURIER_ASSIGNED';
            const randomCourierProfile = mockCourierProfiles[Math.floor(Math.random() * mockCourierProfiles.length)];
            newCourierInfo = getAssignedCourierDetails(randomCourierProfile.id);
            newTimelineEvent = { status: nextStatus, timestamp: new Date().toISOString(), notes: `שליח ${newCourierInfo?.name} שובץ.` };
            delay = 8000; 
            setShowGamificationHint(true);
        }
        break;
      case 'COURIER_ASSIGNED':
        nextStatus = 'PREPARING_AT_RESTAURANT';
        newTimelineEvent = { status: nextStatus, timestamp: new Date().toISOString(), notes: `${order.restaurantName} מכין/ה את ההזמנה שלך.` };
        break;
      case 'PREPARING_AT_RESTAURANT':
        nextStatus = 'AWAITING_PICKUP';
        const actionText = (order.deliveryPreference === 'takeaway' || order.deliveryPreference === 'curbside') ? 'מוכנה לאיסוף!' : `מוכנה. שליח ${order.assignedCourier?.name || 'לא ידוע'} בדרך אל ${order.restaurantName}.`;
        newTimelineEvent = { status: nextStatus, timestamp: new Date().toISOString(), notes: actionText };
        delay = 7000;
        break;
      case 'AWAITING_PICKUP':
        if (order.deliveryPreference === 'takeaway' || order.deliveryPreference === 'curbside') {
           // For pickup orders, this might be the final "active" state before DELIVERED
           // or the user picks it up. We'll simulate delivery for now.
           nextStatus = 'DELIVERED';
           newTimelineEvent = { status: nextStatus, timestamp: new Date().toISOString(), notes: "ההזמנה נאספה. בתאבון!" };
        } else {
            nextStatus = 'OUT_FOR_DELIVERY';
            newTimelineEvent = { status: nextStatus, timestamp: new Date().toISOString(), notes: `שליח ${order.assignedCourier?.name || 'לא ידוע'} אסף את ההזמנה.` };
            delay = 10000; 
        }
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
          if (order.deliveryPreference === 'takeaway' || order.deliveryPreference === 'curbside') {
            if(nextStatus === 'PREPARING_AT_RESTAURANT') updatedOrder.estimatedDeliveryTime = `מוכן בעוד כ-${10 + Math.floor(Math.random() * 5)} דק'`;
            if(nextStatus === 'AWAITING_PICKUP') updatedOrder.estimatedDeliveryTime = `מוכן לאיסוף כעת!`;
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
    const giftParam = searchParams.get('isGift');
    if (giftParam === 'true') {
      setIsGiftOrderState(true);
    }

    let extractedScheduledTime: string | undefined = undefined;
    if (orderId.includes('_scheduled_')) {
        const parts = orderId.split('_scheduled_');
        if (parts.length > 1 && parts[1]) {
            extractedScheduledTime = decodeURIComponent(parts[1].split('?')[0]);
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
    if (giftParam === 'true') {
        fetchedOrder.isGiftOrder = true;
    }
    setOrder(fetchedOrder);
    
    const storedTriviaState = localStorage.getItem(`triviaAnswered_${orderId.split('_scheduled_')[0].split('?')[0]}`); 
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
    if (order && (order.status === 'OUT_FOR_DELIVERY' || order.status === 'AWAITING_PICKUP') && order.assignedCourier && (order.assignedCourier.currentEtaMinutes || 0) > 0 && order.deliveryPreference !== 'takeaway' && order.deliveryPreference !== 'curbside') {
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
      }, 60 * 1000 * (Math.random() * 0.5 + 0.5)); 
      return () => clearInterval(etaInterval);
    }
  }, [order]);

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
          {error || "לא הצלחנו למצוא את ההזמנה שאתה מחפש. ייתכן שהייתה בעיה עם מזהה ההזמנה או שהיא עדיין לא נוצרה."}
        </p>
        <Button asChild>
          <Link href="/"><span>חזרה לדף הבית</span></Link>
        </Button>
      </div>
    );
  }
  
  const renderPickupView = () => (
    <Card className="shadow-xl text-center py-10 bg-green-50 border-green-300 animate-fadeIn">
        <CardHeader className="items-center">
            {order.deliveryPreference === 'takeaway' ? 
                <ShoppingBag className="h-12 w-12 text-green-600 mb-3" /> : 
                <Car className="h-12 w-12 text-green-600 mb-3" />
            }
            <CardTitle className="text-2xl font-semibold text-green-700">
                הזמנתך {order.status === 'AWAITING_PICKUP' ? 'מוכנה לאיסוף!' : 'בהכנה לאיסוף'}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-lg text-green-600/90">
                ההזמנה שלך מ<strong className="text-green-700">{order.restaurantName}</strong> {order.status === 'AWAITING_PICKUP' ? 'מוכנה כעת.' : `תהיה מוכנה בעוד כ-${order.estimatedDeliveryTime || 'מספר דקות'}.`}
            </p>
            <p className="text-md text-green-600/80 mt-2">נא לגשת ל{order.restaurantName} בכתובת: {order.deliveryAddress}.</p>
            {order.deliveryPreference === 'curbside' && order.customerNotes && (
                <p className="text-sm text-blue-600 mt-2 bg-blue-100 p-2 rounded-md">הערות לאיסוף מהרכב: {order.customerNotes}</p>
            )}
            {order.deliveryPreference === 'curbside' && !order.customerNotes && (
                <p className="text-sm text-orange-600 mt-2 bg-orange-100 p-2 rounded-md">לא צוינו פרטי רכב. אנא צור קשר עם העסק בהגעה.</p>
            )}
        </CardContent>
         <CardFooter className="justify-center">
            <Button variant="outline" onClick={() => toast({description: `מספר טלפון של ${order.restaurantName} יוצג כאן.`})}>
                צור קשר עם העסק
            </Button>
        </CardFooter>
    </Card>
  );


  const renderOrderStatusView = () => {
    switch (order.status) {
      case 'SCHEDULED':
        return (
            <Card className="shadow-xl text-center py-10 bg-blue-50 border-blue-300 animate-fadeIn">
                <CardHeader className="items-center">
                    <CalendarClock className="h-12 w-12 text-blue-600 mb-3" />
                    <CardTitle className="text-2xl font-semibold text-blue-700">הזמנה מתוכננת</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg text-blue-600/90">
                        ההזמנה שלך מ<strong className="text-blue-700">{order.restaurantName}</strong> מתוכננת ל:
                    </p>
                    <p className="text-xl font-bold text-blue-700 mt-2">{order.scheduledDeliveryTime}</p>
                    <p className="text-sm text-blue-600/80 mt-4">אנו נתחיל לעבד אותה לקראת מועד זה. תקבל/י עדכון כאשר ההכנה תתחיל.</p>
                </CardContent>
            </Card>
        );
      case 'MATCHING_COURIER':
        if (order.deliveryPreference === 'takeaway' || order.deliveryPreference === 'curbside') {
            return renderPickupView(); // Or a slightly different "payment received, preparing for pickup"
        }
        return <MatchingCourierView order={order} />;
      case 'COURIER_ASSIGNED':
      case 'PREPARING_AT_RESTAURANT':
      case 'AWAITING_PICKUP':
      case 'OUT_FOR_DELIVERY':
         if (order.deliveryPreference === 'takeaway' || order.deliveryPreference === 'curbside') {
            return renderPickupView();
        }
        return <CourierAssignedView order={order} />;
      case 'DELIVERED':
        return <DeliveryCompleteView order={order} />;
      case 'PENDING_PAYMENT':
         return (
            <Card className="shadow-xl text-center py-10 animate-fadeIn">
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
            <Card className="shadow-xl text-center py-10 animate-fadeIn">
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
  const shouldShowTrivia = showTriviaForStatus.includes(order.status) && !triviaAnswered && order.status !== 'SCHEDULED' && order.deliveryPreference !== 'takeaway' && order.deliveryPreference !== 'curbside';

  const handleTriviaComplete = () => {
    setTriviaAnswered(true);
    localStorage.setItem(`triviaAnswered_${orderId.split('_scheduled_')[0].split('?')[0]}`, 'true');
  };

  const handleGamificationTask = () => {
    toast({
        title: "משימת בונוס!",
        description: "שתף תמונה של הטרנד שהזמנת עם #ZIPP וצבור עוד כוכבים! (הדגמה של משימה).",
        action: <Award className="text-yellow-500" />
    });
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Button variant="outline" onClick={() => router.push('/')} className="mb-0">
        <ArrowLeft className="mr-2 h-4 w-4" /> חזרה לדף הבית
      </Button>

      {renderOrderStatusView()}
      
      {isGiftOrderState && (
        <Card className="bg-pink-50 border-pink-200 animate-fadeIn">
            <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-md text-pink-700 flex items-center"><Gift className="mr-2 h-4 w-4"/>הזמנה זו נשלחת כמתנה!</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
                <p className="text-sm text-pink-600">אנו מקווים שהמקבל/ת ייהנה/תהנה מההפתעה.</p>
            </CardContent>
        </Card>
      )}


      {customerNotes && (
        <Card className="bg-blue-50 border-blue-200 animate-fadeIn">
            <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-md text-blue-700 flex items-center"><Edit className="mr-2 h-4 w-4"/>הערות שהוספת להזמנה:</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
                <p className="text-sm text-blue-600 whitespace-pre-line">{customerNotes}</p>
            </CardContent>
        </Card>
      )}

      {showGamificationHint && !triviaAnswered && order.status !== 'SCHEDULED' && order.deliveryPreference !== 'takeaway' && order.deliveryPreference !== 'curbside' && (
        <Card className="bg-purple-50 border-purple-200 text-purple-700 animate-fadeInUp">
            <CardHeader className="pb-2 pt-3">
                <CardTitle className="flex items-center"><Gamepad2 className="mr-2 h-5 w-5"/> זמן מצוין לאתגר טריוויה קצר!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-3">
                <p>בזמן שההזמנה שלך מתקדמת, למה לא לנסות את חידון הטריוויה שלנו (בהמשך העמוד אם זמין) או להשלים משימת בונוס קטנה כדי לצבור נקודות וכוכבים?</p>
                <Button variant="link" onClick={handleGamificationTask} className="p-0 text-purple-700">
                    בדוק משימת בונוס
                </Button>
            </CardContent>
        </Card>
      )}

      {shouldShowTrivia && (
        <TriviaChallengeCard
          imageUrl={order.items[0]?.imageUrl || "https://placehold.co/600x400.png"}
          imageHint={order.items[0]?.dataAiHint || order.items[0]?.name || "food item"}
          questionText={`מהי המנה הראשונה בהזמנה זו מ-${order.restaurantName}?`}
          options={order.items.length > 0 ? [order.items[0].name, "פיצה פטריות", "סלט יווני"] : ["לא ידוע", "צ'יפס", "שתייה קלה"]}
          correctAnswer={order.items.length > 0 ? order.items[0].name : "לא ידוע"}
          onTriviaComplete={handleTriviaComplete}
        />
      )}

      <Card className="animate-fadeInUp animation-delay-200">
        <CardHeader>
            <CardTitle className="text-lg font-semibold">ציר זמן הזמנה</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-3">
                {order.orderTimeline?.slice().reverse().map((event, index) => (
                    <li key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                        <Info className={cn("h-5 w-5 mt-1 flex-shrink-0", 
                            event.status === 'DELIVERED' ? 'text-green-500' : 
                            event.status === 'OUT_FOR_DELIVERY' ? 'text-blue-500' :
                            event.status === 'CANCELLED' ? 'text-red-500' :
                            'text-primary'
                        )} />
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
       <style jsx global>{`
        .animation-delay-200 { animation-delay: 0.2s; }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0; 
        }
         @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0; 
        }
      `}</style>
    </div>
  );
}
