
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, MessageSquare, HelpCircle, BookOpen, Search, FileText, Video } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
          
          <Card className="p-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <Search className="h-5 w-5 text-primary" />
              <input type="search" placeholder="חפש במאגר הידע שלנו (לדוגמה: איך לעקוב אחרי הזמנה)..." className="w-full p-2 border rounded-md text-sm focus:ring-primary focus:border-primary" disabled />
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="text-center p-6 hover:shadow-md transition-shadow">
              <HelpCircle className="mx-auto h-10 w-10 text-accent mb-3" />
              <h3 className="text-lg font-semibold mb-2">שאלות נפוצות (FAQ)</h3>
              <p className="text-sm text-muted-foreground mb-4">מצא תשובות מהירות לשאלות נפוצות על הפלטפורמה, הזמנות, תשלומים ועוד.</p>
              <Accordion type="single" collapsible className="w-full text-left">
                <AccordionItem value="item-1">
                  <AccordionTrigger>איך אני עוקב אחרי ההזמנה שלי?</AccordionTrigger>
                  <AccordionContent>
                    לאחר ביצוע ההזמנה, תועבר לדף מעקב ההזמנה. תוכל גם לגשת אליו דרך "היסטוריית הזמנות" בחשבונך.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>מהן אפשרויות המשלוח?</AccordionTrigger>
                  <AccordionContent>
                    אנו מציעים "זירת משלוחים חכמה" (ברירת מחדל), "משלוח מהיר ביותר" (בתשלום נוסף), ו"משלוח חסכוני חכם" (הנחה, זמן המתנה ארוך יותר).
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-3">
                  <AccordionTrigger>האם ניתן לשנות הזמנה לאחר שבוצעה?</AccordionTrigger>
                  <AccordionContent>
                    לאחר שההזמנה נשלחה למסעדה וההכנה החלה, לרוב לא ניתן לבצע שינויים. צור קשר עם התמיכה עבור מקרים דחופים.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Button variant="outline" className="mt-4" disabled>עיין בכל השאלות (בקרוב)</Button>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-md transition-shadow">
              <BookOpen className="mx-auto h-10 w-10 text-accent mb-3" />
              <h3 className="text-lg font-semibold mb-2">מדריכים ומאמרים</h3>
              <p className="text-sm text-muted-foreground mb-4">למד כיצד להפיק את המרב מ-LivePick עם מדריכים מפורטים על כל הפיצ'רים.</p>
              <ul className="text-sm text-left space-y-1 list-none">
                <li className="flex items-center"><FileText className="h-4 w-4 mr-2 text-primary/70"/> <Link href="#" className="hover:underline text-primary">מדריך למשתמש חדש (בקרוב)</Link></li>
                <li className="flex items-center"><Video className="h-4 w-4 mr-2 text-primary/70"/> <Link href="#" className="hover:underline text-primary">סרטון: איך להשתמש ב-TrendScanner (בקרוב)</Link></li>
              </ul>
              <Button variant="outline" className="mt-4" disabled>עיין בכל המדריכים (בקרוב)</Button>
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
