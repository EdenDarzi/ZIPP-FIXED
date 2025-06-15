
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, Settings, ListChecks, Palette, ShoppingBasket, BarChart3, ChefHat, LogOut, Users as CourierIcon, Route } from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { href: '/restaurant-admin', label: 'לוח בקרה', icon: LayoutDashboard },
  { href: '/restaurant-admin/settings', label: 'הגדרות עסק', icon: Settings },
  { href: '/restaurant-admin/menu', label: 'ניהול מוצרים/שירותים', icon: ListChecks },
  { href: '/restaurant-admin/design', label: 'עיצוב החנות', icon: Palette },
  { href: '/restaurant-admin/orders', label: 'ניהול הזמנות', icon: ShoppingBasket },
  { href: '/restaurant-admin/delivery-management', label: 'ניהול משלוחים', icon: Route },
  { href: '/restaurant-admin/analytics', label: 'ניתוחים', icon: BarChart3 },
  { href: '/restaurant-admin/courier-management', label: 'ניהול שליחים', icon: CourierIcon },
];

export default function RestaurantAdminLayout({ children }: { children: ReactNode }) {
  // In a real app, you'd get the business name from context/session
  const businessName = "העסק שלי";

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden md:flex flex-col w-64 bg-background border-r">
        <div className="p-4 border-b">
          <Link href="/restaurant-admin" className="flex items-center gap-2 text-lg font-semibold text-primary font-headline">
            <ChefHat className="h-7 w-7" />
            <span>{businessName}</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <nav className="grid items-start px-4 text-sm font-medium">
            {adminNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10 my-1',
                  // Add active link styling here if using usePathname
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4 border-t">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/">
                <span className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" /> יציאה מממשק הניהול
                </span>
              </Link>
            </Button>
        </div>
      </aside>
      <div className="flex flex-col flex-1">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6 sticky top-0 z-30 md:hidden">
            {/* Mobile Nav Trigger - To be implemented if needed */}
            <Link href="/restaurant-admin" className="flex items-center gap-2 text-lg font-semibold text-primary font-headline">
                 <ChefHat className="h-6 w-6" />
                 <span>{businessName}</span>
            </Link>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-6 bg-muted/40">
            <ScrollArea className="h-[calc(100vh-theme(spacing.14)-theme(spacing.12))] md:h-[calc(100vh-theme(spacing.12))]">
                 <div className="p-0 md:p-4"> {children} </div>
            </ScrollArea>
        </main>
      </div>
    </div>
  );
}
