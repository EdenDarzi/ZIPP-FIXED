
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Trash2, PlusCircle, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockPaymentMethods = [
  { id: 'pm1', type: 'Visa', last4: '1234', expiry: '12/25', isPrimary: true },
  { id: 'pm2', type: 'PayPal', email: 'user@example.com', isPrimary: false },
  { id: 'pm3', type: 'MasterCard', last4: '5678', expiry: '06/24', isPrimary: false },
];

export default function UserPaymentMethodsPage() {
  const { toast } = useToast();

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center"><CreditCard className="mr-2 h-6 w-6 text-primary"/> ניהול אמצעי תשלום</CardTitle>
        <CardDescription>הוסף, ערוך או הסר אמצעי תשלום לשימוש קל ומהיר.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {mockPaymentMethods.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <CreditCard className="mx-auto h-12 w-12 mb-3" />
            <p>אין לך עדיין אמצעי תשלום שמורים.</p>
          </div>
        )}
        {mockPaymentMethods.map(method => (
          <Card key={method.id} className="p-4 bg-muted/30">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CreditCard className="mr-3 h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold text-md">
                    {method.type === 'PayPal' ? `חשבון PayPal` : `${method.type} המסתיים ב-${method.last4}`}
                    {method.isPrimary && <span className="text-xs text-primary font-normal mr-2">(ראשי)</span>}
                  </p>
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
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button onClick={handleAddNewMethod} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> הוסף אמצעי תשלום חדש
        </Button>
      </CardFooter>
    </Card>
  );
}
