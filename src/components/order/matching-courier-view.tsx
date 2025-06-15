
'use client';

import type { Order } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, HelpCircle, Search, MapPin, Star, ClockIcon } from 'lucide-react'; // Added Search, MapPin, Star, ClockIcon
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
}

export function MatchingCourierView({ order }: MatchingCourierViewProps) {
  const [identifiedCouriersCount, setIdentifiedCouriersCount] = useState(0);
  const [leadingMatch, setLeadingMatch] = useState<{ eta: number; rating: number } | null>(null);
  const [mockDots, setMockDots] = useState<MockCourierDot[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setIdentifiedCouriersCount(prev => prev + (Math.random() > 0.5 ? 1 : 0));
      if (Math.random() > 0.4) {
        setLeadingMatch({
          eta: 10 + Math.floor(Math.random() * 15),
          rating: parseFloat((4 + Math.random()).toFixed(1)),
        });
      }

      // Add new dots dynamically
      if (mockDots.length < 5 && Math.random() > 0.3) { // Limit to 5 dots for demo
        setMockDots(prevDots => [
          ...prevDots,
          {
            id: `dot-${Date.now()}`,
            top: `${Math.random() * 80 + 10}%`, // Random position within radar
            left: `${Math.random() * 80 + 10}%`,
            delay: `${Math.random() * 2}s`
          }
        ]);
      } else if (mockDots.length >= 5 && Math.random() > 0.8) { // Occasionally remove a dot
        setMockDots(prevDots => prevDots.slice(1));
      }

    }, 2000); // Update more frequently for a dynamic feel
    return () => clearInterval(interval);
  }, [mockDots.length]); // Re-run if mockDots changes to manage its growth

  const handleUpgrade = () => {
    toast({
      title: "בקשת שדרוג נשלחה (דמו)",
      description: "אנו ניתן עדיפות למציאת שליח מהיר יותר עבורך, בתוספת תשלום.",
    });
  };

  return (
    <Card className="shadow-xl animate-fadeIn">
      <CardHeader className="text-center">
        <div className="relative w-48 h-48 mx-auto mb-4 radar-pulse-container">
          <div className="radar-pulse-base">
            <Search className="h-12 w-12 text-primary radar-center-icon" />
          </div>
          <div className="radar-ring radar-ring-1"></div>
          <div className="radar-ring radar-ring-2"></div>
          <div className="radar-ring radar-ring-3"></div>
          {mockDots.map(dot => (
            <div
              key={dot.id}
              className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping-slow"
              style={{ top: dot.top, left: dot.left, animationDelay: dot.delay }}
              title="שליח מזוהה (דמו)"
            ></div>
          ))}
        </div>
        <CardTitle className="text-3xl font-headline text-primary">סורק אזור... מאתר שליחים עבורך!</CardTitle>
        <CardDescription className="text-lg">
          המערכת החכמה שלנו סורקת כעת את האזור ומאתרת שליחים זמינים בקרבת מקום עבור הזמנתך מ{order.restaurantName}. אנו מעריכים את התאמתם לפי קרבה, מהירות תגובה, דירוג ועומס נוכחי.
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
              <MapPin className="h-6 w-6 mr-3 text-accent" /> {/* Changed icon to MapPin */}
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
         {/* Inline styles for radar animation - for simplicity in this environment */}
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
            animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          @keyframes ping-slow {
            75%, 100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `}</style>
      </CardContent>
    </Card>
  );
}
