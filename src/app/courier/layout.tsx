
'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LayoutDashboard, ListChecks, PackageCheck, BarChart3, UserCog, CreditCard, Wallet, LogOut } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context';

const courierNavItems = [
  { href: '/courier/dashboard', labelKey: 'courier.nav.dashboard', labelFallback: 'Dashboard', icon: LayoutDashboard },
  { href: '/courier/open-bids', labelKey: 'courier.nav.openBids', labelFallback: 'Open Bids', icon: ListChecks },
  { href: '/courier/active-orders', labelKey: 'courier.nav.activeOrders', labelFallback: 'Active Orders', icon: PackageCheck },
  { href: '/courier/performance', labelKey: 'courier.nav.performance', labelFallback: 'Performance & Earnings', icon: BarChart3 },
  { href: '/courier/wallet', labelKey: 'courier.nav.wallet', labelFallback: 'Wallet & Payments', icon: Wallet },
  { href: '/courier/profile', labelKey: 'courier.nav.profile', labelFallback: 'Profile & Settings', icon: UserCog },
];

export default function CourierLayout({ children }: { children: ReactNode }) {
  const { isRTL } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <nav className="bg-muted/30 border-b p-4 sticky top-0 z-40">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <Link href="/courier/dashboard" className="text-xl font-bold text-primary font-headline mb-2 sm:mb-0">
            <AutoTranslateText 
              translationKey="courier.portalTitle" 
              fallback="ZIPP - Courier Portal"
            />
          </Link>
          <div className="flex flex-wrap justify-center gap-1">
            {courierNavItems.map((item) => (
              <Button key={item.labelKey} variant="ghost" size="sm" asChild 
                // Add active link styling here if using usePathname from next/navigation
                // className={cn(pathname === item.href && "bg-primary/10 text-primary")}
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  <AutoTranslateText 
                    translationKey={item.labelKey} 
                    fallback={item.labelFallback}
                  />
                </Link>
              </Button>
            ))}
             <Button variant="outline" size="sm" asChild className="border-destructive text-destructive hover:bg-destructive/10">
              <Link href="/auth/login">
                <span className="flex items-center">
                  <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> 
                  <AutoTranslateText 
                    translationKey="courier.logout" 
                    fallback="Logout (Demo)"
                  />
                </span>
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
