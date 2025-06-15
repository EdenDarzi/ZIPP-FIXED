
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem, Zap, ShieldCheck, Sparkles, Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const vipBenefits = [
  { icon: Zap, text: "משלוחים מהירים במיוחד עם עדיפות עליונה." },
  { icon: ShieldCheck, text: "תמיכה טכנית אישית 24/7 עם זמן מענה מהיר." },
  { icon: Sparkles, text: "גישה למנות, מוצרים ושירותים בלעדיים מחנויות נבחרות." },
  { icon: Crown, text: "הנחות קבועות ומבצעים ייחודיים לחברי VIP." },
  { icon: Gem, text: "צבירת 'כוכבי VIP' כפולה בתוכנית הנאמנות SocialDrop." }
];

export default function VipProgramPage() {
  const { toast } = useToast();

  const handleJoinClick = () => {
    toast({
      title: "תוכנית VIP - בקרוב!",
      description: "פרטים נוספים על הצטרפות למועדון ה-VIP שלנו יפורסמו בקרוב.",
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      <Card className="shadow-xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
        <CardHeader className="text-center items-center pt-8">
          <Gem className="h-16 w-16 mb-4 animate-bounce" />
          <CardTitle className="text-4xl font-headline">ברוכים הבאים ל-LivePick VIP</CardTitle>
          <CardDescription className="text-xl text-purple-100 mt-2">
            חווית המשלוחים האולטימטיבית, רק בשבילכם.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center px-6 py-8">
          <p className="text-lg mb-8 text-purple-50">
            שדרגו את חווית ה-LivePick שלכם עם מועדון ה-VIP שלנו! קבלו גישה להטבות בלעדיות, שירות פרימיום והפתעות שיגרמו לכם להרגיש כמו מלכים.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary text-center">מה מקבלים חברי VIP?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-none space-y-3">
            {vipBenefits.map((benefit, index) => (
              <li key={index} className="flex items-start p-3 bg-muted/30 rounded-md">
                <benefit.icon className="h-6 w-6 mr-3 text-primary flex-shrink-0 mt-1" />
                <span className="text-foreground">{benefit.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-accent">מוכנים לשדרג?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            תוכנית ה-VIP שלנו נמצאת כעת בשלבי פיתוח אחרונים ותושק בקרוב מאוד.
            הישארו מעודכנים!
          </p>
          <Button size="lg" onClick={handleJoinClick} className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg shadow-md">
            הצטרפו לרשימת המתנה (בקרוב!) <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
           <p className="text-xs text-muted-foreground">
            תנאי התוכנית עשויים להשתנות. הטבות בכפוף לזמינות ומיקום.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
