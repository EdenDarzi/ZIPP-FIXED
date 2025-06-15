
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapIcon, Utensils, Clock, TrendingUp as LiveTrendIcon, Users } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

// Mock data for recent orders & live trends
const mockRecentOrders = [
  { id: '1', itemName: 'פיצה פפרוני חריפה', restaurantName: 'פיצה האט', timeAgo: 'ממש עכשיו', locationHint: 'רחוב הרצל', type: 'order', dataAiHint: 'pizza pepperoni map' },
  { id: '2', itemName: 'סושי קומבינציה', restaurantName: 'סושי בר', timeAgo: 'לפני 2 דקות', locationHint: 'שדרות רוטשילד', type: 'order', dataAiHint: 'sushi combination map' },
  { id: '3', event: "🔥 'סנדוויץ׳ ראמן לוהט' נצפה בטיקטוק עכשיו באזור המרכז!", user: 'FoodieTrendz', timeAgo: 'לפני 3 דקות', type: 'trend_share', dataAiHint: 'ramen sandwich trend' },
  { id: '4', itemName: 'המבורגר גורמה', restaurantName: 'בורגר קינג', timeAgo: 'לפני 5 דקות', locationHint: 'מרכז העיר', type: 'order', dataAiHint: 'burger gourmet map' },
  { id: '5', event: "📈 'מאצ׳ה לאטה עם פיסטוק' זוכה לפופולריות! 5 משתמשים חיפשו בדקות האחרונות.", user: 'SwiftServe AI', timeAgo: 'לפני 6 דקות', type: 'trend_search', dataAiHint: 'matcha latte pistachio' },
  { id: '6', itemName: 'סלט קיסר גדול', restaurantName: 'בית קפה השכונתי', timeAgo: 'לפני 8 דקות', locationHint: 'פארק הירקון', type: 'order', dataAiHint: 'salad caesar map' },
];

export default function FoodRadarPage() {
  return (
    <div className="space-y-8">
      <Card className="text-center shadow-xl">
        <CardHeader>
          <LiveTrendIcon className="h-16 w-16 mx-auto text-primary mb-4 animate-pulse" />
          <CardTitle className="text-3xl font-headline text-primary">Food Radar & Live Trends</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            גלה מה אחרים מזמינים, משתפים ומחפשים בסביבתך בזמן אמת (אנונימי לחלוטין). קבל השראה והישאר מעודכן!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-[16/9] w-full max-w-2xl mx-auto rounded-lg overflow-hidden border-2 border-primary/30 shadow-lg mb-8">
            <Image
              src="https://placehold.co/800x450.png"
              alt="מפת Food Radar עם הזמנות וטרנדים חמים"
              layout="fill"
              objectFit="cover"
              data-ai-hint="live map food orders trends"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <p className="text-white text-xl font-semibold">תצוגת מפת טרנדים חיה (בקרוב!)</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-accent">פיד טרנדים חי באזור שלך (דמו):</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockRecentOrders.map(item => (
              <Card key={item.id} className="p-4 text-left shadow-md hover:shadow-lg transition-shadow">
                {item.type === 'order' && item.itemName && item.restaurantName && (
                  <>
                    <div className="flex items-center mb-2">
                      <Utensils className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-semibold text-foreground">{item.itemName}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">מאת: {item.restaurantName}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{item.timeAgo}</span>
                      {item.locationHint && <><span className="mx-1">|</span><span>מיקום משוער: {item.locationHint}</span></>}
                    </div>
                    <div className="mt-2 relative h-20 w-full bg-gray-200 rounded overflow-hidden">
                        <Image src={`https://placehold.co/200x100.png`} alt={item.itemName} layout="fill" objectFit="cover" data-ai-hint={item.dataAiHint}/>
                    </div>
                  </>
                )}
                {(item.type === 'trend_share' || item.type === 'trend_search') && item.event && (
                    <>
                     <div className="flex items-center mb-2">
                        <LiveTrendIcon className="h-5 w-5 mr-2 text-accent" />
                        <h3 className="font-semibold text-accent">{item.type === 'trend_share' ? 'שיתוף טרנד חם!' : 'חיפוש טרנדי!'}</h3>
                    </div>
                    <p className="text-sm text-foreground">{item.event}</p>
                     <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{item.timeAgo}</span>
                      {item.user && <><span className="mx-1">|</span><Users className="h-3 w-3 mr-1"/><span>על ידי: {item.user}</span></>}
                    </div>
                     <div className="mt-2 relative h-20 w-full bg-gray-200 rounded overflow-hidden">
                        <Image src={`https://placehold.co/200x100.png`} alt={"Trend visual"} layout="fill" objectFit="cover" data-ai-hint={item.dataAiHint}/>
                    </div>
                    </>
                )}
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-8">
            שימו לב: פיצ'ר זה נמצא בפיתוח ויציג נתונים אמיתיים ואנונימיים בקרוב.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
