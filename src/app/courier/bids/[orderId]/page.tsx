
'use client';

import { getOrderForBiddingById, mockCourierProfiles, getRestaurantById, mockBidsForOrder } from '@/lib/mock-data';
import type { OrderDetailsForBidding, CourierBid, CourierProfile, DeliveryVehicle } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, DollarSign, Zap, XCircle, Info, Timer, MapPin, Navigation, Package, Edit3, Clock, AlertTriangle, Bike, Car, Footprints, Loader2, Award, ThumbsDown } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { selectBestCourierBid, CourierMatchingInputType, CourierMatchingOutputType } from '@/ai/flows/courier-matching-flow'; 
import { cn } from '@/lib/utils';

const MOCK_CURRENT_COURIER_ID = 'courier1'; 

const VehicleIcon = ({ type, className }: { type: DeliveryVehicle | undefined, className?: string }) => {
  const iconProps = { className: cn("inline h-4 w-4 mr-1", className) };
  if (type === 'motorcycle') return <Bike {...iconProps} title="אופנוע" />;
  if (type === 'scooter') return <Bike {...iconProps} title="קטנוע" />;
  if (type === 'car') return <Car {...iconProps} title="רכב" />;
  if (type === 'bicycle') return <Bike {...iconProps} title="אופניים"/>;
  if (type === 'foot') return <Footprints {...iconProps} title="הולך רגל"/>;
  return null;
};


export default function CourierBidPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const router = useRouter();
  const { toast } = useToast();

  const [order, setOrder] = useState<OrderDetailsForBidding | null>(null);
  const [courier, setCourier] = useState<CourierProfile | null>(null);
  const [restaurantDetails, setRestaurantDetails] = useState<{ name: string, location: string } | null>(null);

  const [customBid, setCustomBid] = useState<string>('');
  const [isFastPickup, setIsFastPickup] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(20); 
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bidPlaced, setBidPlaced] = useState<boolean>(false);
  const [evaluationTriggered, setEvaluationTriggered] = useState(false);

  const [otherBids, setOtherBids] = useState<CourierBid[]>([]);
  const [winningBidInfo, setWinningBidInfo] = useState<CourierMatchingOutputType | null>(null);


  useEffect(() => {
    const fetchedOrder = getOrderForBiddingById(orderId);
    const fetchedCourier = mockCourierProfiles.find(c => c.id === MOCK_CURRENT_COURIER_ID);

    if (!fetchedOrder) {
      notFound();
      return;
    }
    if (!fetchedCourier) {
        toast({ title: "שגיאה", description: "פרופיל שליח לא נמצא.", variant: "destructive"});
        router.push('/courier/open-bids');
        return;
    }
    setOrder(fetchedOrder);
    setCourier(fetchedCourier);
    setCustomBid(fetchedOrder.baseCommission.toString());

    const restDetails = getRestaurantById(fetchedOrder.restaurantName === 'Pizza Palace' ? 'restaurant1' : 'restaurant2'); 
    if(restDetails) {
      setRestaurantDetails({name: restDetails.name, location: restDetails.location});
    }
    setOtherBids(mockBidsForOrder(orderId).filter(b => b.courierId !== MOCK_CURRENT_COURIER_ID));

  }, [orderId, router, toast]);

 useEffect(() => {
    if (timeLeft <= 0 || !order || bidPlaced || evaluationTriggered) {
        if (timeLeft <= 0 && !bidPlaced && !evaluationTriggered && order) {
            toast({ title: "זמן ההצעה הסתיים", description: "מעבד הצעות קיימות...", variant: "default" });
            handleBidEvaluation(otherBids);
            setEvaluationTriggered(true);
        }
        return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, order, bidPlaced, evaluationTriggered, otherBids]);


  const handleBidAction = async (actionType: 'accept' | 'bid' | 'speed' | 'skip') => {
    if (timeLeft <= 0 || !order || !courier || isSubmitting || bidPlaced) {
      toast({ title: "ההצעה נסגרה", description: "חלון הזמן לפעולה זו נסגר.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    let finalBidAmount = parseFloat(customBid) || order.baseCommission;
    let finalFastPickup = isFastPickup;
    let message = "";

    if (actionType === 'skip') {
      router.push('/courier/open-bids');
      toast({ title: "הזמנה דולגה", description: "דילגת על הזדמנות הצעה זו." });
      setIsSubmitting(false);
      setBidPlaced(true); 
      handleBidEvaluation(otherBids); 
      setEvaluationTriggered(true);
      return;
    }

    switch (actionType) {
      case 'accept':
        finalBidAmount = order.baseCommission;
        message = `עמלת בסיס של ₪${finalBidAmount.toFixed(2)} התקבלה${finalFastPickup ? ' עם איסוף מהיר.' : '.'}`;
        break;
      case 'bid':
        const newBid = parseFloat(customBid);
        if (isNaN(newBid) || newBid < order.baseCommission * 0.8 || newBid > order.baseCommission * 2.5) {
          toast({ title: "הצעה לא תקינה", description: `הצעה חייבת להיות בין ₪${(order.baseCommission * 0.8).toFixed(2)} לבין ₪${(order.baseCommission * 2.5).toFixed(2)}.`, variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
        finalBidAmount = newBid;
        message = `הצעה של ₪${finalBidAmount.toFixed(2)} הוגשה${finalFastPickup ? ' עם איסוף מהיר.' : '.'}`;
        break;
      case 'speed':
        finalFastPickup = true;
        setIsFastPickup(true);
        finalBidAmount = parseFloat(customBid) || order.baseCommission;
         if (isNaN(finalBidAmount) || finalBidAmount < order.baseCommission * 0.8 || finalBidAmount > order.baseCommission * 2.5) {
            finalBidAmount = order.baseCommission; 
         }
        message = `הצעת איסוף מהיר עם הצעה נוכחית של ₪${finalBidAmount.toFixed(2)}.`;
        break;
    }

    const currentCourierBid: CourierBid = {
        bidId: `bid-${orderId}-${courier.id}-${Date.now()}`,
        orderId: order.orderId,
        courierId: courier.id,
        courierName: courier.name,
        distanceToRestaurantKm: Math.random() * 3 + 0.5, 
        bidAmount: finalBidAmount,
        proposedEtaMinutes: Math.round((order.estimatedRouteDistanceKm || order.estimatedDistanceKm) * (finalFastPickup ? 3 : 5) + (Math.random() * 3 + 0.5)*3), 
        courierRating: courier.rating,
        courierTrustScore: courier.trustScore,
        vehicleType: courier.vehicleType,
        timestamp: new Date().toISOString(),
        isFastPickup: finalFastPickup,
        status: 'pending',
        courierProfileSnapshot: { ...courier }
    };

    toast({ title: "הצעה הוגשה!", description: message });
    setBidPlaced(true); 
    
    await handleBidEvaluation([currentCourierBid, ...otherBids]);
    setEvaluationTriggered(true);
    setIsSubmitting(false);
  };

  const handleBidEvaluation = async (allSubmittedBids: CourierBid[]) => {
    if (!order) return;
    setIsSubmitting(true); 
    setBidPlaced(true); 
    toast({ title: "מעבד הצעות...", description: "ה-AI בוחר את השליח המתאים ביותר." });
    try {
        const input: CourierMatchingInputType = { orderDetails: order, bids: allSubmittedBids };
        await new Promise(resolve => setTimeout(resolve, 2000));
        const result = await selectBestCourierBid(input);
        setWinningBidInfo(result);
        setTimeLeft(0); 
    } catch (error) {
        console.error("שגיאה בעיבוד הצעות:", error);
        toast({ title: "שגיאת עיבוד", description: "לא ניתן היה לקבוע את ההצעה הזוכה.", variant: "destructive" });
        setWinningBidInfo({ fallbackRequired: true, reasoning: "אירעה שגיאה במהלך עיבוד ההצעות."});
    } finally {
        setIsSubmitting(false);
    }
  }


  if (!order || !courier) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">טוען הזדמנות הצעה...</p>
      </div>
    );
  }

  const distanceToRestaurant = parseFloat((Math.random() * 2 + 0.2).toFixed(1));
  const estTimeFromCourierToRest = Math.round(distanceToRestaurant * (courier.vehicleType === 'bicycle' ? 6 : courier.vehicleType === 'foot' ? 10 : 3));
  const estTimeFromRestToCust = Math.round((order.estimatedRouteDistanceKm || order.estimatedDistanceKm) * (courier.vehicleType === 'bicycle' ? 7 : courier.vehicleType === 'foot' ? 12 : 4));
  const totalEstimatedTime = estTimeFromCourierToRest + parseInt(order.expectedPickupTime.match(/\d+/)?.[0] || '10') + estTimeFromRestToCust;
  const bonusRequested = (parseFloat(customBid) || order.baseCommission) - order.baseCommission;

  const courierVehicleMatchesRequirement = !order.requiredVehicleType || order.requiredVehicleType.length === 0 || order.requiredVehicleType.includes(courier.vehicleType);


  if (winningBidInfo) {
    const isWinner = winningBidInfo.selectedBid?.courierId === MOCK_CURRENT_COURIER_ID;
    return (
        <Card className={cn("shadow-xl animate-fadeIn mt-6 max-w-lg mx-auto border-2", 
            isWinner ? "border-green-500 bg-green-50" : winningBidInfo.selectedBid ? "border-yellow-500 bg-yellow-50" : "border-red-500 bg-red-50"
        )}>
            <CardHeader className="text-center items-center">
                {isWinner ? <Award className="h-12 w-12 text-green-600 mb-2"/> : winningBidInfo.selectedBid ? <ThumbsDown className="h-12 w-12 text-yellow-600 mb-2"/> : <XCircle className="h-12 w-12 text-red-600 mb-2"/>}
                <CardTitle className={cn("text-3xl font-headline", 
                    isWinner ? "text-green-700" : winningBidInfo.selectedBid ? "text-yellow-700" : "text-red-700"
                )}>
                    {isWinner ? "🎉 זכית בהצעה!" : winningBidInfo.selectedBid ? "ההצעה לא זכתה הפעם" : "לא נבחרה הצעה מתאימה"}
                </CardTitle>
                <CardDescription className="text-base">עבור הזמנה #{order.orderId.slice(-6)} מ{order.restaurantName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-center">
                {winningBidInfo.selectedBid ? (
                    <>
                        <p>ההזמנה הוקצתה ל<span className="font-semibold">{winningBidInfo.selectedBid.courierName}</span>.</p>
                        <p className="text-sm text-muted-foreground p-2 bg-background/50 rounded-md"><strong>נימוק AI:</strong> {winningBidInfo.reasoning || "מבוסס על ציון כולל."}</p>
                        {isWinner && <p className="mt-2 font-medium text-green-700">אנא המשך/י לאיסוף ההזמנה מ{order.restaurantName}. פרטים נוספים בהזמנות פעילות.</p>}
                    </>
                ) : (
                     <p className="text-muted-foreground">{winningBidInfo.reasoning || "לא נמצאה הצעה מתאימה, או שמופעלים נהלי גיבוי."}</p>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={() => router.push('/courier/open-bids')} className="w-full mt-4" variant="outline" aria-label="חזרה להצעות פתוחות">חזרה להצעות פתוחות</Button>
            </CardFooter>
        </Card>
    )
  }

  if (isSubmitting || (bidPlaced && !winningBidInfo)) {
     return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-300px)] space-y-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-xl text-primary">{isSubmitting && !bidPlaced ? "שולח את הצעתך..." : "מעבד את כל ההצעות..."}</p>
        <p className="text-muted-foreground">ה-AI שלנו בוחן כעת את כל ההצעות שהוגשו. מייד נעדכן אותך!</p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4" disabled={isSubmitting || bidPlaced} aria-label="חזרה להצעות פתוחות">
        <ArrowLeft className="mr-2 h-4 w-4" /> חזרה להצעות פתוחות
      </Button>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10 p-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-headline text-primary">הזדמנות משלוח</CardTitle>
             <Badge 
                variant={timeLeft > 10 ? "default" : timeLeft > 5 ? "secondary" : "destructive"} 
                className={cn("text-lg px-3 py-1 transition-all", timeLeft <= 5 && timeLeft > 0 && 'animate-pulse ring-2 ring-offset-2 ring-destructive/70', timeLeft === 0 && 'opacity-50')}
                aria-label={`נותרו ${timeLeft} שניות להגיש הצעה`}
                role="timer"
                aria-live="polite"
              >
                <Timer className="inline mr-2 h-5 w-5" /> {timeLeft > 0 ? `נותרו ${timeLeft} שנ'` : "הזמן אזל!"}
            </Badge>
          </div>
          <CardDescription className="text-base">
            הזמנה <span className="font-semibold text-primary">{order.orderId}</span> מ<span className="font-semibold text-primary">{order.restaurantName}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground border-b pb-2 mb-3">פרטי הזמנה</h3>
             <div className="flex items-start">
              <Package className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
              <div>
                <p className="font-medium">פריטים: {order.itemsDescription}</p>
                <p className="text-sm text-muted-foreground">ערך: ~₪{order.orderValue?.toFixed(2) || 'לא זמין'}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
              <div>
                <p className="font-medium">מ: {order.restaurantName}</p>
                <p className="text-sm text-muted-foreground">{restaurantDetails?.location}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Navigation className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
               <div>
                <p className="font-medium">אל: {order.deliveryAddress}</p>
                <p className="text-sm text-muted-foreground">מסלול משוער: ~{order.estimatedRouteDistanceKm?.toFixed(1) || order.estimatedDistanceKm.toFixed(1)} ק"מ</p>
              </div>
            </div>
            <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-accent" />
                <p className="font-medium">איסוף צפוי: {order.expectedPickupTime}</p>
            </div>
            {order.customerNotes && (
              <div className="flex items-start p-2 bg-blue-50 border border-blue-200 rounded-md">
                <Info className="h-5 w-5 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-700">הערת לקוח:</p>
                  <p className="text-sm text-blue-600">{order.customerNotes}</p>
                </div>
              </div>
            )}
            {order.requiredVehicleType && order.requiredVehicleType.length > 0 && (
                 <div className={cn("flex items-center text-sm p-2 rounded-md border", courierVehicleMatchesRequirement ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700")}>
                    <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>נדרש: {order.requiredVehicleType.map(v => <VehicleIcon key={v} type={v as DeliveryVehicle} />).reduce((prev, curr, idx) => <>{prev}{idx > 0 ? ', ' : ''}{curr}</>, <></>)}
                    {!courierVehicleMatchesRequirement && " (הרכב שלך אינו תואם)"}
                    </span>
                </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground border-b pb-2 mb-3">ההצעה שלך</h3>
            <div className="flex items-center p-3 rounded-md bg-green-50 border border-green-200">
              <DollarSign className="h-8 w-8 mr-3 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-700">עמלת בסיס מוצעת</p>
                <p className="text-3xl font-bold text-green-600">₪{order.baseCommission.toFixed(2)}</p>
              </div>
            </div>

             <div className="space-y-2">
              <Label htmlFor="customBidAmount" className="text-base">סכום ההצעה שלך (₪)</Label>
              <Input
                id="customBidAmount"
                type="number"
                value={customBid}
                onChange={(e) => setCustomBid(e.target.value)}
                min={(order.baseCommission * 0.8).toFixed(2)}
                max={(order.baseCommission * 2.5).toFixed(2)}
                step="0.50"
                className="text-lg p-2 h-12"
                placeholder={`לדוגמה: ${order.baseCommission.toFixed(2)}`}
                disabled={isSubmitting || bidPlaced || timeLeft <=0}
                aria-label="סכום הצעה מותאם אישית בשקלים"
              />
              <p className={cn("text-xs", bonusRequested > 0 ? "text-green-600" : bonusRequested < 0 ? "text-orange-600" : "text-muted-foreground")}>
                {bonusRequested > 0 ? `בונוס מבוקש: ₪${bonusRequested.toFixed(2)}` : bonusRequested < 0 ? `מציע הנחה: ₪${Math.abs(bonusRequested).toFixed(2)}` : "ללא בונוס/הנחה"}
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <Button
                    variant={isFastPickup ? "default" : "outline"}
                    onClick={() => setIsFastPickup(!isFastPickup)}
                    className={cn("w-full", isFastPickup && 'bg-blue-600 hover:bg-blue-700 text-white')}
                    disabled={isSubmitting || bidPlaced || timeLeft <=0}
                    aria-pressed={isFastPickup}
                    aria-label={isFastPickup ? "איסוף מהיר פעיל" : "הצע איסוף מהיר"}
                >
                    <Zap className="mr-2 h-4 w-4" />
                    {isFastPickup ? "איסוף מהיר פעיל (<4 דק' למסעדה)" : "הצע איסוף מהיר"}
                </Button>
            </div>
            <Separator className="my-4" />
            <div className="text-sm text-muted-foreground space-y-1">
                <p><Info className="inline h-4 w-4 mr-1 text-accent" /> המרחק שלך למסעדה: ~{distanceToRestaurant.toFixed(1)} ק"מ</p>
                <p><Timer className="inline h-4 w-4 mr-1 text-accent" /> זמן כולל משוער עבורך: ~{totalEstimatedTime} דקות</p>
                <p><VehicleIcon type={courier.vehicleType} className="text-accent" /> הרכב שלך: {courier.vehicleType} ({courier.transportationModeDetails || 'לא זמין'})</p>
                <p>דירוג: {courier.rating.toFixed(1)} | אמון: {courier.trustScore}% {courier.batteryPercent ? `| סוללה: ${courier.batteryPercent}%` : ''}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/30 p-4 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            <Button onClick={() => handleBidAction('accept')} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting || timeLeft <= 0 || bidPlaced} aria-label={`קבל הצעת בסיס של ${order.baseCommission.toFixed(2)} שקלים`}>
              <CheckCircle className="mr-2 h-4 w-4" /> קבל בסיס (₪{order.baseCommission.toFixed(2)})
            </Button>
             <Button 
                onClick={() => handleBidAction('bid')} 
                className={cn("w-full", parseFloat(customBid) > order.baseCommission ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "bg-orange-500 hover:bg-orange-600 text-white")}
                disabled={isSubmitting || timeLeft <= 0 || bidPlaced || parseFloat(customBid) === order.baseCommission || isNaN(parseFloat(customBid))}
                aria-label={`הגש הצעה מותאמת של ${parseFloat(customBid) || 0} שקלים`}
            >
              <Edit3 className="mr-2 h-4 w-4" /> הגש הצעה (₪{parseFloat(customBid) || 0})
            </Button>
             <Button onClick={() => handleBidAction('speed')} className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={isSubmitting || timeLeft <= 0 || bidPlaced} aria-label={isFastPickup ? "הגש הצעה עם איסוף מהיר" : "הצע איסוף מהיר"}>
              <Zap className="mr-2 h-4 w-4" /> {isFastPickup ? 'הגש הצעה מהירה' : 'הצע איסוף מהיר'}
            </Button>
            <Button variant="destructive" onClick={() => handleBidAction('skip')} className="w-full" disabled={isSubmitting || timeLeft <= 0 || bidPlaced} aria-label="דלג על הצעה זו">
              <XCircle className="mr-2 h-4 w-4" /> דלג
            </Button>
          </div>
        </CardFooter>
      </Card>
      <p className="text-sm text-center text-muted-foreground mt-4">
        הצעתך מוערכת לפי מחיר, זמן הגעה משוער, דירוג, ציון אמון והצעת איסוף מהיר. מנוע ההתאמה החכם יבחר את ההצעה הטובה ביותר.
      </p>
       <style jsx global>{`
        .animate-pulse {
            animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
        }
        `}</style>
    </div>
  );
}
