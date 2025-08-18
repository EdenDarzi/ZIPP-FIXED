
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
import { Loader2, UploadCloud, Send, Image as ImageIcon } from 'lucide-react';
import type { SecondHandItemCategory } from '@/types';
import { secondHandCategories } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import type { CreateMarketplaceItemRequest } from '@/types/marketplace';

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
  const { t } = useLanguage();

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

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/marketplace/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה ביצירת המוצר');
      }

      toast({
        title: t('marketplace.publish.success.title'),
        description: `"${values.title}" ${t('marketplace.publish.success.description')}`,
      });
      
      form.reset();
      router.push('/marketplace');
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'שגיאה',
        description: error instanceof Error ? error.message : 'שגיאה לא צפויה אירעה',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleMockImageUpload = (fieldName: 'imageUrl1' | 'imageUrl2' | 'imageUrl3') => {
    toast({
        title: t('marketplace.publish.imageUpload.title'),
        description: t('marketplace.publish.imageUpload.description'),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>{t('marketplace.publish.form.title')}</FormLabel><FormControl><Input placeholder={t('marketplace.publish.form.titlePlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        
        <div className="grid md:grid-cols-2 gap-4">
            <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>{t('marketplace.publish.form.category')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder={t('marketplace.publish.form.categoryPlaceholder')} /></SelectTrigger></FormControl>
                    <SelectContent>
                        {secondHandCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                    </Select><FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem><FormLabel>{t('marketplace.publish.form.price')}</FormLabel><FormControl><Input type="number" step="0.01" placeholder={t('marketplace.publish.form.pricePlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>{t('marketplace.publish.form.description')}</FormLabel><FormControl><Textarea placeholder={t('marketplace.publish.form.descriptionPlaceholder')} className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <Card>
            <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold flex items-center"><ImageIcon className="mr-2 h-5 w-5 text-primary"/> {t('marketplace.publish.form.images')}</CardTitle>
                <FormDescription className="text-xs">{t('marketplace.publish.form.imagesDesc')}</FormDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                {[1, 2, 3].map(i => (
                <div key={`image-group-${i}`} className="space-y-3 p-3 border rounded-md bg-muted/30">
                    <FormField control={form.control} name={`imageUrl${i}` as keyof FormValues} render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm">{t('marketplace.publish.form.imageUrl')} {i}</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl><Input placeholder={`https://example.com/image${i}.jpg`} {...field as any} /></FormControl>
                            <Button type="button" variant="outline" size="icon" onClick={() => handleMockImageUpload(`imageUrl${i}` as any)} title="העלה קובץ">
                                <UploadCloud className="h-4 w-4"/>
                            </Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}/>
                    <FormField control={form.control} name={`dataAiHint${i}` as keyof FormValues} render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs">{t('marketplace.publish.form.aiHint')} {i} (אופציונלי)</FormLabel>
                        <FormControl><Input placeholder={t('marketplace.publish.form.aiHintPlaceholder')} {...field as any} className="text-xs h-8"/></FormControl>
                        <FormDescription className="text-xs">{t('marketplace.publish.form.aiHintDesc')}</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}/>
                </div>
                ))}
            </CardContent>
        </Card>


        <FormField control={form.control} name="location" render={({ field }) => (
          <FormItem><FormLabel>{t('marketplace.publish.form.location')}</FormLabel><FormControl><Input placeholder={t('marketplace.publish.form.locationPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <FormField control={form.control} name="contactDetails" render={({ field }) => (
          <FormItem><FormLabel>{t('marketplace.publish.form.contact')}</FormLabel><FormControl><Input placeholder={t('marketplace.publish.form.contactPlaceholder')} {...field} /></FormControl>
          <FormDescription>{t('marketplace.publish.form.contactDesc')}</FormDescription>
          <FormMessage /></FormItem>
        )}/>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg" disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="ml-2 h-5 w-5 animate-spin" /> {t('marketplace.publish.form.submitting')}</>
          ) : (
            <><Send className="ml-2 h-5 w-5" /> {t('marketplace.publish.form.submit')}</>
          )}
        </Button>
      </form>
    </Form>
  );
}
