
'use client';

import type { Order } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Zap, Users, HelpCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MatchingCourierViewProps {
  order: Order;
}

export function MatchingCourierView({ order }: MatchingCourierViewProps) {
  const [progress, setProgress] = useState(10);
  const [offers, setOffers] = useState(0);
  const [topOffer, setTopOffer] = useState<{ price: number, eta: number } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + Math.floor(Math.random() * 5 + 5) : 90));
      setOffers(prev => prev + (Math.random() > 0.6 ? 1 : 0));
      if (Math.random() > 0.5 && offers > 0) {
        setTopOffer({
          price: 10 + Math.floor(Math.random() * 5), // Mock price
          eta: 15 + Math.floor(Math.random() * 10), // Mock ETA
        });
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [offers]);

  const handleUpgrade = () => {
    toast({
      title: "בקשת שדרוג נשלחה (דמו)",
      description: "אנו ניתן עדיפות למציאת שליח מהיר יותר עבורך, בתוספת תשלום.",
    });
    // In a real app, this would trigger a backend action
  };

  return (
    <Card className="shadow-xl animate-fadeIn">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
          {/* Placeholder for animation: couriers on a nice map */}
          <Zap className="h-16 w-16 text-primary animate-pulse" />
        </div>
        <CardTitle className="text-3xl font-headline text-primary">מאתרים לך שליח!</CardTitle>
        <CardDescription className="text-lg">
          שליחים מתחרים כעת על ההזמנה שלך מ{order.restaurantName}. התהליך עשוי לקחת רגע.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <Progress value={progress} className="w-full h-3" />
        <p className="text-sm text-muted-foreground">מחפשים את ההתאמה הטובה ביותר...</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center">
            <Users className="h-6 w-6 mr-3 text-primary" />
            <div>
              <p className="font-semibold">{offers} הצעות הוגשו</p>
              <p className="text-xs text-muted-foreground">שליחים מגישים הצעות כעת!</p>
            </div>
          </div>
          {topOffer && (
            <div className="flex items-center">
              <Zap className="h-6 w-6 mr-3 text-accent" />
              <div>
                <p className="font-semibold">הצעה מובילה: ~₪{topOffer.price}, {topOffer.eta} דקות</p>
                <p className="text-xs text-muted-foreground">ההצעה הטובה ביותר כרגע (משוער).</p>
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
          מזהה ההזמנה שלך: {order.id}. אנו מעריכים את סבלנותך!
        </p>
      </CardContent>
    </Card>
  );
}
