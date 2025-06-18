
import LoginForm from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; 

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">ברוכים השבים!</CardTitle>
          <CardDescription>התחבר כדי להמשיך ל-LivePick.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-6 text-center text-sm text-muted-foreground space-y-1">
            <p>
              אין לך חשבון?{' '}
              <Button variant="link" asChild className="p-0 text-primary">
                <Link href="/auth/register"><span>הירשם</span></Link>
              </Button>
            </p>
            <p className="text-xs pt-2 border-t mt-2">
              <strong>לצורך הדגמה:</strong><br />
              לקוח: כל אימייל | סיסמה: `password`<br />
              עסק: `admin@livepick.com` | סיסמה: `password`<br />
              שליח: `courier@livepick.com` | סיסמה: `password`<br />
              סופר אדמין: `superadmin@livepick.com` | סיסמה: `password`
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
