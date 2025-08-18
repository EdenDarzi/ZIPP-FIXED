
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, Home, ChefHat, Truck, Users, Settings, BarChart3, LogOut, ShieldCheck, KeyRound, UserCog, Server, Activity, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import { AutoTranslateText } from '@/components/translation/auto-translate-text';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const { currentLanguage, isRTL } = useLanguage();
  
  const SuperAdminNavItems = [
    { href: '/super-admin', labelKey: 'superAdmin.mainDashboard', labelFallback: 'Main Dashboard', icon: LayoutDashboard },
    { href: '/', labelKey: 'superAdmin.customerView', labelFallback: 'Customer View (Home)', icon: Home },
    { href: '/restaurant-admin', labelKey: 'superAdmin.businessPortal', labelFallback: 'Business Management Portal', icon: ChefHat },
    { href: '/courier/dashboard', labelKey: 'superAdmin.courierPortal', labelFallback: 'Courier Portal', icon: Truck },
    { isSeparator: true },
    { href: '/super-admin/tariff-management', labelKey: 'superAdmin.deliveryTariffs', labelFallback: 'Delivery Tariff Management', icon: DollarSign },
    { href: '/super-admin/user-management', labelKey: 'superAdmin.userManagement', labelFallback: 'User Management (General)', icon: Users },
    { href: '/super-admin/system-settings', labelKey: 'superAdmin.systemSettings', labelFallback: 'System Settings', icon: Settings },
    { href: '/super-admin/access-management', labelKey: 'superAdmin.accessManagement', labelFallback: 'Access Management (IP, 2FA)', icon: KeyRound },
    { href: '/super-admin/subscription-management', labelKey: 'superAdmin.subscriptionManagement', labelFallback: 'Subscription Management', icon: UserCog },
    { href: '/super-admin/global-analytics', labelKey: 'superAdmin.globalAnalytics', labelFallback: 'Global Analytics', icon: BarChart3 },
    { href: '/super-admin/system-logs', labelKey: 'superAdmin.systemLogs', labelFallback: 'System Logs', icon: Server },
    { href: '/super-admin/service-status', labelKey: 'superAdmin.serviceStatus', labelFallback: 'Service Status', icon: Activity },
  ];
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30" dir={currentLanguage === 'he' || currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <aside className="hidden md:flex flex-col w-72 bg-white/80 backdrop-blur-md border-r border-slate-200/60 shadow-xl">
        <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-purple-600 to-blue-600">
          <Link href="/super-admin" className="flex items-center gap-3 text-lg font-bold text-white font-headline group">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-all duration-200">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="group-hover:text-purple-100 transition-colors">
              <AutoTranslateText 
                translationKey="superAdmin.title" 
                fallback="ZIPP - Super Admin"
              />
            </span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-4">
            {SuperAdminNavItems.map((item, index) => 
              item.isSeparator ? (
                <div key={`sep-${index}`} className="my-4 border-t border-slate-200/60" />
              ) : (
              <Link
                key={item.labelKey}
                href={item.href || '#'}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  item.disabled 
                    ? "text-slate-400 cursor-not-allowed bg-slate-50/50" 
                    : "text-slate-700 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:shadow-sm active:scale-[0.98]"
                )}
              >
                <div className={cn(
                  'p-2 rounded-lg transition-all duration-200',
                  item.disabled 
                    ? "bg-slate-100" 
                    : "bg-slate-100 group-hover:bg-purple-100 group-hover:shadow-sm"
                )}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <AutoTranslateText 
                    translationKey={item.labelKey} 
                    fallback={item.labelFallback}
                  />
                </div>
                {item.comingSoon && (
                  <Badge variant="outline" className="text-xs bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 shadow-sm">
                    <AutoTranslateText 
                      translationKey="superAdmin.comingSoon" 
                      fallback="Coming Soon"
                    />
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4 border-t border-slate-200/60">
            <Button 
              variant="outline" 
              className="w-full justify-start bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-700 hover:from-red-100 hover:to-pink-100 hover:border-red-300 transition-all duration-200 shadow-sm" 
              asChild
            >
              <Link href="/auth/login"> 
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-red-100 rounded-lg">
                    <LogOut className="h-4 w-4" /> 
                  </div>
                  <AutoTranslateText 
                    translationKey="superAdmin.logout" 
                    fallback="Logout (Demo)"
                  />
                </div>
              </Link>
            </Button>
        </div>
      </aside>
      <div className="flex flex-col flex-1">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6 sticky top-0 z-30 md:hidden shadow-sm">
            <Link href="/super-admin" className="flex items-center gap-2 text-lg font-semibold text-purple-600 font-headline">
                 <ShieldCheck className="h-6 w-6" />
                 <span>SA</span>
            </Link>
        </header>
        <main className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-blue-50/30">
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
        </main>
      </div>
    </div>
  );
}
