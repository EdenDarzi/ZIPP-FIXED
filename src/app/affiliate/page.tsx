
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Gift, Share2, Store, TrendingUp, DollarSign, Star } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const affiliateBenefits = [
  { icon: DollarSign, title: "הרוויחו כסף/נקודות", description: "קבלו תגמול על כל הזמנה שנעשית דרך הקישור האישי שלכם או שיתוף מוצלח." },
  { icon: Star, title: "צברו כוכבים מהר יותר", description: "קבלו בונוס כוכבים בתוכנית SocialDrop על הפניות מוצלחות." },
  { icon: Store, title: "חנות המלצות אישית (בקרוב)", description: "צרו עמוד אישי עם המוצרים והעסקים האהובים עליכם ושתפו אותו." },
  { icon: TrendingUp, title: "כלים למעקב", description: "עקבו אחר הביצועים שלכם, מספר ההפניות והרווחים שלכם בדשבורד אישי (בקרוב)." },
  { icon: Gift, title: "הטבות בלעדיות לשותפים", description: "גישה למבצעים מיוחדים, הנחות נוספות ופרסים לשותפים מצטיינים." },
];

export default function AffiliateProgramPage() {
  const { toast } = useToast();

  const handleStartNowClick = () => {
    toast({
      title: "תוכנית השותפים - בקרוב!",
      description: "ההרשמה לתוכנית השותפים שלנו תיפתח בקרוב. הישארו מעודכנים!",
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      <Card className="shadow-xl bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 text-white">
        <CardHeader className="text-center items-center pt-8">
          <Users className="h-16 w-16 mb-4" />
          <CardTitle className="text-4xl font-headline">תוכנית השותפים של LivePick</CardTitle>
          <CardDescription className="text-xl text-green-100 mt-2">
            הפכו לממליצים, שתפו את האהבה שלכם ל-LivePick, והרוויחו פרסים!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center px-6 py-8">
          <p className="text-lg mb-8 text-green-50">
            אוהבים את LivePick? למה לא להרוויח מזה? תוכנית השותפים שלנו מאפשרת לכם להמליץ על עסקים ומוצרים,
            ולקבל תגמול על כל לקוח חדש או הזמנה שמגיעה דרככם.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary text-center">למה כדאי להצטרף?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid md:grid-cols-2 gap-4">
            {affiliateBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start p-3 bg-muted/30 rounded-md">
                <benefit.icon className="h-8 w-8 mr-4 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-accent">איך זה עובד?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
            <p>1. <Share2 className="inline h-5 w-5 text-primary"/> <strong>שתפו:</strong> שתפו קישורים למוצרים, עסקים או את LivePick עצמה.</p>
            <p>2. <Users className="inline h-5 w-5 text-green-500"/> <strong>הפנו:</strong> חברים, עוקבים או כל אחד אחר שמחפש פתרון משלוחים מעולה.</p>
            <p>3. <DollarSign className="inline h-5 w-5 text-accent"/> <strong>הרוויחו:</strong> קבלו עמלות, נקודות או פרסים על כל הצלחה!</p>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button size="lg" onClick={handleStartNowClick} className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg shadow-md">
          התחילו להרוויח עכשיו (בקרוב!)
        </Button>
      </div>
       <CardFooter className="justify-center">
           <p className="text-xs text-muted-foreground text-center">
            פרטים מלאים ותנאי התוכנית יפורסמו עם השקתה.
          </p>
        </CardFooter>
    </div>
  );
}
