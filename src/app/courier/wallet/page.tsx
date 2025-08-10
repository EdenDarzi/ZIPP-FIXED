'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet as WalletIcon, DollarSign, TrendingUp, Download, ListChecks, RefreshCcw, Banknote, CreditCardIcon, Smartphone, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Wallet, Transaction } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export default function CourierWalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyEarnings, setDailyEarnings] = useState<number>(0);
  const [weeklyEarnings, setWeeklyEarnings] = useState<number>(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank');
  const { toast } = useToast();

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
        title: "Error fetching wallet",
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

      wallet.transactions.forEach((tx: Transaction) => {
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
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "סכום לא תקין", description: "אנא הזן סכום חיובי למשיכה.", variant: "destructive" });
      return;
    }
    if (!wallet || amount > wallet.balance) {
      toast({ title: "יתרה לא מספקת", description: `אין לך מספיק כסף בארנק למשיכה זו. יתרה: ₪${wallet?.balance.toFixed(2)}`, variant: "destructive" });
      return;
    }
    toast({
      title: "בקשת משיכה נשלחה (דמו)",
      description: `בקשה למשיכת ₪${amount.toFixed(2)} באמצעות ${withdrawalMethod === 'bank' ? 'העברה בנקאית' : 'Bit'} נשלחה. הכסף יועבר תוך 1-3 ימי עסקים.`,
      duration: 7000,
    });
    // In a real app, this would trigger a backend process.
    // For now, we optimistically update the UI.
    setWallet((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        balance: prev.balance - amount,
        transactions: [
          {
            id: `wtx-${Date.now()}`,
            date: new Date().toISOString(),
            description: `משיכה ל${withdrawalMethod}`,
            amount: -amount,
            type: 'withdrawal',
            status: 'pending'
          },
          ...prev.transactions
        ]
      };
    });
    setWithdrawalAmount('');
  };

  const handleRefreshBalance = () => {
     toast({
        title: "מרענן יתרה...",
        description: "היתרה והתנועות שלך מתעדכנות.",
    });
    fetchWalletData();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">טוען נתוני ארנק...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-destructive">שגיאה בטעינת הארנק</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button onClick={handleRefreshBalance} className="mt-4">נסה שוב</Button>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return <p>לא נמצא ארנק.</p>;
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle className="text-2xl font-headline flex items-center">
              <WalletIcon className="mr-2 h-7 w-7 text-primary" /> הארנק שלי (שליח)
            </CardTitle>
            <CardDescription>עקוב אחרי ההכנסות שלך, בצע משיכות ונהל את הכספים שלך בקלות.</CardDescription>
          </div>
            <Button variant="outline" size="sm" onClick={handleRefreshBalance} className="mt-2 sm:mt-0" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <RefreshCcw className="mr-2 h-4 w-4"/>} רענן יתרה
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
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">הכנסות היום</CardTitle>
             <CardDescription className="text-xs text-muted-foreground">(עמלות + בונוסים)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">₪{dailyEarnings.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">הכנסות השבוע</CardTitle>
             <CardDescription className="text-xs text-muted-foreground">(עמלות + בונוסים)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">₪{weeklyEarnings.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Download className="mr-2 h-5 w-5 text-accent" /> בצע משיכת כספים</CardTitle>
          <CardDescription>משוך את היתרה הזמינה שלך לחשבון הבנק או ל-Bit. (מינימום למשיכה ₪50 - הדגמה)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-1 space-y-1">
              <Label htmlFor="withdrawalAmount">סכום למשיכה (₪)</Label>
              <Input
                id="withdrawalAmount"
                type="number"
                placeholder="לדוגמה: 100"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
              />
            </div>
            <div className="sm:col-span-1 space-y-1">
              <Label htmlFor="withdrawalMethod">אמצעי משיכה</Label>
              <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                <SelectTrigger id="withdrawalMethod">
                  <SelectValue placeholder="בחר אמצעי משיכה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank"><Banknote className="inline h-4 w-4 mr-2"/>העברה בנקאית</SelectItem>
                  <SelectItem value="bit"><Smartphone className="inline h-4 w-4 mr-2"/>Bit (בקרוב)</SelectItem>
                  <SelectItem value="paypal" disabled><CreditCardIcon className="inline h-4 w-4 mr-2"/>PayPal (בקרוב)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleWithdraw} disabled={!withdrawalAmount || parseFloat(withdrawalAmount) < 50 || !wallet || parseFloat(withdrawalAmount) > wallet.balance} className="w-full sm:w-auto">
              בצע משיכה
            </Button>
          </div>
           {wallet && withdrawalAmount && parseFloat(withdrawalAmount) > wallet.balance && <p className="text-xs text-destructive">הסכום המבוקש גבוה מהיתרה הזמינה.</p>}
           {withdrawalAmount && parseFloat(withdrawalAmount) > 0 && parseFloat(withdrawalAmount) < 50 && <p className="text-xs text-destructive">מינימום למשיכה הוא ₪50.</p>}
           <p className="text-xs text-muted-foreground">אמצעי משיכה יוגדרו בפרופיל האישי (בקרוב). משיכות מעובדות תוך 1-3 ימי עסקים.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" /> היסטוריית תנועות בארנק</CardTitle>
           <CardDescription>כל ההכנסות, המשיכות והזיכויים שלך.</CardDescription>
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
                    <TableHead>סוג</TableHead>
                    <TableHead>סטטוס</TableHead>
                    <TableHead className="text-right">סכום (₪)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallet.transactions.slice(0, 10).map((tx: Transaction) => ( // Display first 10 for brevity
                    <TableRow key={tx.id}>
                      <TableCell className="text-xs">{new Date(tx.date).toLocaleString('he-IL')}</TableCell>
                      <TableCell className="font-medium text-sm">{tx.description}</TableCell>
                      <TableCell className="text-xs capitalize">{tx.type.replace('_', ' ')}</TableCell>
                      <TableCell className="text-xs capitalize">{tx.status}</TableCell>
                      <TableCell className={`text-right font-semibold text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-destructive'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {wallet.transactions.length > 10 && <p className="text-xs text-muted-foreground text-center mt-2">מוצגות 10 התנועות האחרונות. דוחות מלאים יהיו זמינים בקרוב.</p>}
        </CardContent>
         <CardFooter>
             <p className="text-xs text-muted-foreground">
                שליחים יקרים, עקבו אחר ההכנסות שלכם בזמן אמת ונהלו את הכספים בקלות דרך הארנק האישי.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
