
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
import { mockExistingSettings } from '@/lib/mock-data';
import { UploadCloud, Info, Loader2, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


const operatingHourSchema = z.object({
  day: z.enum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
  openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "פורמט זמן לא תקין (HH:MM)"),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "פורמט זמן לא תקין (HH:MM)"),
  isClosed: z.boolean(),
});

const settingsFormSchema = z.object({
  businessName: z.string().min(2, { message: 'שם העסק חייב להכיל לפחות 2 תווים.' }),
  logoUrl: z.string().url({ message: 'אנא הזן כתובת URL חוקית ללוגו.' }).optional().or(z.literal('')),
  coverImageUrl: z.string().url({ message: 'אנא הזן כתובת URL חוקית לתמונת נושא.' }).optional().or(z.literal('')),
  category: z.string().min(1, { message: 'קטגוריה היא שדה חובה.' }),
  address: z.string().min(5, { message: 'כתובת חייבת להכיל לפחות 5 תווים.' }),
  operatingHours: z.array(operatingHourSchema).length(7, "אנא הגדר שעות פעילות לכל 7 הימים.")
    .refine(hours => {
        for (const oh of hours) {
            if (!oh.isClosed && oh.openTime >= oh.closeTime) {
                return false;
            }
        }
        return true;
    }, { message: "שעת סגירה חייבת להיות מאוחרת משעת הפתיחה עבור ימים פתוחים.", path: ["operatingHours"] }),
  isOpenNow: z.boolean(),
  specialsStatus: z.string().optional(),
});

const daysOfWeek: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const daysOfWeekHebrew: { [key in DayOfWeek]: string } = {
    Sunday: 'יום ראשון', Monday: 'יום שני', Tuesday: 'יום שלישי', Wednesday: 'יום רביעי',
    Thursday: 'יום חמישי', Friday: 'יום שישי', Saturday: 'יום שבת',
};

const typedMockExistingSettings: RestaurantSettings = mockExistingSettings || {
    id: 'temp-id', 
    businessName: '',
    logoUrl: '',
    coverImageUrl: '',
    category: '',
    address: '',
    operatingHours: daysOfWeek.map(day => ({
      day,
      openTime: '09:00',
      closeTime: '17:00',
      isClosed: day === 'Saturday',
    })),
    isOpenNow: false,
    specialsStatus: '',
};


export default function RestaurantSettingsPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
        businessName: typedMockExistingSettings.businessName,
        logoUrl: typedMockExistingSettings.logoUrl || '',
        coverImageUrl: typedMockExistingSettings.coverImageUrl || '',
        category: typedMockExistingSettings.category,
        address: typedMockExistingSettings.address,
        operatingHours: typedMockExistingSettings.operatingHours.length === 7 ? typedMockExistingSettings.operatingHours : daysOfWeek.map(day => ({
            day,
            openTime: '09:00',
            closeTime: '17:00',
            isClosed: day === 'Saturday',
        })),
        isOpenNow: typedMockExistingSettings.isOpenNow,
        specialsStatus: typedMockExistingSettings.specialsStatus || '',
    }
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "operatingHours",
  });

  function onSubmit(values: z.infer<typeof settingsFormSchema>) {
    console.log(values);
    toast({
      title: 'ההגדרות עודכנו (הדגמה)',
      description: 'הגדרות העסק שלך נשמרו בהצלחה.',
    });
  }

  const handleUploadClick = (fieldName: 'logoUrl' | 'coverImageUrl') => {
    toast({
        title: 'העלאת קובץ (הדגמה)',
        description: `העלאת קבצים עבור ${fieldName === 'logoUrl' ? 'לוגו' : 'תמונת נושא'} תתאפשר בקרוב. בינתיים, אנא השתמש בכתובת URL ישירה לתמונה.`,
        variant: 'default',
    });
  };

  const watchedLogoUrl = form.watch('logoUrl');
  const watchedCoverImageUrl = form.watch('coverImageUrl');

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
                <Info className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0"/>
                <span>עבור עסקים חדשים, במיוחד עסקים קטנים (מאפיות, פרחים, חנויות פופ-אפ), LivePick AI יכול לעזור לבנות תפריט/קטלוג ראשוני, עיצוב בסיסי והצעות מחיר - תוך דקות (בקרוב!).</span>
              </div>
              <Alert variant="default" className="bg-green-50 border-green-200">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-700">תמיכה בלקוחות</AlertTitle>
                  <AlertDescription className="text-green-600/90">
                    לקוחות שיש להם שאלות או בעיות בנוגע להזמנות מהעסק שלך יפנו אליך ישירות דרך אפשרויות הצ'אט והתמיכה בדף ההזמנה. אנא וודא שאתה מגיב לפניות אלו בזמן.
                  </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>מיתוג ונראות</CardTitle>
              <CardDescription>העלה את הלוגו ותמונת הנושא שלך (באמצעות קישור URL).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>כתובת URL של לוגו</FormLabel>
                     {watchedLogoUrl && (
                        <div className="my-2 p-2 border rounded-md inline-block bg-muted/20">
                            <Image src={watchedLogoUrl} alt="תצוגה מקדימה של לוגו" width={150} height={75} className="rounded object-contain data-ai-hint='business logo'" />
                        </div>
                     )}
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
                    {watchedCoverImageUrl && (
                         <div className="my-2 p-2 border rounded-md inline-block bg-muted/20">
                            <Image src={watchedCoverImageUrl} alt="תצוגה מקדימה של תמונת נושא" width={600} height={150} className="rounded object-cover data-ai-hint='business cover'" />
                        </div>
                    )}
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
              {fields.map((fieldItem, index) => (
                <Card key={fieldItem.id} className="p-4 bg-muted/30">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                    <FormItem>
                        <FormLabel htmlFor={`operatingHours.${index}.day`}>יום</FormLabel>
                        <FormControl>
                            <Input id={`operatingHours.${index}.day`} value={daysOfWeekHebrew[form.watch(`operatingHours.${index}.day`)]} readOnly className="font-semibold bg-background"/>
                        </FormControl>
                    </FormItem>
                    <FormField
                      control={form.control}
                      name={`operatingHours.${index}.openTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>שעת פתיחה</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} disabled={form.watch(`operatingHours.${index}.isClosed`)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`operatingHours.${index}.closeTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>שעת סגירה</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} disabled={form.watch(`operatingHours.${index}.isClosed`)} />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`operatingHours.${index}.isClosed`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start sm:items-center sm:flex-row sm:justify-end gap-2 pt-7">
                           <FormControl>
                            <Switch
                              id={`operatingHours.${index}.isClosedSwitch`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              aria-label={`העסק סגור ב${daysOfWeekHebrew[form.getValues(`operatingHours.${index}.day`)]}`}
                            />
                          </FormControl>
                          <FormLabel htmlFor={`operatingHours.${index}.isClosedSwitch`} className="text-sm mt-0 sm:ml-2 rtl:sm:ml-0 rtl:sm:mr-2 whitespace-nowrap cursor-pointer">סגור ביום זה</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
               {form.formState.errors.operatingHours && form.formState.errors.operatingHours.root && (
                  <FormMessage>{form.formState.errors.operatingHours.root.message}</FormMessage>
                )}
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
                      <FormLabel htmlFor="isOpenNowSwitch" className="text-base cursor-pointer">העסק פתוח כעת</FormLabel>
                      <FormDescription>
                        קבע ידנית אם העסק פתוח או סגור להזמנות חדשות. הגדרה זו עוקפת את השעות המתוזמנות.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        id="isOpenNowSwitch"
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
                    <FormLabel>הודעת מבצעים / קופונים (אופציונלי)</FormLabel>
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
            {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> שומר...</> : "שמור הגדרות"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
