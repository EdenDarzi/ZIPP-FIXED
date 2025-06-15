
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapIcon, Utensils, Clock } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

// Mock data for recent orders
const mockRecentOrders = [
  { id: '1', itemName: 'פיצה פפרוני חריפה', restaurantName: 'פיצה האט', timeAgo: 'ממש עכשיו', locationHint: 'רחוב הרצל', dataAiHint: 'pizza pepperoni map' },
  { id: '2', itemName: 'סושי קומבינציה', restaurantName: 'סושי בר', timeAgo: 'לפני 2 דקות', locationHint: 'שדרות רוטשילד', dataAiHint: 'sushi combination map' },
  { id: '3', itemName: 'המבורגר גורמה', restaurantName: 'בורגר קינג', timeAgo: 'לפני 5 דקות', locationHint: 'מרכז העיר', dataAiHint: 'burger gourmet map' },
  { id: '4', itemName: 'סלט קיסר גדול', restaurantName: 'בית קפה השכונתי', timeAgo: 'לפני 8 דקות', locationHint: 'פארק הירקון', dataAiHint: 'salad caesar map' },
];

export default function FoodRadarPage() {
  return (
    <div className="space-y-8">
      <Card className="text-center shadow-xl">
        <CardHeader>
          <MapIcon className="h-16 w-16 mx-auto text-primary mb-4 animate-pulse" />
          <CardTitle className="text-3xl font-headline text-primary">Food Radar - מה חם עכשיו סביבך?</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            גלה מה אחרים מזמינים בקרבתך בזמן אמת (אנונימי לחלוטין) וקבל השראה לארוחה הבאה שלך!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-[16/9] w-full max-w-2xl mx-auto rounded-lg overflow-hidden border-2 border-primary/30 shadow-lg mb-8">
            <Image
              src="https://placehold.co/800x450.png"
              alt="מפת Food Radar עם הזמנות חמות"
              layout="fill"
              objectFit="cover"
              data-ai-hint="map nearby food orders"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <p className="text-white text-xl font-semibold">תצוגת מפה חיה (בקרוב!)</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-accent">הזמנות אחרונות באזור שלך (דמו):</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockRecentOrders.map(order => (
              <Card key={order.id} className="p-4 text-left shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-2">
                  <Utensils className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-semibold text-foreground">{order.itemName}</h3>
                </div>
                <p className="text-sm text-muted-foreground">מאת: {order.restaurantName}</p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{order.timeAgo}</span>
                  <span className="mx-1">|</span>
                  <span>מיקום משוער: {order.locationHint}</span>
                </div>
                <div className="mt-2 relative h-20 w-full bg-gray-200 rounded overflow-hidden">
                     <Image src={`https://placehold.co/200x100.png`} alt={order.itemName} layout="fill" objectFit="cover" data-ai-hint={order.dataAiHint}/>
                </div>
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
