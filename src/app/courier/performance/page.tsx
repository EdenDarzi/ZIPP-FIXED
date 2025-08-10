
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { DollarSign, Package, Clock, Star, TrendingUp, Award, CalendarDays, BarChartHorizontalBig, Wallet as WalletIcon, History, Download, AlertCircle, Info, Loader2, FileText } from 'lucide-react'; 
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast'; 
import type { Wallet, Transaction, TransactionType } from '@/types'; // Keep Wallet and Transaction related types
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link'; // Import Link
import { ExternalLink } from 'lucide-react'; // Import ExternalLink

const mockEarningsDataDefault = [
  { month: 'ינו', total: Math.floor(Math.random() * 2000) + 1000 }, { month: 'פבר', total: Math.floor(Math.random() * 2000) + 1200 }, { month: 'מרץ', total: Math.floor(Math.random() * 2000) + 1500 }, { month: 'אפר', total: Math.floor(Math.random() * 2000) + 1300 }, { month: 'מאי', total: Math.floor(Math.random() * 2000) + 1800 }, { month: 'יונ', total: Math.floor(Math.random() * 2000) + 2200 },
];
const chartConfigEarnings: ChartConfig = { total: { label: "הכנסות (₪)", color: "hsl(var(--primary))" } };

const mockDeliveriesDataDefault = [
  { day: 'א\'', deliveries: Math.floor(Math.random() * 10) + 5 }, { day: 'ב\'', deliveries: Math.floor(Math.random() * 10) + 7 }, { day: 'ג\'', deliveries: Math.floor(Math.random() * 10) + 6 }, { day: 'ד\'', deliveries: Math.floor(Math.random() * 10) + 8 }, { day: 'ה\'', deliveries: Math.floor(Math.random() * 10) + 10 }, { day: 'ו\'', deliveries: Math.floor(Math.random() * 10) + 12 }, { day: 'שבת', deliveries: Math.floor(Math.random() * 10) + 9 },
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

// Wallet related mock data and functions are now primarily in courier/wallet/page.tsx
// We might still show some summary here, but details are in the wallet page.

export default function CourierPerformancePage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [totalEarnings, setTotalEarnings] = useState<number | null>(null);
  const [totalDeliveries, setTotalDeliveries] = useState<number | null>(null);
  const [avgDeliveryTime, setAvgDeliveryTime] = useState<number | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  
  const [earningsData, setEarningsData] = useState(mockEarningsDataDefault);
  const [deliveriesData, setDeliveriesData] = useState(mockDeliveriesDataDefault);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
        const randomFactor = dateRange?.from && dateRange?.to ? (dateRange.to.getTime() - dateRange.from.getTime()) / (1000*60*60*24*30) + 0.5 : 1;
        const newTotalEarnings = parseFloat((Math.random() * 5000 * Math.max(0.2, randomFactor) + 1500).toFixed(2));
        const newTotalDeliveries = Math.floor(Math.random() * 150 * Math.max(0.2, randomFactor) + 40);
        
        setTotalEarnings(newTotalEarnings);
        setTotalDeliveries(newTotalDeliveries);
        setAvgDeliveryTime(Math.floor(Math.random() * 15 + 18)); 
        setAvgRating(parseFloat((4.2 + Math.random() * 0.8).toFixed(1))); 

        setEarningsData(mockEarningsDataDefault.map(d => ({...d, total: Math.floor((d.total + Math.random() * 500 - 250) * Math.max(0.5, randomFactor * 0.7))})));
        setDeliveriesData(mockDeliveriesDataDefault.map(d => ({...d, deliveries: Math.floor((d.deliveries + Math.random() * 5 - 2) * Math.max(0.5, randomFactor * 0.8))})));
        setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [dateRange]);
  
  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setIsLoading(true); 
    setDateRange(newRange);
    toast({
        title: "נתונים עודכנו (דמו)",
        description: "הנתונים והגרפים רועננו בהתאם לטווח התאריכים שנבחר.",
    });
  };


  return (
    <div className="space-y-8">
      <Card className="premium-card-hover">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle className="text-2xl md:text-3xl font-headline">ביצועים והכנסות</CardTitle>
            <CardDescription>עקוב/י אחר ההכנסות, המשלוחים, הדירוגים וההישגים שלך. הכנסות מפורטות זמינות בארנק.</CardDescription> {/* Updated description */}
          </div>
           <div className="mt-3 sm:mt-0 w-full sm:w-auto">
             <DatePickerWithRange onDateChange={handleDateRangeChange} />
          </div>
        </CardHeader>
         <CardFooter className="border-t pt-3">
            <Button variant="outline" size="sm" asChild>
                <Link href="/courier/wallet">
                    <WalletIcon className="mr-2 h-4 w-4"/> עבור לארנק המלא <ExternalLink className="h-3 w-3 ml-1 text-muted-foreground"/>
                </Link>
            </Button>
             <Button variant="outline" size="sm" className="mr-auto" onClick={() => toast({title: "הפקת דוח", description:"הפקת דוח ביצועים לתקופה זו (בקרוב)."})}>
                <FileText className="mr-2 h-4 w-4"/> הפק דוח ביצועים
            </Button>
        </CardFooter>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ הכנסות (בטווח)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || totalEarnings === null ? <Loader2 className="h-6 w-6 animate-spin text-primary"/> : <div className="text-2xl font-bold">₪{totalEarnings.toFixed(2)}</div>}
            <p className="text-xs text-muted-foreground">בטווח התאריכים הנבחר</p>
          </CardContent>
        </Card>
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ משלוחים (בטווח)</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || totalDeliveries === null ? <Loader2 className="h-6 w-6 animate-spin text-primary"/> : <div className="text-2xl font-bold">{totalDeliveries}</div>}
            <p className="text-xs text-muted-foreground">בטווח התאריכים הנבחר</p>
          </CardContent>
        </Card>
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">זמן משלוח ממוצע (בטווח)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || avgDeliveryTime === null ? <Loader2 className="h-6 w-6 animate-spin text-primary"/> : <div className="text-2xl font-bold">{avgDeliveryTime} דקות</div>}
            <p className="text-xs text-muted-foreground">בטווח התאריכים הנבחר</p>
          </CardContent>
        </Card>
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">דירוג ממוצע (בטווח)</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || avgRating === null ? <Loader2 className="h-6 w-6 animate-spin text-primary"/> : <div className="text-2xl font-bold">{avgRating.toFixed(1)} <span className="text-sm text-muted-foreground">/ 5</span></div>}
            <p className="text-xs text-muted-foreground">מבוסס על ביקורות בטווח</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="premium-card-hover">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/> התפלגות הכנסות</CardTitle>
             <CardDescription>הכנסות לפי חודש (דמו, נתונים משתנים עם בחירת תאריכים).</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] -ml-4 pr-2">
            {isLoading ? <div className="flex h-full justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div> : (
            <ChartContainer config={chartConfigEarnings} className="h-full w-full">
                <RechartsBarChart data={earningsData} accessibilityLayer margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis tickLine={false} tickMargin={10} axisLine={false} unit="₪" width={55} />
                    <ChartTooltipContent />
                    <Legend />
                    <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} barSize={30}/>
                </RechartsBarChart>
            </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="premium-card-hover">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><BarChartHorizontalBig className="mr-2 h-5 w-5 text-accent"/> התפלגות משלוחים</CardTitle>
             <CardDescription>מספר משלוחים לפי יום (דמו, נתונים משתנים עם בחירת תאריכים).</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] -ml-4 pr-2">
            {isLoading ? <div className="flex h-full justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-accent"/></div> : (
             <ChartContainer config={chartConfigDeliveries} className="h-full w-full">
                <RechartsLineChart data={deliveriesData} margin={{ top: 20, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis unit=" משל." width={50}/>
                    <ChartTooltipContent />
                    <Legend />
                    <Line type="monotone" dataKey="deliveries" stroke="var(--color-deliveries)" strokeWidth={3} dot={{r: 5, fill: "var(--color-deliveries)"}} activeDot={{r:7}}/>
                </RechartsLineChart>
            </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="premium-card-hover">
            <CardHeader>
                <CardTitle className="text-xl flex items-center"><Award className="mr-2 h-6 w-6 text-yellow-500"/> ההישגים שלי (דמו)</CardTitle>
                <CardDescription>עקוב אחר התגים והמדליות שהשגת על שירות מעולה.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-72 overflow-y-auto">
                {mockAchievements.map(ach => (
                    <div key={ach.id} className={`p-4 border rounded-lg flex items-center gap-4 shadow-sm ${ach.achieved ? 'bg-green-500/10 border-green-500/30' : 'bg-muted/50 opacity-70'}`}>
                        <ach.icon className={`h-10 w-10 flex-shrink-0 ${ach.achieved ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <div>
                            <p className={`font-semibold text-lg ${ach.achieved ? 'text-green-700' : 'text-foreground'}`}>{ach.name}</p>
                            <p className="text-sm text-muted-foreground">{ach.description}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
         <Card className="premium-card-hover">
            <CardHeader>
                <CardTitle className="text-xl flex items-center"><CalendarDays className="mr-2 h-6 w-6 text-purple-500"/> משימות ויעדים (דמו)</CardTitle>
                <CardDescription>השלם משימות כדי לזכות בבונוסים ותגמולים נוספים.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-72 overflow-y-auto">
                 {mockGoals.filter(g => g.active).map(goal => (
                    <div key={goal.id} className="p-4 border border-purple-500/30 rounded-lg bg-purple-500/10 shadow-sm">
                        <p className="font-semibold text-lg text-purple-700">{goal.name}</p>
                        <div className="flex justify-between items-center text-sm mt-1">
                            <span className="text-muted-foreground">התקדמות: <span className="font-medium text-purple-600">{goal.progress}</span></span>
                            <Badge variant="secondary" className="bg-purple-200 text-purple-800 text-xs">{goal.reward}</Badge>
                        </div>
                    </div>
                ))}
                {mockGoals.filter(g => !g.active).map(goal => (
                    <div key={goal.id} className="p-4 border rounded-lg bg-muted/50 opacity-70 shadow-sm">
                         <p className="font-semibold text-lg text-muted-foreground">{goal.name} (לא פעיל)</p>
                         <div className="flex justify-between items-center text-sm mt-1">
                            <span className="text-muted-foreground">התקדמות: {goal.progress}</span>
                            <Badge variant="outline" className="text-xs">{goal.reward}</Badge>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        <Info className="inline h-3 w-3 mr-1"/>
        נתוני הביצועים וההכנסות המוצגים הם להדגמה בלבד. נתונים אמיתיים ידרשו אינטגרציה עם מערכות השרת.
      </p>
    </div>
  );
}
