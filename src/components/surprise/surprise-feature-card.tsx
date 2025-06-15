
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getSurpriseMealSuggestion, SurpriseMealInput, SurpriseMealOutput } from '@/ai/flows/surprise-meal-flow';
import { Gift, Sparkles, Loader2, Utensils } from 'lucide-react';
import { Label } from '../ui/label';

export default function SurpriseFeatureCard() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState('');
  const [surpriseResult, setSurpriseResult] = useState<SurpriseMealOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetSurprise = async () => {
    setIsLoading(true);
    setSurpriseResult(null);
    try {
      const input: SurpriseMealInput = {
        userId: 'mockUserSurpriseMe123', // Using a mock user ID
        preferences: preferences,
      };
      const result = await getSurpriseMealSuggestion(input);
      setSurpriseResult(result);
    } catch (error) {
      console.error('Error getting surprise meal suggestion:', error);
      toast({
        title: 'אוי, השף מתלבט',
        description: 'לא הצלחנו להמציא הפתעה כרגע. נסה שוב בעוד רגע!',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30">
      <CardHeader className="text-center items-center">
        <Gift className="h-12 w-12 text-accent mb-3 animate-pulse" />
        <CardTitle className="text-2xl md:text-3xl font-headline text-accent">קופסת ההפתעות של SwiftServe!</CardTitle>
        <CardDescription className="text-md text-foreground/80">
          מרגישים הרפתקנים? תנו ל-AI שלנו להפתיע אתכם עם מנה מומצאת במיוחד בשבילכם!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="surprisePreferences" className="mb-2 block text-sm font-medium text-foreground">
            יש לכם העדפות מיוחדות או משהו שתרצו להימנע ממנו? (אופציונלי)
          </Label>
          <Textarea
            id="surprisePreferences"
            placeholder="לדוגמה: 'חריף, בלי פירות ים', 'משהו מנחם וגבינתי', 'טבעוני בבקשה'"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className="min-h-[80px] bg-background/70 focus:bg-background"
            disabled={isLoading}
          />
        </div>

        <Button onClick={handleGetSurprise} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 shadow-md">
          {isLoading ? (
            <>
              <Loader2 className="ml-2 h-5 w-5 animate-spin" /> בורא הפתעה...
            </>
          ) : (
            <>
              <Sparkles className="ml-2 h-5 w-5" /> חשוף את ארוחת ההפתעה שלי!
            </>
          )}
        </Button>

        {surpriseResult && !isLoading && (
          <Card className="mt-6 bg-background/80 shadow-inner animate-fadeInUp">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-primary">
                <Utensils className="ml-2 h-6 w-6" /> השף שלנו ממליץ על...
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <h3 className="text-2xl font-bold text-accent">{surpriseResult.itemName}</h3>
              <p className="text-sm text-muted-foreground">ממסעדת: <span className="font-semibold text-primary/90">{surpriseResult.restaurantName}</span> (המצאה שלנו!)</p>
              <p className="text-md text-foreground">{surpriseResult.itemDescription}</p>
              <blockquote className="border-r-4 border-accent bg-accent/10 p-3 rounded-md text-accent-foreground italic text-sm"> {/* Adjusted for RTL */}
                {surpriseResult.playfulReasoning}
              </blockquote>
               <p className="text-xs text-muted-foreground pt-2 text-center">
                זוהי הצעה יצירתית מה-AI שלנו. חפשו מנות דומות באפליקציה!
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
