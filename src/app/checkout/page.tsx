
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CreditCard, Lock, ShoppingBag, AlertTriangle, Zap, Sparkles, DollarSign, Clock, Gift, Edit } from "lucide-react"; 
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react"; 
import { Label } from "@/components/ui/label"; 
import { Checkbox } from "@/components/ui/checkbox";

export default function CheckoutPage() {
  const { cart, itemCount, totalPrice, deliveryPreference, deliveryFee, discountAmount, finalPriceWithDelivery, smartCouponApplied, clearCart, scheduledDeliveryTime, getItemPriceWithAddons } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [discreetDelivery, setDiscreetDelivery] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');

  useEffect(() => {
    const notes = searchParams.get('notes');
    if (notes) {
      setCustomerNotes(notes);
    }
  }, [searchParams]);


  const handleDiscreetToggle = (checked: boolean) => {
    setDiscreetDelivery(checked);
    if (checked) {
        toast({
            title: "משלוח דיסקרטי",
            description: "אפשרויות למשלוח אנונימי (למשל, ללא שם שולח, אינטראקציה גנרית של שליח) יתווספו בקרוב.",
            duration: 5000,
        });
    }
  };


  if (itemCount === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold font-headline text-primary mb-4">הסל שלך ריק</h1>
        <p className="text-lg text-muted-foreground mb-8">
          הוסף פריטים לסל שלך לפני שתמשיך לתשלום.
        </p>
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/restaurants" aria-label="התחל בקניות"><span>התחל בקניות</span></Link>
        </Button>
      </div>
    );
  }

  const handleMockPayment = () => {
    toast({
      title: "התשלום עבר בהצלחה (דמו)",
      description: scheduledDeliveryTime 
        ? `ההזמנה שלך מתוכננת ל: ${scheduledDeliveryTime} ובעיבוד!` 
        : "ההזמנה שלך בעיבוד!",
    });

    const mockOrderId = `mockOrder_${Date.now()}_${scheduledDeliveryTime ? 'scheduled' : 'asap'}`; 
    
    // Pass customerNotes to the order tracking page via query params (mock)
    const trackingUrl = customerNotes 
      ? `/order-tracking/${mockOrderId}?notes=${encodeURIComponent(customerNotes)}`
      : `/order-tracking/${mockOrderId}`;
    
    router.push(trackingUrl);
  };


  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">תשלום מאובטח</CardTitle>
          <CardDescription>בדוק את הזמנתך והשלם את הרכישה.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">סיכום הזמנה</h3>
            <div className="p-4 bg-muted/30 rounded-md space-y-3">
              {cart.map(item => (
                <div key={item.id} className="text-sm pb-2 mb-2 border-b border-border/50 last:border-b-0 last:pb-0 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <Image
                        src={item.imageUrl || 'https://placehold.co/40x40.png'}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded ml-3 rtl:ml-0 rtl:mr-3 flex-shrink-0" 
                        data-ai-hint={item.dataAiHint || "item"}
                      />
                      <div>
                        <span className="font-medium">{item.name} (x{item.quantity})</span>
                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                          <ul className="list-none mr-0 rtl:mr-0 text-xs text-muted-foreground mt-0.5">
                              {item.selectedAddons.map(addon => (
                                  <li key={addon.optionId}>
                                      <span className="text-muted-foreground/80">{addon.groupTitle}: </span>
                                      {addon.optionName} 
                                      {addon.optionPrice > 0 && ` (+₪${addon.optionPrice.toFixed(2)})`}
                                  </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <span className="font-medium whitespace-nowrap">{(getItemPriceWithAddons(item) * item.quantity).toFixed(2)}₪</span>
                  </div>
                </div>
              ))}
              <div className="border-t pt-3 mt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>סה"כ ביניים</span>
                  <span>{totalPrice.toFixed(2)}₪</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>משלוח ({deliveryPreference === 'fastest' ? 'המהיר ביותר' : deliveryPreference === 'smartSaver' ? 'חסכוני חכם' : 'זירה'})</span>
                  <span>{deliveryFee > 0 ? `${deliveryFee.toFixed(2)}₪` : 'חינם'}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>הנחות שהופעלו</span>
                    <span>-{discountAmount.toFixed(2)}₪</span>
                  </div>
                )}
                {scheduledDeliveryTime && (
                  <div className="flex justify-between text-sm text-blue-600">
                    <span className="font-medium flex items-center"><Clock className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1"/>מתוכנן ל:</span>
                    <span className="font-medium">{scheduledDeliveryTime}</span>
                  </div>
                )}
                {cart.some(item => item.name.toLowerCase().includes("gift") || item.selectedAddons?.some(sa => sa.optionName.toLowerCase().includes("gift"))) && ( 
                    <div className="flex justify-between text-sm text-pink-600">
                        <span className="font-medium flex items-center"><Gift className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1"/>נשלח כמתנה</span>
                        <span className="font-medium">(פרטים בקרוב)</span>
                    </div>
                )}
                {customerNotes && (
                   <div className="text-sm text-muted-foreground">
                     <p className="font-medium flex items-center"><Edit className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1"/>הערות להזמנה:</p>
                     <p className="text-xs whitespace-pre-line bg-muted p-2 rounded-md mt-1">{customerNotes}</p>
                   </div>
                )}
                <div className="flex justify-between font-bold text-lg text-primary pt-1">
                  <span>סה"כ</span>
                  <span>{finalPriceWithDelivery.toFixed(2)}₪</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">פרטי תשלום</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              זהו מציין מקום לשילוב תשלומים. לחץ על "שלם עכשיו" כדי לדמות תשלום מוצלח.
            </p>
            <div className="p-6 border border-dashed rounded-md text-center bg-muted/20">
              <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="font-semibold text-lg">שער תשלומים (דמו)</p>
              <p className="text-sm text-muted-foreground">עבד את התשלום שלך באופן מאובטח.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse p-3 border rounded-md bg-muted/50">
            <Checkbox id="discreetDelivery" checked={discreetDelivery} onCheckedChange={handleDiscreetToggle} aria-labelledby="discreetDeliveryLabel" />
            <Label htmlFor="discreetDelivery" id="discreetDeliveryLabel" className="cursor-pointer text-sm">
              🤫 משלוח דיסקרטי (אפשרויות אנונימיות בקרוב)
            </Label>
          </div>

          {scheduledDeliveryTime && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700 flex items-start">
                <Clock className="h-5 w-5 ml-2 rtl:ml-0 rtl:mr-2 mt-0.5 text-yellow-600 flex-shrink-0" /> 
                <span>ההזמנה שלך מתוכננת ל: <strong>{scheduledDeliveryTime}</strong>. היא תעובד לקראת מועד זה.</span>
            </div>
          )}

          {deliveryPreference === 'arena' && !scheduledDeliveryTime && (
             <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700 flex items-start">
                <Zap className="h-5 w-5 ml-2 rtl:ml-0 rtl:mr-2 mt-0.5 text-blue-600 flex-shrink-0" /> 
                <span>בחרת בזירת המשלוחים! לאחר התשלום, נמצא עבורך את השליח הטוב ביותר. זה עשוי לקחת רגע.</span>
            </div>
          )}
          {deliveryPreference === 'smartSaver' && !scheduledDeliveryTime && (
             <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700 flex items-start">
                <DollarSign className="h-5 w-5 ml-2 rtl:ml-0 rtl:mr-2 mt-0.5 text-green-600 flex-shrink-0" /> 
                <span>חסכוני חכם: ההזמנה שלך תימסר עם הנחה, וייתכן שתיקח קצת יותר זמן.</span>
            </div>
          )}
          {smartCouponApplied && deliveryPreference !== 'smartSaver' && (
             <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700 flex items-start">
                <Sparkles className="h-5 w-5 ml-2 rtl:ml-0 rtl:mr-2 mt-0.5 text-yellow-600 flex-shrink-0" /> 
                <span>קופון חכם של 5% הופעל על הזמנתך מעל 70₪!</span>
            </div>
          )}

          <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg" onClick={handleMockPayment} aria-label={`שלם ${finalPriceWithDelivery.toFixed(2)} שקלים (דמו)`}>
            <Lock className="ml-2 rtl:ml-0 rtl:mr-2 h-5 w-5" /> שלם {finalPriceWithDelivery.toFixed(2)}₪ (דמו) 
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            בלחיצה על "שלם עכשיו", אתה מסכים לתנאי השירות ומדיניות הפרטיות שלנו.
          </p>
        </CardContent>
        <CardFooter>
            <Button variant="outline" asChild className="w-full" aria-label="חזור לסל הקניות">
                <Link href="/cart"><span>חזור לסל</span></Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

