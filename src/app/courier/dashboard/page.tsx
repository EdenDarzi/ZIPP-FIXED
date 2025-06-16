
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MapPin, DollarSign, PackageCheck, CheckCircle, XCircle, Search, AlertTriangle, Route, BarChart3, ListChecks, Lightbulb, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function CourierDashboardPage() {
  const [isActive, setIsActive] = useState(true);
  const [dailyEarnings, setDailyEarnings] = useState(0);
  const [dailyDeliveries, setDailyDeliveries] = useState(0);
  const [openBidCount, setOpenBidCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Mock data updates only on client-side
    setDailyEarnings(parseFloat((Math.random() * 150 + 50).toFixed(2)));
    setDailyDeliveries(Math.floor(Math.random() * 10 + 3));
    setOpenBidCount(Math.floor(Math.random() * 5 + 1)); // Mock open bids
  }, []);

  const handleActivityToggle = (checked: boolean) => {
    setIsActive(checked);
    toast({
      title: `סטטוס פעילות עודכן ל: ${checked ? 'פעיל/ה' : 'לא פעיל/ה'}`,
      description: checked ? "את/ה זמין/ה כעת לקבל הצעות משלוח." : "לא תקבל/י הצעות משלוח חדשות עד להפעלה מחדש. (הדמיה)",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle className="text-2xl md:text-3xl font-headline text-primary">לוח הבקרה שלך, שליח!</CardTitle>
            <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 border rounded-lg bg-background shadow-sm">
              <Label htmlFor="activityStatus" className="text-lg font-medium">
                סטטוס: <span className={isActive ? "text-green-600" : "text-destructive"}>{isActive ? "פעיל/ה" : "לא פעיל/ה"}</span>
              </Label>
              <Switch
                id="activityStatus"
                checked={isActive}
                onCheckedChange={handleActivityToggle}
                aria-label="הפעל או כבה זמינות למשלוחים"
              />
              {isActive ? <CheckCircle className="h-6 w-6 text-green-600" /> : <XCircle className="h-6 w-6 text-destructive" />}
            </div>
          </div>
          <CardDescription className="mt-1">
            נהל/י את זמינותך, עקוב/י אחר ביצועים ומצא/י הזדמנויות משלוח חדשות.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><MapPin className="mr-2 h-5 w-5 text-accent"/> מפת אזורים חמים (דמו)</CardTitle>
            <CardDescription>צפה/י באזורים עם ריכוז גבוה של הזמנות כרגע.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
              <Image
                src="https://placehold.co/600x350.png"
                alt="מפת אזורים חמים"
                layout="fill"
                objectFit="cover"
                data-ai-hint="city map delivery hotspots"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-4 text-center">
                <p className="text-white text-lg font-semibold">תצוגת מפה חיה (בקרוב)</p>
                <div className="mt-2 space-y-1 text-xs">
                    <p className="text-yellow-300 flex items-center justify-center"><AlertTriangle className="mr-1 h-3 w-3"/> אזור ביקוש גבוה: מרכז העיר (דמו)</p>
                    <p className="text-blue-300 flex items-center justify-center"><Lightbulb className="mr-1 h-3 w-3"/> מיקום מומלץ (AI): ליד קניון מרכזי (דמו)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><DollarSign className="mr-2 h-5 w-5 text-green-600"/> ביצועים יומיים (דמו)</CardTitle>
             <CardDescription>סיכום הפעילות שלך להיום.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="font-medium">הכנסות היום:</p>
              <p className="text-2xl font-bold text-green-700">₪{dailyEarnings.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="font-medium">משלוחים שהושלמו היום:</p>
              <p className="text-2xl font-bold text-blue-700">{dailyDeliveries}</p>
            </div>
             <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-md">
              <p className="font-medium">הצעות פתוחות כרגע:</p>
              <p className="text-2xl font-bold text-orange-700">{openBidCount}</p>
            </div>
            <Button asChild size="lg" className="w-full">
                <Link href="/courier/performance">
                    <BarChart3 className="mr-2 h-5 w-5"/> צפה בביצועים מלאים
                </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="text-center">
        <CardHeader>
            <CardTitle className="text-xl">מחפש/ת את המשלוח הבא?</CardTitle>
        </CardHeader>
        <CardContent>
            <Button size="xl" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-7 shadow-lg relative overflow-hidden group">
              <Link href="/courier/open-bids" className="flex items-center">
                <Zap className="mr-3 h-6 w-6 text-yellow-300 group-hover:animate-ping absolute left-4 opacity-75"/> 
                <Search className="mr-3 h-6 w-6"/> 
                מצא משלוחים כעת ({openBidCount} הצעות פתוחות)
              </Link>
            </Button>
        </CardContent>
         <CardFooter className="justify-center pt-2">
            <p className="text-xs text-muted-foreground">זירת הצעות מתעדכנת בזמן אמת (הדמיה).</p>
         </CardFooter>
      </Card>
      
       <div className="grid md:grid-cols-2 gap-6">
           <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center"><PackageCheck className="mr-2 h-5 w-5 text-primary"/> ניהול הזמנות פעילות</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">צפה ועקוב אחר המשלוחים הנוכחיים שלך.</p>
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/courier/active-orders">עבור להזמנות פעילות</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary"/> הצעות מהירות</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">ראה את ההצעות האחרונות שהתקבלו או הוגשו.</p>
                    <Button variant="outline" onClick={() => toast({title: "בקרוב!", description: "יכולת לראות הצעות מהירות תתווסף כאן.", duration: 3000})} className="w-full" disabled>
                        הצג הצעות מהירות (בקרוב)
                    </Button>
                </CardContent>
            </Card>
       </div>
    </div>
  );
}
    