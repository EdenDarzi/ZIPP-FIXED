
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet as WalletIcon, DollarSign, TrendingUp, Download, ListChecks, RefreshCcw, FileText, Percent, ShoppingCart, Banknote, ExternalLink, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Wallet, Transaction } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';


const mockBusinessWallet: Wallet = {
  userId: 'restaurant1',
  userType: 'business',
  balance: 1234.56, // After platform fees
  lastUpdatedAt: new Date().toISOString(),
  transactions: [
    { id: 'btx1', date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), description: 'הכנסה מהזמנה #ORD789', amount: 75.50, type: 'order_payment', status: 'completed', relatedOrderId: 'ORD789' },
    { id: 'btx2', date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), description: 'עמלת פלטפורמה - הזמנה #ORD788', amount: -7.80, type: 'fee', status: 'completed', relatedOrderId: 'ORD788' },
    { id: 'btx3', date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), description: 'הכנסה מהזמנה #ORD788', amount: 60.20, type: 'order_payment', status: 'completed', relatedOrderId: 'ORD788' },
    { id: 'btx4', date: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), description: 'משיכה לחשבון בנק', amount: -500.00, type: 'withdrawal', status: 'completed' },
    { id: 'btx5', date: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(), description: 'תשלום עבור קמפיין "מבצעי קיץ"', amount: -50.00, type: 'campaign_payment', status: 'completed', relatedCampaignId: 'SUMMER24' },
  ]
};

const mockDailySalesData = [
  { date: '20/07', sales: 450 }, { date: '21/07', sales: 620 }, { date: '22/07', sales: 550 },
  { date: '23/07', sales: 710 }, { date: '24/07', sales: 680 }, { date: '25/07', sales: 800 }, { date: 'היום', sales: 320 },
];
const chartConfigSales: ChartConfig = { sales: { label: "מכירות (₪)", color: "hsl(var(--primary))" } };


export default function RestaurantWalletPage() {
  const [wallet, setWallet] = useState<Wallet>(mockBusinessWallet);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const { toast } = useToast();

  const totalSalesThisPeriod = wallet.transactions
    .filter(tx => tx.type === 'order_payment' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const platformFeesThisPeriod = wallet.transactions
    .filter(tx => tx.type === 'fee' && tx.status === 'completed')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const handleWithdraw = () => {
    toast({
      title: "משיכת כספים (בקרוב)",
      description: `ניתן יהיה למשוך את היתרה ₪${wallet.balance.toFixed(2)} לחשבון הבנק המקושר. (הדגמה)`,
      duration: 5000,
    });
  };

  const handleGenerateReport = () => {
     toast({
      title: "הפקת דוח (בקרוב)",
      description: "דוח הכנסות והוצאות מפורט יופק ויישלח למייל שלך. (הדגמה)",
    });
  };
  
  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange);
    toast({ title: "סינון תאריכים (דמו)", description: "הנתונים והגרפים יתעדכנו בהתאם לטווח התאריכים הנבחר."});
    // Here you would typically refetch or filter data based on newRange
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <CardTitle className="text-2xl font-headline flex items-center">
                <WalletIcon className="mr-2 h-7 w-7 text-primary" /> הארנק העסקי שלך
                </CardTitle>
                <CardDescription>נתח, חשב, וגדל את ההכנסות דרך הארנק העסקי. נהל תשלומים, עמלות ומשיכות.</CardDescription>
            </div>
             <Button variant="outline" size="sm" onClick={() => { /* Simulate refresh */ toast({title: "מרענן נתונים...", description:"(הדגמה)"})}} className="mt-2 sm:mt-0">
                <RefreshCcw className="mr-2 h-4 w-4"/> רענן נתונים
            </Button>
        </CardHeader>
         <CardContent>
            <p className="text-xs text-muted-foreground text-center sm:text-right">עודכן לאחרונה: {new Date(wallet.lastUpdatedAt).toLocaleString('he-IL')}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="text-center bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-700">יתרה זמינה למשיכה</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">₪{wallet.balance.toFixed(2)}</p>
          </CardContent>
           <CardFooter className="p-3">
            <Button onClick={handleWithdraw} className="w-full" size="sm">
                <Download className="mr-2 h-4 w-4"/> בצע משיכה (בקרוב)
            </Button>
           </CardFooter>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">סה"כ מכירות (תקופה נבחרת)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">₪{totalSalesThisPeriod.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">עמלות פלטפורמה (תקופה)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">₪{platformFeesThisPeriod.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      
       <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/> מכירות יומיות (7 ימים אחרונים - דמו)</CardTitle>
            <CardDescription>בחר טווח תאריכים לניתוח מותאם אישית של מכירות.</CardDescription>
             <div className="pt-2">
                 <DatePickerWithRange onDateChange={handleDateRangeChange} />
             </div>
          </CardHeader>
          <CardContent className="h-[300px] -ml-2 pr-2">
            <ChartContainer config={chartConfigSales} className="h-full w-full">
                <RechartsBarChart data={mockDailySalesData} accessibilityLayer margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                    <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis tickLine={false} tickMargin={10} axisLine={false} unit="₪" width={45}/>
                    <ChartTooltipContent />
                    <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" /> היסטוריית תנועות מפורטת</CardTitle>
           <CardDescription>כל ההכנסות, העמלות, החיובים והמשיכות של העסק שלך.</CardDescription>
        </CardHeader>
        <CardContent>
          {wallet.transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">אין תנועות להצגה.</p>
          ) : (
             <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>תאריך ושעה</TableHead>
                    <TableHead>תיאור</TableHead>
                    <TableHead>הזמנה/קמפיין</TableHead>
                    <TableHead>סוג</TableHead>
                    <TableHead className="text-right">סכום (₪)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallet.transactions.slice(0, 10).map((tx) => ( // Display first 10 for brevity
                    <TableRow key={tx.id}>
                      <TableCell className="text-xs">{new Date(tx.date).toLocaleString('he-IL')}</TableCell>
                      <TableCell className="font-medium text-sm">{tx.description}</TableCell>
                      <TableCell className="text-xs">
                        {tx.relatedOrderId && <Link href={`/restaurant-admin/orders?search=${tx.relatedOrderId}`} className="text-blue-600 hover:underline">#{tx.relatedOrderId.slice(-6)}</Link>}
                        {tx.relatedCampaignId && <Link href={`/restaurant-admin/promotions?search=${tx.relatedCampaignId}`} className="text-purple-600 hover:underline">{tx.relatedCampaignId}</Link>}
                        {!tx.relatedOrderId && !tx.relatedCampaignId && '-'}
                      </TableCell>
                      <TableCell className="text-xs capitalize">{tx.type.replace(/_/g, ' ')}</TableCell>
                      <TableCell className={`text-right font-semibold text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-destructive'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {wallet.transactions.length > 10 && <p className="text-xs text-muted-foreground text-center mt-2">מוצגות 10 התנועות האחרונות.</p>}
        </CardContent>
         <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t pt-4">
            <Button variant="outline" onClick={handleGenerateReport}>
              <FileText className="mr-2 h-4 w-4" /> הפק דוח מפורט (בקרוב)
            </Button>
            <p className="text-xs text-muted-foreground text-center sm:text-right">
                <Info className="inline h-3 w-3 mr-1 text-blue-500"/> אינטגרציה מלאה עם שערי סליקה (Stripe, PayPal, Tranzila) תאפשר תפעול חלק של תשלומים.
            </p>
        </CardFooter>
      </Card>
      
      <Card className="bg-yellow-50 border-yellow-300">
        <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-md text-yellow-700 flex items-center"><ShoppingCart className="mr-2 h-4 w-4"/> ניהול קמפיינים בתשלום</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-yellow-600 space-y-2">
          <p>
            קדם את העסק שלך עם קמפיינים ממומנים ב-LivePick. עקוב אחר הוצאות ותוצאות כאן.
          </p>
           <Button variant="link" size="sm" className="p-0 h-auto text-yellow-700 hover:text-yellow-800" onClick={() => toast({title: "בקרוב!", description:"מערכת ניהול קמפיינים תתווסף."})}>
                צור קמפיין חדש <ExternalLink className="h-3 w-3 mr-1"/>
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}
