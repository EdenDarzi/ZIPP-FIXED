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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { UserPlus, Eye, EyeOff, UploadCloud, FileText, MapPin } from 'lucide-react';
import { useState } from 'react';
import type { DeliveryVehicle } from '@/types';

const vehicleTypes: { value: string; label: string }[] = [
  { value: 'motorcycle', label: 'אופנוע' },
  { value: 'car', label: 'רכב פרטי' },
  { value: 'bicycle', label: 'אופניים (רגילים/חשמליים)' },
  { value: 'foot', label: 'הולך רגל' },
  { value: 'scooter', label: 'קטנוע / קורקינט חשמלי' },
];

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'שם מלא חייב להכיל לפחות 2 תווים.' }),
  phone: z.string().regex(/^0\d([\d]{0,1})([-]{0,1})\d{7}$/, { message: 'מספר טלפון לא תקין.' }),
  email: z.string().email({ message: 'כתובת אימייל לא תקינה.' }),
  vehicleType: z.enum(['motorcycle', 'car', 'bicycle', 'foot', 'scooter'], {
    required_error: "חובה לבחור סוג רכב.",
  }),
  city: z.string().min(2, { message: 'עיר מגורים חייבת להכיל לפחות 2 תווים.' }),
  password: z.string().min(6, { message: 'סיסמה חייבת להכיל לפחות 6 תווים.' }),
  confirmPassword: z.string().min(6, { message: 'אישור סיסמה חייב להכיל לפחות 6 תווים.' }),
  licenseNumber: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'חובה לאשר את תנאי השימוש.',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'הסיסמאות אינן תואמות.',
  path: ['confirmPassword'],
});

export default function CourierRegisterForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      vehicleType: undefined,
      city: '',
      password: '',
      confirmPassword: '',
      licenseNumber: '',
      termsAccepted: false,
    },
  });

  const selectedVehicleType = form.watch('vehicleType');
  const isMotorVehicle = selectedVehicleType === 'car' || selectedVehicleType === 'motorcycle' || selectedVehicleType === 'scooter';

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Mock submission
    toast({
      title: 'בקשת הצטרפות נשלחה',
      description: 'פרטיך התקבלו. ניצור איתך קשר להמשך תהליך לאחר בדיקה. (זהו דמו)',
    });
    // In a real app, you'd send data to a backend and likely redirect or show a more detailed success message.
    // For now, we'll just clear the form as an example.
    form.reset();
    // router.push('/auth/login'); // Optional: redirect to login
  }

  const handleMockUpload = (fieldName: string) => {
     toast({
        title: `העלאת ${fieldName} (בקרוב)`,
        description: "אפשרות להעלאת מסמכים תתווסף כאן בקרוב.",
     });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם מלא</FormLabel>
              <FormControl>
                <Input placeholder="לדוגמה: ישראל ישראלי" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>מספר טלפון</FormLabel>
                <FormControl>
                    <Input type="tel" placeholder="לדוגמה: 0501234567" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>אימייל</FormLabel>
                <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>סוג רכב עיקרי</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="בחר סוג רכב..." />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {vehicleTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                            {type.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
                <FormItem>
                <FormLabel>עיר מגורים ראשית</FormLabel>
                <FormControl>
                    <Input placeholder="לדוגמה: תל אביב" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        {isMotorVehicle && (
            <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>מספר רישיון נהיגה (אופציונלי לרכב מנועי)</FormLabel>
                    <FormControl>
                    <Input placeholder="הזן מספר רישיון" {...field} />
                    </FormControl>
                    <FormDescription>רלוונטי רק אם בחרת רכב פרטי, אופנוע או קטנוע.</FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
        )}

        <div className="grid md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel>סיסמה</FormLabel>
                <FormControl>
                    <div className="relative">
                    <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••" 
                        {...field} 
                    />
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    </div>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
                <FormItem>
                <FormLabel>אישור סיסמה</FormLabel>
                <FormControl>
                    <div className="relative">
                    <Input 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••" 
                        {...field} 
                    />
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                    >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    </div>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="space-y-4 pt-4 border-t">
            <FormLabel className="text-base">העלאת מסמכים (בקרוב)</FormLabel>
             <div className="grid sm:grid-cols-2 gap-3">
                <Button type="button" variant="outline" className="w-full justify-start" onClick={() => handleMockUpload('רישיון נהיגה')}>
                    <UploadCloud className="ml-2 h-4 w-4"/> העלאת צילום רישיון נהיגה (בקרוב)
                </Button>
                <Button type="button" variant="outline" className="w-full justify-start" onClick={() => handleMockUpload('תעודת זהות')}>
                    <FileText className="ml-2 h-4 w-4"/> העלאת צילום ת.ז (בקרוב)
                </Button>
             </div>
            <FormDescription>
                <MapPin className="inline h-4 w-4 mr-1 text-muted-foreground"/>
                הערה: הפעלת הרשאות מיקום (GPS) עבור אפליקציית השליחים תהיה חובה לטובת הקצאת משלוחים ומעקב.
            </FormDescription>
        </div>

        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  קראתי ואני מאשר/ת את <Button variant="link" type="button" className="p-0 h-auto" onClick={() => toast({title: "תנאי שימוש (דמו)", description: "תוכן תנאי השימוש יוצג כאן."})}>תנאי השימוש ומדיניות הפרטיות</Button> של LivePick לשליחים.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg" disabled={form.formState.isSubmitting}>
          <UserPlus className="ml-2 h-5 w-5" /> שלח בקשת הצטרפות
        </Button>
      </form>
    </Form>
  );
}

