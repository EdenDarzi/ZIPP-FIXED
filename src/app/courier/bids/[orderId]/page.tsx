
'use client';

import { getOrderForBiddingById, mockCourierProfiles, getRestaurantById } from '@/lib/mock-data';
import type { OrderDetailsForBidding, CourierBid, CourierProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, DollarSign, Zap, XCircle, Info, Timer, MapPin, Navigation } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Mock current courier (replace with actual auth)
const MOCK_CURRENT_COURIER_ID = 'courier1';

export default function CourierBidPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const router = useRouter();
  const { toast } = useToast();

  const [order, setOrder] = useState<OrderDetailsForBidding | null>(null);
  const [courier, setCourier] = useState<CourierProfile | null>(null);
  
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [customBid, setCustomBid] = useState<string>('');
  const [isFastPickup, setIsFastPickup] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(20); // 20 seconds bidding window

  useEffect(() => {
    const fetchedOrder = getOrderForBiddingById(orderId);
    const fetchedCourier = mockCourierProfiles.find(c => c.id === MOCK_CURRENT_COURIER_ID);

    if (!fetchedOrder) {
      notFound();
      return;
    }
    if (!fetchedCourier) {
        // Handle case where courier profile is not found (e.g., redirect or error)
        toast({ title: "Error", description: "Courier profile not found.", variant: "destructive"});
        router.push('/courier/open-bids');
        return;
    }
    setOrder(fetchedOrder);
    setCourier(fetchedCourier);
    setBidAmount(fetchedOrder.baseCommission);
    setCustomBid(fetchedOrder.baseCommission.toString());
  }, [orderId, router, toast]);

  useEffect(() => {
    if (timeLeft <= 0 || !order) return;
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, order]);

  if (!order || !courier) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Timer className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading bidding opportunity...</p>
      </div>
    );
  }

  const restaurantDetails = getRestaurantById(order.restaurantName === 'Pizza Palace' ? 'restaurant1' : 'restaurant2'); // Simplified


  const handleBidAction = (actionType: 'accept' | 'bid' | 'speed' | 'skip') => {
    if (timeLeft <= 0) {
      toast({ title: "Time's Up!", description: "Bidding window has closed.", variant: "destructive" });
      return;
    }

    let finalBidAmount = order.baseCommission;
    let finalFastPickup = isFastPickup;
    let message = "";

    switch (actionType) {
      case 'accept':
        finalBidAmount = order.baseCommission;
        finalFastPickup = false; // Reset if they just accept base
        message = `Accepted base commission of ₪${finalBidAmount.toFixed(2)}.`;
        break;
      case 'bid':
        const newBid = parseFloat(customBid);
        if (isNaN(newBid) || newBid < order.baseCommission) {
          toast({ title: "Invalid Bid", description: `Bid must be at least ₪${order.baseCommission.toFixed(2)}.`, variant: "destructive" });
          return;
        }
        // Example: Prevention of illegal/high bids (e.g., max 2x base)
        if (newBid > order.baseCommission * 2) {
            toast({ title: "Bid Too High", description: `Maximum bid allowed is ₪${(order.baseCommission * 2).toFixed(2)}.`, variant: "destructive" });
            return;
        }
        finalBidAmount = newBid;
        message = `Bid ₪${finalBidAmount.toFixed(2)} submitted.`;
        break;
      case 'speed':
        finalFastPickup = true;
        // Keep current bid amount or base if not set
        finalBidAmount = parseFloat(customBid) || order.baseCommission; 
        message = `Speed bid submitted! Committed to faster pickup with bid ₪${finalBidAmount.toFixed(2)}.`;
        break;
      case 'skip':
        router.push('/courier/open-bids');
        toast({ title: "Order Skipped", description: "You have skipped this bidding opportunity." });
        return;
    }
    
    // Mock submission
    console.log({
      orderId: order.orderId,
      courierId: courier.id,
      bidAmount: finalBidAmount,
      isFastPickup: finalFastPickup,
      action: actionType,
      // In a real app, add courierRating, trustScore, distanceToRestaurantKm, proposedEtaMinutes
    });

    toast({ title: "Bid Submitted!", description: message });
    // Potentially disable buttons or redirect after bid
    // For now, just reset timer to simulate moving on
    setTimeLeft(0); 
  };

  const distanceToRestaurant = Math.random() * 3 + 0.5; // Mock distance to restaurant: 0.5 to 3.5 km
  const timeToRestaurant = Math.round(distanceToRestaurant * 5); // Mock time: 5 mins per km
  const timeToDestination = timeToRestaurant + Math.round(order.estimatedDistanceKm * 6); // Mock delivery time

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Open Bids
      </Button>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10 p-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-headline text-primary">Delivery Opportunity</CardTitle>
            <div className={`text-xl font-semibold px-3 py-1 rounded-md ${timeLeft > 10 ? 'bg-green-500/20 text-green-700' : timeLeft > 5 ? 'bg-yellow-500/20 text-yellow-700' : 'bg-red-500/20 text-red-700'}`}>
              <Timer className="inline mr-2 h-5 w-5" /> {timeLeft}s left
            </div>
          </div>
          <CardDescription className="text-base">
            Order <span className="font-semibold text-primary">{order.orderId}</span> from <span className="font-semibold text-primary">{order.restaurantName}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground border-b pb-2 mb-3">Order Details</h3>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-3 text-accent" />
              <div>
                <p className="font-medium">From: {order.restaurantName}</p>
                <p className="text-sm text-muted-foreground">{restaurantDetails?.location}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Navigation className="h-5 w-5 mr-3 text-accent" />
               <div>
                <p className="font-medium">To: {order.deliveryAddress}</p>
                <p className="text-sm text-muted-foreground">~{order.estimatedDistanceKm.toFixed(1)} km delivery journey</p>
              </div>
            </div>
             <div className="flex items-center">
              <Info className="h-5 w-5 mr-3 text-accent" />
               <div>
                <p className="font-medium">Your distance to restaurant</p>
                <p className="text-sm text-muted-foreground">~{distanceToRestaurant.toFixed(1)} km</p>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-3 text-green-600" />
              <div>
                <p className="font-medium">Base Salary</p>
                <p className="text-2xl font-bold text-green-600">₪{order.baseCommission.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Timer className="h-5 w-5 mr-3 text-accent" />
              <div>
                <p className="font-medium">Estimated Total Time (Pickup + Delivery)</p>
                 <p className="text-sm text-muted-foreground">{timeToDestination} minutes</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground border-b pb-2 mb-3">Your Bid</h3>
             <div className="space-y-2">
              <Label htmlFor="customBidAmount" className="text-base">Your Bid Amount (₪)</Label>
              <Input 
                id="customBidAmount"
                type="number"
                value={customBid}
                onChange={(e) => setCustomBid(e.target.value)}
                min={order.baseCommission}
                step="0.50"
                className="text-lg p-2 h-12"
                placeholder={`Min ₪${order.baseCommission.toFixed(2)}`}
              />
              <p className="text-xs text-muted-foreground">
                Base is ₪{order.baseCommission.toFixed(2)}. You can request more. Current bonus: ₪{(parseFloat(customBid) - order.baseCommission > 0 ? parseFloat(customBid) - order.baseCommission : 0).toFixed(2)}
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <Button 
                    variant={isFastPickup ? "default" : "outline"}
                    onClick={() => setIsFastPickup(!isFastPickup)} 
                    className={`w-full ${isFastPickup ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                >
                    <Zap className="mr-2 h-4 w-4" /> 
                    {isFastPickup ? "Speed Pickup Active (4 min)" : "Offer Speed Pickup (pickup within 4 min)"}
                </Button>
            </div>
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">
              Your rating: {courier.rating.toFixed(1)} | Trust Score: {courier.trustScore}%
            </p>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/30 p-4 border-t">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
            <Button onClick={() => handleBidAction('accept')} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={timeLeft <= 0}>
              <CheckCircle className="mr-2 h-4 w-4" /> Accept Base (₪{order.baseCommission.toFixed(2)})
            </Button>
            <Button onClick={() => handleBidAction('bid')} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" disabled={timeLeft <= 0 || parseFloat(customBid) <= order.baseCommission}>
              <DollarSign className="mr-2 h-4 w-4" /> Submit Bid (₪{parseFloat(customBid) || 0})
            </Button>
             <Button onClick={() => handleBidAction('speed')} className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={timeLeft <= 0}>
              <Zap className="mr-2 h-4 w-4" /> Speed Bid
            </Button>
            <Button variant="destructive" onClick={() => handleBidAction('skip')} className="w-full" disabled={timeLeft <= 0}>
              <XCircle className="mr-2 h-4 w-4" /> Skip
            </Button>
          </div>
        </CardFooter>
      </Card>
      <p className="text-sm text-center text-muted-foreground">
        Your bid will be evaluated against others based on price, ETA, rating, and trust score.
      </p>
    </div>
  );
}
