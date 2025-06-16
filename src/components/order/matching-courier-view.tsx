
'use client';

import type { Order } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, HelpCircle, Search, MapPin, Star, ClockIcon } from 'lucide-react'; 
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MatchingCourierViewProps {
  order: Order;
}

interface MockCourierDot {
  id: string;
  top: string;
  left: string;
  delay: string;
  colorClass: string;
}

const dotColors = ['bg-green-500', 'bg-blue-400', 'bg-yellow-400'];

export function MatchingCourierView({ order }: MatchingCourierViewProps) {
  const [identifiedCouriersCount, setIdentifiedCouriersCount] = useState(0);
  const [leadingMatch, setLeadingMatch] = useState<{ eta: number; rating: number } | null>(null);
  const [mockDots, setMockDots] = useState<MockCourierDot[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setIdentifiedCouriersCount(prev => prev + (Math.random() > 0.4 ? 1 : 0));
      if (Math.random() > 0.35) {
        setLeadingMatch({
          eta: 8 + Math.floor(Math.random() * 12),
          rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)),
        });
      }

      if (mockDots.length < 6 && Math.random() > 0.2) { 
        setMockDots(prevDots => [
          ...prevDots,
          {
            id: `dot-${Date.now()}-${Math.random()}`,
            top: `${Math.random() * 70 + 15}%`, 
            left: `${Math.random() * 70 + 15}%`,
            delay: `${Math.random() * 1.5}s`,
            colorClass: dotColors[Math.floor(Math.random() * dotColors.length)],
          }
        ]);
      } else if (mockDots.length >= 3 && Math.random() > 0.7) { 
        setMockDots(prevDots => prevDots.slice(1));
      }

    }, 1800); 
    return () => clearInterval(interval);
  }, [mockDots.length]); 

  const handleUpgrade = () => {
    toast({
      title: "בקשת שדרוג למשלוח מהיר נשלחה (הדמיה)",
      description: "אנו ניתן עדיפות למציאת שליח מהיר יותר עבורך. תוספת תשלום עשויה לחול.",
    });
  };

  return (
    <Card className="shadow-xl animate-fadeIn">
      <CardHeader className="text-center">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-4 radar-pulse-container">
          <div className="radar-pulse-base">
            <Search className="h-12 w-12 sm:h-14 sm:w-14 text-primary radar-center-icon" />
          </div>
          <div className="radar-ring radar-ring-1"></div>
          <div className="radar-ring radar-ring-2"></div>
          <div className="radar-ring radar-ring-3"></div>
          {mockDots.map(dot => (
            <div
              key={dot.id}
              className={cn("absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-ping-slow opacity-70", dot.colorClass)}
              style={{ top: dot.top, left: dot.left, animationDelay: dot.delay }}
              title="שליח מזוהה (הדמיה)"
            ></div>
          ))}
        </div>
        <CardTitle className="text-3xl font-headline text-primary">סורק אזור... מאתר שליחים עבורך!</CardTitle>
        <CardDescription className="text-lg">
          המערכת החכמה שלנו סורקת כעת את האזור ומאתרת שליחים זמינים בקרבת מקום עבור הזמנתך מ<span className="font-semibold">{order.restaurantName}</span>. אנו מעריכים את התאמתם לפי קרבה, מהירות תגובה, דירוג ועומס נוכחי.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center">
            <Users className="h-6 w-6 mr-3 text-primary" />
            <div>
              <p className="font-semibold">{identifiedCouriersCount} שליחים זוהו באזורך</p>
              <p className="text-xs text-muted-foreground">המערכת ממשיכה לסרוק ולהעריך...</p>
            </div>
          </div>
          {leadingMatch && (
            <div className="flex items-center">
              <MapPin className="h-6 w-6 mr-3 text-accent" /> 
              <div>
                <p className="font-semibold">התאמה פוטנציאלית מובילה:</p>
                <div className="text-xs text-muted-foreground flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1"/> ~{leadingMatch.eta} דקות
                    <span className="mx-1">|</span>
                    <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400"/> {leadingMatch.rating}/5
                </div>
              </div>
            </div>
          )}
        </div>

        {order.deliveryPreference === 'arena' && (
          <Card className="bg-primary/5 border-primary/20 p-4 text-left">
            <CardHeader className="p-0 pb-2">
                <CardTitle className="text-lg text-primary flex items-center"><HelpCircle className="h-5 w-5 mr-2"/> טיפ לזירת המשלוחים</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <p className="text-sm text-primary/80 mb-3">
                    רוצה לזרז את התהליך? ניתן לשדרג למשלוח מהיר יותר בעדיפות.
                </p>
                <Button onClick={handleUpgrade} variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
                    שדרג למשלוח מהיר יותר (לדוגמה: +₪4)
                </Button>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground pt-4">
          מזהה ההזמנה שלך: {order.id}. התהליך אוטומטי לחלוטין.
        </p>
        <style jsx global>{`
          .radar-pulse-container {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .radar-pulse-base {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-color: hsl(var(--primary) / 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 1;
          }
          .radar-center-icon {
             opacity: 0.7;
          }
          .radar-ring {
            content: '';
            position: absolute;
            border-radius: 50%;
            border: 2px solid hsl(var(--primary) / 0.5);
            animation: radarScan 2.5s infinite linear;
            opacity: 0;
            transform-origin: center;
          }
          .radar-ring-1 { width: 120px; height: 120px; animation-delay: 0s; }
          .radar-ring-2 { width: 180px; height: 180px; animation-delay: 0.8s; }
          .radar-ring-3 { width: 240px; height: 240px; animation-delay: 1.6s; }

          @media (min-width: 640px) { /* sm breakpoint */
            .radar-pulse-base { width: 100px; height: 100px; }
            .radar-ring-1 { width: 150px; height: 150px; }
            .radar-ring-2 { width: 220px; height: 220px; }
            .radar-ring-3 { width: 290px; height: 290px; }
          }


          @keyframes radarScan {
            0% {
              transform: scale(0.3);
              opacity: 0;
            }
            50% {
              opacity: 0.7;
            }
            100% {
              transform: scale(1);
              opacity: 0;
            }
          }
          
          .animate-ping-slow {
            animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          @keyframes ping-slow {
            75%, 100% {
              transform: scale(1.8);
              opacity: 0;
            }
          }
        `}</style>
      </CardContent>
    </Card>
  );
}
