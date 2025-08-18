
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, MessageSquare, HelpCircle, BookOpen, Search, FileText, Video, Phone, Mail, Info } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context'; 

export default function SupportPage() {
  const { toast } = useToast();
  const { isRTL } = useLanguage(); 

  const handleSearchKnowledgeBase = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchTerm = formData.get("knowledgeBaseSearch") as string;
    toast({
      title: "Knowledge Base Search",
      description: `Searching results for: "${searchTerm}". (Demo process).`
    });
  };

  const handleContactSupport = (method: 'chat' | 'email') => {
    if (method === 'chat') {
      toast({
        title: "Starting chat with support...",
        description: "Chat interface with support agent will load here. (Demo process).",
      });
    } else {
      toast({
        title: "Opening email contact form...",
        description: "Contact form via email will load here. (Demo process).",
      });
    }
  };

  const handleViewAllFaqs = () => {
     toast({title:"FAQ Database", description: "All frequently asked questions will be displayed here. (Demo)"});
  };

  const handleViewAllGuides = () => {
     toast({title:"Guides Database", description: "All guides and articles will be displayed here. (Demo)"});
  };


  return (
    <div className="container mx-auto py-12 max-w-3xl" dir={isRTL ? 'rtl' : 'ltr'}>
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <LifeBuoy className="mx-auto h-12 w-12 text-primary mb-4" />
          <AutoTranslateText 
            translationKey="support.title" 
            fallback="ZIPP Support Center"
            as={CardTitle}
            className="text-3xl font-headline text-primary"
          />
          <AutoTranslateText 
            translationKey="support.subtitle" 
            fallback="We're here to help you with any question or issue."
            as={CardDescription}
          />
        </CardHeader>
        <CardContent className="space-y-8">
          
          <Card className="p-4 bg-muted/30">
            <form onSubmit={handleSearchKnowledgeBase} className="space-y-2">
              <label htmlFor="knowledgeBaseSearch" className="sr-only">חפש במאגר הידע</label>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <Input 
                  id="knowledgeBaseSearch"
                  name="knowledgeBaseSearch"
                  type="search" 
                  placeholder="חפש במאגר הידע שלנו (לדוגמה: איך לעקוב אחרי הזמנה)..." 
                  className="w-full p-2 border rounded-md text-sm focus:ring-primary focus:border-primary" 
                />
                <Button type="submit" variant="outline" size="sm">חפש</Button>
              </div>
            </form>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="text-center p-6 hover:shadow-md transition-shadow flex flex-col">
              <HelpCircle className="mx-auto h-10 w-10 text-accent mb-3" />
              <h3 className="text-lg font-semibold mb-2">שאלות נפוצות (FAQ)</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">מצא תשובות מהירות לשאלות נפוצות על הפלטפורמה, הזמנות, תשלומים ועוד.</p>
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
              <Button variant="outline" className="mt-4" onClick={handleViewAllFaqs}>עיין בכל השאלות</Button>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-md transition-shadow flex flex-col">
              <BookOpen className="mx-auto h-10 w-10 text-accent mb-3" />
              <h3 className="text-lg font-semibold mb-2">מדריכים ומאמרים</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">למד כיצד להפיק את המרב מ-LivePick עם מדריכים מפורטים על כל הפיצ'רים.</p>
              <ul className="text-sm text-left space-y-1 list-none">
                <li className="flex items-center"><FileText className="h-4 w-4 mr-2 text-primary/70"/> <Link href="#" className="hover:underline text-primary" onClick={(e)=>{e.preventDefault(); toast({title:"מדריך למשתמש חדש", description:"המדריך יפורסם."})}}>מדריך למשתמש חדש</Link></li>
                <li className="flex items-center"><Video className="h-4 w-4 mr-2 text-primary/70"/> <Link href="#" className="hover:underline text-primary" onClick={(e)=>{e.preventDefault(); toast({title:"סרטון: TrendScanner", description:"הסרטון יפורסם."})}}>סרטון: איך להשתמש ב-TrendScanner</Link></li>
                 <li className="flex items-center"><FileText className="h-4 w-4 mr-2 text-primary/70"/> <Link href="#" className="hover:underline text-primary" onClick={(e)=>{e.preventDefault(); toast({title:"מדריך: הגדרת עסק", description:"המדריך יפורסם."})}}>מדריך: הגדרת העסק שלך</Link></li>
              </ul>
              <Button variant="outline" className="mt-4" onClick={handleViewAllGuides}>עיין בכל המדריכים</Button>
            </Card>
          </div>
          
          <Card className="bg-primary/10 border-primary/30 p-6">
            <h3 className="text-xl font-semibold text-primary mb-3 text-center flex items-center justify-center">
              <MessageSquare className="mr-2 h-6 w-6"/> צור קשר עם התמיכה
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              לא מצאת את מה שחיפשת? צוות התמיכה שלנו זמין לסייע לך.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
                    onClick={() => handleContactSupport('chat')}
                >
                    <MessageSquare className="ml-2 h-5 w-5"/> התחל צ'אט תמיכה
                </Button>
                 <Button 
                    size="lg" 
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/5 flex-1"
                    onClick={() => handleContactSupport('email')}
                >
                    <Mail className="ml-2 h-5 w-5"/> שלח פנייה במייל
                </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
                <Phone className="inline h-3 w-3 mr-1"/> ניתן גם ליצור קשר טלפוני במספר: 1-800-LIVE-PICK (שעות פעילות: ימים א'-ה', 09:00-18:00).
            </p>
          </Card>
        </CardContent>
         <CardFooter className="p-4 border-t">
             <p className="text-xs text-muted-foreground flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0"/>
                <span>הערה: פנייה לעסקים או שליחים בנוגע להזמנות ספציפיות מתבצעת דרך דף ההזמנה או פורטל הניהול הרלוונטי.</span>
            </p>
         </CardFooter>
      </Card>
    </div>
  );
}
