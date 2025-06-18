
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, Users, DollarSign, Utensils, Star, TrendingUp, Clock, Lightbulb, Activity, Wallet as WalletIcon, History, FileText } from 'lucide-react'; // Added WalletIcon, History, FileText
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { Wallet, Transaction, TransactionType } from '@/types';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const dailySalesData = [
  { date: 'יום א', sales: 4000 }, { date: 'יום ב', sales: 3000 }, { date: 'יום ג', sales: 2000 },
  { date: 'יום ד', sales: 2780 }, { date: 'יום ה', sales: 1890 }, { date: 'יום ו', sales: 2390 }, { date: 'שבת', sales: 3490 },
];
const chartConfigSales: ChartConfig = { מכירות: { label: "מכירות (₪)", color: "hsl(var(--primary))" } };


const popularItemsData = [
  { name: 'מוצר א', sold: 400, fill: "hsl(var(--chart-1))" }, { name: 'מוצר ב', sold: 300, fill: "hsl(var(--chart-2))" },
  { name: 'שירות ג', sold: 300, fill: "hsl(var(--chart-3))" }, { name: 'מוצר ד', sold: 200, fill: "hsl(var(--chart-4))" },
];
const chartConfigItems: ChartConfig = {
  itemA: { label: "מוצר א", color: "hsl(var(--chart-1))" },
  itemB: { label: "מוצר ב", color: "hsl(var(--chart-2))" },
  serviceC: { label: "שירות ג", color: "hsl(var(--chart-3))" },
  itemD: { label: "מוצר ד", color: "hsl(var(--chart-4))" },
}

const customerFeedbackData = [
  { name: '5 כוכבים', value: 120, fill: "hsl(var(--chart-1))" }, { name: '4 כוכבים', value: 80, fill: "hsl(var(--chart-2))" },
  { name: '3 כוכבים', value: 30, fill: "hsl(var(--chart-3))" }, { name: '2 כוכבים', value: 10, fill: "hsl(var(--chart-4))" }, { name: 'כוכב 1', value: 5, fill: "hsl(var(--chart-5))" },
];

const mockBusinessWallet: Wallet = {
    userId: 'business1',
    userType: 'business',
    balance: 10250.75, 
    currency: 'ILS',
    transactions: [
        { id: 'btxn1', type: 'payment', amount: 75.50, description: 'תשלום מהזמנה #orderClient1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', relatedUserId: 'client1'},
        { id: 'btxn2', type: 'fee', amount: -7.55, description: 'עמלת פלטפורמה (10%)', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', relatedOrderId: 'orderClient1'},
        { id: 'btxn3', type: 'payment', amount: 120.00, description: 'תשלום מהזמנה #orderClient2', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', relatedUserId: 'client2'},
        { id: 'btxn4', type: 'fee', amount: -12.00, description: 'עמלת פלטפורמה (10%)', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', relatedOrderId: 'orderClient2'},
        { id: 'btxn5', type: 'charge', amount: -100.00, description: 'חיוב קמפיין "מבצעי קיץ"', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed'},
    ],
    lastUpdatedAt: new Date().toISOString(),
};

const getTransactionTypeDisplayBusiness = (type: TransactionType): { text: string; icon: React.ElementType; colorClass: string } => {
  switch (type) {
    case 'payment': return { text: 'קבלת תשלום', icon: DollarSign, colorClass: 'text-green-600' };
    case 'fee': return { text: 'עמלת פלטפורמה', icon: Percent, colorClass: 'text-red-600' }; // Assuming Percent icon exists or use another
    case 'charge': return { text: 'חיוב קמפיין', icon: TrendingUp, colorClass: 'text-orange-600' };
    case 'payout': return { text: 'משיכה', icon: FileText, colorClass: 'text-blue-600'};
    default: return { text: type, icon: WalletIcon, colorClass: 'text-muted-foreground' };
  }
}


export default function AnalyticsPage() {
  const [businessWallet, setBusinessWallet] = useState<Wallet | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching wallet data
    setTimeout(() => setBusinessWallet(mockBusinessWallet), 700);
  }, []);

  const handleGenerateInvoice = () => {
    toast({
        title: "הפקת חשבונית/קבלה (דמו)",
        description: "חשבונית/קבלה עבור התקופה הנבחרת 'נוצרה' ותישלח למייל הרשום. אינטגרציה עם מערכת חשבונאות תתווסף.",
    });
  };

  const handleRequestPayout = () => {
    toast({
        title: "בקשת משיכת כספים (דמו)",
        description: "בקשתך למשיכת כספים מהארנק העסקי נשלחה. הכספים יועברו לחשבונך תוך 3-5 ימי עסקים.",
    });
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">ניתוחים וביצועים</CardTitle>
          <CardDescription>עקוב אחר מדדי המפתח וביצועי העסק שלך. קבל תובנות AI לשיפור.</CardDescription>
        </CardHeader>
      </Card>

       <Card>
        <CardHeader>
            <CardTitle className="text-xl flex items-center"><WalletIcon className="mr-2 h-5 w-5 text-primary"/> ארנק העסק שלי</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {businessWallet ? (
                <>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                        <p className="text-sm text-blue-700 font-medium">יתרה נוכחית זמינה למשיכה</p>
                        <p className="text-4xl font-bold text-blue-600">₪{businessWallet.balance.toFixed(2)}</p>
                        <p className="text-xs text-blue-500">עדכון אחרון: {new Date(businessWallet.lastUpdatedAt).toLocaleTimeString('he-IL')}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button onClick={handleRequestPayout} variant="outline">
                            <DollarSign className="mr-2 h-4 w-4"/> בקש משיכת כספים
                        </Button>
                        <Button onClick={handleGenerateInvoice} variant="outline">
                            <FileText className="mr-2 h-4 w-4"/> הפק דוח/חשבונית
                        </Button>
                    </div>
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
                                {businessWallet.transactions.slice(0, 3).map(tx => {
                                    const typeDisplay = getTransactionTypeDisplayBusiness(tx.type);
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
                        {businessWallet.transactions.length > 3 && <Button variant="link" size="sm" className="mt-1 p-0 h-auto text-xs">הצג את כל התנועות</Button>}
                    </div>
                </>
            ) : (
                <p className="text-muted-foreground text-center py-4">טוען נתוני ארנק...</p>
            )}
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">ההכנסות מהזמנות (בניכוי עמלות) מועברות לארנק העסק. ניתן למשוך כספים בהתאם לתנאי השירות.</p>
        </CardFooter>
      </Card>


      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ הכנסות (30 ימים אחרונים)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪12,345.67</div>
            <p className="text-xs text-muted-foreground">+5.2% מהחודש שעבר</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ הזמנות (30 ימים אחרונים)</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+12 הזמנות מהחודש שעבר</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">דירוג ממוצע</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6 <span className="text-sm text-muted-foreground">/ 5</span></div>
            <p className="text-xs text-muted-foreground">מבוסס על 150 ביקורות</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/> סקירת מכירות (7 ימים אחרונים)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] -ml-2">
            <ChartContainer config={chartConfigSales} className="h-full w-full">
                <RechartsBarChart data={dailySalesData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis tickLine={false} tickMargin={10} axisLine={false} unit="₪" />
                    <ChartTooltipContent />
                    <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><PieChart className="mr-2 h-5 w-5 text-primary"/> מוצרים/שירותים פופולריים (יחידות שנמכרו)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
             <ChartContainer config={chartConfigItems} className="mx-auto aspect-square h-full">
                <RechartsPieChart>
                    <ChartTooltipContent nameKey="name" hideLabel />
                    <Pie data={popularItemsData} dataKey="sold" nameKey="name" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                         {popularItemsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </RechartsPieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="flex items-center"><Clock className="mr-2 h-5 w-5 text-primary"/> מגמות זמן טיפול ממוצע</CardTitle>
            <CardDescription>נתוני דמה המציגים מגמות בזמן הכנה/טיפול.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] -ml-2">
            <ChartContainer config={{ processTime: { label: "זמן טיפול ממוצע (דק')", color: "hsl(var(--accent))" } }} className="h-full w-full">
                <RechartsLineChart data={[{day: "א", processTime: 15}, {day: "ב", processTime: 12}, {day: "ג", processTime: 14}, {day: "ד", processTime: 13}, {day: "ה", processTime: 16}, {day: "ו", processTime: 18}, {day: "ש", processTime: 17}]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis unit=" דק'"/>
                    <ChartTooltipContent />
                    <Legend />
                    <Line type="monotone" dataKey="processTime" stroke="var(--color-processTime)" strokeWidth={2} dot={{r: 4, fill: "var(--color-processTime)"}} activeDot={{r:6}}/>
                </RechartsLineChart>
            </ChartContainer>
        </CardContent>
       </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-700 flex items-center"><Lightbulb className="mr-2 h-5 w-5" /> תובנת AI: שעות שיא צפויות</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-600">המערכת צופה עומס גבוה בימי חמישי בערב ובשבת בצהריים. שקול תגבור צוות/שליחים.</p>
            <p className="text-xs text-blue-500 mt-2">(תכונה בפיתוח - נתונים מדומים)</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg text-green-700 flex items-center"><Activity className="mr-2 h-5 w-5" /> תובנת AI: טרנד עונתי</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-600">זוהתה עלייה בחיפוש משקאות קרים וגלידות. שקול לקדם מוצרים אלו או להוסיף חדשים.</p>
            <p className="text-xs text-green-500 mt-2">(תכונה בפיתוח - נתונים מדומים)</p>
          </CardContent>
        </Card>
         <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-lg text-orange-700 flex items-center"><DollarSign className="mr-2 h-5 w-5" /> תובנת AI: אופטימיזציית רווחיות</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-600">שקול להציע "ארוחה עסקית" בשעות הצהריים (12-15) כדי להגדיל ממוצע הזמנה.</p>
            <p className="text-xs text-orange-500 mt-2">(תכונה בפיתוח - נתונים מדומים)</p>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        ניתוחים מתקדמים ודוחות מותאמים אישית ידרשו עיבוד נתונים נוסף ואינטגרציה בצד השרת.
      </p>
    </div>
  );
}

    