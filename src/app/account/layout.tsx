
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, MapPin, CreditCard, ListOrdered, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

// Mock activePath - in a real app, use usePathname() from next/navigation
// For simplicity, we'll assume it's passed or handled differently for styling active links
// const activePath = "/account/profile"; 

const accountNavItems = [
  { href: '/account/profile', label: 'פרופיל אישי', icon: User },
  { href: '/account/addresses', label: 'ניהול כתובות', icon: MapPin },
  { href: '/account/payment-methods', label: 'אמצעי תשלום', icon: CreditCard },
  { href: '/account/order-history', label: 'היסטוריית הזמנות', icon: ListOrdered },
  { href: '/account/security', label: 'אבטחה והתראות', icon: Shield },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto py-8">
      <div className="md:grid md:grid-cols-12 md:gap-8">
        <aside className="md:col-span-3 lg:col-span-2 mb-8 md:mb-0">
          <h2 className="text-xl font-semibold mb-4 text-primary">החשבון שלי</h2>
          <nav className="flex flex-col space-y-1">
            {accountNavItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                asChild
                className={cn(
                  "w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10",
                  // activePath === item.href && "bg-primary/10 text-primary font-semibold" // Example for active styling
                )}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>
        <main className="md:col-span-9 lg:col-span-10">
          {children}
        </main>
      </div>
    </div>
  );
}
