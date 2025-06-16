
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { RestaurantSettings } from '@/types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Palette, GripVertical, ThumbsUp, Type, LayoutTemplate, Star, ClockIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const designFormSchema = z.object({
  primaryColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "קוד HEX לא תקין").optional().or(z.literal('')),
  accentColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "קוד HEX לא תקין").optional().or(z.literal('')),
  dishDisplayStyle: z.enum(['grid', 'list']).default('grid'),
  storeFont: z.enum(['sans', 'serif', 'mono']).default('sans').optional(),
  bannerLayout: z.enum(['textOverImage', 'textBelowImage']).default('textOverImage').optional(),
  showRatingsOnStore: z.boolean().default(true).optional(),
  showDeliveryTimeOnStore: z.boolean().default(true).optional(),
});

const mockExistingDesignSettings: Partial<RestaurantSettings> = {
    primaryColor: '#29ABE2',
    accentColor: '#F2994A',
    dishDisplayStlye: 'grid',
    storeFont: 'sans',
    bannerLayout: 'textOverImage',
    showRatingsOnStore: true,
    showDeliveryTimeOnStore: true,
};

export default function StoreDesignPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof designFormSchema>>({
    resolver: zodResolver(designFormSchema),
    defaultValues: {
      primaryColor: mockExistingDesignSettings.primaryColor || '',
      accentColor: mockExistingDesignSettings.accentColor || '',
      dishDisplayStyle: mockExistingDesignSettings.dishDisplayStlye || 'grid',
      storeFont: mockExistingDesignSettings.storeFont || 'sans',
      bannerLayout: mockExistingDesignSettings.bannerLayout || 'textOverImage',
      showRatingsOnStore: mockExistingDesignSettings.showRatingsOnStore === undefined ? true : mockExistingDesignSettings.showRatingsOnStore,
      showDeliveryTimeOnStore: mockExistingDesignSettings.showDeliveryTimeOnStore === undefined ? true : mockExistingDesignSettings.showDeliveryTimeOnStore,
    },
  });

  const watchedValues = form.watch();

  function onSubmit(values: z.infer<typeof designFormSchema>) {
    console.log(values);
    toast({
      title: 'עיצוב החנות עודכן (דמו)',
      description: 'הגדרות עיצוב החנות שלך נשמרו בהצלחה.',
    });
  }

  const getFontFamilyClass = (fontTheme?: 'sans' | 'serif' | 'mono') => {
    switch (fontTheme) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      case 'sans':
      default:
        return 'font-sans';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">עיצוב החנות והפריסה</CardTitle>
          <CardDescription>התאם אישית את מראה עמוד החנות הציבורי שלך.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>מיתוג חזותי</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="primaryColor" render={({ field }) => (
                      <FormItem>
                        <FormLabel>צבע ראשי (Hex)</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl><Input type="text" placeholder="#29ABE2" {...field} className="w-32"/></FormControl>
                          <div className="w-8 h-8 rounded border" style={{ backgroundColor: field.value || mockExistingDesignSettings.primaryColor }} />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="accentColor" render={({ field }) => (
                      <FormItem>
                        <FormLabel>צבע משני (Hex)</FormLabel>
                         <div className="flex items-center gap-2">
                            <FormControl><Input type="text" placeholder="#F2994A" {...field} className="w-32" /></FormControl>
                             <div className="w-8 h-8 rounded border" style={{ backgroundColor: field.value || mockExistingDesignSettings.accentColor }} />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="storeFont" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Type className="mr-2 h-4 w-4"/> ערכת גופנים לחנות</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="בחר ערכת גופנים..." /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="sans">רגיל (Sans-Serif)</SelectItem>
                          <SelectItem value="serif">אלגנטי (Serif)</SelectItem>
                          <SelectItem value="mono">מודרני (Monospace)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>פריסת עמוד</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <FormField control={form.control} name="bannerLayout" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="flex items-center"><LayoutTemplate className="mr-2 h-4 w-4"/> פריסת באנר ראשי</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col sm:flex-row gap-4">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="textOverImage" /></FormControl>
                            <FormLabel className="font-normal">טקסט על גבי תמונה</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="textBelowImage" /></FormControl>
                            <FormLabel className="font-normal">טקסט מתחת לתמונה</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="dishDisplayStyle" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>סגנון תצוגת מוצרים/שירותים</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col sm:flex-row gap-4">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="grid" /></FormControl>
                              <FormLabel className="font-normal">תצוגת רשת (Grid)</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="list" /></FormControl>
                              <FormLabel className="font-normal">תצוגת רשימה (List)</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>סידור קטגוריות</FormLabel>
                    <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground bg-muted/20">
                        <GripVertical className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">סידור קטגוריות בגרירה ושחרור</p>
                        <p className="text-xs">(בקרוב)</p>
                    </div>
                    <FormDescription>התאם אישית את סדר קטגוריות המוצרים/שירותים בעמוד החנות.</FormDescription>
                  </FormItem>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                    <CardTitle>הצגת מידע</CardTitle>
                    <CardDescription>בחר אילו פרטים יוצגו ללקוחות בעמוד החנות ובכרטיסי המוצר.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="showRatingsOnStore" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base flex items-center"><Star className="mr-2 h-4 w-4 text-yellow-400"/> הצג דירוגים</FormLabel>
                                <FormDescription>האם להציג דירוגי מוצרים/שירותים ללקוחות?</FormDescription>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="showDeliveryTimeOnStore" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base flex items-center"><ClockIcon className="mr-2 h-4 w-4 text-blue-500"/> הצג זמן משלוח/שירות מוערך</FormLabel>
                                 <FormDescription>האם להציג הערכת זמן משלוח או אספקת שירות?</FormDescription>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )}/>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "שומר..." : "שמור הגדרות עיצוב"} <ThumbsUp className="ml-2 h-4 w-4"/>
              </Button>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-1">
            <Card className={cn("sticky top-24", getFontFamilyClass(watchedValues.storeFont))}>
                <CardHeader>
                    <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary"/> תצוגה מקדימה (דמו)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className="border rounded-lg p-4 space-y-3 min-h-[400px] transition-all"
                        style={{
                            // @ts-ignore
                            '--preview-primary': watchedValues.primaryColor || mockExistingDesignSettings.primaryColor,
                            '--preview-accent': watchedValues.accentColor || mockExistingDesignSettings.accentColor,
                        }}
                    >
                        <div className={cn(
                            "h-24 rounded data-ai-hint='store banner preview' bg-cover bg-center relative",
                            {'flex items-center justify-center': watchedValues.bannerLayout === 'textOverImage'},
                            {'mb-2': watchedValues.bannerLayout === 'textBelowImage'}
                           )}
                           style={{backgroundImage: "url('https://placehold.co/300x100.png?text=Banner')"}} >
                           {watchedValues.bannerLayout === 'textOverImage' && (
                             <h2 className="text-xl font-bold text-white p-2 bg-black/50 rounded" style={{fontFamily: 'inherit'}}>שם העסק (דמו)</h2>
                           )}
                        </div>
                        {watchedValues.bannerLayout === 'textBelowImage' && (
                             <h2 className="text-xl font-bold text-center my-2" style={{color: 'var(--preview-primary)', fontFamily: 'inherit'}}>שם העסק (דמו)</h2>
                        )}

                        <h3 className="text-lg font-semibold" style={{ color: 'var(--preview-primary)', fontFamily: 'inherit' }}>מוצרים/שירותים</h3>
                        {watchedValues.showRatingsOnStore && (
                            <div className="flex items-center text-xs" style={{fontFamily: 'inherit'}}>
                                <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400"/> 4.5 (123 ביקורות)
                            </div>
                        )}
                        {watchedValues.showDeliveryTimeOnStore && (
                            <p className="text-xs text-muted-foreground" style={{fontFamily: 'inherit'}}>
                                <ClockIcon className="inline h-3 w-3 mr-1"/> זמן משלוח/אספקה: 20-30 דק'
                            </p>
                        )}
                        <div className={`p-2 border rounded ${watchedValues.dishDisplayStyle === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-2'}`}>
                            {[1,2].map(i => (
                                <div key={i} className="p-2 border rounded bg-card" style={{fontFamily: 'inherit'}}>
                                    <div className="h-10 w-full bg-muted rounded mb-1 data-ai-hint='item image preview'"></div>
                                    <p className="text-sm font-medium">מוצר {i}</p>
                                    <p className="text-xs text-muted-foreground">תיאור קצר...</p>
                                    <p className="text-sm font-semibold" style={{ color: 'var(--preview-accent)' }}>₪10.00</p>
                                </div>
                            ))}
                        </div>
                         <Button style={{ backgroundColor: 'var(--preview-primary)', color: 'hsl(var(--primary-foreground))', fontFamily: 'inherit' }} className="w-full">הוסף לעגלה (דוגמה)</Button>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2 text-center">זוהי תצוגה מקדימה מפושטת. המראה בפועל עשוי להשתנות.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    