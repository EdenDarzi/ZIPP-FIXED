
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
import { TimePicker } from '@/components/ui/time-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, PlusCircle, UploadCloud, Info } from 'lucide-react';
import Image from 'next/image';

const operatingHourSchema = z.object({
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  isClosed: z.boolean(),
});

const settingsFormSchema = z.object({
  businessName: z.string().min(2, { message: 'שם העסק חייב להכיל לפחות 2 תווים.' }),
  logoUrl: z.string().url({ message: 'אנא הזן כתובת URL חוקית ללוגו.' }).optional().or(z.literal('')),
  coverImageUrl: z.string().url({ message: 'אנא הזן כתובת URL חוקית לתמונת נושא.' }).optional().or(z.literal('')),
  category: z.string().min(1, { message: 'קטגוריה היא שדה חובה.' }),
  address: z.string().min(5, { message: 'כתובת חייבת להכיל לפחות 5 תווים.' }),
  operatingHours: z.array(operatingHourSchema).length(7, "אנא הגדר שעות פעילות לכל 7 הימים."),
  isOpenNow: z.boolean(),
  specialsStatus: z.string().optional(),
});

const defaultOperatingHours: OperatingHour[] = (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as DayOfWeek[]).map(day => ({
  day,
  openTime: '09:00',
  closeTime: '22:00',
  isClosed: day === 'Sunday', 
}));

const mockExistingSettings: RestaurantSettings = { 
    id: 'business1', 
    businessName: 'העסק המגניב שלי',
    logoUrl: 'https://placehold.co/200x100.png?text=Current+Logo',
    coverImageUrl: 'https://placehold.co/1200x300.png?text=Current+Cover',
    category: 'שירותים כלליים',
    address: 'רחוב ראשי 123, תל אביב',
    operatingHours: defaultOperatingHours,
    isOpenNow: true,
    specialsStatus: 'WEEKEND20 להנחה של 20% בסופי שבוע!'
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

  const { fields } = useFieldArray({
    control: form.control,
    name: "operatingHours",
  });

  function onSubmit(values: z.infer<typeof settingsFormSchema>) {
    console.log(values);
    toast({
      title: 'ההגדרות עודכנו',
      description: 'הגדרות העסק שלך נשמרו בהצלחה.',
    });
  }

  const handleUploadClick = (fieldName: 'logoUrl' | 'coverImageUrl') => {
    toast({
        title: 'העלאת קובץ (דמו)',
        description: `העלאת קבצים עבור ${fieldName === 'logoUrl' ? 'לוגו' : 'תמונת נושא'} תתאפשר בקרוב. בינתיים, אנא השתמש בכתובת URL ישירה לתמונה.`,
        variant: 'default',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">הגדרות העסק</CardTitle>
          <CardDescription>נהל את המידע הכללי של העסק שלך, מראה ושעות פעילות.</CardDescription>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>מידע על העסק</CardTitle>
              <CardDescription>פרטים בסיסיים על העסק שלך. LivePick AI יכול לסייע בהצעת פרטים התחלתיים (בקרוב!).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם העסק</FormLabel>
                    <FormControl>
                      <Input placeholder="לדוגמה: החנות המופלאה, מאפיית הפינה" {...field} />
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
                    <FormLabel>קטגוריה / סוג עסק</FormLabel>
                    <FormControl>
                      <Input placeholder="לדוגמה: אופנה, מאפייה, פרחים, ייעוץ" {...field} />
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
                    <FormLabel>כתובת מלאה</FormLabel>
                    <FormControl>
                      <Input placeholder="לדוגמה: הרצל 10, תל אביב, 12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="text-xs text-muted-foreground p-2 bg-blue-50 border border-blue-200 rounded-md flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                <span>עבור עסקים חדשים, במיוחד עסקים קטנים (מאפיות, פרחים, חנויות פופ-אפ), LivePick AI יכול לעזור לבנות תפריט/קטלוג ראשוני, עיצוב בסיסי והצעות מחיר - תוך דקות (בקרוב!).</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>מיתוג ונראות</CardTitle>
              <CardDescription>העלה את הלוגו ותמונת הנושא שלך.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>כתובת URL של לוגו</FormLabel>
                     {field.value && <Image src={field.value} alt="לוגו נוכחי" width={150} height={75} className="rounded border mb-2 object-contain data-ai-hint='business logo'"/>}
                    <FormControl>
                        <div className="flex items-center gap-2">
                           <Input placeholder="https://example.com/logo.png" {...field} />
                           <Button type="button" variant="outline" onClick={() => handleUploadClick('logoUrl')}><UploadCloud className="mr-2 h-4 w-4" /> העלאה</Button>
                        </div>
                    </FormControl>
                    <FormDescription>כתובת URL ישירה לתמונת הלוגו שלך (למשל PNG, JPG, SVG).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>כתובת URL של תמונת נושא (באנר)</FormLabel>
                    {field.value && <Image src={field.value} alt="תמונת נושא נוכחית" width={600} height={150} className="rounded border mb-2 object-cover data-ai-hint='business cover'"/>}
                    <FormControl>
                         <div className="flex items-center gap-2">
                            <Input placeholder="https://example.com/cover.png" {...field} />
                            <Button type="button" variant="outline" onClick={() => handleUploadClick('coverImageUrl')}><UploadCloud className="mr-2 h-4 w-4" /> העלאה</Button>
                        </div>
                    </FormControl>
                    <FormDescription>כתובת URL לתמונת באנר גדולה לעמוד החנות שלך (מומלץ 1200x300px).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>שעות פעילות</CardTitle>
              <CardDescription>הגדר את שעות הפתיחה והסגירה השבועיות שלך.</CardDescription>
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
                          <FormLabel>יום</FormLabel>
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
                          <FormLabel>שעת פתיחה</FormLabel>
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
                          <FormLabel>שעת סגירה</FormLabel>
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
                          <FormLabel className="text-sm mt-0 sm:ml-2">סגור</FormLabel>
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
              <CardTitle>סטטוס תפעולי</CardTitle>
              <CardDescription>נהל זמינות נוכחית ומבצעים.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="isOpenNow"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">העסק פתוח</FormLabel>
                      <FormDescription>
                        קבע ידנית אם העסק פתוח או סגור להזמנות חדשות. הגדרה זו עוקפת את השעות המתוזמנות.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-label="סטטוס פתיחת העסק"
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
                    <FormLabel>הודעת מבצעים / קופונים</FormLabel>
                    <FormControl>
                      <Input placeholder="לדוגמה: 'SALE20 ל-20% הנחה על כל המוצרים!'" {...field} />
                    </FormControl>
                    <FormDescription>הצג הודעה קצרה על מבצעים או קופונים עדכניים בעמוד החנות שלך.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "שומר..." : "שמור הגדרות"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
