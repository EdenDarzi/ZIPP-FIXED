
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Gamepad2, Gift, Loader2, Play, TicketPercent, CakeSlice, Truck, Share2, Sparkles, AlertTriangle, CalendarClock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SpinWheelPrize {
  id: string;
  name: string;
  description?: string;
  icon: React.ElementType;
  isWin: boolean;
  redeemable?: boolean;
  colorClass: string; 
  textColorClass?: string; 
}

const mockPrizes: SpinWheelPrize[] = [
  { id: 'discount10', name: '10% הנחה', description: 'על ההזמנה הבאה שלך (מעל 50₪) מאותו עסק', icon: TicketPercent, isWin: true, redeemable: true, colorClass: 'bg-green-500', textColorClass: 'text-green-100' },
  { id: 'freeDessert', name: 'קינוח מתנה', description: 'ממסעדות משתתפות בהזמנה הבאה מאותו עסק', icon: CakeSlice, isWin: true, redeemable: true, colorClass: 'bg-pink-500', textColorClass: 'text-pink-100' },
  { id: 'freeDelivery', name: 'משלוח חינם', description: 'עד עלות של 15₪ להזמנה הבאה מאותו עסק', icon: Truck, isWin: true, redeemable: true, colorClass: 'bg-blue-500', textColorClass: 'text-blue-100' },
  { id: 'tryAgain', name: 'לא נורא, נסה שוב בהזמנה הבאה מאותו עסק!', icon: AlertTriangle, isWin: false, colorClass: 'bg-gray-400', textColorClass: 'text-gray-100' },
  { id: 'dailySurprise', name: 'הפתעה יומית סודית!', description: 'קוד קופון יישלח אליך בקרוב!', icon: Gift, isWin: true, redeemable: true, colorClass: 'bg-purple-500', textColorClass: 'text-purple-100' },
  { id: 'discount5', name: '5% הנחה', description: 'על ההזמנה הבאה שלך מאותו עסק', icon: TicketPercent, isWin: true, redeemable: true, colorClass: 'bg-teal-500', textColorClass: 'text-teal-100' },
];

const WHEEL_SEGMENTS = 8; 
const SPIN_DURATION_MS = 2800; 
const DAILY_SPIN_COOLDOWN_HOURS = 24; 

export default function SpinWheelPage() {
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinWheelPrize | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [nextSpinTime, setNextSpinTime] = useState<Date | null>(null);
  const [timeLeftForNextSpin, setTimeLeftForNextSpin] = useState('');
  const [rotationDegree, setRotationDegree] = useState(0);


  useEffect(() => {
    const lastSpinTimestamp = localStorage.getItem('lastLivePickSpin');
    if (lastSpinTimestamp) {
      const lastSpinDate = new Date(parseInt(lastSpinTimestamp, 10));
      const cooldownPeriod = DAILY_SPIN_COOLDOWN_HOURS * 60 * 60 * 1000;
      const timeSinceLastSpin = new Date().getTime() - lastSpinDate.getTime();

      if (timeSinceLastSpin < cooldownPeriod) {
        setCanSpin(false);
        setNextSpinTime(new Date(lastSpinDate.getTime() + cooldownPeriod));
      }
    }
  }, []);

  useEffect(() => {
    if (!canSpin && nextSpinTime) {
      const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const diff = nextSpinTime.getTime() - now;

        if (diff <= 0) {
          setCanSpin(true);
          setTimeLeftForNextSpin('');
          setNextSpinTime(null);
          localStorage.removeItem('lastLivePickSpin'); 
          return;
        }
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeftForNextSpin(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      };
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    }
  }, [canSpin, nextSpinTime]);

  const handleSpin = () => {
    if (!canSpin || isSpinning) {
      toast({ title: "ניסיון יומי נוצל", description: `תוכל לסובב שוב בעוד ${timeLeftForNextSpin || 'זמן מה'}.`, variant: "default" });
      return;
    }
    setIsSpinning(true);
    setSpinResult(null);

    const randomSpins = Math.floor(Math.random() * 3) + 5; // 5-8 full spins
    const randomStopSegment = Math.floor(Math.random() * WHEEL_SEGMENTS);
    const segmentAngle = 360 / WHEEL_SEGMENTS;
    const offsetForPointer = segmentAngle / 2; 
    const finalRotation = (randomSpins * 360) + (randomStopSegment * segmentAngle) + offsetForPointer;
    
    setRotationDegree(prev => prev + finalRotation);


    setTimeout(() => {
      const prizeIndex = randomStopSegment % mockPrizes.length; 
      const result = mockPrizes[prizeIndex];
      setSpinResult(result);
      setIsSpinning(false);
      setCanSpin(false); 
      const now = new Date();
      localStorage.setItem('lastLivePickSpin', now.getTime().toString());
      setNextSpinTime(new Date(now.getTime() + DAILY_SPIN_COOLDOWN_HOURS * 60 * 60 * 1000));

      if (result.isWin) {
        toast({
          title: `🎉 זכית ב: ${result.name}! 🎉`,
          description: result.description || 'ההטבה נוספה לחשבונך (דמו).',
          duration: 7000,
          className: cn(result.colorClass, result.textColorClass || 'text-white', 'border-2', result.textColorClass ? result.textColorClass.replace('text-','border-') : 'border-white/50' ),
        });
      } else {
         toast({
          title: result.name,
          variant: "default",
          duration: 5000,
        });
      }
    }, SPIN_DURATION_MS);
  };

  const handleRedeem = () => {
    toast({
      title: "הטבה מומשה (דמו)",
      description: `ההטבה "${spinResult?.name}" הופעלה עבורך. תראה אותה בעגלה/בתשלום בהזמנה הבאה מאותו עסק.`,
    });
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
      <Card className="shadow-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 overflow-hidden border-2 border-primary/30 rounded-xl">
        <CardHeader className="items-center pt-6 pb-4 bg-card/50">
          <h1 className="text-3xl sm:text-4xl font-headline text-primary px-2">
            מרגיש/ה בר מזל? 🍀 סובב את הגלגל – ותגלה מה מחכה לך היום!
          </h1>
        </CardHeader>
        <CardContent className="space-y-8 flex flex-col items-center px-4 sm:px-6 py-8">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-8 border-primary/30 shadow-2xl overflow-hidden bg-card my-6">
            <div 
                className="absolute top-[-14px] left-1/2 -translate-x-1/2 w-0 h-0 z-20"
                style={{
                    borderLeft: '18px solid transparent',
                    borderRight: '18px solid transparent',
                    borderBottom: '30px solid hsl(var(--destructive))', 
                    filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))'
                }}
                title="מחט"
            />
            <div 
                className={cn(
                    "absolute inset-0 rounded-full transition-transform ease-out",
                    isSpinning && `duration-[${SPIN_DURATION_MS}ms]` 
                  )}
                style={{ transform: `rotate(${rotationDegree}deg)`}}
            >
              {segments.map((segment, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-start pl-3 sm:pl-5", 
                    segment.colorClass
                  )}
                  style={{
                    transform: `rotate(${segment.rotation}deg) skewY(${90 - segment.angle}deg)`,
                  }}
                >
                  <div
                    style={{ transform: `skewY(-${90 - segment.angle}deg) rotate(-${segment.angle / 2}deg) translateX(5%) translateY(-50%)` }} 
                    className="transform-origin-center text-center"
                  >
                    <segment.icon className={cn("h-5 w-5 sm:h-7 sm:w-7 inline-block drop-shadow-md", segment.textColorClass || 'text-white')} />
                  </div>
                </div>
              ))}
            </div>
             <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card border-4 border-primary/70 shadow-lg flex items-center justify-center">
                     <Gamepad2 className={cn("h-8 w-8 sm:h-10 sm:w-10 text-primary/80", isSpinning && "opacity-50")} />
                </div>
            </div>
          </div>
          
           {isSpinning && (
            <div className="text-primary font-semibold text-lg flex items-center py-3">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> מסתובב... בהצלחה!
            </div>
           )}

          {!isSpinning && spinResult && (
            <Card className={cn(
                "p-4 sm:p-6 shadow-lg animate-fadeInUp w-full max-w-md mt-6 border-2 rounded-lg", 
                spinResult.isWin ? `${spinResult.colorClass.replace('bg-','border-')}/70` : 'border-muted',
                spinResult.colorClass
            )}>
              <CardHeader className={cn("p-0 pb-2 sm:pb-3 items-center", spinResult.textColorClass || (spinResult.isWin ? 'text-white' : 'text-foreground'))}>
                {spinResult.isWin ? <Sparkles className="h-12 w-12 text-yellow-400 mb-2 animate-ping-once" /> : <AlertTriangle className="h-12 w-12 text-muted-foreground mb-2"/>}
                <CardTitle className={cn("text-xl sm:text-2xl font-semibold", spinResult.textColorClass || (spinResult.isWin ? 'text-white' : 'text-foreground'))}>
                  {spinResult.name}
                </CardTitle>
                {spinResult.description && <CardDescription className={cn("text-sm mt-1 px-2", spinResult.textColorClass ? `${spinResult.textColorClass} opacity-80` : (spinResult.isWin ? 'text-white/90' : 'text-muted-foreground'))}>{spinResult.description}</CardDescription>}
              </CardHeader>
              {spinResult.redeemable && (
                <CardFooter className="p-0 pt-3 sm:pt-4">
                  <Button onClick={handleRedeem} className={cn("w-full text-md sm:text-lg py-2.5", spinResult.isWin ? 'bg-white/20 hover:bg-white/30 text-white border-white/50' : 'bg-accent hover:bg-accent/90 text-accent-foreground' )}>
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
            className={cn(
                "w-full max-w-xs text-xl py-3 sm:py-4 shadow-lg rounded-full text-white transition-all duration-300 ease-in-out focus:ring-4 focus:ring-offset-2",
                isSpinning || !canSpin ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-400 hover:shadow-xl transform hover:scale-105",
                "font-headline group" 
            )}
            aria-label={canSpin ? "סובב עכשיו" : "תוכל לסובב שוב מאוחר יותר"}
          >
            {isSpinning ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : canSpin ? (
              <> <Play className="mr-2 h-7 w-7 group-hover:animate-pulse" /> סובב עכשיו </>
            ) : (
              <> <CalendarClock className="mr-2 h-7 w-7" /> חזור מאוחר יותר </>
            )}
          </Button>

          {!isSpinning && !canSpin && (
            <div className="mt-3 space-y-1 p-3 bg-card/80 rounded-md shadow">
                {timeLeftForNextSpin ? (
                    <p className="text-sm text-muted-foreground flex flex-col items-center">
                    <CalendarClock className="h-5 w-5 mb-1 text-primary"/>
                    אפשר סיבוב אחד ביום. נסה שוב בעוד: <strong className="text-primary block text-lg font-mono">{timeLeftForNextSpin}</strong>
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground">תוכל לסובב שוב בקרוב!</p>
                )}
                <Button variant="outline" size="sm" onClick={handleShareForTry} className="text-xs">
                    <Share2 className="mr-1.5 h-3.5 w-3.5"/> שתף עם חבר לניסיון נוסף (בקרוב)
                </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-6 border-t bg-card/50 justify-center pb-4">
          <p className="text-xs text-muted-foreground">
            <Info className="inline h-3 w-3 mr-1"/>
            אפשר סיבוב אחד ביום – כל פרס אמיתי. <Link href="/terms" className="hover:text-primary underline">תקנון הגלגל והמבצעים</Link>. בהצלחה!
          </p>
        </CardFooter>
      </Card>
       <p className="text-xs text-muted-foreground px-4">
        אפקט הסיבוב הוא להדגמה. משחק מלא עם אנימציות מתקדמות, סאונד, ניהול פרסים אמיתי בצד השרת ומגבלות שימוש מתקדמות יפותח בהמשך.
      </p>
       <style jsx global>{`
        @keyframes ping-once {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.7; }
        }
        .animate-ping-once {
          animation: ping-once 1s cubic-bezier(0, 0, 0.2, 1);
        }
        .transform-origin-center {
            transform-origin: center;
        }
      `}</style>
    </div>
  );
}
