
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, Utensils, Star, TrendingUp, Clock, Lightbulb, Activity, Wallet as WalletIcon, History, FileText, BarChart3, Percent, Filter, AlertTriangle, PieChart as PieChartIcon } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { Wallet, Transaction, TransactionType } from '@/types';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from "react-day-picker";
import { Info, Loader2 } from 'lucide-react';

const mockDailySalesDataDefault = [
  { date: 'א\'', sales: 4000 }, { date: 'ב\'', sales: 3000 }, { date: 'ג\'', sales: 2000 },
  { date: 'ד\'', sales: 2780 }, { date: 'ה\'', sales: 1890 }, { date: 'ו\'', sales: 2390 }, { date: 'שבת', sales: 3490 },
];
const chartConfigSales: ChartConfig = { מכירות: { label: "מכירות (₪)", color: "hsl(var(--primary))" } };


const popularItemsDataDefault = [
  { name: 'מוצר א', sold: 400, fill: "hsl(var(--chart-1))" }, { name: 'מוצר ב', sold: 300, fill: "hsl(var(--chart-2))" },
  { name: 'שירות ג', sold: 300, fill: "hsl(var(--chart-3))" }, { name: 'מוצר ד', sold: 200, fill: "hsl(var(--chart-4))" },
];
const chartConfigItems: ChartConfig = {
  itemA: { label: "מוצר א", color: "hsl(var(--chart-1))" },
  itemB: { label: "מוצר ב", color: "hsl(var(--chart-2))" },
  serviceC: { label: "שירות ג", color: "hsl(var(--chart-3))" },
  itemD: { label: "מוצר ד", color: "hsl(var(--chart-4))" },
}

const customerFeedbackDataDefault = [
  { name: '5 כוכבים', value: 120, fill: "hsl(var(--chart-1))" }, { name: '4 כוכבים', value: 80, fill: "hsl(var(--chart-2))" },
  { name: '3 כוכבים', value: 30, fill: "hsl(var(--chart-3))" }, { name: '2 כוכבים', value: 10, fill: "hsl(var(--chart-4))" }, { name: 'כוכב 1', value: 5, fill: "hsl(var(--chart-5))" },
];

const mockBusinessWalletData: Wallet = {
    userId: 'business1',
    userType: 'business',
    balance: 10250.75, 
    currency: 'ILS',
    transactions: [
        { id: 'btxn1', type: 'order_payment', amount: 75.50, description: 'תשלום מהזמנה #orderClient1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', relatedUserId: 'client1'},
        { id: 'btxn2', type: 'fee', amount: -7.55, description: 'עמלת פלטפורמה (10%)', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', relatedOrderId: 'orderClient1'},
        { id: 'btxn3', type: 'order_payment', amount: 120.00, description: 'תשלום מהזמנה #orderClient2', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', relatedUserId: 'client2'},
        { id: 'btxn4', type: 'fee', amount: -12.00, description: 'עמלת פלטפורמה (10%)', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', relatedOrderId: 'orderClient2'},
        { id: 'btxn5', type: 'fee', amount: -100.00, description: 'חיוב קמפיין "מבצעי קיץ"', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', relatedCampaignId: 'SUMMER_SALE'},
    ],
    lastUpdatedAt: new Date().toISOString(),
};

const getTransactionTypeDisplayBusiness = (type: TransactionType): { text: string; icon: React.ElementType; colorClass: string } => {
  switch (type) {
    case 'order_payment': return { text: 'קבלת תשלום', icon: DollarSign, colorClass: 'text-green-600' };
    case 'fee': return { text: 'עמלת פלטפורמה/קמפיין', icon: Percent, colorClass: 'text-red-600' };
    case 'withdrawal': return { text: 'משיכה', icon: FileText, colorClass: 'text-blue-600'};
    default: return { text: type, icon: WalletIcon, colorClass: 'text-muted-foreground' };
  }
}


export default function AnalyticsPage() {
  const [businessWallet, setBusinessWallet] = useState<Wallet | null>(null);
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [avgOrderValue, setAvgOrderValue] = useState<number | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [dailySalesData, setDailySalesData] = useState(mockDailySalesDataDefault);
  const [popularItemsData, setPopularItemsData] = useState(popularItemsDataDefault);
  const [customerFeedbackData, setCustomerFeedbackData] = useState(customerFeedbackDataDefault);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const loadingTimer = setTimeout(() => { // Ensure loading state is visible for a bit
        setBusinessWallet(mockBusinessWalletData);
        const factor = dateRange?.from && dateRange?.to ? (dateRange.to.getTime() - dateRange.from.getTime()) / (1000*60*60*24*7) + 0.5 : 1;
        setTotalRevenue(parseFloat(((Math.random() * 8000 + 4000)*factor).toFixed(2)));
        setTotalOrders(Math.floor((Math.random() * 200 + 100)*factor));
        setAvgOrderValue(parseFloat(((Math.random() * 30 + 20)*factor).toFixed(2)));
        setAvgRating(parseFloat((4.2 + Math.random() * 0.8).toFixed(1)));
        
        setDailySalesData(mockDailySalesDataDefault.map(d => ({...d, sales: Math.floor(d.sales * (0.8 + Math.random()*0.4) * factor)})));
        setPopularItemsData(popularItemsDataDefault.map(d => ({...d, sold: Math.floor(d.sold * (0.8 + Math.random()*0.4) * factor)})));
        setIsLoading(false);
    }, 800);
    return () => clearTimeout(loadingTimer);
  }, [dateRange]);


  const handleGenerateInvoice = () => {
    toast({
        title: "הפקת דוח/חשבונית (דמו)",
        description: "דוח עבור התקופה הנבחרת 'נוצר' ויהיה זמין להורדה או יישלח למייל הרשום. (הדגמה)",
    });
  };

  const handleRequestPayout = () => {
    toast({
        title: "בקשת משיכת כספים (דמו)",
        description: "בקשתך למשיכת כספים מהארנק העסקי נשלחה. הכספים יועברו לחשבונך תוך 3-5 ימי עסקים.",
    });
  };


  return (
    <div className="space-y-8">
      <Card className="premium-card-hover">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <CardTitle className="text-2xl md:text-3xl font-headline">ניתוחים וביצועים</CardTitle>
                <CardDescription>עקוב אחר מדדי המפתח וביצועי העסק שלך. קבל תובנות AI לשיפור.</CardDescription>
            </div>
            <div className="mt-3 sm:mt-0 w-full sm:w-auto">
                <DatePickerWithRange onDateChange={setDateRange} />
            </div>
        </CardHeader>
      </Card>

       <Card className="premium-card-hover">
        <CardHeader>
            <CardTitle className="text-xl flex items-center"><WalletIcon className="mr-2 h-6 w-6 text-primary"/> הארנק העסקי שלי</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            {isLoading || !businessWallet ? (
                <div className="flex justify-center items-center py-8"> <Loader2 className="h-8 w-8 animate-spin text-primary"/> <p className="mr-2">טוען נתוני ארנק...</p></div>
            ) : (
                <>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center shadow-md">
                        <p className="text-sm text-blue-700 font-medium">יתרה נוכחית זמינה למשיכה</p>
                        <p className="text-4xl font-bold text-blue-600">₪{businessWallet.balance.toFixed(2)}</p>
                        <p className="text-xs text-blue-500">עדכון אחרון: {new Date(businessWallet.lastUpdatedAt).toLocaleTimeString('he-IL')}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button onClick={handleRequestPayout} variant="outline" size="lg" className="hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-700">
                            <DollarSign className="mr-2 h-5 w-5"/> בקש משיכת כספים
                        </Button>
                        <Button onClick={handleGenerateInvoice} variant="outline" size="lg" className="hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-700">
                            <FileText className="mr-2 h-5 w-5"/> הפק דוח/חשבונית
                        </Button>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-2 flex items-center"><History className="mr-2 h-5 w-5 text-muted-foreground"/>תנועות אחרונות בארנק (דמו)</h4>
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
                                {businessWallet.transactions.slice(0, 3).map(tx => {
                                    const typeDisplay = getTransactionTypeDisplayBusiness(tx.type);
                                    const Icon = typeDisplay.icon;
                                    return (
                                    <TableRow key={tx.id}>
                                        <TableCell className="text-xs">{new Date(tx.date).toLocaleDateString('he-IL')}</TableCell>
                                        <TableCell className="text-sm max-w-[150px] truncate" title={tx.description}>{tx.description}</TableCell>
                                        <TableCell className="text-xs"><Icon className={`inline h-3.5 w-3.5 mr-1 ${typeDisplay.colorClass}`} />{typeDisplay.text}</TableCell>
                                        <TableCell className={`text-right font-medium text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
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
                        {businessWallet.transactions.length > 3 && <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-xs text-primary hover:text-accent">הצג את כל התנועות</Button>}
                    </div>
                </>
            )}
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">ההכנסות מהזמנות (בניכוי עמלות) מועברות לארנק העסק. ניתן למשוך כספים בהתאם לתנאי השירות.</p>
        </CardFooter>
      </Card>


      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ הכנסות (בטווח)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || totalRevenue === null ? <Loader2 className="h-6 w-6 animate-spin text-primary"/> : <div className="text-2xl font-bold">₪{totalRevenue.toFixed(2)}</div>}
            <p className="text-xs text-muted-foreground">+5.2% מהתקופה הקודמת (דמו)</p>
          </CardContent>
        </Card>
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ הזמנות (בטווח)</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || totalOrders === null ? <Loader2 className="h-6 w-6 animate-spin text-primary"/> : <div className="text-2xl font-bold">{totalOrders}</div>}
            <p className="text-xs text-muted-foreground">+12 הזמנות מהתקופה הקודמת (דמו)</p>
          </CardContent>
        </Card>
         <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">שווי הזמנה ממוצע (בטווח)</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || avgOrderValue === null ? <Loader2 className="h-6 w-6 animate-spin text-primary"/> : <div className="text-2xl font-bold">₪{avgOrderValue.toFixed(2)}</div>}
            <p className="text-xs text-muted-foreground">+₪1.50 מהתקופה הקודמת (דמו)</p>
          </CardContent>
        </Card>
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">דירוג לקוחות ממוצע</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || avgRating === null ? <Loader2 className="h-6 w-6 animate-spin text-primary"/> : <div className="text-2xl font-bold">{avgRating.toFixed(1)} <span className="text-sm text-muted-foreground">/ 5</span></div>}
            <p className="text-xs text-muted-foreground">מבוסס על 150+ ביקורות</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="premium-card-hover">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/> סקירת מכירות (שבוע נוכחי - דמו)</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] -ml-2 pr-2"> 
             {isLoading ? <div className="flex h-full justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div> : (
                <ChartContainer config={chartConfigSales} className="h-full w-full">
                    <RechartsBarChart data={dailySalesData} accessibilityLayer margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis tickLine={false} tickMargin={10} axisLine={false} unit="₪" width={55} />
                        <ChartTooltipContent />
                        <Bar dataKey="sales" fill="var(--color-מכירות)" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                </ChartContainer>
             )}
          </CardContent>
        </Card>

        <Card className="premium-card-hover">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><PieChartIcon className="mr-2 h-5 w-5 text-accent"/> מוצרים/שירותים פופולריים (דמו)</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
             {isLoading ? <div className="flex h-full justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-accent"/></div> : (
                 <ChartContainer config={chartConfigItems} className="mx-auto aspect-square h-full max-h-[300px]">
                    <RechartsPieChart>
                        <ChartTooltipContent nameKey="name" hideLabel />
                        <Pie data={popularItemsData} dataKey="sold" nameKey="name" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} 
                             paddingAngle={2} innerRadius="50%" outerRadius="80%">
                             {popularItemsData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill} stroke={entry.fill} />
                            ))}
                        </Pie>
                        <Legend content={({ payload }) => (
                            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs mt-3">
                            {payload?.map((entry: any) => (
                                <div key={entry.value} className="flex items-center gap-1.5">
                                <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                {entry.value}
                                </div>
                            ))}
                            </div>
                        )} />
                    </RechartsPieChart>
                </ChartContainer>
             )}
          </CardContent>
        </Card>
      </div>

       <Card className="premium-card-hover">
        <CardHeader>
            <CardTitle className="text-xl flex items-center"><Clock className="mr-2 h-5 w-5 text-orange-500"/> מגמות זמן טיפול ממוצע (דמו)</CardTitle>
            <CardDescription>נתוני דמה המציגים מגמות בזמן הכנה/טיפול בהזמנה.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] -ml-2 pr-2">
           {isLoading ? <div className="flex h-full justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-orange-500"/></div> : (
            <ChartContainer config={{ processTime: { label: "זמן טיפול ממוצע (דק')", color: "hsl(var(--accent))" } }} className="h-full w-full">
                <RechartsLineChart data={[{day: "א", processTime: 15}, {day: "ב", processTime: 12}, {day: "ג", processTime: 14}, {day: "ד", processTime: 13}, {day: "ה", processTime: 16}, {day: "ו", processTime: 18}, {day: "ש", processTime: 17}]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis unit=" דק'" width={50}/>
                    <ChartTooltipContent />
                    <Legend />
                    <Line type="monotone" dataKey="processTime" stroke="var(--color-processTime)" strokeWidth={3} dot={{r: 5, fill: "var(--color-processTime)"}} activeDot={{r:7}}/>
                </RechartsLineChart>
            </ChartContainer>
           )}
        </CardContent>
       </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-blue-500/10 border-blue-500/20 premium-card-hover">
          <CardHeader>
            <CardTitle className="text-lg text-blue-700 flex items-center"><Lightbulb className="mr-2 h-5 w-5" /> תובנת AI: שעות שיא צפויות</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-600">המערכת צופה עומס גבוה בימי חמישי בערב ובשבת בצהריים. שקול תגבור צוות/שליחים או מבצע ייעודי לשעות פחות עמוסות.</p>
            <p className="text-xs text-blue-500 mt-2">(תכונה בפיתוח - נתונים מדומים)</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/20 premium-card-hover">
          <CardHeader>
            <CardTitle className="text-lg text-green-700 flex items-center"><Activity className="mr-2 h-5 w-5" /> תובנת AI: טרנד עונתי</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-600">זוהתה עלייה בחיפוש משקאות קרים וגלידות באזורך. שקול לקדם מוצרים אלו או להוסיף חדשים לתפריט לתקופה הקרובה.</p>
            <p className="text-xs text-green-500 mt-2">(תכונה בפיתוח - נתונים מדומים)</p>
          </CardContent>
        </Card>
         <Card className="bg-orange-500/10 border-orange-500/20 premium-card-hover">
          <CardHeader>
            <CardTitle className="text-lg text-orange-700 flex items-center"><Filter className="mr-2 h-5 w-5" /> תובנת AI: שיפור המרות</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-600">לקוחות שרכשו "מוצר א" נטו לרכוש גם "מוצר נלווה ז". שקול להציע אותם כחבילה (Bundle) בהנחה קלה.</p>
            <p className="text-xs text-orange-500 mt-2">(תכונה בפיתוח - נתונים מדומים)</p>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        <Info className="inline h-3 w-3 mr-1"/>
        ניתוחים מתקדמים ודוחות מותאמים אישית ידרשו עיבוד נתונים נוסף ואינטגרציה בצד השרת.
      </p>
    </div>
  );
}
