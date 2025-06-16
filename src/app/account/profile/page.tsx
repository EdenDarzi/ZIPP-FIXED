
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Edit3, KeyRound, Mail, Phone, Home, CreditCardIcon, ListOrderedIcon } from "lucide-react";
import Link from "next/link";

// Mock user data - in a real app, this would come from context/API
const mockUser = {
  name: "ישראל ישראלי",
  email: "israel@example.com",
  phone: "050-1234567",
};

export default function UserProfilePage() {
  const { toast } = useToast();

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "הפרופיל עודכן (דמו)",
      description: "פרטי הפרופיל שלך נשמרו (הדמיה בלבד).",
    });
  };

   const handlePlaceholderClick = (featureName: string) => {
    toast({
      title: `${featureName} (בקרוב)`,
      description: `ניהול ${featureName.toLowerCase()} יתאפשר כאן בקרוב.`,
    });
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center"><User className="mr-2 h-6 w-6 text-primary"/> הפרופיל האישי שלי</CardTitle>
          <CardDescription>עדכן את פרטיך האישיים והעדפותיך.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="fullName">שם מלא</Label>
                <Input id="fullName" defaultValue={mockUser.name} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">כתובת אימייל</Label>
                <Input id="email" type="email" defaultValue={mockUser.email} readOnly className="bg-muted/50 cursor-not-allowed"/>
                <p className="text-xs text-muted-foreground">לא ניתן לשנות כתובת אימייל.</p>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">מספר טלפון</Label>
              <Input id="phone" type="tel" defaultValue={mockUser.phone} />
            </div>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <Edit3 className="mr-2 h-4 w-4" /> שמור שינויים
                </Button>
                <Button type="button" variant="outline" onClick={() => handlePlaceholderClick("שינוי סיסמה")}>
                    <KeyRound className="mr-2 h-4 w-4" /> שנה סיסמה (בקרוב)
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Home className="mr-2 h-5 w-5 text-primary"/> כתובות שמורות</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">נהל את כתובות המשלוח שלך לגישה מהירה.</p>
            {/* Placeholder for address list */}
            <div className="p-3 border rounded-md bg-muted/20 text-xs text-muted-foreground">
                רחוב הדוגמה 1, תל אביב (ראשי)<br/>
                עבודה - רחוב המשרד 5, רמת גן
            </div>
          </CardContent>
          <CardFooter>
             <Button variant="outline" className="w-full" onClick={() => handlePlaceholderClick("ניהול כתובות")}>נהל כתובות (בקרוב)</Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><CreditCardIcon className="mr-2 h-5 w-5 text-primary"/> אמצעי תשלום</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">הוסף או הסר כרטיסי אשראי ושיטות תשלום אחרות.</p>
             <div className="p-3 border rounded-md bg-muted/20 text-xs text-muted-foreground">
                ויזה **** **** **** 1234
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => handlePlaceholderClick("אמצעי תשלום")}>נהל אמצעי תשלום (בקרוב)</Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><ListOrderedIcon className="mr-2 h-5 w-5 text-primary"/> היסטוריית הזמנות</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">צפה בכל ההזמנות הקודמות שלך והזמן שוב בקלות.</p>
            <div className="p-3 border rounded-md bg-muted/20 text-xs text-muted-foreground">
                הזמנה #12345 - פיצה פאלאס - ₪75.50 (נמסר)
            </div>
          </CardContent>
          <CardFooter>
             <Button variant="outline" className="w-full" asChild>
                <Link href="/account/order-history">צפה בהיסטוריה המלאה</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Placeholder pages for other account sections (to avoid 404s)
export function AddressesPage() {
  return <div className="text-center p-10"><Home className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>דף ניהול כתובות יתווסף כאן בקרוב.</div>;
}
export function PaymentMethodsPage() {
  return <div className="text-center p-10"><CreditCardIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>דף ניהול אמצעי תשלום יתווסף כאן בקרוב.</div>;
}
export function OrderHistoryPage() {
  return <div className="text-center p-10"><ListOrderedIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>היסטוריית ההזמנות המלאה שלך תופיע כאן בקרוב.</div>;
}
export function SecurityPage() {
  return <div className="text-center p-10"><KeyRound className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>הגדרות אבטחה וניהול התראות יתווספו כאן בקרוב.</div>;
}
