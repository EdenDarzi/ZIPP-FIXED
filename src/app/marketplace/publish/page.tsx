
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackagePlus } from 'lucide-react';
import PublishSecondHandForm from '@/components/marketplace/publish-second-hand-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PublishSecondHandItemPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <Button variant="outline" asChild>
        <Link href="/marketplace">
          <ArrowLeft className="mr-2 h-4 w-4" />
          חזרה ללוח יד 2
        </Link>
      </Button>
      <Card className="shadow-xl">
        <CardHeader className="text-center items-center">
          <PackagePlus className="h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-3xl font-headline text-primary">פרסם מוצר חדש ביד 2</CardTitle>
          <CardDescription>
            מלא את פרטי המוצר שברצונך למכור. פריטים יאושרו לפני הפרסום (דמו).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PublishSecondHandForm />
        </CardContent>
      </Card>
    </div>
  );
}
