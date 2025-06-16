
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Edit2, Trash2, PlusCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const mockAddresses = [
  { id: 'addr1', label: 'בית', street: 'רחוב הבית 12', city: 'תל אביב', zip: '6522011', isPrimary: true },
  { id: 'addr2', label: 'עבודה', street: 'מגדלי אלון 1, קומה 10', city: 'רמת גן', zip: '5252001', isPrimary: false },
];

export default function UserAddressesPage() {
  const { toast } = useToast();

  const handleAddNewAddress = () => {
    toast({
      title: "הוספת כתובת חדשה (בקרוב)",
      description: "טופס להוספת כתובת חדשה יופיע כאן בעתיד.",
    });
  };

  const handleEditAddress = (addressId: string) => {
    toast({
      title: "עריכת כתובת (בקרוב)",
      description: `טופס לעריכת כתובת ${addressId} יופיע כאן.`,
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    toast({
      title: "מחיקת כתובת (דמו)",
      description: `כתובת ${addressId} "נמחקה".`,
      variant: "destructive"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center"><MapPin className="mr-2 h-6 w-6 text-primary"/> ניהול כתובות שמורות</CardTitle>
        <CardDescription>הוסף, ערוך או הסר כתובות למשלוח מהיר יותר.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {mockAddresses.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <MapPin className="mx-auto h-12 w-12 mb-3" />
            <p>אין לך עדיין כתובות שמורות.</p>
          </div>
        )}
        {mockAddresses.map(addr => (
          <Card key={addr.id} className="p-4 bg-muted/30">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-1">
                  <Home className="mr-2 h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">{addr.label}</h3>
                  {addr.isPrimary && <Badge variant="default" className="mr-2 bg-green-500 text-white"><Star className="h-3 w-3 mr-1"/>ראשית</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{addr.street}, {addr.city}</p>
                <p className="text-xs text-muted-foreground">מיקוד: {addr.zip}</p>
              </div>
              <div className="flex space-x-1 rtl:space-x-reverse">
                <Button variant="ghost" size="icon" onClick={() => handleEditAddress(addr.id)} title="ערוך כתובת">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(addr.id)} className="text-destructive hover:text-destructive" title="מחק כתובת">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button onClick={handleAddNewAddress} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> הוסף כתובת חדשה
        </Button>
      </CardFooter>
    </Card>
  );
}
