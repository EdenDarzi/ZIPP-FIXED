
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { DollarSign, Package, Clock, Star, TrendingUp, Award, CalendarDays, BarChartHorizontalBig } from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';

const mockEarningsData = [
  { month: 'ינו', total: Math.floor(Math.random() * 2000) + 1000 },
  { month: 'פבר', total: Math.floor(Math.random() * 2000) + 1200 },
  { month: 'מרץ', total: Math.floor(Math.random() * 2000) + 1500 },
  { month: 'אפר', total: Math.floor(Math.random() * 2000) + 1300 },
  { month: 'מאי', total: Math.floor(Math.random() * 2000) + 1800 },
  { month: 'יונ', total: Math.floor(Math.random() * 2000) + 2200 },
];
const chartConfigEarnings: ChartConfig = { total: { label: "הכנסות (₪)", color: "hsl(var(--primary))" } };

const mockDeliveriesData = [
  { day: 'א\'', deliveries: Math.floor(Math.random() * 10) + 5 },
  { day: 'ב\'', deliveries: Math.floor(Math.random() * 10) + 7 },
  { day: 'ג\'', deliveries: Math.floor(Math.random() * 10) + 6 },
  { day: 'ד\'', deliveries: Math.floor(Math.random() * 10) + 8 },
  { day: 'ה\'', deliveries: Math.floor(Math.random() * 10) + 10 },
  { day: 'ו\'', deliveries: Math.floor(Math.random() * 10) + 12 },
  { day: 'שבת', deliveries: Math.floor(Math.random() * 10) + 9 },
];
const chartConfigDeliveries: ChartConfig = { deliveries: { label: "משלוחים", color: "hsl(var(--accent))" } };

const mockAchievements = [
    { id: 'ach1', name: 'שליח החודש', icon: Award, description: 'ביצועים מעולים לאורך כל החודש!', achieved: true },
    { id: 'ach2', name: 'רוכב מהיר', icon: TrendingUp, description: '50 משלוחים מהירים מתחת לזמן הממוצע.', achieved: true },
    { id: 'ach3', name: 'כוכב הקהילה', icon: Star, description: 'קבלת 100 דירוגי 5 כוכבים.', achieved: false },
    { id: 'ach4', name: 'אלוף המשמרות', icon: Clock, description: 'השלמת 20 משמרות לילה.', achieved: true },
];

const mockGoals = [
    { id: 'goal1', name: 'השלם 10 משלוחים בשישי', progress: '7/10', reward: '₪40 בונוס', active: true },
    { id: 'goal2', name: 'שמור על דירוג 4.8+ השבוע', progress: '4.9/5.0', reward: 'בונוס אמון', active: true },
    { id: 'goal3', name: 'השלם 5 משלוחים באזור צפון', progress: '2/5', reward: '₪25 בונוס', active: false },
];


export default function CourierPerformancePage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  // Mock states for KPIs
  const [totalEarnings, setTotalEarnings] = useState(7850.50);
  const [totalDeliveries, setTotalDeliveries] = useState(235);
  const [avgDeliveryTime, setAvgDeliveryTime] = useState(28); // minutes
  const [avgRating, setAvgRating] = useState(4.7);

  // Placeholder for date range change handling
  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange);
    // Here you would typically refetch data based on the newRange
    // For demo, we'll just log it and maybe slightly adjust mock KPIs
    console.log("Selected date range for performance:", newRange);
    setTotalEarnings(parseFloat((Math.random() * 5000 + 2000).toFixed(2)));
    setTotalDeliveries(Math.floor(Math.random() * 150 + 50));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">ביצועים והכנסות</CardTitle>
          <CardDescription>עקוב/י אחר ההכנסות, המשלוחים, הדירוגים וההישגים שלך.</CardDescription>
        </CardHeader>
        <CardContent>
            <DatePickerWithRange onDateChange={handleDateRangeChange} />
            <p className="text-xs text-muted-foreground mt-1 text-center">בחר/י טווח תאריכים כדי לסנן נתונים (פונקציונליות סינון מלאה בפיתוח).</p>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ הכנסות (דמו)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">בטווח התאריכים הנבחר</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ משלוחים (דמו)</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">בטווח התאריכים הנבחר</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">זמן משלוח ממוצע (דמו)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDeliveryTime} דקות</div>
            <p className="text-xs text-muted-foreground">בטווח התאריכים הנבחר</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">דירוג ממוצע (דמו)</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)} <span className="text-sm text-muted-foreground">/ 5</span></div>
            <p className="text-xs text-muted-foreground">מבוסס על ביקורות בטווח</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/> התפלגות הכנסות (דמו)</CardTitle>
             <CardDescription>הכנסות לפי חודש בשנה האחרונה.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] -ml-4 pr-2">
            <ChartContainer config={chartConfigEarnings} className="h-full w-full">
                <RechartsBarChart data={mockEarningsData} accessibilityLayer margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis tickLine={false} tickMargin={10} axisLine={false} unit="₪" width={55} />
                    <ChartTooltipContent />
                    <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><BarChartHorizontalBig className="mr-2 h-5 w-5 text-accent"/> התפלגות משלוחים (דמו)</CardTitle>
             <CardDescription>מספר משלוחים לפי יום בשבוע האחרון.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] -ml-4 pr-2">
             <ChartContainer config={chartConfigDeliveries} className="h-full w-full">
                <RechartsLineChart data={mockDeliveriesData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis unit=" משל." width={50}/>
                    <ChartTooltipContent />
                    <Legend />
                    <Line type="monotone" dataKey="deliveries" stroke="var(--color-deliveries)" strokeWidth={2} dot={{r: 4, fill: "var(--color-deliveries)"}} activeDot={{r:6}}/>
                </RechartsLineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><Award className="mr-2 h-5 w-5 text-yellow-500"/> ההישגים שלי (דמו)</CardTitle>
                <CardDescription>עקוב אחר התגים והמדליות שהשגת.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-60 overflow-y-auto">
                {mockAchievements.map(ach => (
                    <div key={ach.id} className={`p-3 border rounded-md flex items-center gap-3 ${ach.achieved ? 'bg-green-50 border-green-200' : 'bg-muted/50 opacity-70'}`}>
                        <ach.icon className={`h-8 w-8 flex-shrink-0 ${ach.achieved ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <div>
                            <p className={`font-semibold ${ach.achieved ? 'text-green-700' : 'text-foreground'}`}>{ach.name}</p>
                            <p className="text-xs text-muted-foreground">{ach.description}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-purple-500"/> משימות ויעדים (דמו)</CardTitle>
                <CardDescription>השלם משימות כדי לזכות בבונוסים ותגמולים.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-60 overflow-y-auto">
                 {mockGoals.filter(g => g.active).map(goal => (
                    <div key={goal.id} className="p-3 border border-purple-200 rounded-md bg-purple-50">
                        <p className="font-semibold text-purple-700">{goal.name}</p>
                        <div className="flex justify-between items-center text-xs mt-1">
                            <span className="text-muted-foreground">התקדמות: {goal.progress}</span>
                            <Badge variant="secondary" className="bg-purple-200 text-purple-800">{goal.reward}</Badge>
                        </div>
                    </div>
                ))}
                {mockGoals.filter(g => !g.active).map(goal => (
                    <div key={goal.id} className="p-3 border rounded-md bg-muted/50 opacity-70">
                         <p className="font-semibold text-muted-foreground">{goal.name} (לא פעיל)</p>
                         <div className="flex justify-between items-center text-xs mt-1">
                            <span className="text-muted-foreground">התקדמות: {goal.progress}</span>
                            <Badge variant="outline">{goal.reward}</Badge>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        נתוני הביצועים וההכנסות המוצגים הם להדגמה בלבד. נתונים אמיתיים ידרשו אינטגרציה עם מערכות השרת.
      </p>
    </div>
  );
}
