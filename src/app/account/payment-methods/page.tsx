
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Trash2, PlusCircle, Edit2, Star, Wallet as WalletIcon, DollarSign, History, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";

const mockPaymentMethods = [
  { id: 'pm1', type: 'Visa', last4: '1234', expiry: '12/25', isPrimary: true },
  { id: 'pm2', type: 'PayPal', email: 'user@example.com', isPrimary: false },
  { id: 'pm3', type: 'MasterCard', last4: '5678', expiry: '06/24', isPrimary: false },
];

export default function UserPaymentMethodsPage() {
  const { toast } = useToast();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    // Simulate fetching wallet balance
    setTimeout(() => {
      setWalletBalance(parseFloat((Math.random() * 200 + 10).toFixed(2)));
    }, 500);
  }, []);


  const handleAddNewMethod = () => {
    toast({
      title: "הוספת אמצעי תשלום (בקרוב)",
      description: "טופס להוספת כרטיס אשראי או שיטת תשלום אחרת יופיע כאן.",
    });
  };

  const handleEditMethod = (methodId: string) => {
    toast({
      title: "עריכת אמצעי תשלום (בקרוב)",
      description: `טופס לעריכת אמצעי תשלום ${methodId} יופיע כאן.`,
    });
  };

  const handleDeleteMethod = (methodId: string) => {
    toast({
      title: "הסרת אמצעי תשלום (דמו)",
      description: `אמצעי תשלום ${methodId} "הוסר".`,
      variant: "destructive"
    });
  };

  const handleTopUpWallet = () => {
    toast({
        title: "טעינת ארנק (בקרוב)",
        description: "אפשרויות לטעינת הארנק באמצעות אמצעי תשלום שמורים או חדשים יופיעו כאן.",
    });
  };
  
  const handleViewWalletTransactions = () => {
     toast({
        title: "היסטוריית עסקאות ארנק (בקרוב)",
        description: "יוצגו כל הפעולות שבוצעו בארנק שלך.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center"><CreditCard className="mr-2 h-6 w-6 text-primary"/> ניהול אמצעי תשלום וארנק</CardTitle>
        <CardDescription>הוסף, ערוך או הסר אמצעי תשלום, ונהל את יתרת הארנק שלך ב-LivePick.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        <section>
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-semibold text-primary flex items-center">
                        <WalletIcon className="mr-2 h-5 w-5"/> ארנק LivePick שלך
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded-md shadow-sm">
                        <span className="text-lg font-medium text-muted-foreground">יתרה נוכחית:</span>
                        {walletBalance === null ? (
                            <span className="text-2xl font-bold text-primary animate-pulse">טוען...</span>
                        ) : (
                            <span className="text-2xl font-bold text-primary">₪{walletBalance.toFixed(2)}</span>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button onClick={handleTopUpWallet} variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                            <DollarSign className="mr-2 h-4 w-4"/> טען ארנק
                        </Button>
                        <Button onClick={handleViewWalletTransactions} variant="outline" className="w-full">
                            <History className="mr-2 h-4 w-4"/> צפה בהיסטוריית עסקאות
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center pt-2">שלם בקליק עם יתרת הארנק שלך!</p>
                </CardContent>
            </Card>
        </section>
        
        <Separator />

        <section>
            <h3 className="text-lg font-semibold mb-3 text-foreground">אמצעי תשלום שמורים</h3>
            {mockPaymentMethods.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
                <CreditCard className="mx-auto h-12 w-12 mb-3" />
                <p>אין לך עדיין אמצעי תשלום שמורים.</p>
            </div>
            )}
            <div className="space-y-4">
            {mockPaymentMethods.map(method => (
            <Card key={method.id} className="p-4 bg-muted/30 shadow-sm">
                <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <CreditCard className="mr-3 h-6 w-6 text-muted-foreground" />
                    <div>
                    <div className="flex items-center">
                        <p className="font-semibold text-md">
                        {method.type === 'PayPal' ? `חשבון PayPal` : `${method.type} המסתיים ב-${method.last4}`}
                        </p>
                        {method.isPrimary && <Badge variant="default" className="mr-2 bg-green-500 text-white text-xs px-1.5 py-0.5"><Star className="h-3 w-3 mr-1"/>ראשי</Badge>}
                    </div>
                    {method.type !== 'PayPal' && <p className="text-xs text-muted-foreground">תוקף: {method.expiry}</p>}
                    {method.type === 'PayPal' && <p className="text-xs text-muted-foreground">מייל: {method.email}</p>}
                    </div>
                </div>
                <div className="flex space-x-1 rtl:space-x-reverse">
                    <Button variant="ghost" size="icon" onClick={() => handleEditMethod(method.id)} title="ערוך אמצעי תשלום">
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteMethod(method.id)} className="text-destructive hover:text-destructive" title="הסר אמצעי תשלום">
                    <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                </div>
            </Card>
            ))}
            </div>
        </section>

      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button onClick={handleAddNewMethod} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" /> הוסף אמצעי תשלום חדש
        </Button>
      </CardFooter>
       <p className="text-xs text-muted-foreground text-center px-6 pb-4 flex items-start">
            <Info className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0"/>
            <span>הפרטים שלך מאובטחים בתקן PCI-DSS. אנו לא שומרים פרטי כרטיס אשראי מלאים בשרתים שלנו.</span>
        </p>
    </Card>
  );
}
