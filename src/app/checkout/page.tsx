
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Lock, ShoppingBag, AlertTriangle, Zap, Sparkles, DollarSign } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function CheckoutPage() {
  const { cart, itemCount, totalPrice, deliveryPreference, deliveryFee, discountAmount, finalPriceWithDelivery, smartCouponApplied, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  if (itemCount === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold font-headline text-primary mb-4">הסל שלך ריק</h1>
        <p className="text-lg text-muted-foreground mb-8">
          הוסף פריטים לסל שלך לפני שתמשיך לתשלום.
        </p>
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/restaurants"><span>התחל קניות</span></Link>
        </Button>
      </div>
    );
  }

  const handleMockPayment = () => {
    toast({
      title: "התשלום עבר בהצלחה (דמו)",
      description: "ההזמנה שלך בעיבוד!",
    });

    const mockOrderId = `mockOrder_${Date.now()}`; 
    
    router.push(`/order-tracking/${mockOrderId}`);
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
                <div key={item.menuItemId} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Image
                      src={item.imageUrl || 'https://placehold.co/40x40.png'}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="rounded ml-3" 
                      data-ai-hint={item.dataAiHint || "item"}
                    />
                    <span>{item.name} (x{item.quantity})</span>
                  </div>
                  <span>{(item.price * item.quantity).toFixed(2)}₪</span>
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

          {deliveryPreference === 'arena' && (
             <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700 flex items-start">
                <Zap className="h-5 w-5 ml-2 mt-0.5 text-blue-600 flex-shrink-0" /> {/* Adjusted margin for RTL */}
                <span>בחרת בזירת המשלוחים! לאחר התשלום, נמצא עבורך את השליח הטוב ביותר. זה עשוי לקחת רגע.</span>
            </div>
          )}
          {deliveryPreference === 'smartSaver' && (
             <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700 flex items-start">
                <DollarSign className="h-5 w-5 ml-2 mt-0.5 text-green-600 flex-shrink-0" /> {/* Adjusted margin for RTL */}
                <span>חסכוני חכם: ההזמנה שלך תימסר עם הנחה, וייתכן שתיקח קצת יותר זמן.</span>
            </div>
          )}
          {smartCouponApplied && deliveryPreference !== 'smartSaver' && (
             <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700 flex items-start">
                <Sparkles className="h-5 w-5 ml-2 mt-0.5 text-yellow-600 flex-shrink-0" /> {/* Adjusted margin for RTL */}
                <span>קופון חכם של 5% הופעל על הזמנתך מעל 70₪!</span>
            </div>
          )}

          <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg" onClick={handleMockPayment}>
            <Lock className="ml-2 h-5 w-5" /> שלם {finalPriceWithDelivery.toFixed(2)}₪ (דמו) {/* Adjusted for RTL */}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            בלחיצה על "שלם עכשיו", אתה מסכים לתנאי השירות ומדיניות הפרטיות שלנו.
          </p>
        </CardContent>
        <CardFooter>
            <Button variant="outline" asChild className="w-full">
                <Link href="/cart"><span>חזור לסל</span></Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
