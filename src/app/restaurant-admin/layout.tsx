
'use client'; // Required for useRouter and useToast

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, Settings, ListChecks, Palette, ShoppingBasket, BarChart3, ChefHat, LogOut, Users as CourierIcon, Route, Lightbulb, Megaphone, CreditCard, Wallet, Banknote } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast'; 
import { useRouter } from 'next/navigation';
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context'; 

const adminNavItems = [
  { href: '/restaurant-admin', labelKey: 'restaurantAdmin.dashboard', labelFallback: 'Dashboard', icon: LayoutDashboard },
  { href: '/restaurant-admin/settings', labelKey: 'restaurantAdmin.businessSettings', labelFallback: 'Business Settings', icon: Settings },
  { href: '/restaurant-admin/menu', labelKey: 'restaurantAdmin.manageProducts', labelFallback: 'Manage Products/Services', icon: ListChecks },
  { href: '/restaurant-admin/design', labelKey: 'restaurantAdmin.storeDesign', labelFallback: 'Store Design', icon: Palette },
  { href: '/restaurant-admin/orders', labelKey: 'restaurantAdmin.orderManagement', labelFallback: 'Order Management', icon: ShoppingBasket },
  { href: '/restaurant-admin/delivery-management', labelKey: 'restaurantAdmin.deliveryManagement', labelFallback: 'Delivery Management', icon: Route },
  { href: '/restaurant-admin/promotions', labelKey: 'restaurantAdmin.promotionManagement', labelFallback: 'Promotion Management', icon: Megaphone },
  { href: '/restaurant-admin/analytics', labelKey: 'restaurantAdmin.analyticsRevenue', labelFallback: 'Analytics & Revenue', icon: BarChart3 }, 
  { href: '/restaurant-admin/courier-management', labelKey: 'restaurantAdmin.courierManagement', labelFallback: 'Courier Management (View)', icon: CourierIcon },
  { href: '/restaurant-admin/trending-insights', labelKey: 'restaurantAdmin.trendInsights', labelFallback: 'Trend Insights', icon: Lightbulb },
  { href: '/restaurant-admin/wallet', labelKey: 'restaurantAdmin.businessWallet', labelFallback: 'Business Wallet & Billing', icon: Banknote }, 
];

export default function RestaurantAdminLayout({ children }: { children: ReactNode }) {
  const { isRTL } = useLanguage(); 

  return (
    <div className="flex min-h-screen bg-muted/40" dir={isRTL ? 'rtl' : 'ltr'}>
      <aside className="hidden md:flex flex-col w-64 bg-background border-r">
        <div className="p-4 border-b">
          <Link href="/restaurant-admin" className="flex items-center gap-2 text-lg font-semibold text-primary font-headline">
            <ChefHat className="h-7 w-7" />
            <span>
              <AutoTranslateText 
                translationKey="restaurantAdmin.myBusiness" 
                fallback="My Business"
              />
            </span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <nav className="grid items-start px-4 text-sm font-medium">
            {adminNavItems.map((item) => (
              <Link
                key={item.labelKey}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10 my-1', 
                  
                )}
              >
                <item.icon className="h-4 w-4" />
                <AutoTranslateText 
                  translationKey={item.labelKey} 
                  fallback={item.labelFallback}
                />
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4 border-t">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/auth/login">
                <span className="flex items-center">
                  <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> 
                  <AutoTranslateText 
                    translationKey="restaurantAdmin.logout" 
                    fallback="Logout (Demo)"
                  />
                </span>
              </Link>
            </Button>
        </div>
      </aside>
      <div className="flex flex-col flex-1">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6 sticky top-0 z-30 md:hidden">
            
            <Link href="/restaurant-admin" className="flex items-center gap-2 text-lg font-semibold text-primary font-headline">
                 <ChefHat className="h-6 w-6" />
                 <span>
                   <AutoTranslateText 
                     translationKey="restaurantAdmin.myBusiness" 
                     fallback="My Business"
                   />
                 </span>
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
