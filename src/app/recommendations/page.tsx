
import RecommendationForm from '@/components/recommendations/recommendation-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export default function RecommendationsPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <Brain className="h-12 w-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-headline text-primary">המלצות AI חכמות</CardTitle>
          <CardDescription>
            קבל הצעות מותאמות אישית לפריטים ושירותים על בסיס ההעדפות והיסטוריית ההזמנות שלך.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecommendationForm />
        </CardContent>
      </Card>
    </div>
  );
}
