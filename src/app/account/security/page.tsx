
// This is a placeholder page component.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function UserSecurityPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center"><ShieldCheck className="mr-2 h-6 w-6 text-primary"/> אבטחה והתראות</CardTitle>
        <CardDescription>נהל את הגדרות האבטחה של חשבונך והעדפות התראה.</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-12">
        <ShieldCheck className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
        <p className="text-muted-foreground">
          הגדרות אבטחה כגון אימות דו-שלבי וניהול התראות יתווספו כאן בקרוב.
        </p>
      </CardContent>
    </Card>
  );
}
