
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockCourierProfiles } from '@/lib/mock-data';
import type { CourierProfile, DeliveryVehicle } from '@/types';
import { Bike, Car, Footprints, UserCheck, UserX, MapPin, TrendingUp, Clock, Star, Map as MapIconLucide, Gift, AlertTriangle, Users, Loader2 } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const VehicleIcon = ({ type, className }: { type: DeliveryVehicle | undefined, className?: string }) => {
  const iconProps = { className: cn(className || "inline h-4 w-4 mr-1", "text-muted-foreground") };
  if (type === 'motorcycle') return <Bike {...iconProps} title="אופנוע" />;
  if (type === 'scooter') return <Bike {...iconProps} title="קטנוע" />;
  if (type === 'car') return <Car {...iconProps} title="רכב" />;
  if (type === 'bicycle') return <Bike {...iconProps} title="אופניים"/>;
  if (type === 'foot') return <Footprints {...iconProps} title="הולך רגל"/>;
  return null;
};

const mockDeliveriesPerHourData = [
  { hour: '08:00', deliveries: 5 }, { hour: '09:00', deliveries: 8 }, { hour: '10:00', deliveries: 12 },
  { hour: '11:00', deliveries: 15 }, { hour: '12:00', deliveries: 22 }, { hour: '13:00', deliveries: 25 },
  { hour: '14:00', deliveries: 18 }, { hour: '15:00', deliveries: 14 }, { hour: '16:00', deliveries: 10 },
  { hour: '17:00', deliveries: 16 }, { hour: '18:00', deliveries: 20 }, { hour: '19:00', deliveries: 28 },
  { hour: '20:00', deliveries: 24 }, { hour: '21:00', deliveries: 15 },
];
const chartConfigDeliveries: ChartConfig = { deliveries: { label: "משלוחים", color: "hsl(var(--primary))" } };

const mockProblematicCouriers = [
    { id: 'courier2', name: 'ריטה האמינה', issue: '3 איחורים השבוע', actionRequired: true },
    { id: 'courier5', name: 'וולי ההולך', issue: 'GPS לא מגיב', actionRequired: true },
    { id: 'courier1', name: 'סמי המהיר', issue: '2 תלונות לקוח על אדיבות', actionRequired: false },
];

export default function CourierManagementDashboard() {
  const [activeCouriers, setActiveCouriers] = useState<number | null>(null);
  const [totalCouriers, setTotalCouriers] = useState<number | null>(null);
  const [dailyDeliveries, setDailyDeliveries] = useState<number | null>(null);
  const [avgDeliveryTime, setAvgDeliveryTime] = useState<number | null>(null);
  const [avgCourierRating, setAvgCourierRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
        setActiveCouriers(mockCourierProfiles.filter(c => c.isActive).length);
        setTotalCouriers(mockCourierProfiles.length);
        setDailyDeliveries(Math.floor(Math.random() * 200 + 50));
        setAvgDeliveryTime(Math.floor(Math.random() * 10 + 25));
        setAvgCourierRating(parseFloat((Math.random() * 0.8 + 4.0).toFixed(1)));
        setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);


  const handleSendBonusAlert = () => {
    toast({
        title: "התראת בונוס נשלחה (דמו)",
        description: "התראה על בונוס זמני נשלחה לשליחים באזור הנבחר.",
        className: "bg-green-500 text-white"
    });
  };

  const handleCourierAction = (courierName: string, action: 'השעיה' | 'חסימה' | 'אזהרה') => {
     toast({
        title: `פעולה בוצעה עבור ${courierName} (דמו)`,
        description: `השליח ${courierName} ${action === 'השעיה' ? 'הושעה זמנית' : action === 'חסימה' ? 'נחסם' : 'קיבל אזהרה'}.`,
        variant: action === 'חסימה' ? 'destructive' : 'default'
    });
  };

  return (
    <div className="space-y-8"> {/* Increased gap */}
      <Card className="premium-card-hover">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">לוח בקרת שליחים</CardTitle>
          <CardDescription>פקח על פעילות שליחים, ביצועים, אזורי תפעול ותחזיות עומס.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"> {/* Increased gap */}
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">שליחים פעילים</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || activeCouriers === null || totalCouriers === null ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{activeCouriers} / {totalCouriers}</div>}
            <p className="text-xs text-muted-foreground">מחוברים וזמינים כעת</p>
          </CardContent>
        </Card>
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ משלוחים (היום)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || dailyDeliveries === null ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{dailyDeliveries}</div>}
            <p className="text-xs text-muted-foreground">+15% מאתמול (דמו)</p>
          </CardContent>
        </Card>
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">זמן משלוח ממוצע</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading || avgDeliveryTime === null ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{avgDeliveryTime} דקות</div>}
            <p className="text-xs text-muted-foreground">-2 דקות מהשבוע שעבר (דמו)</p>
          </CardContent>
        </Card>
         <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">דירוג שליחים ממוצע</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || avgCourierRating === null ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{avgCourierRating.toFixed(1)} <span className="text-sm text-muted-foreground">/ 5</span></div>}
            <p className="text-xs text-muted-foreground">מבוסס על +250 דירוגי לקוחות</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 premium-card-hover">
          <CardHeader>
            <CardTitle>פעילות שליחים חיה (דמו)</CardTitle>
            <CardDescription>סטטוס בזמן אמת של כל השליחים הרשומים.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div> : 
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם</TableHead>
                  <TableHead>כלי רכב</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>מיקום (דמו)</TableHead>
                  <TableHead>דירוג</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCourierProfiles.slice(0, 5).map((courier) => (
                  <TableRow key={courier.id}>
                    <TableCell className="font-medium">{courier.name}</TableCell>
                    <TableCell><VehicleIcon type={courier.vehicleType} /> {courier.vehicleType}</TableCell>
                    <TableCell>
                      <Badge variant={courier.isActive ? 'default' : 'outline'} className={cn(courier.isActive ? 'bg-green-500 hover:bg-green-600 text-primary-foreground' : 'border-muted-foreground text-muted-foreground')}>
                        {courier.isActive ? <UserCheck className="mr-1 h-3 w-3"/> : <UserX className="mr-1 h-3 w-3"/>}
                        {courier.isActive ? 'פעיל' : 'לא פעיל'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                        <MapPin className="inline h-3 w-3 mr-1"/>
                        {courier.currentLocation.lat.toFixed(2)}, {courier.currentLocation.lng.toFixed(2)}
                    </TableCell>
                     <TableCell>
                        <Star className="inline h-3 w-3 mr-1 text-yellow-400 fill-yellow-400"/>
                        {courier.rating.toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>}
             {mockCourierProfiles.length > 5 && !isLoading && <p className="text-xs text-muted-foreground text-center mt-2">מציג 5 שליחים ראשונים. רשימה מלאה עם דפדוף תתווסף בקרוב.</p>}
          </CardContent>
           <CardFooter className="border-t pt-3">
                <Button variant="outline" size="sm" onClick={() => toast({title: "מעקב מפורט", description: "מעבר למפת מעקב מלאה עם פילטרים (בקרוב)."})}>צפה במפת מעקב מלאה</Button>
            </CardFooter>
        </Card>

        <div className="space-y-6">
            <Card className="premium-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center"><MapIconLucide className="mr-2 h-5 w-5 text-primary"/> ניהול אזורי משלוח</CardTitle>
                <CardDescription>הגדר ונהל אזורי משלוח ובונוסים.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative aspect-[16/9] bg-muted rounded-lg overflow-hidden border data-ai-hint='map delivery zones interface'">
                    <Image src="https://placehold.co/400x225.png" alt="מפת אזורי משלוח (placeholder)" layout="fill" objectFit="cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <p className="text-white text-sm font-semibold">כלי ניהול אזורים (בקרוב)</p>
                    </div>
                </div>
                <Input placeholder="שם אזור (לדוגמה: צפון תל אביב)" className="my-2" />
                <Button variant="outline" className="w-full" onClick={handleSendBonusAlert}><Gift className="mr-2 h-4 w-4"/> שלח התראת בונוס לאזור</Button>
              </CardContent>
            </Card>
        </div>
      </div>

        <Card className="premium-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/> משלוחים לפי שעה (היום - דמו)</CardTitle>
             <CardDescription>שעות שיא והתפלגות משלוחים לאורך היום. השתמש בתובנה זו לתכנון צוות ותגבור.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] -ml-2 pr-2"> 
            {isLoading ? <div className="flex h-full justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div> : 
            <ChartContainer config={chartConfigDeliveries} className="h-full w-full">
                <RechartsBarChart data={mockDeliveriesPerHourData} accessibilityLayer margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="hour" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis tickLine={false} tickMargin={10} axisLine={false} unit=" משל." width={45}/>
                    <ChartTooltipContent />
                    <Bar dataKey="deliveries" fill="var(--color-deliveries)" radius={4} />
                </RechartsBarChart>
            </ChartContainer>}
          </CardContent>
          <CardFooter className="border-t pt-3">
            <Button variant="outline" size="sm" onClick={() => toast({title: "תכנון צוות חכם", description: "המערכת תציע בקרוב תכנון צוות אוטומטי מבוסס תחזיות עומס."})}>
                תכנן תגבור צוות (בקרוב)
            </Button>
          </CardFooter>
        </Card>

         <Card className="premium-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive"><AlertTriangle className="mr-2 h-5 w-5"/> התראות מערכת על שליחים (דמו)</CardTitle>
             <CardDescription>מעקב אחר התנהגות לא תקינה וטיפול בפניות.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-destructive"/></div> : 
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם השליח</TableHead>
                  <TableHead>תיאור הבעיה</TableHead>
                  <TableHead>פעולה נדרשת</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProblematicCouriers.map((courier) => (
                  <TableRow key={courier.id} className={courier.actionRequired ? 'bg-red-50' : ''}>
                    <TableCell className="font-medium">{courier.name}</TableCell>
                    <TableCell className="text-sm">{courier.issue}</TableCell>
                    <TableCell>
                        <Badge variant={courier.actionRequired ? "destructive" : "secondary"}>
                            {courier.actionRequired ? "טיפול מיידי" : "למעקב"}
                        </Badge>
                    </TableCell>
                    <TableCell className="space-x-1 rtl:space-x-reverse">
                        <Button variant="ghost" size="xs" onClick={() => handleCourierAction(courier.name, 'אזהרה')}>אזהרה</Button>
                        <Button variant="ghost" size="xs" className="text-orange-600 hover:text-orange-700" onClick={() => handleCourierAction(courier.name, 'השעיה')}>השעיה</Button>
                        <Button variant="ghost" size="xs" className="text-destructive hover:text-destructive" onClick={() => handleCourierAction(courier.name, 'חסימה')}>חסימה</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>}
          </CardContent>
        </Card>

      <p className="text-xs text-muted-foreground text-center mt-4">
        ניתוחי שליחים מתקדמים, מעקב בזמן אמת, ואופטימיזציה של אזורים ידרשו אינטגרציה נוספת עם השרת ונתונים.
      </p>
    </div>
  );
}
