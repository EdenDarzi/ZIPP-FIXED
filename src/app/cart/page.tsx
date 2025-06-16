
'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Zap, CheckCircle, ShieldQuestion, Sparkles, DollarSign, Clock, Gift, Users, Navigation, Edit } from 'lucide-react'; // Added Gift, Users, Navigation, Edit
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { DeliveryPreference } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input'; 
import { Textarea } from '@/components/ui/textarea'; // Added Textarea
import { useState } from 'react'; 
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice, // Base total price without delivery/discounts
    deliveryPreference,
    setDeliveryPreference,
    deliveryFee,
    discountAmount,
    finalPriceWithDelivery,
    smartCouponApplied,
    scheduledDeliveryTime, 
    setScheduledDeliveryTime,
    getItemPriceWithAddons,
  } = useCart();

  const [manualScheduledTime, setManualScheduledTime] = useState(scheduledDeliveryTime || '');
  const [isGift, setIsGift] = useState(false);
  const [customerNotes, setCustomerNotes] = useState(''); // State for customer notes
  const { toast } = useToast();

  const handleSetManualScheduledTime = () => {
    if (manualScheduledTime.trim()) {
      setScheduledDeliveryTime(manualScheduledTime.trim());
    }
  };

  const handleClearScheduledTime = () => {
    setScheduledDeliveryTime(null);
    setManualScheduledTime('');
  };

  const handleGiftToggle = (checked: boolean) => {
    setIsGift(checked);
    if (checked) {
        toast({
            title: "משלוח מתנה!",
            description: "אפשרויות להוספת נמען ופתק אישי יופיעו בקרוב בתהליך התשלום.",
        });
    }
  };

  const handleDynamicLocationClick = () => {
    toast({
        title: "משלוח למיקום דינמי (בטא)",
        description: "המשלוח יעקוב אחר מיקומך! אידיאלי כשאתה בתנועה. פיצ'ר בפיתוח.",
        duration: 5000,
    });
  };
  
  const handleGroupOrderClick = () => {
    toast({
        title: "הזמנה קבוצתית (בקרוב!)",
        description: "הזמן חברים להוסיף פריטים לעגלה זו ולחלק את החשבון! פונקציונליות בפיתוח.",
        duration: 5000,
    });
  };

  if (itemCount === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold font-headline text-primary mb-4">הסל שלך ריק</h1>
        <p className="text-lg text-muted-foreground mb-8">
          נראה שעדיין לא הוספת שום דבר לסל שלך.
        </p>
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/restaurants" aria-label="התחל בקניות"><span>התחל בקניות</span></Link>
        </Button>
      </div>
    );
  }

  const estimatedPreparationTime = Math.max(15, itemCount * 5); 

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold font-headline text-primary">סל הקניות שלך</h1>
        <p className="text-lg text-muted-foreground">בדוק את הפריטים שלך ובחר אפשרויות משלוח.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-start p-4 gap-4 shadow-md">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={item.imageUrl || 'https://placehold.co/100x100.png'}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={item.dataAiHint || "food item"}
                />
              </div>
              <div className="flex-grow text-right sm:text-right"> 
                <h2 className="text-lg font-semibold text-foreground">{item.name}</h2>
                <p className="text-sm text-muted-foreground">מחיר בסיס: {item.price.toFixed(2)}₪</p>
                {item.selectedAddons && item.selectedAddons.length > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    <p className="font-medium">תוספות:</p>
                    <ul className="list-disc list-inside mr-4 rtl:mr-0 rtl:ml-4">
                      {item.selectedAddons.map(addon => (
                        <li key={addon.optionId}>
                          {addon.groupTitle}: {addon.optionName} (+₪{addon.optionPrice.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0 my-2 sm:my-0 self-center sm:self-auto">
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`הפחת כמות עבור ${item.name}`}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium" aria-label={`כמות נוכחית עבור ${item.name}: ${item.quantity}`}>{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`הגדל כמות עבור ${item.name}`}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-semibold text-lg text-primary w-24 text-left sm:text-left flex-shrink-0 self-center sm:self-auto">{(getItemPriceWithAddons(item) * item.quantity).toFixed(2)}₪</p> 
              <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80 flex-shrink-0 self-center sm:self-start" aria-label={`הסר את ${item.name} מהסל`}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </Card>
          ))}

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-headline text-primary">אפשרויות משלוח</CardTitle>
              <CardDescription>בחר כיצד תרצה לקבל את ההזמנה שלך.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={deliveryPreference}
                onValueChange={(value) => setDeliveryPreference(value as DeliveryPreference)}
                className="space-y-3"
                dir="rtl" 
                aria-label="אפשרויות משלוח"
              >
                <Label htmlFor="arena-delivery" className="flex items-center p-4 border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                  <RadioGroupItem value="arena" id="arena-delivery" className="ml-3" aria-label="זירת המשלוחים החכמה" /> 
                  <div className="flex-grow">
                    <div className="font-semibold flex items-center">
                      <Zap className="h-5 w-5 ml-2 text-accent" /> זירת המשלוחים החכמה (ברירת מחדל)
                    </div>
                    <p className="text-sm text-muted-foreground">מערכת ה-AI שלנו מאתרת ומודיעה לשליחים זמינים באזורך. הם מגיבים עם הצעות, והמערכת בוחרת את השליח המתאים ביותר למשלוח מהיר ויעיל, תוך התחשבות במיקום, זמינות ודירוג.</p>
                  </div>
                  <span className="font-semibold text-green-600 mr-2">חינם</span> 
                </Label>
                <Label htmlFor="fastest-delivery" className="flex items-center p-4 border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                  <RadioGroupItem value="fastest" id="fastest-delivery" className="ml-3" aria-label="משלוח מהיר ביותר" />
                  <div className="flex-grow">
                    <div className="font-semibold flex items-center">
                       <CheckCircle className="h-5 w-5 ml-2 text-primary" /> משלוח מהיר ביותר
                    </div>
                    <p className="text-sm text-muted-foreground">משלוח בעדיפות להגעה המהירה ביותר. תוספת תשלום קבועה.</p>
                  </div>
                  <span className="font-semibold text-primary mr-2">+5.00₪</span>
                </Label>
                <Label htmlFor="smart-saver-delivery" className="flex items-center p-4 border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                  <RadioGroupItem value="smartSaver" id="smart-saver-delivery" className="ml-3" aria-label="משלוח חסכוני חכם"/>
                  <div className="flex-grow">
                    <div className="font-semibold flex items-center">
                       <DollarSign className="h-5 w-5 ml-2 text-green-600" /> משלוח חסכוני חכם
                    </div>
                    <p className="text-sm text-muted-foreground">המתן קצת יותר (עד 30 דקות נוספות) וקבל הנחה. מצוין להזמנות לא דחופות.</p>
                  </div>
                  <span className="font-semibold text-green-600 mr-2">-3.00₪</span>
                </Label>
              </RadioGroup>
              <p className="mt-4 text-sm text-muted-foreground p-3 bg-muted/30 rounded-md flex items-start">
                <ShieldQuestion className="h-5 w-5 ml-2 mt-0.5 text-primary flex-shrink-0" /> 
                <span>ב'זירת המשלוחים החכמה', שליחים באזור מתחרים על הזמנתך. מערכת ה-AI שלנו בוחרת את ההצעה האופטימלית עבורך. אם אתה ממהר, בחר 'משלוח מהיר ביותר'! לחלופין, חסוך עם 'משלוח חסכוני חכם' אם הזמן גמיש.</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-headline text-primary flex items-center">
                <Edit className="h-5 w-5 ml-2" /> הערות להזמנה (אופציונלי)
              </CardTitle>
              <CardDescription>הוסף הוראות מיוחדות למסעדה או לשליח.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="לדוגמה: נא לארוז כל פריט בנפרד, בלי בצל בסלט, נא להתקשר בהגעה..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="min-h-[100px]"
                aria-label="הערות להזמנה"
              />
            </CardContent>
          </Card>


          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-headline text-primary flex items-center">
                <Clock className="h-5 w-5 ml-2" /> תכנן משלוח (אופציונלי)
              </CardTitle>
              <CardDescription>קבע תאריך ושעה עתידיים למשלוח שלך.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!scheduledDeliveryTime ? (
                <>
                  <Label htmlFor="scheduledTimeInput">הזן תאריך ושעה (למשל, "מחר 18:00", "25.12 13:30")</Label>
                  <Input
                    id="scheduledTimeInput"
                    type="text"
                    placeholder="הזן זמן מבוקש..."
                    value={manualScheduledTime}
                    onChange={(e) => setManualScheduledTime(e.target.value)}
                    className="w-full"
                    aria-label="הזן זמן מבוקש למשלוח מתוכנן"
                  />
                  <Button onClick={handleSetManualScheduledTime} disabled={!manualScheduledTime.trim()} className="w-full sm:w-auto" aria-label="קבע זמן למשלוח מתוכנן">
                    קבע זמן
                  </Button>
                </>
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="font-semibold text-green-700">המשלוח שלך מתוכנן ל: {scheduledDeliveryTime}</p>
                  <Button onClick={handleClearScheduledTime} variant="link" className="p-0 h-auto text-sm text-destructive" aria-label="נקה זמן מתוכנן למשלוח">
                    נקה זמן מתוכנן
                  </Button>
                </div>
              )}
               <p className="text-xs text-muted-foreground">שימו לב: זמינות המשלוח המתוכנן תלויה בשעות הפעילות של המסעדה והשליחים.</p>
                 <Button onClick={handleDynamicLocationClick} variant="outline" className="w-full mt-2" aria-label="משלוח למיקום דינמי (בטא)">
                    <Navigation className="h-4 w-4 ml-2 text-blue-500" /> משלוח למיקום דינמי (בטא - בקרוב)
                 </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-xl font-headline text-primary">אפשרויות נוספות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 p-3 border rounded-md rtl:space-x-reverse">
                    <Checkbox id="isGift" checked={isGift} onCheckedChange={handleGiftToggle} aria-labelledby="giftLabel" />
                    <Label htmlFor="isGift" id="giftLabel" className="flex items-center cursor-pointer">
                        <Gift className="h-5 w-5 ml-2 text-pink-500" /> זו מתנה? (פתק אישי בקרוב)
                    </Label>
                </div>
                <Button onClick={handleGroupOrderClick} variant="outline" className="w-full" aria-label="התחל הזמנה קבוצתית (בקרוב)">
                    <Users className="h-4 w-4 ml-2 text-purple-500" /> התחל הזמנה קבוצתית (בקרוב)
                 </Button>
            </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-xl sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-primary">סיכום הזמנה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">סה"כ ביניים ({itemCount} פריטים)</span>
                <span className="font-medium">{totalPrice.toFixed(2)}₪</span>
              </div>
               <div className="flex justify-between">
                <span className="text-muted-foreground">זמן הכנה משוער</span>
                <span className="font-medium">~{estimatedPreparationTime} דק'</span>
              </div>
              {scheduledDeliveryTime && (
                <div className="flex justify-between text-sm text-blue-600">
                    <span className="font-medium flex items-center"><Clock className="h-4 w-4 ml-1"/>מתוכנן ל:</span>
                    <span className="font-medium">{scheduledDeliveryTime}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">דמי משלוח</span>
                <span className={`font-medium ${deliveryFee > 0 ? 'text-primary' : 'text-green-600'}`}>
                  {deliveryFee > 0 ? `${deliveryFee.toFixed(2)}₪` : 'חינם'}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center">
                    <Sparkles className="h-4 w-4 ml-1 text-green-500" /> 
                    הנחות
                  </span>
                  <span className="font-medium text-green-600">-{discountAmount.toFixed(2)}₪</span>
                </div>
              )}
              {smartCouponApplied && deliveryPreference !== 'smartSaver' && ( 
                <Badge variant="secondary" className="w-full justify-center bg-green-100 text-green-700 border-green-300 py-1">
                   <Sparkles className="h-4 w-4 ml-1"/> קופון חכם הופעל! 5% הנחה להזמנות מעל 70₪.
                </Badge>
              )}
               {deliveryPreference === 'smartSaver' && (
                 <Badge variant="secondary" className="w-full justify-center bg-blue-100 text-blue-700 border-blue-300 py-1">
                   <DollarSign className="h-4 w-4 ml-1"/> הנחת משלוח חסכוני חכם הופעלה!
                </Badge>
               )}
                {isGift && (
                    <Badge variant="secondary" className="w-full justify-center bg-pink-100 text-pink-700 border-pink-300 py-1">
                        <Gift className="h-4 w-4 ml-1"/> ההזמנה תסומן כמתנה!
                    </Badge>
                )}
                {customerNotes && (
                     <Badge variant="outline" className="w-full justify-start text-left py-1.5 mt-1">
                        <Edit className="h-3 w-3 mr-1 text-muted-foreground"/> <strong className="ml-1">הערות:</strong> <span className="truncate text-xs">{customerNotes}</span>
                    </Badge>
                )}
              <Separator />
              <div className="flex justify-between text-xl font-bold text-primary">
                <span>סה"כ</span>
                <span>{finalPriceWithDelivery.toFixed(2)}₪</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button size="lg" asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg">
                <Link href={{ pathname: "/checkout", query: { notes: customerNotes } }} aria-label="המשך לתשלום">
                  <span className="flex items-center justify-center w-full">
                    <ArrowLeft className="mr-2 h-5 w-5" /> 
                    המשך לתשלום 
                  </span>
                </Link>
              </Button>
              <Button variant="outline" onClick={clearCart} className="w-full" aria-label="נקה סל">
                נקה סל
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

