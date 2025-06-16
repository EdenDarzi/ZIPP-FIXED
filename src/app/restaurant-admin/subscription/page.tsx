
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle, CreditCard, Star, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const mockSubscriptionDetails = {
  planName: 'תוכנית LivePick Pro לעסקים',
  status: 'פעיל',
  nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('he-IL'),
  price: '₪149.90 לחודש',
  features: [
    { text: 'גישה מלאה לכל כלי ניהול העסק', icon: Zap },
    { text: 'ניתוחים ודוחות מתקדמים', icon: Award },
    { text: 'תובנות AI מותאמות אישית לקידום העסק', icon: Star },
    { text: 'תמיכה ייעודית לעסקים עם עדיפות', icon: CheckCircle },
    { text: 'הופעה מוגברת בתוצאות החיפוש בפלטפורמה', icon: CreditCard },
  ],
};

export default function RestaurantSubscriptionPage() {
  const { toast } = useToast();

  const handleManageSubscription = () => {
    toast({
      title: 'ניהול מנוי (הדגמה)',
      description: 'יופנה לפורטל חיצוני לניהול פרטי חיוב ושינוי תוכנית (בקרוב).',
    });
  };

  const handleUpgradePlan = () => {
     toast({
      title: 'שדרוג תוכנית (הדגמה)',
      description: 'הצגת אפשרויות שדרוג לתוכניות מתקדמות יותר (בקרוב).',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <CreditCard className="mr-2 h-6 w-6 text-primary" /> מנוי וחיוב (עסקים)
          </CardTitle>
          <CardDescription>נהל את המנוי שלך לשירותי LivePick לעסקים.</CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="bg-primary/10">
          <CardTitle className="text-xl text-primary">{mockSubscriptionDetails.planName}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={mockSubscriptionDetails.status === 'פעיל' ? 'default' : 'destructive'} className={mockSubscriptionDetails.status === 'פעיל' ? 'bg-green-500 text-white' : ''}>
              {mockSubscriptionDetails.status}
            </Badge>
            <span className="text-sm text-muted-foreground">חיוב הבא: {mockSubscriptionDetails.nextBillingDate} | {mockSubscriptionDetails.price}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-3">הטבות כלולות בתוכנית שלך:</h3>
          <ul className="space-y-2">
            {mockSubscriptionDetails.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <feature.icon className="h-5 w-5 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="border-t pt-4 flex flex-col sm:flex-row gap-3">
          <Button onClick={handleManageSubscription} className="w-full sm:flex-1">
            נהל מנוי ופרטי חיוב
          </Button>
          <Button variant="outline" onClick={handleUpgradePlan} className="w-full sm:flex-1">
            שדרג תוכנית (בקרוב)
          </Button>
        </CardFooter>
      </Card>
       <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-md text-blue-700">תזכורת חשובה:</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-600">
          <p>המנוי מאפשר לך גישה מלאה לכל הפיצ'רים המתקדמים של הפלטפורמה לניהול וקידום העסק שלך. אנו ממליצים לעבור על כל ההגדרות והאפשרויות כדי למקסם את התועלת.</p>
        </CardContent>
      </Card>
    </div>
  );
}
