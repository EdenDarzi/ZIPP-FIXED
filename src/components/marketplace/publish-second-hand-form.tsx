
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, UploadCloud, Send } from 'lucide-react';
import type { SecondHandItemCategory } from '@/types';
import { secondHandCategories } from '@/lib/mock-data';

const formSchema = z.object({
  title: z.string().min(3, { message: 'כותרת המוצר חייבת להכיל לפחות 3 תווים.' }),
  category: z.enum(secondHandCategories as [SecondHandItemCategory, ...SecondHandItemCategory[]], {
    required_error: "חובה לבחור קטגוריה.",
  }),
  price: z.preprocess(
    (val) => parseFloat(val as string),
    z.number({ required_error: "מחיר הוא שדה חובה."}).positive({ message: 'מחיר חייב להיות מספר חיובי.' })
  ),
  description: z.string().min(10, { message: 'תיאור המוצר חייב להכיל לפחות 10 תווים.' }),
  imageUrl1: z.string().url({ message: 'כתובת URL של תמונה ראשית אינה תקינה.' }).or(z.literal('')).optional(),
  dataAiHint1: z.string().optional(),
  imageUrl2: z.string().url({ message: 'כתובת URL של תמונה שנייה אינה תקינה.' }).or(z.literal('')).optional(),
  dataAiHint2: z.string().optional(),
  imageUrl3: z.string().url({ message: 'כתובת URL של תמונה שלישית אינה תקינה.' }).or(z.literal('')).optional(),
  dataAiHint3: z.string().optional(),
  location: z.string().min(2, { message: 'מיקום (עיר/אזור) חייב להכיל לפחות 2 תווים.' }),
  contactDetails: z.string().min(5, {message: 'פרטי יצירת קשר הם שדה חובה (טלפון/מייל).'})
});

type FormValues = z.infer<typeof formSchema>;

export default function PublishSecondHandForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: undefined,
      price: undefined,
      description: '',
      imageUrl1: '',
      dataAiHint1: '',
      imageUrl2: '',
      dataAiHint2: '',
      imageUrl3: '',
      dataAiHint3: '',
      location: '',
      contactDetails: '',
    },
  });

  function onSubmit(values: FormValues) {
    setIsLoading(true);
    console.log('Second-hand item to publish:', values);
    // Mock submission
    setTimeout(() => {
      toast({
        title: 'המוצר נשלח לפרסום!',
        description: `"${values.title}" יופיע בלוח יד 2 לאחר אישור קצר (זהו דמו).`,
      });
      setIsLoading(false);
      form.reset();
      router.push('/marketplace');
    }, 1500);
  }

  const handleMockImageUpload = (fieldName: 'imageUrl1' | 'imageUrl2' | 'imageUrl3') => {
    toast({
        title: 'העלאת תמונה (בקרוב)',
        description: 'אפשרות להעלאת קבצים ישירות מהמכשיר תתווסף בקרוב. בינתיים, אנא השתמש/י בקישור (URL) לתמונה.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>כותרת המוצר</FormLabel><FormControl><Input placeholder="לדוגמה: ספה פינתית במצב טוב" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        
        <div className="grid md:grid-cols-2 gap-4">
            <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>קטגוריה</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="בחר קטגוריה..." /></SelectTrigger></FormControl>
                    <SelectContent>
                        {secondHandCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                    </Select><FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem><FormLabel>מחיר (₪)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="לדוגמה: 150" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>תיאור המוצר</FormLabel><FormControl><Textarea placeholder="פרט על מצב המוצר, גודל, סיבת מכירה וכו'." className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <FormLabel className="text-base font-semibold">תמונות המוצר (עד 3, השתמש בקישורי URL)</FormLabel>
        {[1, 2, 3].map(i => (
          <div key={`image-group-${i}`} className="space-y-2 p-3 border rounded-md bg-muted/20">
            <FormField control={form.control} name={`imageUrl${i}` as keyof FormValues} render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">קישור לתמונה {i}</FormLabel>
                <div className="flex items-center gap-2">
                    <FormControl><Input placeholder={`https://example.com/image${i}.jpg`} {...field as any} /></FormControl>
                    <Button type="button" variant="outline" size="icon" onClick={() => handleMockImageUpload(`imageUrl${i}` as any)}><UploadCloud className="h-4 w-4"/></Button>
                </div>
                <FormMessage />
              </FormItem>
            )}/>
             <FormField control={form.control} name={`dataAiHint${i}` as keyof FormValues} render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">רמז AI לתמונה {i} (אופציונלי)</FormLabel>
                <FormControl><Input placeholder="לדוגמה: כיסא עץ, סמארטפון שחור" {...field as any} /></FormControl>
                <FormDescription className="text-xs">אם התמונה היא Placeholder, עזור ל-AI ליצור תמונה מתאימה.</FormDescription>
                <FormMessage />
              </FormItem>
            )}/>
          </div>
        ))}
        <FormDescription>ניתן להוסיף עד 3 תמונות. השתמש בקישורי URL ישירים לתמונות.</FormDescription>


        <FormField control={form.control} name="location" render={({ field }) => (
          <FormItem><FormLabel>עיר / אזור איסוף</FormLabel><FormControl><Input placeholder="לדוגמה: תל אביב, אזור המרכז" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <FormField control={form.control} name="contactDetails" render={({ field }) => (
          <FormItem><FormLabel>פרטי יצירת קשר (טלפון / מייל)</FormLabel><FormControl><Input placeholder="הטלפון או המייל שלך ליצירת קשר" {...field} /></FormControl>
          <FormDescription>פרט זה יוצג לקונים פוטנציאליים.</FormDescription>
          <FormMessage /></FormItem>
        )}/>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg" disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="ml-2 h-5 w-5 animate-spin" /> מפרסם מוצר...</>
          ) : (
            <><Send className="ml-2 h-5 w-5" /> פרסם את המוצר</>
          )}
        </Button>
      </form>
    </Form>
  );
}
