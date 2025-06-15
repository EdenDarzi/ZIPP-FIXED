
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { NutritionalGoal, DishRecommendation } from '@/types';
import { getNutritionalAdvice, NutritionalAdvisorInput, NutritionalAdvisorOutput } from '@/ai/flows/nutritional-advisor-flow';
import { Loader2, Sparkles, Utensils, Lightbulb, HeartPulse } from 'lucide-react';

const nutritionalGoals: { value: NutritionalGoal; label: string }[] = [
  { value: 'TONING', label: 'חיטוב ובניית שריר' },
  { value: 'WEIGHT_LOSS', label: 'ירידה במשקל' },
  { value: 'ENERGY_BOOST', label: 'הגברת אנרגיה' },
  { value: 'GENERAL_HEALTHY', label: 'תזונה בריאה כללית' },
];

const formSchema = z.object({
  goal: z.enum(['TONING', 'WEIGHT_LOSS', 'ENERGY_BOOST', 'GENERAL_HEALTHY'], {
    required_error: "חובה לבחור מטרה תזונתית.",
  }),
  preferences: z.string().optional(),
});

type NutritionalAdvisorFormValues = z.infer<typeof formSchema>;

export default function NutritionalAdvisorPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [advisorResponse, setAdvisorResponse] = useState<NutritionalAdvisorOutput | null>(null);

  const form = useForm<NutritionalAdvisorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: undefined, // No default goal initially
      preferences: '',
    },
  });

  async function onSubmit(values: NutritionalAdvisorFormValues) {
    setIsLoading(true);
    setAdvisorResponse(null);
    try {
      const input: NutritionalAdvisorInput = {
        userId: 'mockUserNutrition123', // Mock user ID
        goal: values.goal as NutritionalGoal,
        preferences: values.preferences,
      };
      const result = await getNutritionalAdvice(input);
      setAdvisorResponse(result);
      if (!result.recommendations || result.recommendations.length === 0) {
         toast({ title: "לא נמצאו המלצות ספציפיות", description: "נסה לשנות את ההעדפות או המטרה שלך."});
      }
    } catch (error) {
      console.error('Error getting nutritional advice:', error);
      toast({
        title: 'שגיאה בקבלת ייעוץ',
        description: 'אירעה שגיאה. אנא נסה שוב מאוחר יותר.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center items-center">
          <HeartPulse className="h-12 w-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-headline text-primary">יועץ התזונה החכם שלך</CardTitle>
          <CardDescription>
            קבל המלצות מותאמות אישית למנות שיעזרו לך להשיג את מטרות התזונה שלך!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מהי מטרת התזונה העיקרית שלך?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר/י מטרה..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {nutritionalGoals.map((goalOption) => (
                          <SelectItem key={goalOption.value} value={goalOption.value}>
                            {goalOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>העדפות, הגבלות או מאכלים אהובים (אופציונלי)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="לדוגמה: צמחוני, ללא גלוטן, אוהב/ת אוכל אסיאתי, מחפש/ת ארוחות קלות..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      ספר/י לנו עוד כדי שנוכל להתאים את ההמלצות טוב יותר.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="ml-2 h-5 w-5 animate-spin" /> מקבל המלצות...</>
                ) : (
                  <><Sparkles className="ml-2 h-5 w-5" /> קבל המלצות AI</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {advisorResponse && advisorResponse.recommendations && advisorResponse.recommendations.length > 0 && (
        <Card className="mt-8 shadow-lg animate-fadeInUp">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-accent flex items-center">
                <Utensils className="ml-3 h-7 w-7"/>המלצות השף התזונתי שלנו עבורך:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {advisorResponse.recommendations.map((rec, index) => (
              <Card key={index} className="bg-muted/30 p-4">
                <CardTitle className="text-xl text-primary mb-1">{rec.dishName}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-2">מאת: {rec.restaurantName}</CardDescription>
                <p className="text-foreground/90 mb-2">{rec.description}</p>
                <div className="text-xs text-muted-foreground space-x-3 rtl:space-x-reverse mb-2"> {/* Adjusted for RTL */}
                  {rec.estimatedCalories && <span>כ-{rec.estimatedCalories} קלוריות</span>}
                  {rec.estimatedProteinGrams && <span>כ-{rec.estimatedProteinGrams} גרם חלבון</span>}
                </div>
                <p className="text-sm italic text-accent-foreground/80 bg-accent/10 p-2 rounded-md">
                  <Lightbulb className="inline h-4 w-4 ml-1 text-accent"/>{rec.reasoning}
                </p>
              </Card>
            ))}
            {advisorResponse.generalAdvice && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
                    <p className="font-semibold flex items-center"><HeartPulse className="ml-2 h-5 w-5"/>טיפ כללי מהיועץ:</p>
                    <p>{advisorResponse.generalAdvice}</p>
                </div>
            )}
          </CardContent>
           <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">
                    אלו הן המלצות כלליות. מומלץ להתייעץ עם איש מקצוע להתאמה אישית מלאה.
                </p>
           </CardFooter>
        </Card>
      )}
       {advisorResponse && (!advisorResponse.recommendations || advisorResponse.recommendations.length === 0) && !isLoading && (
        <Card className="mt-8 text-center py-10 shadow-md">
          <CardContent>
            <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">לא מצאנו המלצות מתאימות בדיוק.</p>
            <p className="text-sm">אולי כדאי לנסות מטרה אחרת או לשנות את ההעדפות?</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
