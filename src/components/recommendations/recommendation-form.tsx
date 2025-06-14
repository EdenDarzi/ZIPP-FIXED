'use client';

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getItemRecommendations, ItemRecommendationInput } from '@/ai/flows/item-recommendation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2 } from 'lucide-react';

const formSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required.' }),
  orderHistory: z.string().optional().describe('Comma-separated list of item names or IDs'),
  userPreferences: z.string().min(10, { message: 'Preferences must be at least 10 characters.' }),
});

export default function RecommendationForm() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: 'mockUser123', // Default mock user ID
      orderHistory: 'Margherita Pizza, Classic Burger', // Default mock history
      userPreferences: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations([]);
    try {
      const input: ItemRecommendationInput = {
        userId: values.userId,
        orderHistory: values.orderHistory ? values.orderHistory.split(',').map(item => item.trim()).filter(item => item) : [],
        userPreferences: values.userPreferences,
      };
      const result = await getItemRecommendations(input);
      setRecommendations(result.recommendedItems);
      if (result.recommendedItems.length === 0) {
        toast({
            title: 'No specific recommendations found',
            description: "We couldn't find specific recommendations based on your input. Try broadening your preferences!",
            variant: "default"
        });
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to get recommendations. Please try again.',
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
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your User ID" {...field} />
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
                <FormLabel>Order History (comma-separated)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Pizza, Burger, Salad" {...field} />
                </FormControl>
                <FormDescription>
                  List items you&apos;ve ordered before.
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
                <FormLabel>Your Preferences</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., I like spicy food, Italian cuisine, and healthy options."
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
                Getting Recommendations...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" /> Get Recommendations
              </>
            )}
          </Button>
        </form>
      </Form>

      {recommendations.length > 0 && (
        <Card className="mt-8 bg-accent/10">
          <CardHeader>
            <CardTitle className="text-xl font-headline text-primary">Our Suggestions For You</CardTitle>
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
