'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet as WalletIcon, DollarSign, Landmark, Activity, History, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Wallet, Transaction } from '@/types';

const getTransactionTypeHebrew = (type: Transaction['type']): string => {
  const map: Record<Transaction['type'], string> = {
    deposit: 'הפקדה',
    withdrawal: 'משיכה',
    purchase: 'רכישה',
    refund: 'זיכוי',
    commission: 'עמלה',
    bonus: 'בונוס',
    fee: 'עמלה',
    order_payment: 'תשלום הזמנה',
    payout: 'תשלום',
    reward: 'פרס',
    COURIER_PAYOUT: 'תשלום לשליח',
    COURIER_BONUS: 'בונוס לשליח',
    campaign_payment: 'תשלום קמפיין'
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
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyEarnings, setDailyEarnings] = useState<number>(0);
  const [weeklyEarnings, setWeeklyEarnings] = useState<number>(0);

  const fetchWalletData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/courier/wallet');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch wallet data');
      }
      const data: Wallet = await response.json();
      setWallet(data);
    } catch (e: any) {
      setError(e.message);
      toast({
        title: "Error fetching earnings data",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  useEffect(() => {
    if (wallet?.transactions) {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();

      let daily = 0;
      let weekly = 0;

      wallet.transactions.forEach((tx) => {
        const txDate = new Date(tx.date).getTime();
        if (tx.amount > 0 && (tx.type === 'commission' || tx.type === 'bonus')) {
          if (txDate >= todayStart) {
            daily += tx.amount;
          }
          if (txDate >= weekStart) {
            weekly += tx.amount;
          }
        }
      });
      setDailyEarnings(daily);
      setWeeklyEarnings(weekly);
    }
  }, [wallet?.transactions]);


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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">טוען נתוני הכנסות...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-destructive">שגיאה בטעינת נתונים</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button onClick={fetchWalletData} className="mt-4">נסה שוב</Button>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return <p>לא נמצא ארנק.</p>;
  }

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
            <p className="text-4xl font-bold text-primary">₪{wallet.balance.toFixed(2)}</p>
          <Button onClick={handleWithdraw} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            <Landmark className="mr-2 h-5 w-5" /> בקש משיכה (בקרוב)
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><DollarSign className="mr-2 h-5 w-5 text-green-600"/>סיכום הכנסות</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between p-3 bg-green-50 border border-green-200 rounded-md">
              <span className="font-medium">היום:</span>
              <span className="font-semibold text-green-700">₪{dailyEarnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-3 bg-green-50 border border-green-200 rounded-md">
              <span className="font-medium">7 ימים אחרונים:</span>
              <span className="font-semibold text-green-700">₪{weeklyEarnings.toFixed(2)}</span>
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
          {wallet.transactions.length === 0 ? (
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
                {wallet.transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-xs">{new Date(tx.date).toLocaleString('he-IL')}</TableCell>
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
            <p className="text-xs text-muted-foreground">מוצגות {wallet.transactions.length} התנועות האחרונות. דוחות מלאים יהיו זמינים להורדה.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
