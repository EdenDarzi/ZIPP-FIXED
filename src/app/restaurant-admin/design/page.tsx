
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
import { Palette, GripVertical, ThumbsUp } from 'lucide-react';

const designFormSchema = z.object({
  primaryColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Invalid hex color").optional().or(z.literal('')),
  accentColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Invalid hex color").optional().or(z.literal('')),
  dishDisplayStyle: z.enum(['grid', 'list']).default('grid'),
  // categoryArrangement: z.string().optional(), // For future drag-and-drop or ordering
});

// Mock existing settings - in a real app, this would be fetched
const mockExistingDesignSettings: Partial<RestaurantSettings> = {
    primaryColor: '#29ABE2', // Default app primary
    accentColor: '#F2994A',   // Default app accent
    dishDisplayStlye: 'grid',
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
      title: 'Store Design Updated',
      description: 'Your storefront design settings have been saved.',
    });
    // Here you would typically send data to your backend
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Store Design & Layout</CardTitle>
          <CardDescription>Customize the appearance of your public restaurant page.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Color Scheme</CardTitle>
                  <CardDescription>Choose primary and accent colors for your store page. Leave blank to use app defaults.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color (Hex)</FormLabel>
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
                        <FormLabel>Accent Color (Hex)</FormLabel>
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
                  <CardTitle>Menu Display</CardTitle>
                  <CardDescription>How your dishes are presented on the menu.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="dishDisplayStyle"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Dish Display Style</FormLabel>
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
                              <FormLabel className="font-normal">Grid View</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="list" />
                              </FormControl>
                              <FormLabel className="font-normal">List View</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Category Arrangement</FormLabel>
                    <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground bg-muted/20">
                        <GripVertical className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Drag & drop reordering for categories</p>
                        <p className="text-xs">(Coming Soon)</p>
                    </div>
                    <FormDescription>Customize the order of menu categories on your store page.</FormDescription>
                  </FormItem>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Design Settings"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-1">
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary"/> Live Preview (Mock)</CardTitle>
                    <CardDescription>A simplified preview of your store page.</CardDescription>
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
                           Your Restaurant Banner
                        </div>
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--preview-primary)' }}>Menu Items</h3>
                        <div className={`p-2 border rounded ${form.watch('dishDisplayStyle') === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-2'}`}>
                            {[1,2].map(i => (
                                <div key={i} className="p-2 border rounded bg-card">
                                    <div className="h-10 w-full bg-muted rounded mb-1 data-ai-hint='dish image preview'"></div>
                                    <p className="text-sm font-medium">Dish Name {i}</p>
                                    <p className="text-xs text-muted-foreground">Short description...</p>
                                    <p className="text-sm font-semibold" style={{ color: 'var(--preview-accent)' }}>₪10.00</p>
                                </div>
                            ))}
                        </div>
                         <Button style={{ backgroundColor: 'var(--preview-primary)', color: 'hsl(var(--primary-foreground))' }} className="w-full">Add to Cart (Example)</Button>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2 text-center">This is a simplified mock preview. Actual appearance may vary.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    