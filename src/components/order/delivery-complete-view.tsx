
'use client';

import type { Order } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, CheckCircle, Gift, Heart, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface DeliveryCompleteViewProps {
  order: Order;
}

export function DeliveryCompleteView({ order }: DeliveryCompleteViewProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    // Mock submission
    console.log({ orderId: order.id, rating, feedback });
    toast({
      title: "Feedback Submitted!",
      description: "Thanks for sharing your thoughts.",
    });
  };
  
  const handleTip = (amount: number) => {
     toast({
      title: `Added ₪${amount} Tip! (Mock)`,
      description: `Thank you for your generosity towards ${order.assignedCourier?.name || 'your courier'}.`,
    });
  }

  return (
    <Card className="shadow-xl animate-fadeIn">
      <CardHeader className="text-center items-center">
        <Heart className="h-16 w-16 text-pink-500 mb-3 fill-pink-500" />
        <CardTitle className="text-3xl font-headline text-primary">Delivery Complete!</CardTitle>
        <CardDescription className="text-lg">
          Your order from {order.restaurantName} has arrived. Enjoy your meal! ❤️
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">Rate Your Experience</h3>
          <div className="flex justify-center space-x-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer transition-colors
                  ${(hoverRating || rating) >= star ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`Rate ${star} star`}
              />
            ))}
          </div>
          <Textarea
            placeholder={`How was your delivery by ${order.assignedCourier?.name || 'the courier'}? Any comments on the food?`}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[80px]"
            aria-label="Feedback text area"
          />
           <Button onClick={handleRatingSubmit} className="w-full mt-3 bg-primary hover:bg-primary/90">
            Submit Feedback
          </Button>
        </div>

        <div className="border-t pt-6 space-y-3">
            <h3 className="text-lg font-semibold text-center">Support Your Courier</h3>
            <p className="text-sm text-muted-foreground text-center">
                {order.assignedCourier?.name || 'Your courier'} worked hard to bring your order. Consider leaving a tip!
            </p>
            <div className="flex justify-center space-x-2">
                <Button variant="outline" onClick={() => handleTip(2)}>₪2</Button>
                <Button variant="outline" onClick={() => handleTip(5)}>₪5</Button>
                <Button variant="outline" onClick={() => handleTip(10)}>₪10</Button>
                <Button variant="outline">Custom Tip</Button>
            </div>
        </div>

      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-4">
        <Button variant="outline" asChild className="flex-1">
          <Link href={`/restaurants/${order.restaurantId}`}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reorder from {order.restaurantName}
          </Link>
        </Button>
        <Button asChild className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/restaurants">
            <CheckCircle className="mr-2 h-4 w-4" /> Order Again
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
