
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle, CreditCard, Star, Zap, Info, Wallet, DollarSign, TrendingUp, Settings, FileText, BarChart3, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Transaction } from '@/types';

const mockBusinessSubscription = {
  planName: 'תוכנית LivePick Pro לעסקים',
  status: 'פעיל',
  nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('he-IL'),
  price: '₪149.90 לחודש',
};

const mockBusinessTransactions: Transaction[] = [
    { id: 'btx1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), description: 'תשלום עבור הזמנה #LP12345', amount: 75.50, type: 'order_payment', status: 'completed' },
    { id: 'btx2', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), description: 'עמלת LivePick (ינואר)', amount: -250.00, type: 'fee', status: 'completed' },
    { id: 'btx3', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), description: 'משיכה לחשבון בנק', amount: -1200.00, type: 'payout', status: 'completed' },
    { id: 'btx4', date: new Date().toISOString(), description: 'תשלום קמפיין שיווקי (פברואר)', amount: -100.00, type: 'fee', status: 'pending'},
];


export default function RestaurantFinanceWalletPage() {
  const { toast } = useToast();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [pendingPayout, setPendingPayout] = useState<number | null>(null);
  const [lastMonthRevenue, setLastMonthRevenue] = useState<number | null>(null);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
        setWalletBalance(parseFloat((Math.random() * 5000 + 1000).toFixed(2)));
        setPendingPayout(parseFloat((Math.random() * 500).toFixed(2)));
        setLastMonthRevenue(parseFloat((Math.random() * 15000 + 5000).toFixed(2)));
    }, 600);
    return () => clearTimeout(timer);
  }, []);


  const handleRequestPayout = () => {
    toast({
      title: 'בקשת משיכה (הדגמה)',
      description: `בקשת משיכה עבור ₪${walletBalance?.toFixed(2) || '0.00'} נשלחה ותטופל.`,
    });
  };

  const handleManageSubscription = () => {
    toast({
      title: 'ניהול מנוי',
      description: 'יופנה לפורטל חיצוני לניהול פרטי חיוב ושינוי תוכנית. (הדגמה)',
    });
  };
  
  const handleRefreshData = () => {
    setWalletBalance(null);
    setPendingPayout(null);
    setLastMonthRevenue(null);
     toast({ title: 'מרענן נתונים...', description: 'הנתונים הפיננסיים שלך מתעדכנים. (הדגמה)' });
     setTimeout(() => {
        setWalletBalance(parseFloat((Math.random() * 5000 + 1000).toFixed(2)));
        setPendingPayout(parseFloat((Math.random() * 500).toFixed(2)));
        setLastMonthRevenue(parseFloat((Math.random() * 15000 + 5000).toFixed(2)));
        toast({ title: 'נתונים עודכנו!', icon: <CheckCircle className="text-green-500" /> });
    }, 1200);
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle className="text-2xl font-headline flex items-center">
                    <Wallet className="mr-2 h-6 w-6 text-primary" /> כספים וארנק עסקי
                </CardTitle>
                <CardDescription>נהל את התשלומים, ההכנסות, המשיכות ופרטי המנוי של העסק שלך.</CardDescription>
            </div>
             <Button variant="outline" size="icon" onClick={handleRefreshData} title="רענן נתונים">
                <RefreshCw className="h-4 w-4" />
            </Button>
        </CardHeader>
      </Card>
       <p className="text-sm text-center text-muted-foreground">
            <CreditCard className="inline h-4 w-4 mr-1 text-green-500"/>
            עסקים, כל מה שצריך – במקום אחד! נתחו, חשבו, וגדלו את ההכנסות דרך הארנק העסקי.
        </p>


      <Card className="shadow-lg">
        <CardHeader className="bg-primary/10">
          <CardTitle className="text-xl text-primary">ארנק העסק שלך ב-LivePick</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
            <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">יתרה נוכחית למשיכה</p>
                 {walletBalance === null ? (
                    <p className="text-4xl font-bold text-primary animate-pulse">טוען...</p>
                ) : (
                    <p className="text-4xl font-bold text-primary">₪{walletBalance.toFixed(2)}</p>
                )}
            </div>
             <Button onClick={handleRequestPayout} className="w-full" disabled={!walletBalance || walletBalance <=0 }>
                <DollarSign className="mr-2 h-4 w-4"/> בקש משיכה (דמו)
            </Button>
             <div className="flex items-center justify-center text-xs text-muted-foreground mt-2">
                <Info className="h-3 w-3 mr-1 text-blue-500"/> משיכות מעובדות תוך 1-3 ימי עסקים.
            </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-green-500"/> סקירה פיננסית</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="font-medium">סה"כ הכנסות (חודש שעבר):</p>
                {lastMonthRevenue === null ? <span className="animate-pulse">טוען...</span> : <p className="text-xl font-bold text-green-700">₪{lastMonthRevenue.toFixed(2)}</p>}
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="font-medium">תשלומים ממתינים (מהלקוחות):</p>
                 {pendingPayout === null ? <span className="animate-pulse">טוען...</span> : <p className="text-xl font-bold text-yellow-700">₪{pendingPayout.toFixed(2)}</p>}
            </div>
            <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/restaurant-admin/analytics"><BarChart3 className="mr-1 h-4 w-4"/> צפה בדוחות מפורטים</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><FileText className="mr-2 h-5 w-5 text-muted-foreground"/> חשבוניות וקמפיינים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" disabled>
                <FileText className="ml-2 h-4 w-4"/> צור/הצג חשבוניות (בקרוב)
            </Button>
             <Button variant="outline" className="w-full justify-start" disabled>
                <DollarSign className="ml-2 h-4 w-4"/> נהל קמפיינים בתשלום (בקרוב)
            </Button>
             <p className="text-xs text-muted-foreground p-2 bg-blue-50 border border-blue-200 rounded-md">
                <Info className="inline h-3 w-3 mr-1 text-blue-500"/> פירוט עמלות ודמי מנוי LivePick יופיעו בחשבונית החודשית.
            </p>
          </CardContent>
        </Card>
      </div>

        <Card>
        <CardHeader>
            <CardTitle className="text-lg flex items-center"><History className="mr-2 h-5 w-5"/> היסטוריית עסקאות אחרונות בארנק</CardTitle>
            <CardDescription>תשלומים שהתקבלו, עמלות, משיכות והוצאות קמפיינים.</CardDescription>
        </CardHeader>
        <CardContent>
             {mockBusinessTransactions.length === 0 ? (
                 <p className="text-muted-foreground text-center py-4">אין עסקאות להצגה.</p>
            ) : (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>תאריך</TableHead>
                        <TableHead>תיאור</TableHead>
                        <TableHead>סוג</TableHead>
                        <TableHead>סטטוס</TableHead>
                        <TableHead className="text-right">סכום (₪)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockBusinessTransactions.slice(0,3).map(tx => ( // Show first 3 for brevity
                        <TableRow key={tx.id}>
                            <TableCell className="text-xs">{new Date(tx.date).toLocaleDateString('he-IL')}</TableCell>
                            <TableCell className="text-xs">{tx.description}</TableCell>
                            <TableCell className="text-xs capitalize">{tx.type.replace('_', ' ')}</TableCell>
                            <TableCell><Badge variant={tx.status === 'completed' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'} className={tx.status === 'completed' ? 'bg-green-100 text-green-700' : ''}>{tx.status || 'לא ידוע'}</Badge></TableCell>
                            <TableCell className={`text-right font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-destructive'}`}>{tx.amount.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            )}
             {mockBusinessTransactions.length > 3 && (
                <div className="text-center mt-3">
                     <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => toast({description: "הצגת כל היסטוריית העסקאות (בקרוב)."})}>הצג היסטוריה מלאה</Button>
                </div>
            )}
        </CardContent>
      </Card>

      <Separator />
      
      <Card className="shadow-sm">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-md text-foreground/80">פרטי מנוי LivePick לעסקים</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 text-sm space-y-1">
            <p><strong>תוכנית:</strong> {mockBusinessSubscription.planName}</p>
            <p><strong>סטטוס:</strong> <Badge variant={mockBusinessSubscription.status === 'פעיל' ? 'default' : 'destructive'} className={mockBusinessSubscription.status === 'פעיל' ? 'bg-green-100 text-green-700' : ''}>{mockBusinessSubscription.status}</Badge></p>
            <p><strong>חיוב הבא:</strong> {mockBusinessSubscription.nextBillingDate}</p>
            <p><strong>מחיר:</strong> {mockBusinessSubscription.price}</p>
        </CardContent>
        <CardFooter className="border-t pt-3 flex flex-col sm:flex-row gap-2">
          <Button onClick={handleManageSubscription} variant="outline" size="sm" className="flex-1">
            נהל מנוי ופרטי חיוב
          </Button>
           <Button variant="outline" size="sm" className="flex-1" disabled>
            שדרג תוכנית (בקרוב)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
