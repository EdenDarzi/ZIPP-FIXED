'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { requestP2PDelivery, P2PDeliveryRequestInputType } from '@/ai/flows/p2p-delivery-request-flow';
import { useState } from 'react';
import { PackagePlus, ShoppingBag, Loader2, Send, User, Phone } from 'lucide-react';

const p2pFormSchema = z.object({
  pickupAddress: z.string().min(5, { message: 'כתובת איסוף חייבת להכיל לפחות 5 תווים.' }),
  destinationAddress: z.string().min(5, { message: 'כתובת יעד חייבת להכיל לפחות 5 תווים.' }),
  packageDescription: z.string().min(3, { message: 'תיאור החבילה חייב להכיל לפחות 3 תווים.' }),
  pickupContactName: z.string().optional(),
  pickupContactPhone: z.string().optional(),
  destinationContactName: z.string().optional(),
  destinationContactPhone: z.string().optional(),
  isPurchaseRequired: z.boolean().default(false).optional(),
  shoppingList: z.string().optional(),
  estimatedBudget: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "תקציב חייב להיות מספר" }).positive({ message: "תקציב חייב להיות חיובי" }).optional()
  ),
  specialInstructions: z.string().optional(),
}).refine(data => {
  if (data.isPurchaseRequired) {
    return !!data.shoppingList && data.shoppingList.length > 0 && data.estimatedBudget !== undefined && data.estimatedBudget > 0;
  }
  return true;
}, {
  message: "אם נדרשת רכישה, יש למלא רשימת קניות ותקציב משוער.",
  path: ['isPurchaseRequired'], // General path, or specific like shoppingList/estimatedBudget
});

type P2PFormValues = z.infer<typeof p2pFormSchema>;

export default function SendPackagePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<string | null>(null);

  const form = useForm<P2PFormValues>({
    resolver: zodResolver(p2pFormSchema),
    defaultValues: {
      pickupAddress: '',
      destinationAddress: '',
      packageDescription: '',
      pickupContactName: '',
      pickupContactPhone: '',
      destinationContactName: '',
      destinationContactPhone: '',
      isPurchaseRequired: false,
      shoppingList: '',
      estimatedBudget: undefined,
      specialInstructions: '',
    },
  });

  const isPurchaseRequired = form.watch('isPurchaseRequired');

  async function onSubmit(values: P2PFormValues) {
    setIsLoading(true);
    setSubmissionResult(null);
    try {
      const input: P2PDeliveryRequestInputType = {
        ...values,
        isPurchaseRequired: values.isPurchaseRequired ?? false,
        estimatedBudget: values.estimatedBudget ? Number(values.estimatedBudget) : undefined,
      };
      const result = await requestP2PDelivery(input);
      
      if (result.status === 'FAILED_VALIDATION') {
         toast({
          title: 'שגיאת אימות',
          description: result.message,
          variant: 'destructive',
        });
      } else {
        setSubmissionResult(result.message);
        toast({
          title: 'הבקשה נשלחה בהצלחה!',
          description: result.message,
        });
        form.reset(); // Reset form on success
      }

    } catch (error) {
      console.error('Error requesting P2P delivery:', error);
      toast({
        title: 'שגיאה בשליחת הבקשה',
        description: 'אירעה שגיאה. אנא נסה שוב מאוחר יותר.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <PackagePlus className="h-12 w-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-headline text-primary">שלח חבילה / בצע שליחות</CardTitle>
          <CardDescription>
            שלח כל דבר, לכל מקום. מלא את הפרטים ונמצא לך שליח.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">פרטי המשלוח</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="pickupAddress" render={({ field }) => (
                    <FormItem><FormLabel>כתובת איסוף מלאה</FormLabel><FormControl><Input placeholder="רחוב, מספר בית, עיר" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="destinationAddress" render={({ field }) => (
                    <FormItem><FormLabel>כתובת יעד מלאה</FormLabel><FormControl><Input placeholder="רחוב, מספר בית, עיר" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="packageDescription" render={({ field }) => (
                    <FormItem><FormLabel>תיאור החבילה/שליחות</FormLabel><FormControl><Textarea placeholder="לדוגמה: מפתחות, מסמכים, איסוף חולצה מחנות ABC" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">פרטי יצירת קשר (אופציונלי)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="pickupContactName" render={({ field }) => (
                            <FormItem><FormLabel><User className="inline h-4 w-4 mr-1"/> איש קשר באיסוף</FormLabel><FormControl><Input placeholder="שם" {...field} /></FormControl></FormItem>
                        )}/>
                        <FormField control={form.control} name="pickupContactPhone" render={({ field }) => (
                            <FormItem><FormLabel><Phone className="inline h-4 w-4 mr-1"/> טלפון באיסוף</FormLabel><FormControl><Input type="tel" placeholder="מספר טלפון" {...field} /></FormControl></FormItem>
                        )}/>
                    </div>
                     <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="destinationContactName" render={({ field }) => (
                            <FormItem><FormLabel><User className="inline h-4 w-4 mr-1"/> איש קשר ביעד</FormLabel><FormControl><Input placeholder="שם" {...field} /></FormControl></FormItem>
                        )}/>
                        <FormField control={form.control} name="destinationContactPhone" render={({ field }) => (
                            <FormItem><FormLabel><Phone className="inline h-4 w-4 mr-1"/> טלפון ביעד</FormLabel><FormControl><Input type="tel" placeholder="מספר טלפון" {...field} /></FormControl></FormItem>
                        )}/>
                    </div>
                </CardContent>
              </Card>
              
              <FormField control={form.control} name="isPurchaseRequired" render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md bg-muted/20">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} id="isPurchaseRequired" /></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="isPurchaseRequired" className="cursor-pointer flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-2 text-accent"/> השליח צריך לרכוש עבורי פריטים?
                    </FormLabel>
                  </div>
                </FormItem>
              )}/>

              {isPurchaseRequired && (
                <Card className="animate-fadeIn bg-accent/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-accent-foreground">פרטי רכישה</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="shoppingList" render={({ field }) => (
                      <FormItem><FormLabel>רשימת קניות (פריט אחד בכל שורה)</FormLabel><FormControl><Textarea placeholder="לדוגמה: לחם אחיד, חלב 3%, 6 ביצים L" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="estimatedBudget" render={({ field }) => (
                      <FormItem><FormLabel>תקציב משוער לרכישה (₪)</FormLabel><FormControl><Input type="number" placeholder="לדוגמה: 50" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                  </CardContent>
                </Card>
              )}
               {form.formState.errors.isPurchaseRequired && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.isPurchaseRequired.message}</p>
              )}


              <FormField control={form.control} name="specialInstructions" render={({ field }) => (
                <FormItem><FormLabel>הוראות מיוחדות לשליח (אופציונלי)</FormLabel><FormControl><Textarea placeholder="לדוגמה: נא להתקשר לפני ההגעה, להשאיר אצל השומר" {...field} /></FormControl></FormItem>
              )}/>
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="ml-2 h-5 w-5 animate-spin" /> מעבד בקשה...</>
                ) : (
                  <><Send className="ml-2 h-5 w-5" /> בקש משלוח</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        {submissionResult && (
          <CardFooter className="bg-green-50 p-4 border-t border-green-200">
            <p className="text-sm text-green-700">{submissionResult}</p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

