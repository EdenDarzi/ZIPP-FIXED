
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MapPin, DollarSign, Clock, Edit2, Info, Settings } from 'lucide-react';
import Image from 'next/image';

export default function DeliveryManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <Settings className="mr-2 h-6 w-6 text-primary" />
            ניהול והגדרות משלוחים
          </CardTitle>
          <CardDescription>הגדר את אזורי המשלוח, תמחור וזמני הכנה של העסק שלך.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary" /> ניהול אזורי משלוח</CardTitle>
          <CardDescription>הגדר את האזורים אליהם העסק שלך מבצע משלוחים.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground bg-muted/20">
            <Image src="https://placehold.co/600x300.png?text=Map+Placeholder" alt="מפת אזורי משלוח (Placeholder)" width={600} height={300} className="mx-auto rounded data-ai-hint='delivery map zones'" />
            <p className="mt-2 text-sm">כלי להגדרת אזורים על גבי מפה (למשל, ציור פוליגונים, הגדרת רדיוס).</p>
            <Button variant="outline" className="mt-2" disabled>הגדר אזורים (בקרוב)</Button>
          </div>
          <div>
            <Label htmlFor="deliveryRadius">רדיוס משלוח מרבי (ק"מ)</Label>
            <Input id="deliveryRadius" type="number" placeholder="לדוגמה: 5" className="mt-1 max-w-xs" />
            <p className="text-xs text-muted-foreground mt-1">הגדר מרחק מקסימלי למשלוחים מהעסק.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><DollarSign className="mr-2 h-5 w-5 text-primary" /> הגדרות תמחור משלוחים</CardTitle>
          <CardDescription>קבע את עלויות המשלוח עבור הלקוחות שלך.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="baseDeliveryFee">דמי משלוח בסיסיים (₪)</Label>
              <Input id="baseDeliveryFee" type="number" placeholder="לדוגמה: 10" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="freeDeliveryThreshold">סכום מינימום למשלוח חינם (₪)</Label>
              <Input id="freeDeliveryThreshold" type="number" placeholder="לדוגמה: 150" className="mt-1" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="dynamicPricing" disabled />
            <Label htmlFor="dynamicPricing" className="text-sm">תמחור דינמי לפי מרחק/שעה (בקרוב)</Label>
          </div>
           <p className="text-xs text-muted-foreground p-2 bg-blue-50 border border-blue-200 rounded-md flex items-start">
            <Info className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
            <span>ניתן להגדיר עלויות משלוח מורכבות יותר, כולל תוספות לאזורים מסוימים או תעריפים לפי שעות עומס, דרך הגדרות מתקדמות (בקרוב).</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Clock className="mr-2 h-5 w-5 text-primary" /> זמני הכנה והתראות</CardTitle>
          <CardDescription>הגדר זמני הכנה ממוצעים כדי לשפר את הערכות זמן המשלוח.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="avgPreparationTime">זמן הכנה ממוצע (דקות)</Label>
            <Input id="avgPreparationTime" type="number" placeholder="לדוגמה: 15" className="mt-1 max-w-xs" />
            <p className="text-xs text-muted-foreground mt-1">זמן זה ישמש לחישוב זמן הגעה משוער ללקוח.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="rushHourAdjustments" disabled />
            <Label htmlFor="rushHourAdjustments" className="text-sm">התאמות אוטומטיות לשעות עומס (בקרוב)</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          <Edit2 className="mr-2 h-4 w-4" /> שמור הגדרות משלוח (דמו)
        </Button>
      </div>
       <p className="text-xs text-muted-foreground text-center mt-4">
        זכור כי הגדרות אלו יכולות להשפיע על חווית הלקוח ושביעות רצון השליחים.
      </p>
    </div>
  );
}
