
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Gamepad2, Gift, Loader2, Play, TicketPercent, CakeSlice, Truck, Share2, Sparkles, AlertTriangle, CalendarClock, Info } from 'lucide-react'; // Using CakeSlice for dessert
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SpinWheelPrize {
  id: string;
  name: string;
  description?: string;
  icon: React.ElementType;
  isWin: boolean;
  redeemable?: boolean;
  colorClass: string; // For wheel segment and prize display
  textColorClass?: string; // For icon color on segment
}

const mockPrizes: SpinWheelPrize[] = [
  { id: 'discount10', name: '10% הנחה', description: 'על ההזמנה הבאה שלך (מעל 50₪) מאותו עסק', icon: TicketPercent, isWin: true, redeemable: true, colorClass: 'bg-green-500', textColorClass: 'text-green-100' },
  { id: 'freeDessert', name: 'קינוח מתנה', description: 'ממסעדות משתתפות בהזמנה הבאה מאותו עסק', icon: CakeSlice, isWin: true, redeemable: true, colorClass: 'bg-pink-500', textColorClass: 'text-pink-100' },
  { id: 'freeDelivery', name: 'משלוח חינם', description: 'עד עלות של 15₪ להזמנה הבאה מאותו עסק', icon: Truck, isWin: true, redeemable: true, colorClass: 'bg-blue-500', textColorClass: 'text-blue-100' },
  { id: 'tryAgain', name: 'לא נורא, נסה שוב בהזמנה הבאה מאותו עסק!', icon: AlertTriangle, isWin: false, colorClass: 'bg-gray-400', textColorClass: 'text-gray-100' },
  { id: 'dailySurprise', name: 'הפתעה יומית סודית!', description: 'קוד קופון יישלח אליך בקרוב!', icon: Gift, isWin: true, redeemable: true, colorClass: 'bg-purple-500', textColorClass: 'text-purple-100' },
  { id: 'discount5', name: '5% הנחה', description: 'על ההזמנה הבאה שלך מאותו עסק', icon: TicketPercent, isWin: true, redeemable: true, colorClass: 'bg-teal-500', textColorClass: 'text-teal-100' },
];

const WHEEL_SEGMENTS = 8; // Number of segments on the wheel visually

export default function SpinWheelPage() {
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinWheelPrize | null>(null);
  const [canSpin, setCanSpin] = useState(true); 
  const [timeLeftForNextSpin, setTimeLeftForNextSpin] = useState('');

  // Simulate checking if user can spin (e.g., once per order from the same business, or daily)
  useEffect(() => {
    // This is a mock. In a real app, you'd check this against user's spin history for this order/business.
    const lastSpinTime = localStorage.getItem('lastLivePickSpin');
    if (lastSpinTime) {
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if (new Date().getTime() - new Date(lastSpinTime).getTime() < twentyFourHours) {
            // setCanSpin(false); // For demo, allow spinning each visit
        }
    }
  }, []);


  useEffect(() => {
    if (!canSpin) {
      const calculateTimeLeft = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0); // Assuming reset at midnight
        const diff = tomorrow.getTime() - now.getTime();
        if (diff <= 0) {
            setCanSpin(true);
            setTimeLeftForNextSpin('');
            return;
        }
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeftForNextSpin(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      };
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 60000);
      return () => clearInterval(timer);
    }
  }, [canSpin]);

  const handleSpin = () => {
    if (!canSpin && !isSpinning) { // Check isSpinning to prevent re-trigger if already processing
      toast({ title: "ניסיון יומי נוצל", description: "תוכל לסובב שוב מחר (או בהזמנה הבאה)!", variant: "default" });
      return;
    }
    setIsSpinning(true);
    setSpinResult(null);

    // Simulate API call and wheel animation
    // In a real app, the server would determine the prize based on weighted odds.
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockPrizes.length);
      const result = mockPrizes[randomIndex];
      setSpinResult(result);
      setIsSpinning(false);
      // setCanSpin(false); // Mark as spun for this session/order
      localStorage.setItem('lastLivePickSpin', new Date().toISOString());


      if (result.isWin) {
        toast({
          title: `🎉 זכית ב: ${result.name}! 🎉`,
          description: result.description || 'ההטבה נוספה לחשבונך (דמו).',
          duration: 7000,
        });
      } else {
         toast({
          title: result.name,
          variant: "default",
          duration: 5000,
        });
      }
    }, 2800); // Simulate spin duration
  };

  const handleRedeem = () => {
    toast({
      title: "הטבה מומשה (דמו)",
      description: `ההטבה "${spinResult?.name}" הופעלה עבורך. תראה אותה בעגלה/בתשלום בהזמנה הבאה מאותו עסק.`,
    });
    // Potentially disable redeem button or mark prize as redeemed in user's profile (backend needed)
  };
  
  const handleShareForTry = () => {
    toast({
        title: "שיתוף (בקרוב!)",
        description: "שתף עם חבר ותקבל ניסיון נוסף לסובב את הגלגל! (פונקציונליות בפיתוח)",
    });
  }

  const segments = Array.from({ length: WHEEL_SEGMENTS }).map((_, index) => {
    const prize = mockPrizes[index % mockPrizes.length];
    return {
      ...prize,
      angle: (360 / WHEEL_SEGMENTS),
      rotation: (360 / WHEEL_SEGMENTS) * index,
    };
  });

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8 text-center">
      <Card className="shadow-xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 overflow-hidden">
        <CardHeader className="items-center pt-6 pb-4">
          <Gamepad2 className="h-16 w-16 text-primary mb-2" />
          <CardTitle className="text-3xl sm:text-4xl font-headline text-primary">מרגיש/ה בר מזל? 🍀 סובב/י את הגלגל!</CardTitle>
          <CardDescription className="text-md sm:text-lg text-muted-foreground px-2">
            סובב/י את גלגל ההפתעות של LivePick בכל הזמנה מאותו עסק וזכה/י בפרסים שווים להזמנה הבאה: הנחות, משלוחים חינם, קינוחים ועוד! ניסיון אחד לכל הזמנה.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 flex flex-col items-center px-4 sm:px-6">
          {/* Wheel Visual Representation */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-8 border-primary/50 shadow-2xl overflow-hidden bg-card">
            {/* Pointer */}
            <div 
                className="absolute top-[-12px] left-1/2 -translate-x-1/2 w-0 h-0 z-20"
                style={{
                    borderLeft: '15px solid transparent',
                    borderRight: '15px solid transparent',
                    borderBottom: '25px solid hsl(var(--destructive))',
                }}
                title="מצביע"
            />
            {/* Segments Container */}
            <div className={cn("absolute inset-0 rounded-full transition-transform duration-[2500ms] ease-out", isSpinning && "animate-spin-slow-then-stop")}>
              {segments.map((segment, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-start pl-4 sm:pl-6",
                    segment.colorClass
                  )}
                  style={{
                    transform: `rotate(${segment.rotation}deg) skewY(${90 - segment.angle}deg)`,
                  }}
                >
                  <div
                    style={{ transform: `skewY(-${90 - segment.angle}deg) rotate(-${segment.angle / 2}deg) translateX(10%) translateY(-50%)` }}
                    className="transform-origin-center text-center"
                  >
                    <segment.icon className={cn("h-6 w-6 sm:h-8 sm:h-8 inline-block", segment.textColorClass || 'text-white')} />
                  </div>
                </div>
              ))}
            </div>
             {/* Center Button Overlay - Can be used if "Spin" is part of the wheel visual */}
             <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card border-4 border-primary shadow-md flex items-center justify-center">
                     <Play className={cn("h-8 w-8 sm:h-10 sm:w-10 text-primary", isSpinning && "opacity-50")} />
                </div>
            </div>
          </div>
          
           {isSpinning && (
            <div className="text-primary font-semibold text-lg flex items-center py-3">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> מסובב... בהצלחה!
            </div>
           )}

          {!isSpinning && spinResult && (
            <Card className={cn("p-4 sm:p-6 shadow-lg animate-fadeIn w-full max-w-md mt-6", spinResult.isWin ? spinResult.colorClass.replace('bg-','border-') + ' border-4' : 'border-muted border-2')}>
              <CardHeader className="p-0 pb-2 sm:pb-3 items-center">
                {spinResult.isWin ? <Sparkles className="h-12 w-12 text-yellow-400 mb-2" /> : <AlertTriangle className="h-12 w-12 text-muted-foreground mb-2"/>}
                <CardTitle className={cn("text-xl sm:text-2xl", spinResult.isWin ? spinResult.colorClass.replace('bg-','text-') : 'text-foreground')}>
                  {spinResult.name}
                </CardTitle>
                {spinResult.description && <CardDescription className="text-sm mt-1">{spinResult.description}</CardDescription>}
              </CardHeader>
              {spinResult.redeemable && (
                <CardFooter className="p-0 pt-3 sm:pt-4">
                  <Button onClick={handleRedeem} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-md sm:text-lg">
                    נצל את ההטבה (דמו)
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}

          <Button
            onClick={handleSpin}
            disabled={isSpinning || !canSpin}
            size="lg"
            className="w-full max-w-xs text-xl py-6 sm:py-7 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-60 mt-6"
            aria-label={canSpin ? "סובב את הגלגל עכשיו" : "תוכל לסובב שוב מאוחר יותר"}
          >
            {isSpinning ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : canSpin ? (
              <> <Play className="mr-2 h-6 w-6" /> סובב עכשיו! </>
            ) : (
              <> <CalendarClock className="mr-2 h-6 w-6" /> חזור מאוחר יותר </>
            )}
          </Button>

          {!canSpin && timeLeftForNextSpin && (
            <p className="text-sm text-muted-foreground">
              תוכל לנסות שוב בעוד: <strong>{timeLeftForNextSpin}</strong>
            </p>
          )}

          {!canSpin && (
            <Button variant="outline" size="sm" onClick={handleShareForTry} className="mt-2">
                <Share2 className="mr-2 h-4 w-4"/> שתף עם חבר לניסיון נוסף (בקרוב)
            </Button>
          )}
        </CardContent>
        <CardFooter className="pt-6 border-t justify-center">
          <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary underline">
            תקנון הגלגל והמבצעים
          </Link>
        </CardFooter>
      </Card>
       <p className="text-xs text-muted-foreground px-4">
        <Info className="inline h-3 w-3 mr-1"/>
        זוהי הדגמה של גלגל ההפתעות. אנימציית סיבוב אמיתית, סאונד אפקטים, ניהול פרסים מבוסס שרת ומגבלות שימוש מתקדמות יתווספו בפיתוח מלא.
      </p>
       <style jsx global>{`
        @keyframes spin-slow-then-stop {
          0% { transform: rotate(0deg); }
          70% { transform: rotate(1080deg); } /* 3 full spins quickly */
          100% { transform: rotate(1080deg); } /* Holds the final position after stopping 'randomly' */
          /* In a real scenario, the final rotation degree would be calculated based on the prize */
        }
        .animate-spin-slow-then-stop {
          animation: spin-slow-then-stop 2.5s ease-out forwards;
        }
        .transform-origin-center {
            transform-origin: center;
        }
      `}</style>
    </div>
  );
}

