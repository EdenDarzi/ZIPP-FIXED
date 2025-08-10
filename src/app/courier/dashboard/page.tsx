
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MapPin, DollarSign, PackageCheck, CheckCircle, XCircle, Search, AlertTriangle, Route, BarChart3, ListChecks, Lightbulb, Zap, Loader2, Trophy, CalendarClock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function CourierDashboardPage() {
  const [isActive, setIsActive] = useState(true);
  const [dailyEarnings, setDailyEarnings] = useState<number | null>(null);
  const [dailyDeliveries, setDailyDeliveries] = useState<number | null>(null);
  const [openBidCount, setOpenBidCount] = useState<number | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoadingStats(true);
    const timer = setTimeout(() => {
        setDailyEarnings(parseFloat((Math.random() * 150 + 50).toFixed(2)));
        setDailyDeliveries(Math.floor(Math.random() * 10 + 3));
        setOpenBidCount(Math.floor(Math.random() * 5 + 1));
        setIsLoadingStats(false);
    }, 700); 
    
    // Mock bonus alert
    const bonusAlertTimeout = setTimeout(() => {
      if (isActive && Math.random() > 0.7) {
        toast({
          title: "🚀 בונוס אזורי זמין!",
          description: "₪10 נוספים לכל משלוח מאזור 'מרכז העיר' בשעה הקרובה! (הדגמה)",
          duration: 10000,
          className: "bg-yellow-400 text-black border-yellow-500"
        });
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(bonusAlertTimeout);
    }
  }, [isActive]); // Rerun if isActive changes, to potentially show bonus if newly active

  const handleActivityToggle = (checked: boolean) => {
    setIsActive(checked);
    toast({
      title: `סטטוס פעילות עודכן ל: ${checked ? 'פעיל/ה' : 'לא פעיל/ה'}`,
      description: checked ? "את/ה זמין/ה כעת לקבל הצעות משלוח." : "לא תקבל/י הצעות משלוח חדשות עד להפעלה מחדש.",
    });
  };

  return (
    <div className="space-y-8"> {/* Increased spacing */}
      <Card className="shadow-xl premium-card-hover"> {/* Added shadow and hover effect */}
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

      <div className="grid md:grid-cols-3 gap-6"> {/* Changed to 3 cols for new card */}
        <Card className="premium-card-hover">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><MapPin className="mr-2 h-5 w-5 text-accent"/> מפת אזורים חמים</CardTitle>
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
                <p className="text-white text-lg font-semibold">תצוגת מפה חיה (הדגמה)</p>
                <div className="mt-2 space-y-1 text-xs">
                    <Badge variant="destructive" className="bg-red-500/80 text-white animate-pulse"><AlertTriangle className="mr-1 h-3 w-3"/> אזור ביקוש גבוה: מרכז העיר</Badge>
                    <Badge variant="secondary" className="bg-blue-500/80 text-white"><Lightbulb className="mr-1 h-3 w-3"/> מיקום מומלץ (AI): ליד קניון מרכזי</Badge>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">הערה: התראות על בונוסים באזורים חמים יופיעו כ-toast.</p>
          </CardContent>
        </Card>
        
        <Card className="premium-card-hover">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><DollarSign className="mr-2 h-5 w-5 text-green-600"/> ביצועים יומיים</CardTitle>
             <CardDescription>סיכום הפעילות שלך להיום.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="font-medium">הכנסות היום:</p>
              {isLoadingStats || dailyEarnings === null ? <Loader2 className="h-6 w-6 animate-spin text-green-700" /> : <p className="text-2xl font-bold text-green-700">₪{dailyEarnings.toFixed(2)}</p>}
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="font-medium">משלוחים שהושלמו היום:</p>
              {isLoadingStats || dailyDeliveries === null ? <Loader2 className="h-6 w-6 animate-spin text-blue-700" /> : <p className="text-2xl font-bold text-blue-700">{dailyDeliveries}</p>}
            </div>
             <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-md">
              <p className="font-medium">הצעות פתוחות כרגע:</p>
              {isLoadingStats || openBidCount === null ? <Loader2 className="h-6 w-6 animate-spin text-orange-700" /> : <p className="text-2xl font-bold text-orange-700">{openBidCount}</p>}
            </div>
            <Button asChild size="lg" className="w-full btn-gradient-hover-primary">
                <Link href="/courier/performance">
                    <BarChart3 className="mr-2 h-5 w-5"/> צפה בביצועים מלאים
                </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="premium-card-hover">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><Trophy className="mr-2 h-5 w-5 text-yellow-500"/> משימות ובונוסים</CardTitle>
             <CardDescription>עקוב אחר התקדמותך והזדמנויות לבונוסים.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border border-dashed border-yellow-400 rounded-md bg-yellow-50">
                <p className="font-semibold text-yellow-700">משימת סופ"ש (דמו):</p>
                <p className="text-sm text-yellow-600">השלם 5 משלוחים בין שישי לשבת וקבל ₪20 בונוס!</p>
                <div className="w-full bg-yellow-200 rounded-full h-2.5 mt-1">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${( (dailyDeliveries || 0) % 5 / 5) * 100}%` }}></div> {/* Mock progress */}
                </div>
                <p className="text-xs text-yellow-500 mt-1">התקדמות: {(dailyDeliveries || 0) % 5}/5</p>
            </div>
            <div className="p-3 border rounded-md bg-purple-50 text-purple-700">
                <p className="font-semibold">דירוג VIP (דמו): <Badge variant="secondary" className="bg-purple-200 text-purple-800">זהב</Badge></p>
                <p className="text-xs">שליחי VIP מקבלים עדיפות בהצעות משתלמות.</p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => toast({title: "בקרוב", description: "עמוד מלא לניהול משימות, הישגים ותוכנית VIP יתווסף."})}>
                <CalendarClock className="mr-2 h-4 w-4"/> הצג את כל המשימות
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="text-center premium-card-hover">
        <CardHeader>
            <CardTitle className="text-xl">מחפש/ת את המשלוח הבא?</CardTitle>
        </CardHeader>
        <CardContent>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-7 shadow-lg relative overflow-hidden group btn-gradient-hover-accent">
              <Link href="/courier/open-bids" className="flex items-center">
                <Zap className="mr-3 h-6 w-6 text-yellow-300 group-hover:animate-pulse absolute left-4 opacity-75"/> 
                <Search className="mr-3 h-6 w-6"/> 
                מצא משלוחים כעת ({isLoadingStats || openBidCount === null ? <Loader2 className="inline-block h-5 w-5 animate-spin" /> : openBidCount} הצעות פתוחות)
              </Link>
            </Button>
        </CardContent>
         <CardFooter className="justify-center pt-2">
            <p className="text-xs text-muted-foreground">זירת הצעות מתעדכנת בזמן אמת. הצעות מותאמות לך ע"י AI.</p>
         </CardFooter>
      </Card>
      
       <div className="grid md:grid-cols-2 gap-6">
           <Card className="hover:shadow-md transition-shadow premium-card-hover">
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
             <Card className="hover:shadow-md transition-shadow premium-card-hover">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary"/> הצעות מהירות</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">ראה את ההצעות האחרונות שהתקבלו או הוגשו.</p>
                    <Button variant="outline" onClick={() => toast({title: "הצעות מהירות", description: "יכולת לראות הצעות מהירות תתווסף כאן. (הדגמה)"})} className="w-full">
                        הצג הצעות מהירות
                    </Button>
                </CardContent>
            </Card>
       </div>
    </div>
  );
}
