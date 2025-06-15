
'use client';

import { getOrderForBiddingById, mockCourierProfiles, getRestaurantById, mockBidsForOrder } from '@/lib/mock-data';
import type { OrderDetailsForBidding, CourierBid, CourierProfile, DeliveryVehicle } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, DollarSign, Zap, XCircle, Info, Timer, MapPin, Navigation, Package, Edit3, Clock, AlertTriangle, Bike, Car, Footprints, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { selectBestCourierBid, CourierMatchingInput, CourierMatchingOutput } from '@/ai/flows/courier-matching-flow'; // AI Matching
import { cn } from '@/lib/utils';

// Mock current courier (replace with actual auth)
const MOCK_CURRENT_COURIER_ID = 'courier1'; // Speedy Sam

// Helper to get vehicle icon
const VehicleIcon = ({ type, className }: { type: DeliveryVehicle | undefined, className?: string }) => {
  const iconProps = { className: cn("inline h-4 w-4 mr-1", className) };
  if (type === 'motorcycle') return <Bike {...iconProps} title="Motorcycle" />;
  if (type === 'scooter') return <Bike {...iconProps} title="Scooter" />;
  if (type === 'car') return <Car {...iconProps} title="Car" />;
  if (type === 'bicycle') return <Bike {...iconProps} title="Bicycle"/>;
  if (type === 'foot') return <Footprints {...iconProps} title="Foot"/>;
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
  const [timeLeft, setTimeLeft] = useState<number>(20); // 20 seconds bidding window
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bidPlaced, setBidPlaced] = useState<boolean>(false);
  const [evaluationTriggered, setEvaluationTriggered] = useState(false);

  const [otherBids, setOtherBids] = useState<CourierBid[]>([]);
  const [winningBidInfo, setWinningBidInfo] = useState<CourierMatchingOutput | null>(null);


  useEffect(() => {
    const fetchedOrder = getOrderForBiddingById(orderId);
    const fetchedCourier = mockCourierProfiles.find(c => c.id === MOCK_CURRENT_COURIER_ID);

    if (!fetchedOrder) {
      notFound();
      return;
    }
    if (!fetchedCourier) {
        toast({ title: "Error", description: "Courier profile not found.", variant: "destructive"});
        router.push('/courier/open-bids');
        return;
    }
    setOrder(fetchedOrder);
    setCourier(fetchedCourier);
    setCustomBid(fetchedOrder.baseCommission.toString());

    const restDetails = getRestaurantById(fetchedOrder.restaurantName === 'Pizza Palace' ? 'restaurant1' : 'restaurant2'); // Simplified
    if(restDetails) {
      setRestaurantDetails({name: restDetails.name, location: restDetails.location});
    }
    setOtherBids(mockBidsForOrder(orderId).filter(b => b.courierId !== MOCK_CURRENT_COURIER_ID));

  }, [orderId, router, toast]);

 useEffect(() => {
    if (timeLeft <= 0 || !order || bidPlaced || evaluationTriggered) {
        if (timeLeft <= 0 && !bidPlaced && !evaluationTriggered && order) {
            // Time's up, courier didn't bid, trigger evaluation with other bids only
            toast({ title: "Bidding Time Expired", description: "Evaluating existing bids...", variant: "default" });
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
      toast({ title: "Bidding Closed", description: "The bidding window for this action has closed.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    let finalBidAmount = parseFloat(customBid) || order.baseCommission;
    let finalFastPickup = isFastPickup;
    let message = "";

    if (actionType === 'skip') {
      router.push('/courier/open-bids');
      toast({ title: "Order Skipped", description: "You have skipped this bidding opportunity." });
      setIsSubmitting(false);
      setBidPlaced(true); 
      // Courier skipped, evaluate other bids
      handleBidEvaluation(otherBids);
      setEvaluationTriggered(true);
      return;
    }

    switch (actionType) {
      case 'accept':
        finalBidAmount = order.baseCommission;
        message = `Accepted base commission of ₪${finalBidAmount.toFixed(2)}${finalFastPickup ? ' with Speed Pickup.' : '.'}`;
        break;
      case 'bid':
        const newBid = parseFloat(customBid);
        if (isNaN(newBid) || newBid < order.baseCommission * 0.8 || newBid > order.baseCommission * 2.5) {
          toast({ title: "Invalid Bid", description: `Bid must be between ₪${(order.baseCommission * 0.8).toFixed(2)} and ₪${(order.baseCommission * 2.5).toFixed(2)}.`, variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
        finalBidAmount = newBid;
        message = `Bid ₪${finalBidAmount.toFixed(2)} submitted${finalFastPickup ? ' with Speed Pickup.' : '.'}`;
        break;
      case 'speed':
        finalFastPickup = true;
        setIsFastPickup(true);
        finalBidAmount = parseFloat(customBid) || order.baseCommission;
         if (isNaN(finalBidAmount) || finalBidAmount < order.baseCommission * 0.8 || finalBidAmount > order.baseCommission * 2.5) {
            finalBidAmount = order.baseCommission; // Default to base if custom invalid with speed
         }
        message = `Speed Pickup offered with current bid of ₪${finalBidAmount.toFixed(2)}.`;
        break;
    }

    const currentCourierBid: CourierBid = {
        bidId: `bid-${orderId}-${courier.id}-${Date.now()}`,
        orderId: order.orderId,
        courierId: courier.id,
        courierName: courier.name,
        distanceToRestaurantKm: Math.random() * 3 + 0.5, // Mock
        bidAmount: finalBidAmount,
        proposedEtaMinutes: Math.round((order.estimatedRouteDistanceKm || order.estimatedDistanceKm) * (finalFastPickup ? 3 : 5) + (Math.random() * 3 + 0.5)*3), // Mock
        courierRating: courier.rating,
        courierTrustScore: courier.trustScore,
        vehicleType: courier.vehicleType,
        timestamp: new Date().toISOString(),
        isFastPickup: finalFastPickup,
        status: 'pending',
        courierProfileSnapshot: { ...courier }
    };

    toast({ title: "Bid Submitted!", description: message });
    setBidPlaced(true); 
    
    await handleBidEvaluation([currentCourierBid, ...otherBids]);
    setEvaluationTriggered(true);
    setIsSubmitting(false);
  };

  const handleBidEvaluation = async (allSubmittedBids: CourierBid[]) => {
    if (!order) return;
    toast({ title: "Evaluating Bids...", description: "The AI is selecting the best courier." });
    try {
        const input: CourierMatchingInput = { orderDetails: order, bids: allSubmittedBids };
        const result = await selectBestCourierBid(input);
        setWinningBidInfo(result);
        setTimeLeft(0); // Stop timer
    } catch (error) {
        console.error("Error evaluating bids:", error);
        toast({ title: "Evaluation Error", description: "Could not determine winning bid.", variant: "destructive" });
        setWinningBidInfo({ fallbackRequired: true, reasoning: "An error occurred during bid evaluation."});
    }
  }


  if (!order || !courier) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading bidding opportunity...</p>
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
        <Card className="shadow-xl animate-fadeIn mt-6 max-w-lg mx-auto">
            <CardHeader className="text-center">
                <CardTitle className={cn("text-3xl font-headline", isWinner ? "text-green-600" : winningBidInfo.selectedBid ? "text-yellow-600" : "text-red-600")}>
                    {isWinner ? "🎉 You Won the Bid!" : winningBidInfo.selectedBid ? "Bid Not Won" : "No Suitable Bid Selected"}
                </CardTitle>
                <CardDescription>For Order ID: {order.orderId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-center">
                {winningBidInfo.selectedBid ? (
                    <>
                        <p>The order was assigned to <span className="font-semibold">{winningBidInfo.selectedBid.courierName}</span>.</p>
                        <p className="text-sm text-muted-foreground">AI Reasoning: {winningBidInfo.reasoning || "Based on overall score."}</p>
                        {isWinner && <p className="mt-2 font-medium">Please proceed to pick up the order from {order.restaurantName}.</p>}
                    </>
                ) : (
                     <p className="text-muted-foreground">{winningBidInfo.reasoning || "A suitable bid was not found, or fallback procedures are being initiated."}</p>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={() => router.push('/courier/open-bids')} className="w-full mt-4">Back to Open Bids</Button>
            </CardFooter>
        </Card>
    )
  }


  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4" disabled={isSubmitting || bidPlaced}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Open Bids
      </Button>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10 p-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-headline text-primary">Delivery Opportunity</CardTitle>
             <Badge 
                variant={timeLeft > 10 ? "default" : timeLeft > 5 ? "secondary" : "destructive"} 
                className={cn("text-lg px-3 py-1 transition-all", timeLeft <= 5 && timeLeft > 0 && 'animate-pulse ring-2 ring-offset-2 ring-destructive/70', timeLeft === 0 && 'opacity-50')}>
                <Timer className="inline mr-2 h-5 w-5" /> {timeLeft > 0 ? `${timeLeft}s Left` : "Time Up!"}
            </Badge>
          </div>
          <CardDescription className="text-base">
            Order <span className="font-semibold text-primary">{order.orderId}</span> from <span className="font-semibold text-primary">{order.restaurantName}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground border-b pb-2 mb-3">Order Details</h3>
             <div className="flex items-start">
              <Package className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
              <div>
                <p className="font-medium">Items: {order.itemsDescription}</p>
                <p className="text-sm text-muted-foreground">Value: ~₪{order.orderValue?.toFixed(2) || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
              <div>
                <p className="font-medium">From: {order.restaurantName}</p>
                <p className="text-sm text-muted-foreground">{restaurantDetails?.location}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Navigation className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
               <div>
                <p className="font-medium">To: {order.deliveryAddress}</p>
                <p className="text-sm text-muted-foreground">Est. Route: ~{order.estimatedRouteDistanceKm?.toFixed(1) || order.estimatedDistanceKm.toFixed(1)} km</p>
              </div>
            </div>
            <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-accent" />
                <p className="font-medium">Expected Pickup: {order.expectedPickupTime}</p>
            </div>
            {order.customerNotes && (
              <div className="flex items-start p-2 bg-blue-50 border border-blue-200 rounded-md">
                <Info className="h-5 w-5 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-700">Customer Note:</p>
                  <p className="text-sm text-blue-600">{order.customerNotes}</p>
                </div>
              </div>
            )}
            {order.requiredVehicleType && order.requiredVehicleType.length > 0 && (
                 <div className={cn("flex items-center text-sm p-2 rounded-md border", courierVehicleMatchesRequirement ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700")}>
                    <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Required: {order.requiredVehicleType.map(v => <VehicleIcon key={v} type={v as DeliveryVehicle} />).reduce((prev, curr, idx) => <>{prev}{idx > 0 ? ', ' : ''}{curr}</>, <></>)}
                    {!courierVehicleMatchesRequirement && " (Your vehicle doesn't match)"}
                    </span>
                </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground border-b pb-2 mb-3">Your Offer</h3>
            <div className="flex items-center p-3 rounded-md bg-green-50 border border-green-200">
              <DollarSign className="h-8 w-8 mr-3 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-700">Base Salary Offered</p>
                <p className="text-3xl font-bold text-green-600">₪{order.baseCommission.toFixed(2)}</p>
              </div>
            </div>

             <div className="space-y-2">
              <Label htmlFor="customBidAmount" className="text-base">Your Bid Amount (₪)</Label>
              <Input
                id="customBidAmount"
                type="number"
                value={customBid}
                onChange={(e) => setCustomBid(e.target.value)}
                min={(order.baseCommission * 0.8).toFixed(2)}
                max={(order.baseCommission * 2.5).toFixed(2)}
                step="0.50"
                className="text-lg p-2 h-12"
                placeholder={`e.g., ${order.baseCommission.toFixed(2)}`}
                disabled={isSubmitting || bidPlaced || timeLeft <=0}
              />
              <p className={cn("text-xs", bonusRequested > 0 ? "text-green-600" : bonusRequested < 0 ? "text-orange-600" : "text-muted-foreground")}>
                {bonusRequested > 0 ? `Bonus Requested: ₪${bonusRequested.toFixed(2)}` : bonusRequested < 0 ? `Offering Discount: ₪${Math.abs(bonusRequested).toFixed(2)}` : "No bonus/discount"}
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <Button
                    variant={isFastPickup ? "default" : "outline"}
                    onClick={() => setIsFastPickup(!isFastPickup)}
                    className={cn("w-full", isFastPickup && 'bg-blue-600 hover:bg-blue-700 text-white')}
                    disabled={isSubmitting || bidPlaced || timeLeft <=0}
                >
                    <Zap className="mr-2 h-4 w-4" />
                    {isFastPickup ? "Speed Pickup Active (<4min to restaurant)" : "Offer Speed Pickup"}
                </Button>
            </div>
            <Separator className="my-4" />
            <div className="text-sm text-muted-foreground space-y-1">
                <p><Info className="inline h-4 w-4 mr-1 text-accent" /> Your distance to restaurant: ~{distanceToRestaurant.toFixed(1)} km</p>
                <p><Timer className="inline h-4 w-4 mr-1 text-accent" /> Est. total time for you: ~{totalEstimatedTime} min</p>
                <p><VehicleIcon type={courier.vehicleType} className="text-accent" /> Your vehicle: {courier.vehicleType} ({courier.transportationModeDetails || 'N/A'})</p>
                <p>Rating: {courier.rating.toFixed(1)} | Trust: {courier.trustScore}% {courier.batteryPercent ? `| Batt: ${courier.batteryPercent}%` : ''}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/30 p-4 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            <Button onClick={() => handleBidAction('accept')} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting || timeLeft <= 0 || bidPlaced}>
              <CheckCircle className="mr-2 h-4 w-4" /> Accept Base (₪{order.baseCommission.toFixed(2)})
            </Button>
             <Button 
                onClick={() => handleBidAction('bid')} 
                className={cn("w-full", parseFloat(customBid) > order.baseCommission ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "bg-orange-500 hover:bg-orange-600 text-white")}
                disabled={isSubmitting || timeLeft <= 0 || bidPlaced || parseFloat(customBid) === order.baseCommission || isNaN(parseFloat(customBid))}
            >
              <Edit3 className="mr-2 h-4 w-4" /> Submit Bid (₪{parseFloat(customBid) || 0})
            </Button>
             <Button onClick={() => handleBidAction('speed')} className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={isSubmitting || timeLeft <= 0 || bidPlaced}>
              <Zap className="mr-2 h-4 w-4" /> {isFastPickup ? 'Submit Speed Bid' : 'Offer Speed Bid'}
            </Button>
            <Button variant="destructive" onClick={() => handleBidAction('skip')} className="w-full" disabled={isSubmitting || timeLeft <= 0 || bidPlaced}>
              <XCircle className="mr-2 h-4 w-4" /> Skip
            </Button>
          </div>
        </CardFooter>
      </Card>
       {isSubmitting && <p className="text-center text-primary mt-2"><Loader2 className="inline mr-2 h-4 w-4 animate-spin"/>Submitting your offer...</p>}
       {bidPlaced && !winningBidInfo && <p className="text-center text-primary mt-2"><Loader2 className="inline mr-2 h-4 w-4 animate-spin"/>Bid placed, AI is evaluating all offers...</p>}
      <p className="text-sm text-center text-muted-foreground mt-4">
        Your bid is evaluated on price, ETA, rating, trust score, and fast pickup. The AI Matching Engine will select the best offer.
      </p>
    </div>
  );
}

