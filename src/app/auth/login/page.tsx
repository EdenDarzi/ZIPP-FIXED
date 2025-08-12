
'use client';

import LoginForm from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';

export default function LoginPage() {
  const { t, currentLanguage } = useLanguage();
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12" dir={currentLanguage === 'he' || currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">{t('auth.loginTitle')}</CardTitle>
          <CardDescription>{t('auth.loginSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-6 text-center text-sm text-muted-foreground space-y-1">
            <p>
              {t('auth.noAccount')}{' '}
              <Button variant="link" asChild className="p-0 text-primary">
                <Link href="/auth/register"><span>{t('auth.register')}</span></Link>
              </Button>
            </p>
            <p className="text-xs pt-2 border-t mt-2">
              <strong>{t('demoNote', 'לצורך הדגמה:')}</strong><br />
              {t('customerDemo', 'לקוח: כל אימייל | סיסמה: `password`')}<br />
              {t('businessDemo', 'עסק: `admin@livepick.com` | סיסמה: `password`')}<br />
              {t('courierDemo', 'שליח: `courier@livepick.com` | סיסמה: `password`')}<br />
              {t('superAdminDemo', 'סופר אדמין: `superadmin@livepick.com` | סיסמה: `password`')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
