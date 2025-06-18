
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { DollarSign, Package, Clock, Star, TrendingUp, Award, CalendarDays, BarChartHorizontalBig, Wallet as WalletIcon, History, Download, AlertCircle } from 'lucide-react'; // Added WalletIcon, History, Download
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast'; 
import type { Wallet, Transaction, TransactionType } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

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

const mockCourierWallet: Wallet = {
    userId: 'courier1',
    userType: 'courier',
    balance: 345.70, // Example balance
    currency: 'ILS',
    transactions: [
        { id: 'ctxn1', type: 'payout', amount: 120.50, description: 'תשלום עבור משלוח #order123', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed'},
        { id: 'ctxn2', type: 'bonus', amount: 25.00, description: 'בונוס השלמת אתגר שבועי', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed'},
        { id: 'ctxn3', type: 'payout', amount: 95.20, description: 'תשלום עבור משלוח #order456', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed'},
        { id: 'ctxn4', type: 'withdrawal', amount: -200.00, description: 'משיכה לחשבון בנק', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending'},
    ],
    lastUpdatedAt: new Date().toISOString(),
};

const getTransactionTypeDisplayCourier = (type: TransactionType): { text: string; icon: React.ElementType; colorClass: string } => {
  switch (type) {
    case 'payout': return { text: 'תשלום משלוח', icon: DollarSign, colorClass: 'text-green-600' };
    case 'bonus': return { text: 'בונוס', icon: Award, colorClass: 'text-yellow-500' };
    case 'withdrawal': return { text: 'משיכה', icon: Download, colorClass: 'text-blue-600' };
    case 'fee': return { text: 'עמלה', icon: AlertCircle, colorClass: 'text-red-600'};
    default: return { text: type, icon: WalletIcon, colorClass: 'text-muted-foreground' };
  }
}


export default function CourierPerformancePage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [totalEarnings, setTotalEarnings] = useState(7850.50);
  const [totalDeliveries, setTotalDeliveries] = useState(235);
  const [avgDeliveryTime, setAvgDeliveryTime] = useState(28); // minutes
  const [avgRating, setAvgRating] = useState(4.7);
  const [courierWallet, setCourierWallet] = useState<Wallet | null>(null);

  const [earningsData, setEarningsData] = useState(mockEarningsDataDefault);
  const [deliveriesData, setDeliveriesData] = useState(mockDeliveriesDataDefault);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching wallet data
    setTimeout(() => setCourierWallet(mockCourierWallet), 600);
  }, []);

  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange);
    
    const randomFactor = newRange?.from && newRange?.to ? (newRange.to.getTime() - newRange.from.getTime()) / (1000*60*60*24*30) + 0.5 : 1;
    
    const newTotalEarnings = parseFloat((Math.random() * 5000 * Math.max(0.2, randomFactor) + 1500).toFixed(2));
    const newTotalDeliveries = Math.floor(Math.random() * 150 * Math.max(0.2, randomFactor) + 40);
    
    setTotalEarnings(newTotalEarnings);
    setTotalDeliveries(newTotalDeliveries);
    setAvgDeliveryTime(Math.floor(Math.random() * 15 + 18)); 
    setAvgRating(parseFloat((Math.random() * 0.8 + 4.0).toFixed(1))); 

    setEarningsData(mockEarningsDataDefault.map(d => ({...d, total: Math.floor((d.total + Math.random() * 500 - 250) * Math.max(0.5, randomFactor * 0.7))})));
    setDeliveriesData(mockDeliveriesDataDefault.map(d => ({...d, deliveries: Math.floor((d.deliveries + Math.random() * 5 - 2) * Math.max(0.5, randomFactor * 0.8))})));
    
    toast({
        title: "נתונים רועננו (דמו)",
        description: "הנתונים והגרפים עודכנו בהתאם לטווח התאריכים שנבחר.",
    });
  };
  
  useEffect(() => {
    handleDateRangeChange(undefined); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWithdrawFunds = () => {
    toast({
        title: "בקשת משיכה נשלחה (דמו)",
        description: "בקשתך למשיכת כספים מהארנק נשלחה לעיבוד. הכספים יועברו לחשבונך תוך 1-3 ימי עסקים.",
    });
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
            <p className="text-xs text-muted-foreground mt-1 text-center">בחר/י טווח תאריכים כדי לסנן נתונים (הנתונים מתרעננים באופן מדומה).</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="text-xl flex items-center"><WalletIcon className="mr-2 h-5 w-5 text-primary"/> ארנק השליח שלי</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {courierWallet ? (
                <>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                        <p className="text-sm text-green-700 font-medium">יתרה נוכחית בארנק</p>
                        <p className="text-4xl font-bold text-green-600">₪{courierWallet.balance.toFixed(2)}</p>
                    </div>
                    <Button onClick={handleWithdrawFunds} className="w-full" variant="outline">
                        <Download className="mr-2 h-4 w-4"/> בקש משיכת כספים
                    </Button>
                    <div>
                        <h4 className="text-md font-semibold mb-2 flex items-center"><History className="mr-2 h-4 w-4 text-muted-foreground"/>תנועות אחרונות בארנק</h4>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>תאריך</TableHead>
                                <TableHead>תיאור</TableHead>
                                <TableHead>סוג</TableHead>
                                <TableHead className="text-right">סכום</TableHead>
                                <TableHead>סטטוס</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courierWallet.transactions.slice(0, 3).map(tx => {
                                    const typeDisplay = getTransactionTypeDisplayCourier(tx.type);
                                    const Icon = typeDisplay.icon;
                                    return (
                                    <TableRow key={tx.id}>
                                        <TableCell className="text-xs">{new Date(tx.date).toLocaleDateString('he-IL')}</TableCell>
                                        <TableCell className="text-xs max-w-[150px] truncate" title={tx.description}>{tx.description}</TableCell>
                                        <TableCell className="text-xs"><Icon className={`inline h-3 w-3 mr-1 ${typeDisplay.colorClass}`} />{typeDisplay.text}</TableCell>
                                        <TableCell className={`text-right font-medium text-xs ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.amount > 0 ? '+' : ''}₪{tx.amount.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={tx.status === 'completed' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'} 
                                                className={`text-xs ${tx.status === 'completed' ? 'bg-green-100 text-green-700' : tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}`}>
                                            {tx.status === 'completed' ? 'הושלם' : tx.status === 'pending' ? 'ממתין' : 'נכשל'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                         {courierWallet.transactions.length > 3 && <Button variant="link" size="sm" className="mt-1 p-0 h-auto text-xs">הצג את כל התנועות</Button>}
                    </div>
                </>
            ) : (
                <p className="text-muted-foreground text-center py-4">טוען נתוני ארנק...</p>
            )}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">הכנסות משולמות בדרך כלל תוך 24-48 שעות מהשלמת המשלוח. משיכות מעובדות תוך 1-3 ימי עסקים.</p>
        </CardFooter>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ הכנסות (בטווח)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">בטווח התאריכים הנבחר</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ משלוחים (בטווח)</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">בטווח התאריכים הנבחר</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">זמן משלוח ממוצע (בטווח)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDeliveryTime} דקות</div>
            <p className="text-xs text-muted-foreground">בטווח התאריכים הנבחר</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">דירוג ממוצע (בטווח)</CardTitle>
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
            <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/> התפלגות הכנסות</CardTitle>
             <CardDescription>הכנסות לפי חודש (דמו, נתונים משתנים עם בחירת תאריכים).</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] -ml-4 pr-2">
            <ChartContainer config={chartConfigEarnings} className="h-full w-full">
                <RechartsBarChart data={earningsData} accessibilityLayer margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
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
            <CardTitle className="flex items-center"><BarChartHorizontalBig className="mr-2 h-5 w-5 text-accent"/> התפלגות משלוחים</CardTitle>
             <CardDescription>מספר משלוחים לפי יום (דמו, נתונים משתנים עם בחירת תאריכים).</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] -ml-4 pr-2">
             <ChartContainer config={chartConfigDeliveries} className="h-full w-full">
                <RechartsLineChart data={deliveriesData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
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
    
    

    