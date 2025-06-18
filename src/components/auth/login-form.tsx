
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
import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email({ message: 'כתובת אימייל לא תקינה.' }),
  password: z.string().min(6, { message: 'הסיסמה חייבת להכיל לפחות 6 תווים.' }),
});

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    // Mock login logic
    if (values.password === 'password') { // Common password for demo
      if (values.email === 'admin@livepick.com' || values.email === 'restaurant@livepick.com') {
        toast({
          title: 'התחברות מוצלחת (מנהל עסק)',
          description: 'ברוך שובך לפורטל ניהול העסק!',
          action: <LogIn className="text-green-500" />
        });
        router.push('/restaurant-admin');
        return;
      } else if (values.email === 'courier@livepick.com') {
        toast({
          title: 'התחברות מוצלחת (שליח)',
          description: 'ברוך שובך לפורטל השליחים!',
          action: <LogIn className="text-green-500" />
        });
        router.push('/courier/dashboard');
        return;
      } else if (values.email === 'superadmin@livepick.com') {
        toast({
          title: 'התחברות מוצלחת (סופר אדמין)',
          description: 'ברוך שובך לפורטל ניהול המערכת!',
          action: <ShieldCheck className="text-purple-500" />
        });
        router.push('/super-admin');
        return;
      } else {
        toast({
          title: 'התחברות מוצלחת (לקוח)',
          description: 'ברוך שובך ל-LivePick!',
          action: <LogIn className="text-green-500" />
        });
        router.push('/'); 
        return;
      }
    }

    toast({
      title: 'שגיאת התחברות',
      description: 'שם משתמש או סיסמה אינם נכונים. (הדגמה)',
      variant: 'destructive',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <LogIn className="ml-2 h-4 w-4" /> התחבר
        </Button>
      </form>
    </Form>
  );
}
