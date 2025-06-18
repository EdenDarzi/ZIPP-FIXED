
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  name: z.string().min(2, { message: 'שם חייב להכיל לפחות 2 תווים.' }),
  email: z.string().email({ message: 'כתובת אימייל לא תקינה.' }),
  password: z.string().min(6, { message: 'סיסמה חייבת להכיל לפחות 6 תווים.' }),
});

export default function RegisterForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'הרשמה מוצלחת',
      description: 'החשבון שלך נוצר. אנא התחבר.',
    });
    router.push('/auth/login'); 
  }

  const handleSocialRegister = (provider: string) => {
    toast({
      title: `יוצר חשבון באמצעות ${provider}... (הדגמה)`,
      description: `מאמת את פרטיך מול ${provider} ויוצר לך חשבון LivePick.`,
    });
    // Simulate successful registration and redirect
    setTimeout(() => {
      toast({
        title: `חשבון נוצר בהצלחה עם ${provider}!`,
        description: 'אנא התחבר כעת.',
        action: <UserPlus className="text-green-500" />,
      });
      router.push('/auth/login');
    }, 1500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם מלא</FormLabel>
              <FormControl>
                <Input placeholder="ישראל ישראלי" {...field} />
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
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                    className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7" /* Adjusted for RTL */
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
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <UserPlus className="ml-2 h-4 w-4" /> הירשם {/* Adjusted for RTL */}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              או הירשם באמצעות
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button variant="outline" type="button" onClick={() => handleSocialRegister('גוגל')} className="w-full">
            {/* TODO: Add Google Icon */}
            הירשם עם גוגל
          </Button>
          <Button variant="outline" type="button" onClick={() => handleSocialRegister('פייסבוק')} className="w-full">
            {/* TODO: Add Facebook Icon */}
            הירשם עם פייסבוק
          </Button>
          <Button variant="outline" type="button" onClick={() => handleSocialRegister('אפל')} className="w-full">
            {/* TODO: Add Apple Icon */}
            הירשם עם אפל
          </Button>
        </div>
      </form>
    </Form>
  );
}
