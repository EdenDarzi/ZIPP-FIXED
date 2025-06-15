
import CourierRegisterForm from '@/components/auth/courier-register-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CourierRegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">הצטרפות שליחים ל-LivePick</CardTitle>
          <CardDescription>מלא את פרטיך והצטרף לצוות השליחים שלנו!</CardDescription>
        </CardHeader>
        <CardContent>
          <CourierRegisterForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            משתמש קיים?{' '}
            <Button variant="link" asChild className="p-0 text-primary">
              <Link href="/auth/login"><span>התחבר</span></Link>
            </Button>
          </p>
           <p className="mt-2 text-center text-sm text-muted-foreground">
            רוצה להירשם כלקוח?{' '}
            <Button variant="link" asChild className="p-0 text-primary">
              <Link href="/auth/register"><span>הרשמת לקוחות</span></Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
