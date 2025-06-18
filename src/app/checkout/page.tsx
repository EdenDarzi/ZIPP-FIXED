
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CreditCard, Lock, ShoppingBag, AlertTriangle, Zap, Sparkles, DollarSign, Clock, Gift, Edit, Check, ShieldCheck, Wallet as WalletIcon, TicketPercent, Calculator } from "lucide-react"; 
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react"; 
import { Label } from "@/components/ui/label"; 
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // No longer needed for calculator here

export default function CheckoutPage() {
  const { cart, itemCount, totalPrice, deliveryPreference, deliveryFee, discountAmount, finalPriceWithDelivery, smartCouponApplied, clearCart, scheduledDeliveryTime, getItemPriceWithAddons } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [discreetDelivery, setDiscreetDelivery] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');
  const [isGiftOrder, setIsGiftOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [mockWalletBalance, setMockWalletBalance] = useState<number>(0);
  const [couponCode, setCouponCode] = useState('');


  useEffect(() => {
    const notes = searchParams.get('notes');
    if (notes) {
      setCustomerNotes(decodeURIComponent(notes));
    }
    const giftParam = searchParams.get('isGift');
    if (giftParam === 'true') {
        setIsGiftOrder(true);
    }
    setMockWalletBalance(parseFloat((Math.random() * 150 + 20).toFixed(2)));
  }, [searchParams]);


  const handleDiscreetToggle = (checked: boolean) => {
    setDiscreetDelivery(checked);
    if (checked) {
        toast({
            title: "משלוח דיסקרטי הופעל",
            description: "אפשרויות למשלוח אנונימי (ללא שם שולח, אינטראקציה גנרית של שליח) יתווספו בהמשך. (הדגמה)",
            duration: 5000,
        });
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim() === '') {
        toast({ title: "קוד קופון ריק", description: "אנא הזן קוד קופון.", variant: "destructive" });
        return;
    }
    if (couponCode.toUpperCase() === 'LIVEPICK10') {
        toast({ title: "קופון הופעל!", description: "10% הנחה נוספו להזמנה שלך (הדגמה).", className: "bg-green-500 text-white" });
    } else {
        toast({ title: "קוד קופון לא תקין", description: "הקוד שהזנת אינו חוקי או פג תוקף.", variant: "destructive"});
    }
    setCouponCode('');
  };

  const handleMockPayment = () => {
    if (paymentMethod === 'wallet' && mockWalletBalance < finalPriceWithDelivery) {
        toast({
            title: "יתרה לא מספקת בארנק",
            description: `אין לך מספיק יתרה בארנק SwiftServe (₪${mockWalletBalance.toFixed(2)}) כדי לכסות את ההזמנה (₪${finalPriceWithDelivery.toFixed(2)}). אנא טען את הארנק או בחר אמצעי תשלום אחר.`,
            variant: "destructive",
            duration: 7000,
        });
        return;
    }

    toast({
      title: "התשלום עבר בהצלחה!",
      description: scheduledDeliveryTime 
        ? `ההזמנה שלך מתוכננת ל: ${scheduledDeliveryTime} ובעיבוד!` 
        : "ההזמנה שלך בעיבוד!",
      action: <Check className="text-green-500" />
    });

    const mockOrderId = `swiftsrve_${Date.now()}_${scheduledDeliveryTime ? 'scheduled' : 'asap'}`;
    
    const queryParams = new URLSearchParams();
    if (customerNotes) queryParams.append('notes', customerNotes);
    if (isGiftOrder) queryParams.append('isGift', 'true');
    
    const trackingUrl = `/order-tracking/${mockOrderId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    clearCart(); 
    router.push(trackingUrl);
  };


  if (itemCount === 0 && !searchParams.get('fromExternal')) { 
    return (
      <div className="text-center py-20">
        <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold font-headline text-primary mb-4">הסל שלך ריק</h1>
        <p className="text-lg text-muted-foreground mb-8">
          הוסף פריטים לסל שלך לפני שתמשיך לתשלום.
        </p>
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground btn-gradient-hover-primary">
          <Link href="/restaurants" aria-label="התחל בקניות"><span>התחל בקניות</span></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
          <CardTitle className="text-3xl font-headline text-primary">תשלום מאובטח</CardTitle>
          <CardDescription>בדוק את הזמנתך והשלם את הרכישה.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {itemCount > 0 && (
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
                      <span className="flex items-center"><Sparkles className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1"/>הנחות שהופעלו</span>
                      <span>-{discountAmount.toFixed(2)}₪</span>
                    </div>
                  )}
                  {scheduledDeliveryTime && (
                    <div className="flex justify-between text-sm text-blue-600">
                      <span className="font-medium flex items-center"><Clock className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1"/>מתוכנן ל:</span>
                      <span className="font-medium">{scheduledDeliveryTime}</span>
                    </div>
                  )}
                  {isGiftOrder && ( 
                      <div className="flex justify-between text-sm text-pink-600">
                          <span className="font-medium flex items-center"><Gift className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1"/>נשלח כמתנה</span>
                      </div>
                  )}
                  {customerNotes && (
                     <div className="text-sm text-muted-foreground">
                       <p className="font-medium flex items-center"><Edit className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1"/>הערות להזמנה:</p>
                       <p className="text-xs whitespace-pre-line bg-muted p-2 rounded-md mt-1">{customerNotes}</p>
                     </div>
                  )}
                  <div className="flex justify-between font-bold text-lg text-primary pt-1">
                    <span>סה"כ לתשלום</span>
                    <span>{finalPriceWithDelivery.toFixed(2)}₪</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Separator />
          
          <div>
            <h3 className="text-xl font-semibold mb-3">קופון / שובר</h3>
            <div className="flex items-center gap-2">
                <Input 
                    id="couponCode"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="הזן קוד קופון או שובר"
                    className="flex-grow"
                    aria-label="קוד קופון או שובר"
                />
                <Button variant="outline" onClick={handleApplyCoupon} disabled={!couponCode.trim()} aria-label="הפעל קופון">
                    <TicketPercent className="ml-2 h-4 w-4" /> הפעל
                </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">הדגמה: נסה "LIVEPICK10".</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-3">אמצעי תשלום</h3>
            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'wallet')} className="space-y-3" dir="rtl">
                <Label htmlFor="payWithCard" className="flex items-center p-4 border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                    <RadioGroupItem value="card" id="payWithCard" className="ml-3 rtl:ml-0 rtl:mr-3" />
                    <CreditCard className="h-5 w-5 ml-2 rtl:ml-0 rtl:mr-2 text-primary" />
                    <div className="flex-grow">
                        <span className="font-semibold">כרטיס אשראי</span>
                        <p className="text-xs text-muted-foreground">השתמש בכרטיס שמור או הוסף חדש (שער תשלומים מדומה).</p>
                    </div>
                </Label>
                <Label htmlFor="payWithWallet" className="flex items-center p-4 border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                    <RadioGroupItem value="wallet" id="payWithWallet" className="ml-3 rtl:ml-0 rtl:mr-3" disabled={mockWalletBalance < finalPriceWithDelivery} />
                    <WalletIcon className="h-5 w-5 ml-2 rtl:ml-0 rtl:mr-2 text-green-600" />
                     <div className="flex-grow">
                        <span className="font-semibold">ארנק SwiftServe</span>
                        <p className="text-xs text-muted-foreground">יתרה נוכחית: <span className="font-medium text-green-700">₪{mockWalletBalance.toFixed(2)}</span></p>
                         {mockWalletBalance < finalPriceWithDelivery && <p className="text-xs text-destructive">יתרה לא מספקת לתשלום מלא.</p>}
                    </div>
                </Label>
            </RadioGroup>
             {paymentMethod === 'card' && (
                <div className="mt-4 p-4 border border-dashed rounded-md text-center bg-muted/20">
                    <CreditCard className="h-10 w-10 text-primary mx-auto mb-3" />
                    <p className="font-semibold">שער תשלומים מאובטח (הדגמה)</p>
                    <p className="text-xs text-muted-foreground">יוצג כאן טופס להזנת פרטי כרטיס או בחירת כרטיס שמור.</p>
                </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse p-3 border rounded-md bg-muted/50 mt-4">
            <Checkbox id="discreetDelivery" checked={discreetDelivery} onCheckedChange={handleDiscreetToggle} aria-labelledby="discreetDeliveryLabel" />
            <Label htmlFor="discreetDelivery" id="discreetDeliveryLabel" className="cursor-pointer text-sm flex items-center">
              <ShieldCheck className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1 text-blue-500"/> משלוח דיסקרטי (אופציונלי)
            </Label>
          </div>

          {scheduledDeliveryTime && (
            <Badge variant="secondary" className="w-full justify-start text-left py-1.5 bg-yellow-100 text-yellow-700 border-yellow-300">
                <Clock className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1"/> ההזמנה שלך מתוכננת ל: <strong>{scheduledDeliveryTime}</strong>. היא תעובד לקראת מועד זה.
            </Badge>
          )}

          {deliveryPreference === 'arena' && !scheduledDeliveryTime && (
             <Badge variant="secondary" className="w-full justify-start text-left py-1.5 bg-blue-100 text-blue-700 border-blue-300">
                <Zap className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1"/> בחרת בזירת המשלוחים! לאחר התשלום, נמצא עבורך את השליח הטוב ביותר.
            </Badge>
          )}
          {deliveryPreference === 'smartSaver' && !scheduledDeliveryTime && (
             <Badge variant="secondary" className="w-full justify-start text-left py-1.5 bg-green-100 text-green-700 border-green-300">
                <DollarSign className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1"/> חסכוני חכם: ההזמנה שלך תימסר עם הנחה, וייתכן שתיקח קצת יותר זמן.
            </Badge>
          )}
          {smartCouponApplied && deliveryPreference !== 'smartSaver' && (
             <Badge variant="secondary" className="w-full justify-start text-left py-1.5 bg-yellow-100 text-yellow-700 border-yellow-300">
                <Sparkles className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1"/> קופון חכם של 5% הופעל על הזמנתך מעל 70₪!
            </Badge>
          )}

          <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg btn-gradient-hover-primary" onClick={handleMockPayment} aria-label={`שלם ${finalPriceWithDelivery.toFixed(2)} שקלים`}>
            <Lock className="ml-2 rtl:ml-0 rtl:mr-2 h-5 w-5" /> שלם ₪{finalPriceWithDelivery.toFixed(2)}
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
