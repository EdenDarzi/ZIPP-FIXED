
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, Home, ChefHat, Truck, Users, Settings, BarChart3, LogOut, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { useRouter } from 'next/navigation'; // Import useRouter


const SuperAdminNavItems = [
  { href: '/super-admin', label: 'לוח בקרה ראשי', icon: LayoutDashboard },
  { href: '/', label: 'תצוגת לקוח (דף הבית)', icon: Home },
  { href: '/restaurant-admin', label: 'פורטל ניהול עסקים', icon: ChefHat },
  { href: '/courier/dashboard', label: 'פורטל שליחים', icon: Truck },
  { isSeparator: true },
  { href: '#', label: 'ניהול משתמשים (כללי)', icon: Users, disabled: true },
  { href: '#', label: 'הגדרות מערכת גלובליות', icon: Settings, disabled: true },
  { href: '#', label: 'ניתוחים גלובליים', icon: BarChart3, disabled: true },
];

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  // const { toast } = useToast(); // This line will cause an error as hooks can only be used in client components
  // const router = useRouter(); // This line will also cause an error

  // For server components, actions like logout need to be handled differently,
  // typically via server actions or API routes. For this demo, we'll keep it simple.
  // If this were a client component, the following would be valid:
  /*
  const handleLogout = () => {
    toast({ title: "התנתקת (סופר אדמין)", description: "התנתקת בהצלחה ממערכת הניהול הראשית." });
    router.push('/auth/login');
  };
  */
  
  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden md:flex flex-col w-72 bg-background border-r">
        <div className="p-4 border-b">
          <Link href="/super-admin" className="flex items-center gap-2 text-lg font-semibold text-purple-600 font-headline">
            <ShieldCheck className="h-7 w-7" />
            <span>LivePick - Super Admin</span>
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
                onClick={item.disabled ? (e) => {e.preventDefault(); /* toast({title: "בקרוב!", description: "פיצ'ר זה עדיין בפיתוח."}) */ } : undefined}
              >
                <Link href={item.href || '#'}>
                  <item.icon className="mr-3 h-5 w-5" /> {/* Adjusted margin for RTL */}
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4 border-t">
            <Button variant="outline" className="w-full justify-start" asChild>
              {/* For demo, direct link. Real app would use a server action for logout */}
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
