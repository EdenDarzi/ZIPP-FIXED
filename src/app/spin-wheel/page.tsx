
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
}

const mockPrizes: SpinWheelPrize[] = [
  { id: 'discount10', name: '10% הנחה', description: 'על ההזמנה הבאה שלך (מעל 50₪)', icon: TicketPercent, isWin: true, redeemable: true, colorClass: 'bg-green-500' },
  { id: 'freeDessert', name: 'קינוח מתנה', description: 'ממסעדות משתתפות', icon: CakeSlice, isWin: true, redeemable: true, colorClass: 'bg-pink-500' },
  { id: 'freeDelivery', name: 'משלוח חינם', description: 'עד עלות של 15₪', icon: Truck, isWin: true, redeemable: true, colorClass: 'bg-blue-500' },
  { id: 'tryAgain', name: 'לא נורא, נסה שוב מחר!', icon: AlertTriangle, isWin: false, colorClass: 'bg-gray-400' },
  { id: 'dailySurprise', name: 'הפתעה יומית סודית!', description: 'בדוק את ההודעות שלך!', icon: Gift, isWin: true, redeemable: true, colorClass: 'bg-purple-500' },
  { id: 'discount5', name: '5% הנחה', description: 'על ההזמנה הבאה שלך', icon: TicketPercent, isWin: true, redeemable: true, colorClass: 'bg-teal-500' },
];

const WHEEL_SEGMENTS = 8; // Number of segments on the wheel visually

export default function SpinWheelPage() {
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinWheelPrize | null>(null);
  const [canSpin, setCanSpin] = useState(true); // Mock daily limit
  const [timeLeftForNextSpin, setTimeLeftForNextSpin] = useState('');

  useEffect(() => {
    if (!canSpin) {
      const calculateTimeLeft = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const diff = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeftForNextSpin(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      };
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 60000); // Update every minute
      return () => clearInterval(timer);
    }
  }, [canSpin]);

  const handleSpin = () => {
    if (!canSpin) {
      toast({ title: "ניסיון יומי נוצל", description: "תוכל לסובב שוב מחר!", variant: "default" });
      return;
    }
    setIsSpinning(true);
    setSpinResult(null);

    // Simulate API call and wheel animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockPrizes.length);
      const result = mockPrizes[randomIndex];
      setSpinResult(result);
      setIsSpinning(false);
      setCanSpin(false); // Simulate daily limit

      if (result.isWin) {
        toast({
          title: `🎉 זכית ב: ${result.name}! 🎉`,
          description: result.description || 'ההטבה נוספה לחשבונך (דמו).',
          duration: 5000,
        });
      } else {
         toast({
          title: result.name,
          variant: "default",
          duration: 5000,
        });
      }
    }, 2500); // Simulate 2.5 seconds spin
  };

  const handleRedeem = () => {
    toast({
      title: "הטבה מומשה (דמו)",
      description: `ההטבה "${spinResult?.name}" הופעלה עבורך. תראה אותה בעגלה/בתשלום.`,
    });
  };
  
  const handleShareForTry = () => {
    toast({
        title: "שיתוף (בקרוב!)",
        description: "שתף עם חבר ותקבל ניסיון נוסף לסובב את הגלגל! (פונקציונליות בפיתוח)",
    });
  }

  // Create visual segments for the wheel
  const segments = Array.from({ length: WHEEL_SEGMENTS }).map((_, index) => {
    const prize = mockPrizes[index % mockPrizes.length]; // Cycle through prizes for visual
    return {
      ...prize,
      rotation: (360 / WHEEL_SEGMENTS) * index,
    };
  });

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8 text-center">
      <Card className="shadow-xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 overflow-hidden">
        <CardHeader className="items-center">
          <Gamepad2 className="h-16 w-16 text-primary mb-3" />
          <CardTitle className="text-4xl font-headline text-primary">מרגיש/ה בר מזל? 🍀</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            סובב/י את גלגל ההפתעות של LivePick וזכה/י בפרסים שווים! ניסיון אחד ביום.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 flex flex-col items-center">
          {/* Static Wheel Representation */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-8 border-primary/30 shadow-2xl overflow-hidden bg-card flex items-center justify-center">
             {segments.map((segment, index) => (
                <div
                  key={index}
                  className="absolute w-1/2 h-1/2 origin-bottom-right"
                  style={{
                    transform: `rotate(${segment.rotation}deg) skewY(${(360 / WHEEL_SEGMENTS) - 90}deg)`,
                    background: index % 2 === 0 ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--accent) / 0.2)',
                  }}
                >
                  <div
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{ transform: `skewY(-${(360 / WHEEL_SEGMENTS) - 90}deg) rotate(-${(360 / WHEEL_SEGMENTS) / 2}deg)` }}
                  >
                    <segment.icon className={cn("h-6 w-6 sm:h-8 sm:h-8", segment.colorClass.replace('bg-', 'text-'))} />
                  </div>
                </div>
             ))}
            <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card border-4 border-primary shadow-md flex items-center justify-center z-10">
                 <Play className={cn("h-8 w-8 sm:h-10 sm:w-10 text-primary", isSpinning && "animate-ping")} />
            </div>
             <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[25px] border-b-destructive z-20" title="מצביע"></div>

          </div>
           {isSpinning && (
            <div className="text-primary font-semibold text-lg flex items-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> מסובב... בהצלחה!
            </div>
           )}

          {!isSpinning && spinResult && (
            <Card className={cn("p-6 shadow-lg animate-fadeIn w-full max-w-md", spinResult.isWin ? spinResult.colorClass.replace('bg-','border-') + ' border-2' : 'border-muted')}>
              <CardHeader className="p-0 pb-3 items-center">
                {spinResult.isWin ? <Sparkles className="h-10 w-10 text-yellow-400 mb-2" /> : <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2"/>}
                <CardTitle className={cn("text-2xl", spinResult.isWin ? spinResult.colorClass.replace('bg-','text-') : 'text-foreground')}>
                  {spinResult.name}
                </CardTitle>
                {spinResult.description && <CardDescription className="text-sm">{spinResult.description}</CardDescription>}
              </CardHeader>
              {spinResult.redeemable && (
                <CardFooter className="p-0 pt-4">
                  <Button onClick={handleRedeem} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
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
            className="w-full max-w-xs text-xl py-7 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-60"
            aria-label={canSpin ? "סובב את הגלגל עכשיו" : "תוכל לסובב שוב מאוחר יותר"}
          >
            {isSpinning ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : canSpin ? (
              <> <Play className="mr-2 h-6 w-6" /> סובב עכשיו! </>
            ) : (
              <> <CalendarClock className="mr-2 h-6 w-6" /> חזור מחר </>
            )}
          </Button>

          {!canSpin && timeLeftForNextSpin && (
            <p className="text-sm text-muted-foreground">
              תוכל לנסות שוב בעוד: <strong>{timeLeftForNextSpin}</strong>
            </p>
          )}

          {!canSpin && (
            <Button variant="outline" size="sm" onClick={handleShareForTry}>
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
       <p className="text-xs text-muted-foreground">
        <Info className="inline h-3 w-3 mr-1"/>
        אנימציית סיבוב הגלגל, סאונד, ניהול פרסים אמיתי ומגבלות מתקדמות יתווספו בפיתוח מלא.
      </p>
    </div>
  );
}

