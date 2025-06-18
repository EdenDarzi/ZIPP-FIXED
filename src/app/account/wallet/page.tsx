
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet as WalletIcon, ArrowLeft, Download, Filter, CalendarDays, Loader2, PackageSearch } from "lucide-react";
import Link from "next/link";
import type { Transaction, TransactionType } from "@/types";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";

const mockTransactions: Transaction[] = [
  { id: 'txn1', timestamp: new Date(Date.now() - 1*24*60*60*1000).toISOString(), type: 'purchase', amount: -75.50, description: 'הזמנה מפיצה פאלאס (#ord123)', status: 'completed', relatedOrderId: 'ord123' },
  { id: 'txn2', timestamp: new Date(Date.now() - 2*24*60*60*1000).toISOString(), type: 'deposit', amount: 100.00, description: 'טעינת ארנק מכרטיס ויזה 1234', status: 'completed' },
  { id: 'txn3', timestamp: new Date(Date.now() - 3*24*60*60*1000).toISOString(), type: 'refund', amount: 25.00, description: 'זיכוי עבור פריט חסר מהזמנה #ord098', status: 'completed', relatedOrderId: 'ord098' },
  { id: 'txn4', timestamp: new Date(Date.now() - 5*24*60*60*1000).toISOString(), type: 'purchase', amount: -55.00, description: 'הזמנה מבורגר בוננזה (#ord456)', status: 'completed', relatedOrderId: 'ord456' },
  { id: 'txn5', timestamp: new Date().toISOString(), type: 'bonus', amount: 10.00, description: 'בונוס הצטרפות ל-LivePick VIP', status: 'pending' },
];

const getTransactionTypeHebrew = (type: TransactionType): string => {
  const map: Record<TransactionType, string> = {
    deposit: 'הפקדה',
    withdrawal: 'משיכה',
    purchase: 'רכישה',
    refund: 'זיכוי',
    commission_payment: 'תשלום עמלה',
    bonus: 'בונוס',
    fee: 'עמלה',
  };
  return map[type] || type;
};

const getTransactionStatusVariant = (status: Transaction['status']): "default" | "secondary" | "outline" | "destructive" => {
    switch(status) {
        case 'completed': return 'default';
        case 'pending': return 'secondary';
        case 'failed': return 'destructive';
        case 'cancelled': return 'outline';
        default: return 'outline';
    }
}

export default function UserWalletHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching transactions
    setTimeout(() => {
      let filteredTransactions = mockTransactions;
      if (dateRange?.from && dateRange?.to) {
        filteredTransactions = mockTransactions.filter(txn => {
          const txnDate = new Date(txn.timestamp);
          return txnDate >= dateRange.from! && txnDate <= dateRange.to!;
        });
      }
      setTransactions(filteredTransactions);
      setIsLoading(false);
    }, 800);
  }, [dateRange]);

  const handleDownloadStatement = () => {
    toast({
      title: "הורדת דוח פעולות (בקרוב)",
      description: "הדוח יופק בפורמט PDF ויהיה זמין להורדה. (הדגמה)",
    });
  };

  const handleApplyFilters = () => {
     toast({
      title: "החלת פילטרים (בקרוב)",
      description: "אפשרויות סינון מתקדמות לפי סוג עסקה, סכום וכו'. (הדגמה)",
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle className="text-2xl font-headline flex items-center"><WalletIcon className="mr-2 h-6 w-6 text-primary"/> היסטוריית פעולות בארנק</CardTitle>
            <Button variant="outline" asChild>
                <Link href="/account/payment-methods">
                    <ArrowLeft className="mr-2 h-4 w-4" /> חזרה לארנק ואמצעי תשלום
                </Link>
            </Button>
        </div>
        <CardDescription>עקוב אחר כל הפעולות הכספיות שלך ב-LivePick. 💳 כל מה שצריך – במקום אחד!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="p-4 bg-muted/30">
            <CardHeader className="p-0 pb-3">
                 <CardTitle className="text-lg">סינון היסטוריה</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                        <label htmlFor="dateRangePickerHistory" className="text-sm font-medium text-muted-foreground mb-1 block">טווח תאריכים</label>
                        <DatePickerWithRange id="dateRangePickerHistory" onDateChange={setDateRange} />
                    </div>
                    <Button variant="outline" onClick={handleApplyFilters} className="w-full md:w-auto self-end">
                        <Filter className="mr-2 h-4 w-4"/> סנן (בקרוב)
                    </Button>
                </div>
            </CardContent>
        </Card>
       
        {isLoading ? (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-3 text-muted-foreground">טוען פעולות...</p>
            </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <PackageSearch className="mx-auto h-16 w-16 mb-4" />
            <p className="text-lg">לא נמצאו פעולות התואמות לסינון או שאין היסטוריה.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>תאריך ושעה</TableHead>
                <TableHead>סוג פעולה</TableHead>
                <TableHead>תיאור</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead className="text-right">סכום (₪)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="text-xs">{new Date(txn.timestamp).toLocaleString('he-IL')}</TableCell>
                  <TableCell>{getTransactionTypeHebrew(txn.type)}</TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate" title={txn.description}>{txn.description}</TableCell>
                  <TableCell>
                    <Badge variant={getTransactionStatusVariant(txn.status)} className="capitalize">{txn.status}</Badge>
                  </TableCell>
                  <TableCell className={cn("text-right font-medium", txn.amount > 0 ? "text-green-600" : "text-destructive")}>
                    {txn.amount > 0 ? '+' : ''}{txn.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handleDownloadStatement} disabled={isLoading || transactions.length === 0}>
          <Download className="mr-2 h-4 w-4" /> הורד דוח פעולות (בקרוב)
        </Button>
      </CardFooter>
    </Card>
  );
}
