import RecommendationForm from '@/components/recommendations/recommendation-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export default function RecommendationsPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <Brain className="h-12 w-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-headline text-primary">AI Item Recommendations</CardTitle>
          <CardDescription>
            Get personalized item suggestions based on your preferences and order history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecommendationForm />
        </CardContent>
      </Card>
    </div>
  );
}
