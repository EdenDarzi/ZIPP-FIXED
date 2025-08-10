
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, Home, ChefHat, Truck, Users, Settings, BarChart3, LogOut, ShieldCheck, KeyRound, UserCog, Server, Activity, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const { t, currentLanguage } = useLanguage();
  
  const SuperAdminNavItems = [
    { href: '/super-admin', label: t('mainDashboard', 'לוח בקרה ראשי'), icon: LayoutDashboard },
    { href: '/', label: t('customerView', 'תצוגת לקוח (דף הבית)'), icon: Home },
    { href: '/restaurant-admin', label: t('businessManagementPortal', 'פורטל ניהול עסקים'), icon: ChefHat },
    { href: '/courier/dashboard', label: t('courierPortal', 'פורטל שליחים'), icon: Truck },
    { isSeparator: true },
    { href: '/super-admin/tariff-management', label: t('deliveryTariffManagement', 'ניהול תעריפי משלוחים'), icon: DollarSign },
    { href: '#', label: t('userManagementGeneral', 'ניהול משתמשים (כללי)'), icon: Users, disabled: true, comingSoon: true },
    { href: '#', label: t('systemSettings', 'הגדרות מערכת'), icon: Settings, disabled: true, comingSoon: true },
    { href: '#', label: t('accessManagement', 'ניהול גישה (IP, 2FA)'), icon: KeyRound, disabled: true, comingSoon: true },
    { href: '#', label: t('subscriptionManagement', 'ניהול מנויים'), icon: UserCog, disabled: true, comingSoon: true },
    { href: '#', label: t('globalAnalytics', 'ניתוחים גלובליים'), icon: BarChart3, disabled: true, comingSoon: true },
    { href: '#', label: t('systemLogs', 'יומני מערכת'), icon: Server, disabled: true, comingSoon: true },
    { href: '#', label: t('serviceStatus', 'סטטוס שירותים'), icon: Activity, disabled: true, comingSoon: true },
  ];
  
  return (
    <div className="flex min-h-screen bg-muted/40" dir={currentLanguage === 'he' || currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <aside className="hidden md:flex flex-col w-72 bg-background border-r">
        <div className="p-4 border-b">
          <Link href="/super-admin" className="flex items-center gap-2 text-lg font-semibold text-purple-600 font-headline">
            <ShieldCheck className="h-7 w-7" />
            <span>{t('superAdminTitle', 'ZIPP - Super Admin')}</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <nav className="grid items-start px-4 text-sm font-medium">
            {SuperAdminNavItems.map((item, index) => 
              item.isSeparator ? (
                <hr key={`sep-${index}`} className="my-2 border-border" />
              ) : (
              <Button
                key={item.label}
                variant="ghost"
                asChild
                className={cn(
                  'w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10 my-1 py-2.5 text-base',
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
                disabled={item.disabled}
              >
                <Link href={item.href || '#'}>
                  {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                  {item.label}
                  {item.comingSoon && <Badge variant="outline" className="ml-auto text-xs bg-yellow-100 text-yellow-700 border-yellow-300">בקרוב</Badge>}
                </Link>
              </Button>
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4 border-t">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/auth/login"> 
                <span className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" /> יציאה (מדומה)
                </span>
              </Link>
            </Button>
        </div>
      </aside>
      <div className="flex flex-col flex-1">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6 sticky top-0 z-30 md:hidden">
            <Link href="/super-admin" className="flex items-center gap-2 text-lg font-semibold text-purple-600 font-headline">
                 <ShieldCheck className="h-6 w-6" />
                 <span>SA</span>
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
