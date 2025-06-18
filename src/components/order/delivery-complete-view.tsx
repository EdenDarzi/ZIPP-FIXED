
'use client';

import type { Order } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Star, CheckCircle, Gift, Heart, RotateCcw, DollarSign, MessageSquare, Camera, Share2, Mic, ThumbsUp, Facebook, Instagram, Video as TiktokIcon } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { cn } from '@/lib/utils';

const WhatsAppIcon = MessageSquare; // Keep for WhatsApp or replace if a more specific icon is found later


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
  const [addToTasteLibrary, setAddToTasteLibrary] = useState(false);


  const { toast } = useToast();

  const handleFeedbackSubmit = () => {
    if (restaurantRating === 0 && deliveryRating === 0 && !restaurantFeedback && !deliveryFeedback) {
      toast({ title: "לא נבחר דירוג או הוזנה משוב", description: "אנא דרג לפחות את המסעדה או המשלוח, או הוסף הערה.", variant: "destructive" });
      return;
    }
    console.log({
      orderId: order.id,
      restaurantRating,
      restaurantFeedback,
      deliveryRating,
      deliveryFeedback,
      addToTasteLibrary,
    });
    toast({
      title: "המשוב נשלח!",
      description: "תודה ששיתפת אותנו בדעתך.",
    });
    if (addToTasteLibrary && order.items.length > 0) {
        toast({
            title: "נוסף לספריית הטעמים!",
            description: `"${order.items[0].name}" נשמר במועדפים שלך (בקרוב).`,
        });
    }
    setRestaurantRating(0);
    setRestaurantFeedback('');
    setDeliveryRating(0);
    setDeliveryFeedback('');
    setAddToTasteLibrary(false);
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

  const handleSocialShare = (platform: string) => {
    const dishName = order.items.length > 0 ? order.items[0].name : "my amazing meal";
    toast({
        title: `שיתוף ב-${platform} (דמו)`,
        description: `שיתפת את "${dishName}" מ-${order.restaurantName} ב-${platform}! +10 כוכבים נוספו לחשבונך! (SocialDrop דמו)`,
    });
  };

  const handleVoiceFeedback = () => {
    toast({
        title: "משוב קולי (בקרוב!)",
        description: "הקלטת משוב קולי תתאפשר בקרוב. נשמח לשמוע אותך!",
    });
  };

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
        
        <Card className="bg-accent/10 border-accent/30 p-4">
          <CardHeader className="p-0 pb-2 text-center">
            <CardTitle className="text-xl text-accent font-headline flex items-center justify-center">
                <Share2 className="h-6 w-6 ml-2" /> SocialDrop: שתפו וזכו בכוכבים!
            </CardTitle>
            <CardDescription className="text-sm text-accent-foreground/80">
                כל שיתוף מוצלח של המנה שלכם ברשתות החברתיות יכול לזכות אתכם ב"כוכבים" להנחות ופרסים!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-3 flex flex-wrap justify-center items-center gap-3">
            <Button variant="outline" className="border-accent text-accent hover:bg-accent/20" onClick={() => handleSocialShare('Facebook')}>
                <Facebook className="h-5 w-5 ml-2"/> Facebook
            </Button>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent/20" onClick={() => handleSocialShare('Instagram')}>
                <Instagram className="h-5 w-5 ml-2"/> Instagram
            </Button>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent/20" onClick={() => handleSocialShare('TikTok')}>
                <TiktokIcon className="h-5 w-5 ml-2"/> TikTok
            </Button>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent/20" onClick={() => handleSocialShare('WhatsApp')}>
                <WhatsAppIcon className="h-5 w-5 ml-2"/> WhatsApp
            </Button>
          </CardContent>
        </Card>

        <Separator />
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">דרג את העסק/מסעדה</h3>
          <div className="flex justify-center space-x-1 mb-3" dir="ltr">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={`resto-${star}`}
                className={`h-8 w-8 cursor-pointer transition-colors
                  ${(hoverRestaurantRating || restaurantRating) >= star ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'}`}
                onClick={() => setRestaurantRating(star)}
                onMouseEnter={() => setHoverRestaurantRating(star)}
                onMouseLeave={() => setHoverRestaurantRating(0)}
                aria-label={`דרג עסק ${star} כוכבים`}
              />
            ))}
          </div>
          <Textarea
            placeholder={`איך הייתה החוויה שלך עם ${order.restaurantName}?`}
            value={restaurantFeedback}
            onChange={(e) => setRestaurantFeedback(e.target.value)}
            className="min-h-[80px]"
            aria-label="משוב על העסק"
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">דרג את המשלוח</h3>
          <div className="flex justify-center space-x-1 mb-3" dir="ltr">
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

        <div className="flex items-center space-x-2 rtl:space-x-reverse justify-center mt-3">
            <Checkbox id="addToTasteLibrary" checked={addToTasteLibrary} onCheckedChange={(checked) => setAddToTasteLibrary(Boolean(checked))} />
            <Label htmlFor="addToTasteLibrary" className="cursor-pointer text-sm text-muted-foreground">
                הוסף את {order.items.length > 0 ? `"${order.items[0].name}"` : "המנה הראשית"} לספריית הטעמים שלי (בקרוב)
            </Label>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <Button onClick={handleFeedbackSubmit} className="flex-1 bg-primary hover:bg-primary/90">
              <ThumbsUp className="ml-2 h-4 w-4" /> שלח משוב
            </Button>
            <Button variant="outline" onClick={handleVoiceFeedback} className="flex-1">
              <Mic className="mr-2 h-4 w-4" /> השאר משוב קולי (בקרוב!)
            </Button>
        </div>


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
              <CheckCircle className="mr-2 h-4 w-4" /> הזמן מעסק אחר
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
