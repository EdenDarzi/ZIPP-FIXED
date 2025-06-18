
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet as WalletIcon, DollarSign, Landmark, Activity, History, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/types';

const mockTransactions: Transaction[] = [
  { id: 'txn1', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), type: 'COURIER_PAYOUT', amount: 120.50, description: 'תשלום עבור משלוח #abc123', status: 'completed' },
  { id: 'txn2', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), type: 'COURIER_BONUS', amount: 25.00, description: 'בונוס שעות שיא', status: 'completed' },
  { id: 'txn3', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: 'COURIER_PAYOUT', amount: 85.70, description: 'תשלום עבור משלוח #def456', status: 'completed' },
  { id: 'txn4', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), type: 'WITHDRAWAL', amount: -200.00, description: 'משיכה לחשבון בנק', status: 'pending' },
];

const getTransactionTypeHebrew = (type: Transaction['type']): string => {
  const map: Record<Transaction['type'], string> = {
    DEPOSIT: 'הפקדה',
    ORDER_PAYMENT: 'תשלום הזמנה',
    REFUND: 'החזר',
    COURIER_PAYOUT: 'תשלום משלוח',
    COURIER_BONUS: 'בונוס',
    BUSINESS_PAYOUT: 'תשלום לעסק',
    PLATFORM_FEE: 'עמלת פלטפורמה',
    WITHDRAWAL: 'משיכה',
    SUBSCRIPTION_FEE: 'דמי מנוי',
  };
  return map[type] || type;
};

const getTransactionStatusVariant = (status: Transaction['status']): "default" | "secondary" | "outline" | "destructive" => {
  if (status === 'completed') return 'default';
  if (status === 'pending') return 'secondary';
  if (status === 'failed') return 'destructive';
  return 'outline';
}

export default function CourierEarningsPage() {
  const { toast } = useToast();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [dailyEarnings, setDailyEarnings] = useState<number | null>(null);
  const [weeklyEarnings, setWeeklyEarnings] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setWalletBalance(Math.random() * 300 + 50);
      setDailyEarnings(Math.random() * 100 + 20);
      setWeeklyEarnings(Math.random() * 500 + 100);
    }, 600);
  }, []);

  const handleWithdraw = () => {
    toast({
      title: "בקשת משיכה (בקרוב)",
      description: "אפשרות למשיכת כספים לחשבון בנק או ביט תתווסף כאן. התהליך יכלול אימות ואישור.",
    });
  };

  const handleCashPaymentInfo = () => {
     toast({
      title: "קבלת תשלום במזומן",
      description: "במקרים מסוימים ובאזורים נבחרים, תתאפשר קבלת תשלום במזומן מהלקוח. פרטים נוספים יופיעו במשימות משלוח רלוונטיות. (בקרוב)",
      duration: 7000,
    });
  };
  
  const handleDownloadReport = () => {
    toast({
        title: "הורדת דוח (בקרוב)",
        description: "הכנת דוח הכנסות ותשלומים מפורט להורדה (PDF/CSV).",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <WalletIcon className="mr-2 h-6 w-6 text-primary" /> הארנק וההכנסות שלי
          </CardTitle>
          <CardDescription>עקוב אחרי ההכנסות שלך בזמן אמת, נהל משיכות וצפה בהיסטוריית התשלומים שלך.</CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-lg bg-primary/10 border-primary/30">
        <CardHeader>
          <CardTitle className="text-xl text-primary">יתרה נוכחית בארנק</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {walletBalance !== null ? (
            <p className="text-4xl font-bold text-primary">₪{walletBalance.toFixed(2)}</p>
          ) : (
            <p className="text-muted-foreground text-xl">טוען יתרה...</p>
          )}
          <Button onClick={handleWithdraw} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            <Landmark className="mr-2 h-5 w-5" /> בקש משיכה (בקרוב)
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><DollarSign className="mr-2 h-5 w-5 text-green-600"/>סיכום הכנסות (דמו)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between p-3 bg-green-50 border border-green-200 rounded-md">
              <span className="font-medium">היום:</span>
              {dailyEarnings !== null ? <span className="font-semibold text-green-700">₪{dailyEarnings.toFixed(2)}</span> : <span>טוען...</span>}
            </div>
            <div className="flex justify-between p-3 bg-green-50 border border-green-200 rounded-md">
              <span className="font-medium">7 ימים אחרונים:</span>
              {weeklyEarnings !== null ? <span className="font-semibold text-green-700">₪{weeklyEarnings.toFixed(2)}</span> : <span>טוען...</span>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Activity className="mr-2 h-5 w-5 text-blue-600"/>אפשרויות נוספות</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" onClick={handleCashPaymentInfo} className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4"/> מידע על קבלת תשלום במזומן
            </Button>
             <Button variant="outline" onClick={() => toast({title: "בונוסים ועמלות", description: "מידע מפורט על מבנה הבונוסים והעמלות יוצג כאן."})} className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4"/> מבנה בונוסים ועמלות (בקרוב)
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg flex items-center"><History className="mr-2 h-5 w-5"/>היסטוריית תנועות בארנק</CardTitle>
          <Button variant="outline" size="sm" onClick={handleDownloadReport}><Download className="mr-1 h-3 w-3"/>הורד דוח (בקרוב)</Button>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">אין עדיין תנועות להצגה.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>תאריך ושעה</TableHead>
                  <TableHead>סוג תנועה</TableHead>
                  <TableHead>תיאור</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead className="text-right">סכום (₪)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-xs">{new Date(tx.timestamp).toLocaleString('he-IL')}</TableCell>
                    <TableCell>{getTransactionTypeHebrew(tx.type)}</TableCell>
                    <TableCell className="text-xs">{tx.description}</TableCell>
                    <TableCell><Badge variant={getTransactionStatusVariant(tx.status)}>{tx.status}</Badge></TableCell>
                    <TableCell className={`text-right font-medium ${tx.amount >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                      {tx.amount >= 0 ? '+' : ''}₪{tx.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">מוצגות {transactions.length} התנועות האחרונות. דוחות מלאים יהיו זמינים להורדה.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
