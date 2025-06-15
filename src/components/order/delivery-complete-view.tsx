
'use client';

import type { Order } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Star, CheckCircle, Gift, Heart, RotateCcw, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';

interface DeliveryCompleteViewProps {
  order: Order;
}

export function DeliveryCompleteView({ order }: DeliveryCompleteViewProps) {
  const [restaurantRating, setRestaurantRating] = useState(0);
  const [hoverRestaurantRating, setHoverRestaurantRating] = useState(0);
  const [restaurantFeedback, setRestaurantFeedback] = useState('');

  const [deliveryRating, setDeliveryRating] = useState(0);
  const [hoverDeliveryRating, setHoverDeliveryRating] = useState(0);
  const [deliveryFeedback, setDeliveryFeedback] = useState('');

  const [showCustomTipInput, setShowCustomTipInput] = useState(false);
  const [customTipAmount, setCustomTipAmount] = useState('');


  const { toast } = useToast();

  const handleFeedbackSubmit = () => {
    if (restaurantRating === 0 && deliveryRating === 0 && !restaurantFeedback && !deliveryFeedback) {
      toast({ title: "לא נבחר דירוג או הוזנה משוב", description: "אנא דרג לפחות את המסעדה או המשלוח, או הוסף הערה.", variant: "destructive" });
      return;
    }
    // Mock submission
    console.log({
      orderId: order.id,
      restaurantRating,
      restaurantFeedback,
      deliveryRating,
      deliveryFeedback,
    });
    toast({
      title: "המשוב נשלח!",
      description: "תודה ששיתפת אותנו בדעתך.",
    });
    // Optionally reset states
    setRestaurantRating(0);
    setRestaurantFeedback('');
    setDeliveryRating(0);
    setDeliveryFeedback('');
  };

  const handleTip = (amount: number | string) => {
     const tipValue = typeof amount === 'string' ? parseFloat(amount) : amount;
     if (isNaN(tipValue) || tipValue <=0) {
        toast({ title: "סכום טיפ לא תקין", description: "אנא הזן סכום חיובי.", variant: "destructive"});
        return;
     }
     toast({
      title: `טיפ בסך ₪${tipValue.toFixed(2)} נוסף! (דמו)`,
      description: `תודה על נדיבותך כלפי ${order.assignedCourier?.name || 'השליח שלך'}.`,
    });
    setShowCustomTipInput(false);
    setCustomTipAmount('');
  }

  return (
    <Card className="shadow-xl animate-fadeIn">
      <CardHeader className="text-center items-center">
        <Heart className="h-16 w-16 text-pink-500 mb-3 fill-pink-500" />
        <CardTitle className="text-3xl font-headline text-primary">המשלוח הושלם!</CardTitle>
        <CardDescription className="text-lg">
          ההזמנה שלך מ{order.restaurantName} הגיעה. בתאבון! ❤️
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Restaurant Feedback */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">דרג את המסעדה</h3>
          <div className="flex justify-center space-x-1 mb-3" dir="ltr"> {/* LTR for stars */}
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={`resto-${star}`}
                className={`h-8 w-8 cursor-pointer transition-colors
                  ${(hoverRestaurantRating || restaurantRating) >= star ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'}`}
                onClick={() => setRestaurantRating(star)}
                onMouseEnter={() => setHoverRestaurantRating(star)}
                onMouseLeave={() => setHoverRestaurantRating(0)}
                aria-label={`דרג מסעדה ${star} כוכבים`}
              />
            ))}
          </div>
          <Textarea
            placeholder={`איך הייתה האוכל במסעדת ${order.restaurantName}?`}
            value={restaurantFeedback}
            onChange={(e) => setRestaurantFeedback(e.target.value)}
            className="min-h-[80px]"
            aria-label="משוב על המסעדה"
          />
        </div>

        <Separator />

        {/* Delivery Feedback */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">דרג את המשלוח</h3>
          <div className="flex justify-center space-x-1 mb-3" dir="ltr"> {/* LTR for stars */}
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={`delivery-${star}`}
                className={`h-8 w-8 cursor-pointer transition-colors
                  ${(hoverDeliveryRating || deliveryRating) >= star ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'}`}
                onClick={() => setDeliveryRating(star)}
                onMouseEnter={() => setHoverDeliveryRating(star)}
                onMouseLeave={() => setHoverDeliveryRating(0)}
                aria-label={`דרג משלוח ${star} כוכבים`}
              />
            ))}
          </div>
          <Textarea
            placeholder={`איך היה שירות המשלוח של ${order.assignedCourier?.name || 'השליח'}?`}
            value={deliveryFeedback}
            onChange={(e) => setDeliveryFeedback(e.target.value)}
            className="min-h-[80px]"
            aria-label="משוב על המשלוח"
          />
        </div>

        <Button onClick={handleFeedbackSubmit} className="w-full mt-3 bg-primary hover:bg-primary/90">
          שלח משוב
        </Button>

        <Separator />

        <div className="pt-2 space-y-3">
            <h3 className="text-lg font-semibold text-center">פנק את השליח/ה</h3>
            <p className="text-sm text-muted-foreground text-center">
                {order.assignedCourier?.name || 'השליח/ה שלך'} עבד/ה קשה כדי להביא את ההזמנה. אפשר לשקול להשאיר טיפ!
            </p>
            {!showCustomTipInput ? (
                <div className="flex flex-wrap justify-center gap-2">
                    <Button variant="outline" onClick={() => handleTip(2)}>₪2</Button>
                    <Button variant="outline" onClick={() => handleTip(5)}>₪5</Button>
                    <Button variant="outline" onClick={() => handleTip(10)}>₪10</Button>
                    <Button variant="outline" onClick={() => setShowCustomTipInput(true)}>טיפ מותאם אישית</Button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2 animate-fadeIn">
                    <Label htmlFor="customTip" className="sr-only">סכום טיפ מותאם אישית</Label>
                    <Input
                        id="customTip"
                        type="number"
                        placeholder="הזן סכום (למשל, 7.50)"
                        value={customTipAmount}
                        onChange={(e) => setCustomTipAmount(e.target.value)}
                        className="max-w-xs text-center"
                    />
                    <div className="flex gap-2">
                        <Button onClick={() => handleTip(customTipAmount)} className="bg-accent hover:bg-accent/90">
                            <DollarSign className="mr-1 h-4 w-4"/> שלח טיפ
                        </Button>
                        <Button variant="ghost" onClick={() => setShowCustomTipInput(false)}>בטל</Button>
                    </div>
                </div>
            )}
        </div>

      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-4">
        <Button variant="outline" asChild className="flex-1">
          <Link href={`/restaurants/${order.restaurantId}`}>
            <span className="flex items-center justify-center w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> הזמן שוב מ{order.restaurantName}
            </span>
          </Link>
        </Button>
        <Button asChild className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/restaurants">
            <span className="flex items-center justify-center w-full">
              <CheckCircle className="mr-2 h-4 w-4" /> הזמן ממקום אחר
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

    