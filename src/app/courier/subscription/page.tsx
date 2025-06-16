
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle, CreditCard, ListChecks, Zap } from 'lucide-react'; // Replaced Star with ListChecks
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const mockSubscriptionDetails = {
  planName: 'תוכנית LivePick לשליחים',
  status: 'פעיל',
  nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('he-IL'),
  price: '₪29.90 לחודש',
  features: [
    { text: 'גישה מלאה לזירת ההצעות הפתוחות', icon: ListChecks },
    { text: 'סטטיסטיקות ביצועים מתקדמות', icon: Award },
    { text: 'עדיפות בהקצאת משלוחים מסוימים (מבוסס AI)', icon: Zap },
    { text: 'תמיכה ייעודית לשליחים', icon: CheckCircle },
  ],
};

export default function CourierSubscriptionPage() {
  const { toast } = useToast();

  const handleManageSubscriptionPayment = () => {
    toast({
      title: 'ניהול פרטי תשלום (הדגמה)',
      description: 'יופנה לפורטל תשלומים לעדכון אמצעי חיוב עבור המנוי (בקרוב).',
    });
  };
  
  const handleViewTerms = () => {
     toast({
      title: 'תנאי מנוי (הדגמה)',
      description: 'הצגת תנאי המנוי המלאים (בקרוב).',
    });
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <CreditCard className="mr-2 h-6 w-6 text-primary" /> מנוי ותשלומים (שליחים)
          </CardTitle>
          <CardDescription>נהל את המנוי שלך לשירותי LivePick לשליחים.</CardDescription>
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
          <Button onClick={handleManageSubscriptionPayment} className="w-full sm:flex-1">
            נהל פרטי תשלום למנוי
          </Button>
           <Button variant="link" onClick={handleViewTerms} className="w-full sm:w-auto">
            צפה בתנאי המנוי
          </Button>
        </CardFooter>
      </Card>
       <Card className="bg-yellow-50 border-yellow-300">
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-md text-yellow-700">פרטי המנוי נשמרים באופן מאובטח.</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-yellow-600">
          <p>
            ההצטרפות כמנוי מבטיחה לך גישה רציפה להזדמנויות משלוח, כלים לשיפור הביצועים ותמיכה זמינה.
            אנו מעריכים את השותפות שלך!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
