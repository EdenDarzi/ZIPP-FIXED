
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LayoutDashboard, ListChecks, PackageCheck, BarChart3, UserCog, CreditCard } from 'lucide-react'; 
import { cn } from '@/lib/utils';

const courierNavItems = [
  { href: '/courier/dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
  { href: '/courier/open-bids', label: 'הצעות פתוחות', icon: ListChecks },
  { href: '/courier/active-orders', label: 'הזמנות פעילות', icon: PackageCheck },
  { href: '/courier/performance', label: 'ביצועים והכנסות', icon: BarChart3 },
  { href: '/courier/profile', label: 'פרופיל והגדרות', icon: UserCog },
  { href: '/courier/subscription', label: 'מנוי ותשלומים', icon: CreditCard },
];

export default function CourierLayout({ children }: { children: ReactNode }) {
  // In a real app, you might get courier's name or status here
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-muted/30 border-b p-4 sticky top-0 z-40">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <Link href="/courier/dashboard" className="text-xl font-bold text-primary font-headline mb-2 sm:mb-0">
            LivePick - פורטל השליחים
          </Link>
          <div className="flex flex-wrap justify-center gap-1">
            {courierNavItems.map((item) => (
              <Button key={item.label} variant="ghost" size="sm" asChild 
                // Add active link styling here if using usePathname from next/navigation
                // className={cn(pathname === item.href && "bg-primary/10 text-primary")}
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </nav>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
