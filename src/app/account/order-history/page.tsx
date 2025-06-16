
// This is a placeholder page component.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListOrdered } from "lucide-react";

export default function UserOrderHistoryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center"><ListOrdered className="mr-2 h-6 w-6 text-primary"/> היסטוריית הזמנות</CardTitle>
        <CardDescription>צפה בכל ההזמנות הקודמות שלך והזמן שוב בקלות.</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-12">
        <ListOrdered className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
        <p className="text-muted-foreground">
          היסטוריית ההזמנות המלאה שלך תופיע כאן בקרוב.
        </p>
      </CardContent>
    </Card>
  );
}
