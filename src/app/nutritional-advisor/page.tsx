
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
import type { NutritionalGoal, DishRecommendation } from '@/types';
import { getNutritionalAdvice, NutritionalAdvisorInput, NutritionalAdvisorOutput } from '@/ai/flows/nutritional-advisor-flow';
import { generateWeeklyMenu, WeeklyMenuInput, WeeklyMenuOutput } from '@/ai/flows/weekly-menu-planner-flow';
import { Loader2, Sparkles, Utensils, Lightbulb, HeartPulse, Share2, CalendarDays, Info, ListChecks, ShoppingBasket, BarChart3, CheckCircle, Apple, Activity as ActivityIcon, PackageSearch } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const nutritionalGoals: { value: NutritionalGoal; label: string }[] = [
  { value: 'TONING', label: 'חיטוב ובניית שריר' },
  { value: 'WEIGHT_LOSS', label: 'ירידה במשקל' },
  { value: 'ENERGY_BOOST', label: 'הגברת אנרגיה' },
  { value: 'GENERAL_HEALTHY', label: 'תזונה בריאה כללית' },
  { value: 'MUSCLE_GAIN', label: 'עלייה במסת שריר' },
  { value: 'SUGAR_BALANCE', label: 'איזון רמות סוכר' },
  { value: 'KETO', label: 'דיאטה קטוגנית' },
  { value: 'VEGETARIAN', label: 'דיאטה צמחונית' },
  { value: 'PALEO', label: 'דיאטה פליאו' },
];

const dishRecommendFormSchema = z.object({
  goal: z.enum(['TONING', 'WEIGHT_LOSS', 'ENERGY_BOOST', 'GENERAL_HEALTHY', 'MUSCLE_GAIN', 'SUGAR_BALANCE', 'KETO', 'VEGETARIAN', 'PALEO'], {
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = await getNutritionalAdvice(input);
      setAdvisorResponse(result);
      if (!result.recommendations || result.recommendations.length === 0) {
         toast({ title: "לא נמצאו המלצות ספציфиות", description: "נסה לשנות את ההעדפות או המטרה שלך."});
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
    const dishPreferences = dishForm.getValues('preferences'); 

    try {
        const input: WeeklyMenuInput = {
            userId: 'mockUserWeeklyMenu123',
            targetDailyCalories: Number(values.targetDailyCalories),
            numberOfDays: parseInt(values.numberOfDays, 10),
            preferences: dishPreferences,
        };
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
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
      title: "שיתוף המלצות (הדגמה)",
      description: "ההמלצות שלך שותפו! (מנגנון השיתוף יפותח).",
    });
  };
  
  const handleShareWeeklyMenu = () => {
    if (!weeklyMenuResponse || !weeklyMenuResponse.plan || weeklyMenuResponse.plan.length === 0) return;
    toast({
      title: "שיתוף תפריט שבועי (הדגמה)",
      description: "התפריט השבועי שלך שותף! (אפשרויות שיתוף עם בן/בת זוג או מאמן יפותחו).",
    });
  };

  const handleOrderWeeklyMenu = () => {
    if (!weeklyMenuResponse || !weeklyMenuResponse.plan || weeklyMenuResponse.plan.length === 0) return;
    toast({
        title: "הזמנת תפריט שבועי (הדגמה)",
        description: "ההזמנה שלך נשלחה! המשלוחים יחולקו בצורה חכמה לפי ימים וארוחות. (זוהי הדגמה של תהליך).",
    });
  };

  const handleCreateSmartBasket = () => {
    if (!weeklyMenuResponse || !weeklyMenuResponse.plan || weeklyMenuResponse.plan.length === 0) return;
     toast({
        title: "יצירת סל קניות חכם (הדגמה)",
        description: "סל קניות חכם נוצר מהתפריט השבועי. (אפשרויות לבחירת מסעדות או קניית מצרכים יפותחו).",
    });
  };

  const handleFinishedMeal = () => {
    toast({ title: "הארוחה עודכנה (הדגמה)", description: "הארוחה סומנה כאכולה! נתוני המעקב שלך עודכנו. (זוהי הדגמה)." });
  };
  
  const handleReplaceMenu = async () => {
     if (!weeklyMenuResponse || !weeklyMenuResponse.plan || weeklyMenuResponse.plan.length === 0) {
       toast({ title: "אין תפריט להחלפה", description: "אנא צור תפריט תחילה.", variant: "destructive" });
       return;
     }
    toast({ title: "מחליף תפריט... (הדגמה)", description: "ה-AI שלנו מנסה ליצור עבורך תפריט חלופי. אנא המתן." });
    setIsLoadingWeeklyMenu(true); // Use the same loading state
    // Re-use the current form values for weekly menu to generate a new one
    const currentMenuValues = menuForm.getValues();
    const dishPreferences = dishForm.getValues('preferences');
    try {
        const input: WeeklyMenuInput = {
            userId: 'mockUserWeeklyMenu123_replace', // Different user for variation
            targetDailyCalories: Number(currentMenuValues.targetDailyCalories),
            numberOfDays: parseInt(currentMenuValues.numberOfDays, 10),
            preferences: dishPreferences,
        };
        await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate longer delay for replacement
        const result = await generateWeeklyMenu(input); // This will generate a potentially different menu
        setWeeklyMenuResponse(result);
        toast({ title: "תפריט חדש נוצר!", description: "התפריט השבועי שלך הוחלף בהצלחה."});
    } catch (error) {
        console.error('Error replacing weekly menu:', error);
        toast({ title: 'שגיאה בהחלפת תפריט', description: 'אירעה שגיאה. אנא נסה שוב.', variant: 'destructive' });
    } finally {
      setIsLoadingWeeklyMenu(false);
    }
  };

  const handleConnectHealthApp = (appName: string) => {
    toast({
        title: `חיבור ל-${appName} (הדגמה)`,
        description: `החיבור לאפליקציית ${appName} בפיתוח ויאפשר סנכרון נתוני בריאות.`,
    });
  };

  const handleSelectRoutine = (routineName: string) => {
    toast({
        title: `שגרת "${routineName}" נבחרה (הדגמה)`,
        description: `ה-AI יבנה לך כעת תפריט שבועי מותאם לשגרה זו. (הפונקציונליות בפיתוח).`,
    });
  };
  
  const handleViewChallenges = () => {
     toast({
        title: "אתגרי תזונה (הדגמה)",
        description: "עמוד אתגרי התזונה שלך עם משימות ופרסים יוצג כאן. (הפונקציונליות בפיתוח).",
    });
  };


  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center items-center">
          <HeartPulse className="h-12 w-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-headline text-primary">יועץ התזונה והתפריטים החכם שלך</CardTitle>
          <PageCardDescription>
            קבל המלצות מותאמות אישית למנות, תכנן תפריט שבועי ואפילו הגדר סל קבוע שיעזרו לך להשיג את מטרות התזונה שלך עם LivePick!
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
                <PageCardDescription className="text-sm text-muted-foreground mb-2">מאת: {rec.restaurantName} (הערכה)</PageCardDescription>
                <p className="text-foreground/90 mb-2">{rec.description}</p>
                <div className="text-xs text-muted-foreground space-x-3 rtl:space-x-reverse mb-2">
                  {rec.estimatedCalories && <span>כ-{rec.estimatedCalories} קלוריות</span>}
                  {rec.estimatedProteinGrams && <span>כ-{rec.estimatedProteinGrams} גרם חלבון</span>}
                </div>
                <p className="text-sm italic text-accent-foreground/80 bg-accent/10 p-2 rounded-md">
                  <Lightbulb className="inline h-4 w-4 ml-1 text-accent"/>{rec.reasoning}
                </p>
                 <p className="text-xs text-muted-foreground mt-1">המלצה מותאמת לזמינות מסעדות באזורך (הדגמה).</p>
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

      <Card className="shadow-xl">
        <CardHeader className="text-center items-center">
          <CalendarDays className="h-12 w-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-headline text-primary">תכנון תפריט שבועי חכם</CardTitle>
          <PageCardDescription>
            הגדר/י את יעד הקלוריות היומי שלך וקבל/י הצעות לתפריט שבועי מותאם אישית מה-AI. התפריט ינסה להתאים את עצמו לזמינות מסעדות באזורך (הדגמה).
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
            <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <CardTitle className="text-2xl font-headline text-accent flex items-center">
                    <CalendarDays className="ml-3 h-7 w-7"/>התפריט השבועי שלך:
                </CardTitle>
                <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
                    <Button variant="outline" size="sm" onClick={handleReplaceMenu} aria-label="החלף תפריט" disabled={isLoadingWeeklyMenu}>
                        <Sparkles className="h-4 w-4 ml-1"/> החלף תפריט
                    </Button>
                     <Button variant="outline" size="sm" onClick={handleShareWeeklyMenu} aria-label="שתף תפריט שבועי">
                        <Share2 className="h-4 w-4 ml-1" /> שתף תפריט
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground text-center">הערה: ההמלצות מותאמות לזמינות מסעדות באזורך (הדגמה).</p>
                <Accordion type="single" collapsible className="w-full" defaultValue="day-1">
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
            <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-4">
                <Button onClick={handleOrderWeeklyMenu} variant="default" className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white">
                    <ShoppingBasket className="ml-2 h-4 w-4" /> הזמן את התפריט השבועי
                </Button>
                 <Button onClick={handleCreateSmartBasket} variant="outline" className="w-full sm:flex-1">
                    <Sparkles className="ml-2 h-4 w-4" /> צור סל קניות חכם
                </Button>
            </CardFooter>
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

      <Separator className="my-10" />

      <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="text-xl font-headline text-primary flex items-center">
                <BarChart3 className="ml-2 h-5 w-5" /> מעקב התקדמות תזונתית
            </CardTitle>
            <PageCardDescription>עקוב אחר צריכת הקלוריות, החלבונים, השומנים והפחמימות שלך לאורך זמן.</PageCardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
            <div className="p-6 border border-dashed rounded-md bg-muted/20">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">כאן יוצגו גרפים של הצריכה היומית/שבועית שלך.</p>
                <p className="text-xs text-muted-foreground">(הדגמת קונספט - פונקציונליות בפיתוח)</p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm text-left">
                <p className="font-semibold flex items-center"><Info className="ml-1 h-4 w-4"/> התראה לדוגמה:</p>
                 <p>היום צרכת פחות מדי חלבון. האם תרצה/י שנוסיף מנה עשירה בחלבון להזמנה הבאה שלך? (לחץ <Button variant="link" size="sm" className="p-0 h-auto text-yellow-700" onClick={() => toast({title:"הצעה נוספה!", description:"מנת חלבון מומלצת נוספה לעגלה שלך (הדגמה)."})}>כאן</Button> להצעה).</p>
            </div>
            <Button onClick={handleFinishedMeal} variant="outline">
                <CheckCircle className="ml-2 h-4 w-4 text-green-500"/> סיימתי את הארוחה (הדגמה)
            </Button>
        </CardContent>
      </Card>

      <Separator className="my-10" />
       <div className="space-y-6">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-headline text-primary flex items-center">
                         <ActivityIcon className="ml-2 h-5 w-5" /> שילוב עם נתוני בריאות
                    </CardTitle>
                    <PageCardDescription>חבר את חשבון LivePick שלך לאפליקציות בריאות לקבלת המלצות מדויקות יותר המבוססות על רמות הפעילות, שריפת הקלוריות ושעות השינה שלך.</PageCardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={() => handleConnectHealthApp('Apple Health')}><Apple className="ml-2 h-4 w-4" /> חבר ל-Apple Health</Button>
                        <Button variant="outline" onClick={() => handleConnectHealthApp('Google Fit')}><Sparkles className="ml-2 h-4 w-4" /> חבר ל-Google Fit</Button>
                    </div>
                     <p className="text-xs text-muted-foreground">(הדגמת קונספט - פונקציונליות בפיתוח)</p>
                </CardContent>
            </Card>
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-headline text-primary flex items-center">
                        <CalendarDays className="ml-2 h-5 w-5" /> שגרות חכמות
                    </CardTitle>
                     <PageCardDescription>בחר תבניות תזונה מוכנות מראש שה-AI יתאים עבורך.</PageCardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                    <p className="text-sm">לדוגמה: "ימי אכילה קבועים", "שבוע ניקוי רעלים", "שבוע חלבון גבוה", "שבוע ארוחות מהירות".</p>
                    <Button variant="outline" onClick={() => handleSelectRoutine('ימי אכילה קבועים')}>בחר שגרה (הדגמה)</Button>
                    <p className="text-xs text-muted-foreground">(הדגמת קונספט - פונקציונליות בפיתוח)</p>
                </CardContent>
            </Card>
             <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-headline text-primary flex items-center">
                        <Sparkles className="ml-2 h-5 w-5" /> אתגר התזונה שלך
                    </CardTitle>
                    <PageCardDescription>צבור נקודות, השג תגים והשלם משימות תזונה כדי לזכות בפרסים!</PageCardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                    <p className="text-sm">לדוגמה: "השלמת שבוע זהב" = משלוח מתנה. "אכול 3 ירקות שונים ביום".</p>
                    <Button variant="outline" onClick={handleViewChallenges}>הצג אתגרים (הדגמה)</Button>
                    <p className="text-xs text-muted-foreground">(הדגמת קונספט - פונקציונליות בפיתוח)</p>
                </CardContent>
            </Card>
       </div>

    </div>
  );
}
    
