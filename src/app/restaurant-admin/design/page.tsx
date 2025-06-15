
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
import type { RestaurantSettings } from '@/types'; // Consider renaming RestaurantSettings to BusinessSettings
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Palette, GripVertical, ThumbsUp } from 'lucide-react';

const designFormSchema = z.object({
  primaryColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "קוד HEX לא תקין").optional().or(z.literal('')),
  accentColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "קוד HEX לא תקין").optional().or(z.literal('')),
  dishDisplayStyle: z.enum(['grid', 'list']).default('grid'), // 'dish' might become 'product' or 'item'
  // categoryArrangement: z.string().optional(), // For future drag-and-drop or ordering
});

// Mock existing settings - in a real app, this would be fetched
const mockExistingDesignSettings: Partial<RestaurantSettings> = { // Consider renaming RestaurantSettings
    primaryColor: '#29ABE2', // Default app primary
    accentColor: '#F2994A',   // Default app accent
    dishDisplayStlye: 'grid', // itemDisplayStyle
};

export default function StoreDesignPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof designFormSchema>>({
    resolver: zodResolver(designFormSchema),
    defaultValues: {
      primaryColor: mockExistingDesignSettings.primaryColor || '',
      accentColor: mockExistingDesignSettings.accentColor || '',
      dishDisplayStyle: mockExistingDesignSettings.dishDisplayStlye || 'grid',
    },
  });

  function onSubmit(values: z.infer<typeof designFormSchema>) {
    console.log(values);
    toast({
      title: 'עיצוב החנות עודכן',
      description: 'הגדרות עיצוב החנות שלך נשמרו.',
    });
    // Here you would typically send data to your backend
  }

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
                  <CardTitle>סכמת צבעים</CardTitle>
                  <CardDescription>בחר צבע ראשי וצבע משני (accent) לעמוד החנות שלך. השאר ריק לשימוש בברירות המחדל של האפליקציה.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>צבע ראשי (Hex)</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input type="text" placeholder="#29ABE2" {...field} className="w-32"/>
                          </FormControl>
                          <div className="w-8 h-8 rounded border" style={{ backgroundColor: field.value || '#29ABE2' }} />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accentColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>צבע משני (Hex)</FormLabel>
                         <div className="flex items-center gap-2">
                            <FormControl>
                                <Input type="text" placeholder="#F2994A" {...field} className="w-32" />
                            </FormControl>
                             <div className="w-8 h-8 rounded border" style={{ backgroundColor: field.value || '#F2994A' }} />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>תצוגת מוצרים/שירותים</CardTitle>
                  <CardDescription>כיצד המוצרים או השירותים שלך מוצגים.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="dishDisplayStyle" // itemDisplayStyle
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>סגנון תצוגת מוצרים/שירותים</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row gap-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="grid" />
                              </FormControl>
                              <FormLabel className="font-normal">תצוגת רשת (Grid)</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="list" />
                              </FormControl>
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

              <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "שומר..." : "שמור הגדרות עיצוב"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-1">
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary"/> תצוגה מקדימה (דמו)</CardTitle>
                    <CardDescription>תצוגה מקדימה מפושטת של עמוד החנות שלך.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        className="border rounded-lg p-4 space-y-3 min-h-[300px]"
                        style={{
                            // @ts-ignore
                            '--preview-primary': form.watch('primaryColor') || 'hsl(var(--primary))',
                            '--preview-accent': form.watch('accentColor') || 'hsl(var(--accent))',
                        }}
                    >
                        <div className="h-16 rounded bg-[var(--preview-primary)] flex items-center justify-center text-white font-semibold" data-ai-hint="store banner preview">
                           באנר החנות שלך
                        </div>
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--preview-primary)' }}>מוצרים/שירותים</h3>
                        <div className={`p-2 border rounded ${form.watch('dishDisplayStyle') === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-2'}`}>
                            {[1,2].map(i => (
                                <div key={i} className="p-2 border rounded bg-card">
                                    <div className="h-10 w-full bg-muted rounded mb-1 data-ai-hint='item image preview'"></div>
                                    <p className="text-sm font-medium">שם מוצר {i}</p>
                                    <p className="text-xs text-muted-foreground">תיאור קצר...</p>
                                    <p className="text-sm font-semibold" style={{ color: 'var(--preview-accent)' }}>₪10.00</p>
                                </div>
                            ))}
                        </div>
                         <Button style={{ backgroundColor: 'var(--preview-primary)', color: 'hsl(var(--primary-foreground))' }} className="w-full">הוסף לעגלה (דוגמה)</Button>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2 text-center">זוהי תצוגה מקדימה מפושטת. המראה בפועל עשוי להשתנות.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
