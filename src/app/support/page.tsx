
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, MessageSquare, HelpCircle, BookOpen } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="container mx-auto py-12 max-w-3xl">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <LifeBuoy className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline text-primary">מרכז התמיכה של LivePick</CardTitle>
          <CardDescription>אנחנו כאן כדי לעזור לך בכל שאלה או בעיה.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="text-center p-6 hover:shadow-md transition-shadow">
              <HelpCircle className="mx-auto h-10 w-10 text-accent mb-3" />
              <h3 className="text-lg font-semibold mb-2">שאלות נפוצות (FAQ)</h3>
              <p className="text-sm text-muted-foreground mb-4">מצא תשובות מהירות לשאלות נפוצות על הפלטפורמה, הזמנות, תשלומים ועוד.</p>
              <Button variant="outline" disabled>עיין בשאלות נפוצות (בקרוב)</Button>
            </Card>
            <Card className="text-center p-6 hover:shadow-md transition-shadow">
              <BookOpen className="mx-auto h-10 w-10 text-accent mb-3" />
              <h3 className="text-lg font-semibold mb-2">מדריכים ומאמרים</h3>
              <p className="text-sm text-muted-foreground mb-4">למד כיצד להפיק את המרב מ-LivePick עם מדריכים מפורטים על כל הפיצ'רים.</p>
              <Button variant="outline" disabled>עיין במדריכים (בקרוב)</Button>
            </Card>
          </div>
          
          <Card className="bg-primary/10 border-primary/30 p-6">
            <h3 className="text-xl font-semibold text-primary mb-3 text-center flex items-center justify-center">
              <MessageSquare className="mr-2 h-6 w-6"/> צור קשר עם התמיכה
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              לא מצאת את מה שחיפשת? צוות התמיכה שלנו זמין לסייע לך.
            </p>
            <div className="text-center">
                <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => alert("יופנה לצ'אט תמיכה / טופס יצירת קשר (בקרוב)")}
                >
                    פתח פניית תמיכה (בקרוב)
                </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
                שעות פעילות התמיכה: ימים א'-ה', 09:00-18:00.
            </p>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
