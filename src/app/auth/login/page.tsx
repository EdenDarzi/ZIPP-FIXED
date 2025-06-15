
import LoginForm from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Import Button

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
          <p className="mt-6 text-center text-sm text-muted-foreground">
            אין לך חשבון?{' '}
            <Button variant="link" asChild className="p-0 text-primary">
              <Link href="/auth/register"><span>הירשם</span></Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
