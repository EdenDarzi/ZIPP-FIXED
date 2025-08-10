
'use client';

import RegisterForm from '@/components/auth/register-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';

export default function RegisterPage() {
  const { t, currentLanguage } = useLanguage();
  
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12" dir={currentLanguage === 'he' || currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">{t('createAccount', 'צור חשבון')}</CardTitle>
          <CardDescription>{t('joinLivePick', 'הצטרף ל-LivePick והתחל להזמין עוד היום!')}</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t('alreadyHaveAccount', 'יש לך כבר חשבון?')}{' '}
            <Button variant="link" asChild className="p-0 text-primary">
              <Link href="/auth/login"><span>{t('login', 'התחבר')}</span></Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
