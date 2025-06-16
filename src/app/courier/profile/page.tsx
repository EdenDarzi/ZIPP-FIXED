
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Shield, Edit3, LogOut, Bike, Car, Footprints, AlertTriangle, Users, Camera, Award, MessageSquare, Star, Lightbulb, Banknote, FileText, CalendarDays, ThumbsUp, ThumbsDown } from 'lucide-react';
import { mockCourierProfiles } from '@/lib/mock-data'; 
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { DeliveryVehicle } from '@/types'; // Import DeliveryVehicle type

const MOCK_CURRENT_COURIER_ID = 'courier1'; 

export default function CourierProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const courier = mockCourierProfiles.find(c => c.id === MOCK_CURRENT_COURIER_ID);
  const [followers, setFollowers] = useState<number | null>(null);
  const [mockFeedbacks, setMockFeedbacks] = useState<string[]>([]);

  useEffect(() => {
    setFollowers(Math.floor(Math.random() * 500 + 50));
    setMockFeedbacks([
        "השליח הגיע מהר וחייך, תודה רבה!",
        "תקשורת מעולה, עדכן אותי כשהיה בדרך.",
        "קצת איחר, אבל היה אדיב מאוד.",
        "הכל הגיע חם ובדיוק כמו שצריך, שירות מעולה!"
    ]);
  }, []);

  if (!courier) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold">פרופיל שליח לא נמצא</h1>
            <p className="text-muted-foreground mb-6">לא הצלחנו לטעון את פרטי השליח.</p>
            <Button onClick={() => router.push('/courier/open-bids')}>חזרה להצעות פתוחות</Button>
        </div>
    );
  }

  const handleSaveChanges = () => {
    toast({
      title: "הפרופיל עודכן (דמו)",
      description: "שינויי הפרופיל שלך נשמרו (זוהי הדגמה בלבד).",
    });
  };
  
  const handleSecuritySettings = () => {
    toast({ title: "בקרוב!", description: "אפשרות להגדרות אבטחה מתקדמות (כגון אימות דו-שלבי) תתווסף כאן." });
  };

  const handleLogout = () => {
    toast({ title: "התנתקת (דמו)", description: "התנתקת בהצלחה ממערכת השליחים (זוהי הדגמה)." });
    router.push('/'); 
  };

  const VehicleIconDisplay = ({ type }: { type: DeliveryVehicle | undefined }) => {
    if (type === 'motorcycle') return <Bike className="h-5 w-5 text-primary" title="אופנוע"/>;
    if (type === 'car') return <Car className="h-5 w-5 text-primary" title="רכב"/>;
    if (type === 'bicycle') return <Bike className="h-5 w-5 text-primary" title="אופניים"/>;
    if (type === 'foot') return <Footprints className="h-5 w-5 text-primary" title="הולך רגל"/>;
    if (type === 'scooter') return <Bike className="h-5 w-5 text-primary" title="קטנוע"/>;
    return null;
  };


  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4 border-4 border-primary shadow-lg">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${courier.name.substring(0,1)}`} alt={courier.name} data-ai-hint="courier person" />
            <AvatarFallback>{courier.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-headline text-primary">{courier.name}</CardTitle>
          <CardDescription className="text-lg">מזהה: {courier.id}</CardDescription>
          <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2 text-muted-foreground">
            <VehicleIconDisplay type={courier.vehicleType} />
            <span className="capitalize">{courier.vehicleType} - {courier.transportationModeDetails || 'לא זמין'}</span>
            <span className="mx-1">|</span>
            <Users className="h-4 w-4 text-primary" />
            <span>{followers !== null ? `${followers} עוקבים` : 'טוען עוקבים...'} (דמו)</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="email">אימייל (לקריאה בלבד)</Label>
              <Input id="email" defaultValue={`${courier.id}@livepick.com`} readOnly />
              <p className="text-xs text-muted-foreground">לא ניתן לשנות אימייל.</p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">מספר טלפון</Label>
              <Input id="phone" defaultValue="050-1234567" />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">הגדרות תפעוליות</h3>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-base">פעיל/ה למשלוחים</Label>
                <p className="text-sm text-muted-foreground">
                  הפעל/כבה כדי להתחיל או להפסיק לקבל הצעות משלוח חדשות.
                </p>
              </div>
              <Switch id="isActive" defaultChecked={courier.isActive} />
            </div>
             <div className="space-y-1">
                <Label htmlFor="coverageRadius">רדיוס כיסוי (ק"מ)</Label>
                <Input id="coverageRadius" type="number" defaultValue={courier.areaCoverageRadiusKm} />
                <p className="text-xs text-muted-foreground">מרחק מקסימלי שאתה מוכן לנסוע לאיסוף.</p>
            </div>
            { (courier.vehicleType === 'scooter' || courier.vehicleType === 'bicycle' && courier.batteryPercent) &&
                <div className="space-y-1">
                    <Label htmlFor="battery">סוללה נוכחית (%) (לקריאה בלבד)</Label>
                    <Input id="battery" value={courier.batteryPercent} readOnly />
                    <p className="text-xs text-muted-foreground">לרכבים חשמליים, מתעדכן אוטומטית.</p>
                </div>
            }
          </div>
          
          <Separator />
          
          <div className="space-y-4">
             <h3 className="text-lg font-semibold flex items-center"><Star className="mr-2 h-5 w-5 text-yellow-400"/> ביצועים ודירוגים</h3>
             <div className="flex justify-around p-3 bg-muted/30 rounded-md">
                <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{courier.rating.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">דירוג ממוצע</p>
                </div>
                 <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{courier.trustScore}%</p>
                    <p className="text-xs text-muted-foreground">ציון אמון</p>
                </div>
             </div>
             <Card>
                <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-md flex items-center"><MessageSquare className="mr-2 h-4 w-4 text-blue-500"/> משובים אחרונים (דמו)</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3 space-y-2 max-h-40 overflow-y-auto">
                    {mockFeedbacks.map((fb, i) => (
                        <div key={i} className="text-xs p-2 border rounded-md bg-background">
                            <ThumbsUp className="inline h-3 w-3 mr-1 text-green-500"/> {fb}
                        </div>
                    ))}
                </CardContent>
             </Card>
             <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-md text-blue-700 flex items-center"><Lightbulb className="mr-2 h-4 w-4"/> טיפ AI לשיפור (בקרוב)</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3 text-sm text-blue-600">
                   <p>"לקוחות מעריכים מאוד תקשורת יזומה. נסה לשלוח הודעה קצרה ללקוח כשהאיסוף בוצע." (דמו)</p>
                </CardContent>
             </Card>
          </div>

           <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ניהול אישי</h3>
            <Card className="p-4 bg-muted/30 text-center">
                <Banknote className="h-8 w-8 mx-auto text-muted-foreground mb-2"/>
                <p className="text-sm text-muted-foreground">פרטי קבלת תשלום</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => toast({title: "בקרוב!", description:"ניהול פרטי תשלום יתווסף כאן."})} disabled>הגדר (בקרוב)</Button>
            </Card>
            <Card className="p-4 bg-muted/30 text-center">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2"/>
                <p className="text-sm text-muted-foreground">אימות מסמכים (רישיון, ביטוח)</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => toast({title: "בקרוב!", description:"העלאת מסמכים לאימות תתווסף כאן."})} disabled>העלה מסמכים (בקרוב)</Button>
            </Card>
             <Card className="p-4 bg-muted/30 text-center">
                <CalendarDays className="h-8 w-8 mx-auto text-muted-foreground mb-2"/>
                <p className="text-sm text-muted-foreground">הגדרות זמינות שבועית</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => toast({title: "בקרוב!", description:"הגדרת זמינות שבועית תתווסף כאן."})} disabled>נהל זמינות (בקרוב)</Button>
            </Card>
          </div>
          
          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">המלצות מקומיות ופעילות חברתית (בקרוב)</h3>
            <Card className="p-4 bg-muted/30 text-center">
                <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2"/>
                <p className="text-sm text-muted-foreground">ההמלצות המקומיות שלך וצילומי לקוחות מרוצים יוצגו כאן.</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => toast({title: "בקרוב!", description:"הוספת המלצות וצילומים תתווסף כאן."})} disabled>הוסף המלצה (בקרוב)</Button>
            </Card>
             <Card className="p-4 bg-muted/30 text-center">
                <Award className="h-8 w-8 mx-auto text-muted-foreground mb-2"/>
                <p className="text-sm text-muted-foreground">תגים והישגים (בקרוב)</p>
                <p className="text-xs">כאן יוצגו התגים שהשגת על שירות מעולה, מהירות, או המלצות פופולריות.</p>
            </Card>
          </div>


          <Button onClick={handleSaveChanges} className="w-full mt-4 bg-primary hover:bg-primary/90">
            <Edit3 className="mr-2 h-4 w-4" /> שמור שינויים (דמו)
          </Button>
        </CardContent>
         <CardFooter className="border-t pt-4 flex flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={handleSecuritySettings}><Shield className="mr-2 h-4 w-4" /> הגדרות אבטחה (כולל 2FA - בקרוב)</Button>
            <Button variant="destructive" className="w-full" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4"/> התנתק (דמו)</Button>
         </CardFooter>
      </Card>
    </div>
  );
}

    