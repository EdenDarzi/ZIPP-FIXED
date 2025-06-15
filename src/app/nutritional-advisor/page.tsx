
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
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription as PageCardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import type { NutritionalGoal, DishRecommendation, WeeklyMenu, DailyMealPlan, Meal } from '@/types';
import { getNutritionalAdvice, NutritionalAdvisorInput, NutritionalAdvisorOutput } from '@/ai/flows/nutritional-advisor-flow';
import { generateWeeklyMenu, WeeklyMenuInput, WeeklyMenuOutput } from '@/ai/flows/weekly-menu-planner-flow';
import { Loader2, Sparkles, Utensils, Lightbulb, HeartPulse, Share2, CalendarDays, Info, ListChecks } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const nutritionalGoals: { value: NutritionalGoal; label: string }[] = [
  { value: 'TONING', label: 'חיטוב ובניית שריר' },
  { value: 'WEIGHT_LOSS', label: 'ירידה במשקל' },
  { value: 'ENERGY_BOOST', label: 'הגברת אנרגיה' },
  { value: 'GENERAL_HEALTHY', label: 'תזונה בריאה כללית' },
];

const dishRecommendFormSchema = z.object({
  goal: z.enum(['TONING', 'WEIGHT_LOSS', 'ENERGY_BOOST', 'GENERAL_HEALTHY'], {
    required_error: "חובה לבחור מטרה תזונתית.",
  }),
  preferences: z.string().optional(),
});

type DishRecommendFormValues = z.infer<typeof dishRecommendFormSchema>;

const weeklyMenuFormSchema = z.object({
    targetDailyCalories: z.preprocess(
        (val) => (val === "" || val === undefined ? undefined : Number(val)),
        z.number({ required_error: "חובה להזין יעד קלורי."}).int().positive("יעד קלורי חייב להיות מספר חיובי שלם.").min(1000, "יעד קלורי מינימלי הוא 1000.").max(5000, "יעד קלורי מקסימלי הוא 5000.")
    ),
    numberOfDays: z.enum(['3', '5', '7'], { required_error: "חובה לבחור מספר ימים."}),
});

type WeeklyMenuFormValues = z.infer<typeof weeklyMenuFormSchema>;


export default function NutritionalAdvisorPage() {
  const { toast } = useToast();
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [advisorResponse, setAdvisorResponse] = useState<NutritionalAdvisorOutput | null>(null);
  
  const [isLoadingWeeklyMenu, setIsLoadingWeeklyMenu] = useState(false);
  const [weeklyMenuResponse, setWeeklyMenuResponse] = useState<WeeklyMenuOutput | null>(null);

  const dishForm = useForm<DishRecommendFormValues>({
    resolver: zodResolver(dishRecommendFormSchema),
    defaultValues: {
      goal: undefined,
      preferences: '',
    },
  });

  const menuForm = useForm<WeeklyMenuFormValues>({
    resolver: zodResolver(weeklyMenuFormSchema),
    defaultValues: {
        targetDailyCalories: 2000,
        numberOfDays: '5',
    }
  });

  async function onDishRecommendSubmit(values: DishRecommendFormValues) {
    setIsLoadingRecommendations(true);
    setAdvisorResponse(null);
    try {
      const input: NutritionalAdvisorInput = {
        userId: 'mockUserNutrition123',
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
      setIsLoadingRecommendations(false);
    }
  }

  async function onWeeklyMenuSubmit(values: WeeklyMenuFormValues) {
    setIsLoadingWeeklyMenu(true);
    setWeeklyMenuResponse(null);
    const dishPreferences = dishForm.getValues('preferences'); // Get preferences from the other form

    try {
        const input: WeeklyMenuInput = {
            userId: 'mockUserWeeklyMenu123',
            targetDailyCalories: Number(values.targetDailyCalories),
            numberOfDays: parseInt(values.numberOfDays, 10),
            preferences: dishPreferences,
        };
        const result = await generateWeeklyMenu(input);
        setWeeklyMenuResponse(result);
         if (!result.plan || result.plan.length === 0) {
            toast({ title: "לא הצלחנו ליצור תפריט", description: "נסה לשנות את הקריטריונים שלך או נסה מאוחר יותר."});
        }
    } catch (error) {
        console.error('Error generating weekly menu:', error);
        toast({
            title: 'שגיאה ביצירת תפריט שבועי',
            description: 'אירעה שגיאה. אנא נסה שוב מאוחר יותר.',
            variant: 'destructive',
        });
    } finally {
        setIsLoadingWeeklyMenu(false);
    }
  }

  const handleShareRecommendations = () => {
    if (!advisorResponse || !advisorResponse.recommendations || advisorResponse.recommendations.length === 0) return;
    toast({
      title: "שיתוף המלצות (דמו)",
      description: "המלצות התזונה שלך שותפו!",
    });
  };
  
  const handleShareWeeklyMenu = () => {
    if (!weeklyMenuResponse || !weeklyMenuResponse.plan || weeklyMenuResponse.plan.length === 0) return;
    toast({
      title: "שיתוף תפריט שבועי (דמו)",
      description: "התפריט השבועי שלך שותף!",
    });
  };


  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center items-center">
          <HeartPulse className="h-12 w-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-headline text-primary">יועץ התזונה החכם שלך</CardTitle>
          <PageCardDescription>
            קבל המלצות מותאמות אישית למנות ותכנן תפריט שבועי שיעזרו לך להשיג את מטרות התזונה שלך!
          </PageCardDescription>
        </CardHeader>
        <CardContent>
          <Form {...dishForm}>
            <form onSubmit={dishForm.handleSubmit(onDishRecommendSubmit)} className="space-y-6">
              <FormField
                control={dishForm.control}
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
                control={dishForm.control}
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
                      ספר/י לנו עוד כדי שנוכל להתאים את ההמלצות והתפריט טוב יותר.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg" disabled={isLoadingRecommendations}>
                {isLoadingRecommendations ? (
                  <><Loader2 className="ml-2 h-5 w-5 animate-spin" /> מקבל המלצות למנות...</>
                ) : (
                  <><Sparkles className="ml-2 h-5 w-5" /> קבל המלצות AI למנות</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {advisorResponse && advisorResponse.recommendations && advisorResponse.recommendations.length > 0 && (
        <Card className="mt-8 shadow-lg animate-fadeInUp">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-headline text-accent flex items-center">
                <Utensils className="ml-3 h-7 w-7"/>המלצות השף התזונתי שלנו עבורך:</CardTitle>
            <Button variant="outline" size="icon" onClick={handleShareRecommendations} aria-label="שתף המלצות">
                <Share2 className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {advisorResponse.recommendations.map((rec, index) => (
              <Card key={index} className="bg-muted/30 p-4">
                <CardTitle className="text-xl text-primary mb-1">{rec.dishName}</CardTitle>
                <PageCardDescription className="text-sm text-muted-foreground mb-2">מאת: {rec.restaurantName}</PageCardDescription>
                <p className="text-foreground/90 mb-2">{rec.description}</p>
                <div className="text-xs text-muted-foreground space-x-3 rtl:space-x-reverse mb-2">
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
                    <p className="font-semibold flex items-center"><Info className="ml-2 h-5 w-5"/>טיפ כללי מהיועץ:</p>
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
       {advisorResponse && (!advisorResponse.recommendations || advisorResponse.recommendations.length === 0) && !isLoadingRecommendations && (
        <Card className="mt-8 text-center py-10 shadow-md">
          <CardContent>
            <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">לא מצאנו המלצות מתאימות בדיוק.</p>
            <p className="text-sm">אולי כדאי לנסות מטרה אחרת או לשנות את ההעדפות?</p>
          </CardContent>
        </Card>
      )}

      <Separator className="my-10" />

      {/* Weekly Menu Planning Section */}
      <Card className="shadow-xl">
        <CardHeader className="text-center items-center">
          <CalendarDays className="h-12 w-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-headline text-primary">תכנון תפריט שבועי חכם</CardTitle>
          <PageCardDescription>
            הגדר/י את יעד הקלוריות היומי שלך וקבל/י הצעות לתפריט שבועי מותאם אישית מה-AI.
          </PageCardDescription>
        </CardHeader>
        <CardContent>
            <Form {...menuForm}>
                <form onSubmit={menuForm.handleSubmit(onWeeklyMenuSubmit)} className="space-y-6">
                    <FormField
                        control={menuForm.control}
                        name="targetDailyCalories"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>יעד קלוריות יומי</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="לדוגמה: 2000" {...field} />
                            </FormControl>
                            <FormDescription>כמה קלוריות בערך תרצה/י לצרוך ביום?</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={menuForm.control}
                        name="numberOfDays"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>מספר ימים לתכנון</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="בחר/י מספר ימים..." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="3">3 ימים</SelectItem>
                                <SelectItem value="5">5 ימים</SelectItem>
                                <SelectItem value="7">7 ימים</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     {/* Preferences from the other form will be used, so no need for a field here, but a note might be good */}
                     <p className="text-sm text-muted-foreground"><Info className="inline h-4 w-4 mr-1" />העדפות, הגבלות ומאכלים אהובים יילקחו מהטופס של המלצות המנות למעלה.</p>

                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg" disabled={isLoadingWeeklyMenu}>
                        {isLoadingWeeklyMenu ? (
                        <><Loader2 className="ml-2 h-5 w-5 animate-spin" /> יוצר תפריט שבועי...</>
                        ) : (
                        <><ListChecks className="ml-2 h-5 w-5" /> צור תפריט שבועי AI</>
                        )}
                    </Button>
                </form>
            </Form>
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
                ה-AI ינסה להתאים את התפריט ליעד הקלורי שלך. הערכים הקלוריים הם הערכות בלבד.
            </p>
        </CardFooter>
      </Card>

      {weeklyMenuResponse && weeklyMenuResponse.plan && weeklyMenuResponse.plan.length > 0 && (
        <Card className="mt-8 shadow-lg animate-fadeInUp">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-2xl font-headline text-accent flex items-center">
                    <CalendarDays className="ml-3 h-7 w-7"/>התפריט השבועי שלך:</CardTitle>
                <Button variant="outline" size="icon" onClick={handleShareWeeklyMenu} aria-label="שתף תפריט שבועי">
                    <Share2 className="h-5 w-5" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                    {weeklyMenuResponse.plan.map((dailyPlan, index) => (
                        <AccordionItem value={`day-${index + 1}`} key={index}>
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                <div className="flex justify-between w-full pr-1">
                                    <span>{dailyPlan.day}</span>
                                    <span className="text-sm text-muted-foreground">סה"כ: ~{dailyPlan.totalEstimatedCalories} קלוריות</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pl-2">
                                <ul className="space-y-3">
                                    {dailyPlan.meals.map((meal, mealIndex) => (
                                        <li key={mealIndex} className="p-3 border rounded-md bg-muted/20">
                                            <p className="font-semibold text-primary">{meal.mealType}: <span className="text-foreground font-normal">{meal.dishName}</span></p>
                                            <p className="text-xs text-muted-foreground">~{meal.estimatedCalories} קלוריות</p>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                 {weeklyMenuResponse.summaryNotes && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
                        <p className="font-semibold flex items-center"><Info className="ml-2 h-5 w-5"/>הערות וטיפים לתפריט:</p>
                        <p>{weeklyMenuResponse.summaryNotes}</p>
                    </div>
                )}
            </CardContent>
        </Card>
      )}
      {weeklyMenuResponse && (!weeklyMenuResponse.plan || weeklyMenuResponse.plan.length === 0) && !isLoadingWeeklyMenu && (
        <Card className="mt-8 text-center py-10 shadow-md">
          <CardContent>
            <ListChecks className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">לא הצלחנו ליצור תפריט שבועי.</p>
            <p className="text-sm">אולי כדאי לנסות יעד קלורי אחר או לשנות את ההעדפות?</p>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
