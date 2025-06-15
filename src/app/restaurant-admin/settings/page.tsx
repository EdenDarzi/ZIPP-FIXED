
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { RestaurantSettings, OperatingHour, DayOfWeek } from '@/types';
import { TimePicker } from '@/components/ui/time-picker'; // Assuming a time picker component exists or will be created
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, PlusCircle, UploadCloud } from 'lucide-react';
import Image from 'next/image';

const operatingHourSchema = z.object({
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  isClosed: z.boolean(),
});

const settingsFormSchema = z.object({
  businessName: z.string().min(2, { message: 'Business name must be at least 2 characters.' }),
  logoUrl: z.string().url({ message: 'Please enter a valid URL for the logo.' }).optional().or(z.literal('')),
  coverImageUrl: z.string().url({ message: 'Please enter a valid URL for the cover image.' }).optional().or(z.literal('')),
  category: z.string().min(1, { message: 'Category is required.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  operatingHours: z.array(operatingHourSchema).length(7, "Please define hours for all 7 days."),
  isOpenNow: z.boolean(),
  specialsStatus: z.string().optional(),
});

const defaultOperatingHours: OperatingHour[] = (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as DayOfWeek[]).map(day => ({
  day,
  openTime: '09:00',
  closeTime: '22:00',
  isClosed: day === 'Sunday', // Example default
}));

// Mock existing settings - in a real app, this would be fetched
const mockExistingSettings: RestaurantSettings = {
    id: 'restaurant1',
    businessName: 'Pizza Palace Deluxe',
    logoUrl: 'https://placehold.co/200x100.png?text=Current+Logo',
    coverImageUrl: 'https://placehold.co/1200x300.png?text=Current+Cover',
    category: 'Italian',
    address: '123 Main St, Anytown, USA',
    operatingHours: defaultOperatingHours,
    isOpenNow: true,
    specialsStatus: 'WEEKEND20 for 20% off on weekends!'
};


export default function RestaurantSettingsPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: mockExistingSettings || {
      businessName: '',
      logoUrl: '',
      coverImageUrl: '',
      category: '',
      address: '',
      operatingHours: defaultOperatingHours,
      isOpenNow: false,
      specialsStatus: '',
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "operatingHours",
  });

  function onSubmit(values: z.infer<typeof settingsFormSchema>) {
    console.log(values);
    toast({
      title: 'Settings Updated',
      description: 'Your restaurant settings have been successfully saved.',
    });
    // Here you would typically send data to your backend
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Restaurant Settings</CardTitle>
          <CardDescription>Manage your restaurant's general information, appearance, and operational hours.</CardDescription>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Basic details about your restaurant.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Gourmet Place" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category / Cuisine Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Italian, Mexican, Cafe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 123 Foodie Lane, Flavor Town, FT 54321" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branding & Appearance</CardTitle>
              <CardDescription>Upload your logo and cover image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo Image URL</FormLabel>
                     {field.value && <Image src={field.value} alt="Current Logo" width={150} height={75} className="rounded border mb-2 object-contain data-ai-hint='restaurant logo'"/>}
                    <FormControl>
                        <div className="flex items-center gap-2">
                           <Input placeholder="https://example.com/logo.png" {...field} />
                           {/* <Button type="button" variant="outline"><UploadCloud className="mr-2 h-4 w-4" /> Upload (Soon)</Button> */}
                        </div>
                    </FormControl>
                    <FormDescription>Direct URL to your logo image (e.g., PNG, JPG, SVG).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL (Banner)</FormLabel>
                    {field.value && <Image src={field.value} alt="Current Cover" width={600} height={150} className="rounded border mb-2 object-cover data-ai-hint='restaurant banner'"/>}
                    <FormControl>
                         <div className="flex items-center gap-2">
                            <Input placeholder="https://example.com/cover.png" {...field} />
                            {/* <Button type="button" variant="outline"><UploadCloud className="mr-2 h-4 w-4" /> Upload (Soon)</Button> */}
                        </div>
                    </FormControl>
                    <FormDescription>URL for a large banner image for your store page (recommended 1200x300px).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
              <CardDescription>Define your weekly opening and closing times.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4 bg-muted/30">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                    <FormField
                      control={form.control}
                      name={`operatingHours.${index}.day`}
                      render={({ field: dayField }) => (
                        <FormItem>
                          <FormLabel>Day</FormLabel>
                          <FormControl>
                            <Input {...dayField} readOnly className="font-semibold bg-background"/>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`operatingHours.${index}.openTime`}
                      render={({ field: timeField }) => (
                        <FormItem>
                          <FormLabel>Open Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...timeField} disabled={form.watch(`operatingHours.${index}.isClosed`)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`operatingHours.${index}.closeTime`}
                      render={({ field: timeField }) => (
                        <FormItem>
                          <FormLabel>Close Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...timeField} disabled={form.watch(`operatingHours.${index}.isClosed`)} />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`operatingHours.${index}.isClosed`}
                      render={({ field: switchField }) => (
                        <FormItem className="flex flex-col items-start sm:items-center sm:flex-row sm:justify-end gap-2 pt-7">
                           <FormControl>
                            <Switch
                              checked={switchField.value}
                              onCheckedChange={switchField.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm mt-0 sm:ml-2">Closed</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational Status</CardTitle>
              <CardDescription>Manage current availability and specials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="isOpenNow"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Restaurant Open</FormLabel>
                      <FormDescription>
                        Manually set your restaurant as open or closed for new orders. This overrides scheduled hours.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-label="Restaurant open status"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialsStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specials / Coupon Note</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'TASTY20 for 20% off all pizzas!'" {...field} />
                    </FormControl>
                    <FormDescription>Display a short message about current specials or coupons on your store page.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

// Placeholder for TimePicker component. In a real scenario, you might use a library or build one.
// For now, we'll just use <Input type="time" />
// const TimePicker = Input;
