
// This is a placeholder page component.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function UserPaymentMethodsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center"><CreditCard className="mr-2 h-6 w-6 text-primary"/> ניהול אמצעי תשלום</CardTitle>
        <CardDescription>הוסף, ערוך או הסר אמצעי תשלום.</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-12">
        <CreditCard className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
        <p className="text-muted-foreground">
          האפשרות לנהל את אמצעי התשלום שלך תהיה זמינה כאן בקרוב.
        </p>
      </CardContent>
    </Card>
  );
}
