
'use client';

import { getOrderForBiddingById, mockCourierProfiles, getRestaurantById, mockBidsForOrder } from '@/lib/mock-data';
import type { OrderDetailsForBidding, CourierBid, CourierProfile, DeliveryVehicle } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, DollarSign, Zap, XCircle, Info, Timer, MapPin, Navigation, Package, Edit3, Clock, AlertTriangle, Bike, Car, Footprints } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { selectBestCourierBid, CourierMatchingInput, CourierMatchingOutput } from '@/ai/flows/courier-matching-flow'; // AI Matching

// Mock current courier (replace with actual auth)
const MOCK_CURRENT_COURIER_ID = 'courier1'; // Speedy Sam

// Helper to get vehicle icon
const VehicleIcon = ({ type }: { type: DeliveryVehicle | undefined }) => {
  if (type === 'motorcycle') return <Bike className="inline h-4 w-4 mr-1" />;
  if (type === 'scooter') return <Bike className="inline h-4 w-4 mr-1" />; // Using Bike for scooter too for now
  if (type === 'car') return <Car className="inline h-4 w-4 mr-1" />;
  if (type === 'bicycle') return <Bike className="inline h-4 w-4 mr-1" />;
  if (type === 'foot') return <Footprints className="inline h-4 w-4 mr-1" />;
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

  const [bidAmount, setBidAmount] = useState<number>(0);
  const [customBid, setCustomBid] = useState<string>('');
  const [isFastPickup, setIsFastPickup] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(20); // 20 seconds bidding window for courier to act
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bidPlaced, setBidPlaced] = useState<boolean>(false);

  // Mock: Simulate other bids coming in for context, and AI selection
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
    setBidAmount(fetchedOrder.baseCommission);
    setCustomBid(fetchedOrder.baseCommission.toString());

    const restDetails = getRestaurantById(fetchedOrder.restaurantName === 'Pizza Palace' ? 'restaurant1' : 'restaurant2'); // Simplified
    if(restDetails) {
      setRestaurantDetails({name: restDetails.name, location: restDetails.location});
    }

    // Simulate other bids for AI selection demo
    setOtherBids(mockBidsForOrder(orderId).filter(b => b.courierId !== MOCK_CURRENT_COURIER_ID));

  }, [orderId, router, toast]);

  useEffect(() => {
    if (timeLeft <= 0 || !order || bidPlaced) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    // Simulate bid evaluation when time is up (or slightly before for demo)
    if (timeLeft === 1 && !bidPlaced) { // Trigger evaluation if no bid placed by current courier
        handleBidEvaluation([]); // Pass empty array if current courier didn't bid
    }

    return () => clearInterval(timer);
  }, [timeLeft, order, bidPlaced]);


  const handleBidAction = async (actionType: 'accept' | 'bid' | 'speed' | 'skip') => {
    if (timeLeft <= 0 || !order || !courier || isSubmitting || bidPlaced) {
      toast({ title: "Bidding Closed", description: "The bidding window for this action has closed.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    let finalBidAmount = order.baseCommission;
    let finalFastPickup = isFastPickup; // Use the state of isFastPickup
    let message = "";

    if (actionType === 'skip') {
      router.push('/courier/open-bids');
      toast({ title: "Order Skipped", description: "You have skipped this bidding opportunity." });
      setIsSubmitting(false);
      setBidPlaced(true); // Mark as action taken
      return;
    }

    switch (actionType) {
      case 'accept':
        finalBidAmount = order.baseCommission;
        // isFastPickup state already reflects if speed was chosen prior to accept
        message = `Accepted base commission of ₪${finalBidAmount.toFixed(2)}${finalFastPickup ? ' with Speed Pickup.' : '.'}`;
        break;
      case 'bid':
        const newBid = parseFloat(customBid);
        if (isNaN(newBid) || newBid < order.baseCommission * 0.8) { // Allow slightly lower for negotiation
          toast({ title: "Invalid Bid", description: `Bid must be reasonable (e.g. at least ₪${(order.baseCommission * 0.8).toFixed(2)}).`, variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
        if (newBid > order.baseCommission * 2.5) { // Cap high bids
            toast({ title: "Bid Too High", description: `Maximum bid allowed is ₪${(order.baseCommission * 2.5).toFixed(2)}.`, variant: "destructive" });
            setIsSubmitting(false);
            return;
        }
        finalBidAmount = newBid;
        message = `Bid ₪${finalBidAmount.toFixed(2)} submitted${finalFastPickup ? ' with Speed Pickup.' : '.'}`;
        break;
      case 'speed': // This action now primarily toggles isFastPickup, bid amount is from input or base.
        // This specific button action primarily submits with current state, assuming Speed is now active
        finalFastPickup = true; // Ensure it's true if this button is clicked
        setIsFastPickup(true); // Update UI state as well
        finalBidAmount = parseFloat(customBid) || order.baseCommission;
        if (finalBidAmount < order.baseCommission * 0.8) finalBidAmount = order.baseCommission * 0.8;
         if (finalBidAmount > order.baseCommission * 2.5) finalBidAmount = order.baseCommission * 2.5;

        message = `Speed Pickup offered with current bid of ₪${finalBidAmount.toFixed(2)}.`;
        // This button can also just update the state, and a general "Submit Bid" can be used.
        // For this flow, let's make "Speed Bid" button also a submit action.
        break;
    }

    const currentCourierBid: CourierBid = {
        bidId: `bid-${orderId}-${courier.id}-${Date.now()}`,
        orderId: order.orderId,
        courierId: courier.id,
        courierName: courier.name,
        distanceToRestaurantKm: Math.random() * 3 + 0.5, // Mock
        bidAmount: finalBidAmount,
        proposedEtaMinutes: Math.round((order.estimatedRouteDistanceKm || order.estimatedDistanceKm) * (finalFastPickup ? 3 : 5) + (Math.random() * 3 + 0.5)*3), // Mock ETA calculation
        courierRating: courier.rating,
        courierTrustScore: courier.trustScore,
        vehicleType: courier.vehicleType,
        timestamp: new Date().toISOString(),
        isFastPickup: finalFastPickup,
        status: 'pending',
        courierProfileSnapshot: { ...courier }
    };

    toast({ title: "Bid Submitted!", description: message });
    setBidPlaced(true); // Mark bid as placed
    
    // Now evaluate bids (including the current courier's bid)
    await handleBidEvaluation([currentCourierBid, ...otherBids]);
    setIsSubmitting(false);
  };

  const handleBidEvaluation = async (allSubmittedBids: CourierBid[]) => {
    if (!order) return;
    toast({ title: "Evaluating Bids...", description: "The AI is selecting the best courier." });
    try {
        const input: CourierMatchingInput = { orderDetails: order, bids: allSubmittedBids };
        const result = await selectBestCourierBid(input);
        setWinningBidInfo(result);

        if (result.selectedBid) {
            if (result.selectedBid.courierId === MOCK_CURRENT_COURIER_ID) {
                toast({ title: "🎉 You Won the Bid!", description: `Order ${order.orderId} assigned to you. ${result.reasoning || ''}`, duration: 7000, variant: 'default' });
            } else {
                toast({ title: "Bid Not Won", description: `Order ${order.orderId} was assigned to ${result.selectedBid.courierName}. ${result.reasoning || ''}`, duration: 7000, variant: "default" });
            }
        } else if (result.fallbackRequired) {
            toast({ title: "No Suitable Bid", description: `No bid was selected. ${result.reasoning || 'Fallback may be initiated.'}`, variant: "destructive" });
        }
         //setTimeLeft(0); // Stop timer explicitly after evaluation
    } catch (error) {
        console.error("Error evaluating bids:", error);
        toast({ title: "Evaluation Error", description: "Could not determine winning bid.", variant: "destructive" });
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

  // Mocked data for display based on new structure
  const distanceToRestaurant = parseFloat((Math.random() * 2 + 0.2).toFixed(1)); // Mock distance to restaurant more realistically
  const estTimeFromCourierToRest = Math.round(distanceToRestaurant * (courier.vehicleType === 'bicycle' ? 6 : courier.vehicleType === 'foot' ? 10 : 3)); // Time based on vehicle
  const estTimeFromRestToCust = Math.round((order.estimatedRouteDistanceKm || order.estimatedDistanceKm) * (courier.vehicleType === 'bicycle' ? 7 : courier.vehicleType === 'foot' ? 12 : 4));
  const totalEstimatedTime = estTimeFromCourierToRest + parseInt(order.expectedPickupTime.match(/\d+/)?.[0] || '10') + estTimeFromRestToCust;


  if (winningBidInfo) {
    return (
        <Card className="shadow-xl animate-fadeIn mt-6">
            <CardHeader>
                <CardTitle className="text-2xl font-headline text-primary">Bid Result for Order {order.orderId}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {winningBidInfo.selectedBid ? (
                    winningBidInfo.selectedBid.courierId === MOCK_CURRENT_COURIER_ID ? (
                        <div className="p-4 bg-green-50 border border-green-300 rounded-md">
                            <h3 className="text-xl font-semibold text-green-700">🎉 Congratulations! You won the bid!</h3>
                            <p className="text-green-600 mt-1">Reasoning: {winningBidInfo.reasoning}</p>
                            <p className="mt-2">Proceed to pick up the order from {order.restaurantName}.</p>
                        </div>
                    ) : (
                        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-md">
                            <h3 className="text-xl font-semibold text-yellow-700">Bid Not Won</h3>
                            <p className="text-yellow-600 mt-1">Order was assigned to {winningBidInfo.selectedBid.courierName}.</p>
                            <p className="text-yellow-600 mt-1">Reasoning: {winningBidInfo.reasoning}</p>
                        </div>
                    )
                ) : (
                     <div className="p-4 bg-red-50 border border-red-300 rounded-md">
                        <h3 className="text-xl font-semibold text-red-700">No Bid Selected</h3>
                        <p className="text-red-600 mt-1">{winningBidInfo.reasoning || "A suitable bid was not found or fallback initiated."}</p>
                    </div>
                )}
                <Button onClick={() => router.push('/courier/open-bids')} className="w-full mt-4">Back to Open Bids</Button>
            </CardContent>
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
             <Badge variant={timeLeft > 10 ? "default" : timeLeft > 5 ? "secondary" : "destructive"} className={`text-lg px-3 py-1 ${timeLeft <=5 ? 'animate-pulse' : ''}`}>
                <Timer className="inline mr-2 h-5 w-5" /> {timeLeft}s
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
                <p className="text-sm text-muted-foreground">Order Value: ~₪{order.orderValue?.toFixed(2) || 'N/A'}</p>
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
                <div>
                    <p className="font-medium">Expected Pickup: {order.expectedPickupTime}</p>
                </div>
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
                 <div className="flex items-center text-sm">
                    <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                    Required Vehicles: {order.requiredVehicleType.map(v => <VehicleIcon key={v} type={v as DeliveryVehicle} />).reduce((prev, curr) => <>{prev} {curr}</>)}
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
              <Label htmlFor="customBidAmount" className="text-base">Adjust Your Bid (₪)</Label>
              <Input
                id="customBidAmount"
                type="number"
                value={customBid}
                onChange={(e) => setCustomBid(e.target.value)}
                min={order.baseCommission * 0.8} // Allow slightly lower
                step="0.50"
                className="text-lg p-2 h-12"
                placeholder={`Min ₪${(order.baseCommission * 0.8).toFixed(2)}`}
                disabled={isSubmitting || bidPlaced}
              />
              <p className="text-xs text-muted-foreground">
                Bonus requested: ₪{(parseFloat(customBid) - order.baseCommission > 0 ? parseFloat(customBid) - order.baseCommission : 0).toFixed(2)}
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <Button
                    variant={isFastPickup ? "default" : "outline"}
                    onClick={() => setIsFastPickup(!isFastPickup)}
                    className={`w-full ${isFastPickup ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                    disabled={isSubmitting || bidPlaced}
                >
                    <Zap className="mr-2 h-4 w-4" />
                    {isFastPickup ? "Speed Pickup Active (e.g. <4min to restaurant)" : "Offer Speed Pickup"}
                </Button>
            </div>
            <Separator className="my-4" />
            <div className="text-sm text-muted-foreground space-y-1">
                <p><Info className="inline h-4 w-4 mr-1 text-accent" /> Your distance to restaurant: ~{distanceToRestaurant.toFixed(1)} km</p>
                <p><Timer className="inline h-4 w-4 mr-1 text-accent" /> Est. total time for you: ~{totalEstimatedTime} min</p>
                <p><VehicleIcon type={courier.vehicleType} /> Your vehicle: {courier.vehicleType} ({courier.transportationModeDetails || 'N/A'})</p>
                <p>Rating: {courier.rating.toFixed(1)} | Trust: {courier.trustScore}% {courier.batteryPercent ? `| Batt: ${courier.batteryPercent}%` : ''}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/30 p-4 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            <Button onClick={() => handleBidAction('accept')} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting || timeLeft <= 0 || bidPlaced}>
              <CheckCircle className="mr-2 h-4 w-4" /> Accept Base (₪{order.baseCommission.toFixed(2)})
            </Button>
            <Button onClick={() => handleBidAction('bid')} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" disabled={isSubmitting || timeLeft <= 0 || parseFloat(customBid) <= order.baseCommission || bidPlaced}>
              <Edit3 className="mr-2 h-4 w-4" /> Submit Bid (₪{parseFloat(customBid) || 0})
            </Button>
             <Button onClick={() => handleBidAction('speed')} className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={isSubmitting || timeLeft <= 0 || bidPlaced}>
              <Zap className="mr-2 h-4 w-4" /> {isFastPickup ? 'Update Speed Bid' : 'Offer Speed Bid'}
            </Button>
            <Button variant="destructive" onClick={() => handleBidAction('skip')} className="w-full" disabled={isSubmitting || timeLeft <= 0 || bidPlaced}>
              <XCircle className="mr-2 h-4 w-4" /> Skip
            </Button>
          </div>
        </CardFooter>
      </Card>
       {isSubmitting && <p className="text-center text-primary mt-2"><Loader2 className="inline mr-2 h-4 w-4 animate-spin"/>Submitting your offer...</p>}
       {bidPlaced && !winningBidInfo && <p className="text-center text-primary mt-2"><Loader2 className="inline mr-2 h-4 w-4 animate-spin"/>Bid placed, awaiting results...</p>}
      <p className="text-sm text-center text-muted-foreground mt-4">
        Your bid is evaluated on price, ETA, rating, trust score, and fast pickup. The AI Matching Engine will select the best offer.
      </p>
    </div>
  );
}
