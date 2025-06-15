
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ListChecks, UserCog } from 'lucide-react';

export default function CourierLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-muted/30 border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/courier/open-bids" className="text-xl font-bold text-primary font-headline">
            פורטל השליחים
          </Link>
          <div className="space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/courier/open-bids">
                <ListChecks className="mr-2 h-4 w-4" />
                הצעות פתוחות
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
                <Link href="/courier/profile">
                    <UserCog className="mr-2 h-4 w-4" />
                    הפרופיל שלי
                </Link>
            </Button>
          </div>
        </div>
      </nav>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
