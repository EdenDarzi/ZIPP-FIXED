
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockCourierProfiles } from '@/lib/mock-data';
import type { CourierProfile, DeliveryVehicle } from '@/types';
import { Bike, Car, Footprints, UserCheck, UserX, MapPin, TrendingUp, Clock, Star, Map as MapIconLucide } from 'lucide-react'; // Renamed Map to MapIconLucide
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from '@/lib/utils';

// Helper to get vehicle icon
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


export default function CourierManagementDashboard() {
  const activeCouriers = mockCourierProfiles.filter(c => c.isActive).length;
  const totalCouriers = mockCourierProfiles.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">לוח בקרת שליחים</CardTitle>
          <CardDescription>פקח על פעילות שליחים, ביצועים ואזורי תפעול.</CardDescription>
        </CardHeader>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">שליחים פעילים</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCouriers} / {totalCouriers}</div>
            <p className="text-xs text-muted-foreground">מחוברים וזמינים כעת</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ משלוחים (היום - דמו)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+15% מאתמול</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">זמן משלוח ממוצע (דמו)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28 דקות</div>
            <p className="text-xs text-muted-foreground">-2 דקות מהשבוע שעבר</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">דירוג שליחים ממוצע (דמו)</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.72 <span className="text-sm text-muted-foreground">/ 5</span></div>
            <p className="text-xs text-muted-foreground">מבוסס על +250 דירוגי לקוחות</p>
          </CardContent>
        </Card>
      </div>

      {/* Courier Activity Table & Zone Management Placeholder */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>פעילות שליחים חיה</CardTitle>
            <CardDescription>סטטוס בזמן אמת של כל השליחים הרשומים.</CardDescription>
          </CardHeader>
          <CardContent>
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
                {mockCourierProfiles.slice(0, 5).map((courier) => ( // Display first 5 for brevity
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
            </Table>
             {mockCourierProfiles.length > 5 && <p className="text-xs text-muted-foreground text-center mt-2">מציג 5 שליחים ראשונים. רשימה מלאה עם דפדוף תתווסף בקרוב.</p>}
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><MapIconLucide className="mr-2 h-5 w-5 text-primary"/> ניהול אזורים</CardTitle>
                <CardDescription>הגדר ונהל אזורי משלוח.</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground py-8">
                <MapIconLucide className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">כלים ליצירת והקצאת אזורים</p>
                <p className="text-xs">(תכונה תתווסף בקרוב)</p>
              </CardContent>
            </Card>
        </div>
      </div>


        {/* Performance Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/> משלוחים לפי שעה (היום - דמו)</CardTitle>
             <CardDescription>שעות שיא והתפלגות משלוחים לאורך היום.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] -ml-2 pr-2"> {/* Adjusted padding for axis labels */}
            <ChartContainer config={chartConfigDeliveries} className="h-full w-full">
                <RechartsBarChart data={mockDeliveriesPerHourData} accessibilityLayer margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="hour" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis tickLine={false} tickMargin={10} axisLine={false} unit=" משל." width={45}/>
                    <ChartTooltipContent />
                    <Bar dataKey="deliveries" fill="var(--color-deliveries)" radius={4} />
                </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

      <p className="text-xs text-muted-foreground text-center mt-4">
        ניתוחי שליחים מתקדמים, מעקב בזמן אמת, ואופטימיזציה של אזורים ידרשו אינטגרציה נוספת עם השרת ונתונים.
      </p>
    </div>
  );
}
