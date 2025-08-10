
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard, DollarSign, BarChart3, Settings, TrendingUp, Send, History, AlertCircle, Info, Users, RefreshCw, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Transaction } from '@/types';

const mockCourierSubscription = {
  planName: 'תוכנית LivePick לשליחים',
  status: 'פעיל',
  nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('he-IL'),
  price: '₪29.90 לחודש',
};

const mockTransactions: Transaction[] = [
    { id: 'ctx1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), description: 'עמלת משלוח #LP12345', amount: 12.50, type: 'commission', status: 'completed' },
    { id: 'ctx2', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), description: 'בונוס שעות שיא', amount: 20.00, type: 'bonus', status: 'completed' },
    { id: 'ctx3', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), description: 'משיכה לחשבון בנק', amount: -150.00, type: 'withdrawal', status: 'completed' },
    { id: 'ctx4', date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), description: 'עמלת משלוח #LP67890', amount: 8.75, type: 'commission', status: 'pending' },
];


export default function CourierEarningsWalletPage() {
  const { toast } = useToast();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [dailyEarnings, setDailyEarnings] = useState<number | null>(null);
  const [weeklyEarnings, setWeeklyEarnings] = useState<number | null>(null);
  const [acceptCash, setAcceptCash] = useState(false);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
        setWalletBalance(parseFloat((Math.random() * 300 + 50).toFixed(2)));
        setDailyEarnings(parseFloat((Math.random() * 100 + 20).toFixed(2)));
        setWeeklyEarnings(parseFloat((Math.random() * 500 + 100).toFixed(2)));
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleWithdraw = (method: string) => {
    toast({
      title: `בקשת משיכה (${method})`,
      description: `בקשת משיכה בסך ₪${walletBalance?.toFixed(2) || '0.00'} נשלחה ותעובד. (הדגמה של תהליך)`,
    });
  };

  const handleManageSubscriptionPayment = () => {
    toast({
      title: 'ניהול פרטי תשלום למנוי',
      description: 'יופנה לפורטל תשלומים לעדכון אמצעי חיוב עבור המנוי. (הדגמה)',
    });
  };

  const handleToggleAcceptCash = () => {
    setAcceptCash(!acceptCash);
    toast({
        title: `קבלת מזומן ${!acceptCash ? 'הופעלה' : 'כובתה'}`,
        description: !acceptCash ? 'כעת תוכל לקבל הצעות הכוללות תשלום במזומן.' : 'אינך מקבל יותר הצעות עם תשלום במזומן.',
    });
  };
  
  const handleRefreshData = () => {
    setWalletBalance(null);
    setDailyEarnings(null);
    setWeeklyEarnings(null);
     toast({ title: 'מרענן נתונים...', description: 'הנתונים הפיננסיים שלך מתעדכנים. (הדגמה)' });
     setTimeout(() => {
        setWalletBalance(parseFloat((Math.random() * 300 + 50).toFixed(2)));
        setDailyEarnings(parseFloat((Math.random() * 100 + 20).toFixed(2)));
        setWeeklyEarnings(parseFloat((Math.random() * 500 + 100).toFixed(2)));
        toast({ title: 'נתונים עודכנו!', description: 'כל הנתונים הפיננסיים עודכנו בהצלחה' });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle className="text-2xl font-headline flex items-center">
                    <Wallet className="mr-2 h-6 w-6 text-primary" /> הכנסות וארנק
                </CardTitle>
                <CardDescription>עקוב אחר ההכנסות, נהל משיכות וצפה בפרטי המנוי שלך.</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleRefreshData} title="רענן נתונים">
                <RefreshCw className="h-4 w-4" />
            </Button>
        </CardHeader>
      </Card>
        <p className="text-sm text-center text-muted-foreground">
            <Users className="inline h-4 w-4 mr-1 text-blue-500"/>
            שליחים, כאן תנהלו את כל הפעילות הפיננסית שלכם ב-LivePick!
        </p>

      <Card className="shadow-lg">
        <CardHeader className="bg-primary/10">
          <CardTitle className="text-xl text-primary">ארנק השליח שלך</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
            <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">יתרה נוכחית בארנק</p>
                {walletBalance === null ? (
                    <p className="text-4xl font-bold text-primary animate-pulse">טוען...</p>
                ) : (
                    <p className="text-4xl font-bold text-primary">₪{walletBalance.toFixed(2)}</p>
                )}
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button onClick={() => handleWithdraw('העברה בנקאית')} className="w-full" disabled={!walletBalance || walletBalance <= 0}>
                    <Send className="mr-2 h-4 w-4"/> משיכה לבנק (דמו)
                </Button>
                <Button onClick={() => handleWithdraw('Bit')} variant="outline" className="w-full" disabled={!walletBalance || walletBalance <= 0}>
                    <Send className="mr-2 h-4 w-4"/> משיכה ל-Bit (דמו)
                </Button>
            </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-green-500"/> סיכום הכנסות</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="font-medium">הכנסות היום:</p>
                {dailyEarnings === null ? <span className="animate-pulse">טוען...</span> : <p className="text-xl font-bold text-green-700">₪{dailyEarnings.toFixed(2)}</p>}
             </div>
             <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="font-medium">הכנסות השבוע:</p>
                {weeklyEarnings === null ? <span className="animate-pulse">טוען...</span> : <p className="text-xl font-bold text-blue-700">₪{weeklyEarnings.toFixed(2)}</p>}
             </div>
            <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/courier/performance"><BarChart3 className="mr-1 h-4 w-4"/> צפה בדוח ביצועים מפורט</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Settings className="mr-2 h-5 w-5 text-muted-foreground"/> הגדרות נוספות</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="acceptCashToggle" className="text-sm font-medium">אפשר קבלת תשלום במזומן</Label>
                <Button 
                    variant={acceptCash ? "default" : "outline"} 
                    size="sm" 
                    onClick={handleToggleAcceptCash}
                    className={acceptCash ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                    id="acceptCashToggle"
                >
                    {acceptCash ? "מופעל" : "כבוי"}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                <AlertCircle className="inline h-3 w-3 mr-1 text-yellow-600"/> זכור: קבלת מזומן באחריותך. LivePick אינה אחראית להפרשים או בעיות גבייה.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle className="text-lg flex items-center"><History className="mr-2 h-5 w-5"/> היסטוריית עסקאות אחרונות</CardTitle>
            <CardDescription>עסקאות, בונוסים, עמלות ומשיכות מהארנק שלך.</CardDescription>
        </CardHeader>
        <CardContent>
            {mockTransactions.length === 0 ? (
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
                    {mockTransactions.slice(0,3).map(tx => ( // Show first 3 for brevity
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
             {mockTransactions.length > 3 && (
                <div className="text-center mt-3">
                     <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => toast({description: "הצגת כל היסטוריית העסקאות (בקרוב)."})}>הצג היסטוריה מלאה</Button>
                </div>
            )}
        </CardContent>
      </Card>

      <Separator />

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-md text-foreground/80">פרטי מנוי LivePick לשליחים</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 text-sm space-y-1">
            <p><strong>תוכנית:</strong> {mockCourierSubscription.planName}</p>
            <p><strong>סטטוס:</strong> <Badge variant={mockCourierSubscription.status === 'פעיל' ? 'default' : 'destructive'} className={mockCourierSubscription.status === 'פעיל' ? 'bg-green-100 text-green-700' : ''}>{mockCourierSubscription.status}</Badge></p>
            <p><strong>חיוב הבא:</strong> {mockCourierSubscription.nextBillingDate}</p>
            <p><strong>מחיר:</strong> {mockCourierSubscription.price}</p>
        </CardContent>
        <CardFooter className="border-t pt-3">
          <Button onClick={handleManageSubscriptionPayment} variant="outline" size="sm">
            נהל פרטי תשלום למנוי
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
