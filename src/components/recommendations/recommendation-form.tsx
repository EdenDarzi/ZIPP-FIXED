'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getItemRecommendations, ItemRecommendationInputType } from '@/ai/flows/item-recommendation';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  userId: z.string().min(1, { message: 'שדה מזהה משתמש הוא חובה.' }),
  orderHistory: z.string().optional().describe('רשימת פריטים מופרדת בפסיקים'),
  userPreferences: z.string().min(10, { message: 'העדפות חייבות להכיל לפחות 10 תווים.' }),
});

export default function RecommendationForm() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: 'mockUser123', // מזהה משתמש דמו
      orderHistory: 'פיצה מרגריטה, המבורגר קלאסי', // היסטוריית הזמנות דמו
      userPreferences: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations([]);
    try {
      const input: ItemRecommendationInputType = {
        userId: values.userId,
        orderHistory: values.orderHistory ? values.orderHistory.split(',').map(item => item.trim()).filter(item => item) : [],
        userPreferences: values.userPreferences,
      };
      const result = await getItemRecommendations(input);
      setRecommendations(result.recommendedItems);
      if (result.recommendedItems.length === 0) {
        toast({
            title: 'לא נמצאו המלצות ספציפיות',
            description: "לא הצלחנו למצוא המלצות ספציפיות על סמך הקלט שלך. נסה להרחיב את העדפותיך!",
            variant: "default"
        });
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: 'שגיאה',
        description: 'נכשל בקבלת המלצות. אנא נסה שוב.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>מזהה משתמש</FormLabel>
                <FormControl>
                  <Input placeholder="הזן מזהה משתמש" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="orderHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>היסטוריית הזמנות (מופרד בפסיקים)</FormLabel>
                <FormControl>
                  <Input placeholder="לדוגמה: פיצה, המבורגר, סלט" {...field} />
                </FormControl>
                <FormDescription>
                  רשום פריטים שהזמנת בעבר.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>העדפות שלך</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="לדוגמה: אני אוהב/ת אוכל חריף, מטבח איטלקי, ואפשרויות בריאות."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                מקבל המלצות...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" /> קבל המלצות
              </>
            )}
          </Button>
        </form>
      </Form>

      {recommendations.length > 0 && (
        <Card className="mt-8 bg-accent/10">
          <CardHeader>
            <CardTitle className="text-xl font-headline text-primary">ההצעות שלנו עבורך</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              {recommendations.map((item, index) => (
                <li key={index} className="text-foreground">{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
