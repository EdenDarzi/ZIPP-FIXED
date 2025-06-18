
'use client';

import Link from 'next/link';
import { ShoppingCart, UserCircle, Home, Utensils, Brain, Truck, ChefHat, TrendingUp, Languages, Send, HeartPulse, MapIcon, Briefcase, Users, Store, Bell, Heart, PackageSearch, ShieldCheck, Sparkles, Settings2, Award, Flame, PackagePlus, Route, ListChecks } from 'lucide-react'; // Removed Gem
import { GamepadIcon as Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';


const Header = () => {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { toast } = useToast();
  const [showNotificationDot, setShowNotificationDot] = useState(false);

  useEffect(() => {
    // This effect runs only on the client
    if (typeof window !== 'undefined' && Math.random() > 0.7) {
      setShowNotificationDot(true);
    }
  }, []);


  const handleLanguageToggle = () => {
    toast({
        title: "החלפת שפה (הדגמה)",
        description: "אפשרות להחלפה בין עברית, אנגלית, רוסית וערבית תתווסף. (הדגמה של פונקציונליות זו)."
    });
  };

  const handleTravelModeToggle = () => {
    toast({ title: "מצב נסיעות (הדגמה)", description: "המלצות מותאמות למיקום ושירותים בינלאומיים יגיעו. (הדגמה של פונקציונליות זו)." });
  };

  const navLinks = [
    { href: "/", label: "בית", icon: Home, showAlways: true, showSm: true, showMd: true, showLg: true, showXl: true },
    { href: "/restaurants", label: "עסקים", icon: Utensils, showAlways: true, showSm: true, showMd: true, showLg: true, showXl: true },
    { href: "/marketplace", label: "יד 2", icon: Store, showAlways: false, showSm: false, showMd: false, showLg: true, showXl: true },
    { href: "/send-package", label: "שלח חבילה", icon: Send, showAlways: false, showSm: false, showMd: false, showLg: true, showXl: true },
    { href: "/livepick-sale", label: "LivePick Sale", icon: PackageSearch, showAlways: false, showSm: true, showMd: true, showLg: true, showXl: true },
    { href: "/visual-search", label: "סורק טרנדים", icon: TrendingUp, showAlways: true, showSm: true, showMd: true, showLg: true, showXl: true },
    { href: "/favorites", label: "מועדפים", icon: Heart, showAlways: false, showSm: false, showMd: true, showLg: true, showXl: true },
    { href: "/affiliate", label: "שותפים", icon: Users, showAlways: false, showSm: false, showMd: true, showLg: true, showXl: true },
    // VIP Link Removed
    { href: "/courier/dashboard", label: "שליחים", icon: Truck, showAlways: false, showSm: false, showMd: false, showLg: false, showXl: true },
    { href: "/restaurant-admin", label: "ניהול עסק", icon: ChefHat, showAlways: false, showSm: false, showMd: false, showLg: false, showXl: true },
    { href: "/super-admin", label: "סופר אדמין", icon: ShieldCheck, showAlways: false, showSm: false, showMd: false, showLg: false, showXl: true, className: "text-purple-600" },
  ];


  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <TooltipProvider>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary font-headline" aria-label="LivePick - דף הבית">
          LivePick
        </Link>
        <nav className="flex items-center space-x-0.5 sm:space-x-1 flex-wrap justify-end">
          {navLinks.map(link => (
            <Tooltip key={link.href} delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  asChild
                  size="sm"
                  className={cn(`
                    ${link.className || ''}
                    ${link.showAlways ? 'inline-flex' : 'hidden'}
                    ${link.showSm && !link.showAlways ? 'sm:inline-flex' : ''}
                    ${link.showMd && !link.showSm ? 'md:inline-flex' : ''}
                    ${link.showLg && !link.showMd ? 'lg:inline-flex' : ''}
                    ${link.showXl && !link.showLg ? 'xl:inline-flex' : ''}
                    hover:bg-primary/10
                  `)}
                  title={link.label}
                >
                  <Link href={link.href}><span className="flex items-center">
                    <link.icon className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">{link.label}</span>
                  </span></Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="sm:hidden p-2 text-xs">
                <p>{link.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}

          <DropdownMenu dir="rtl">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="inline-flex items-center hover:bg-accent/10" title="כלים חכמים">
                    <Sparkles className="h-4 w-4 sm:mr-1 text-accent" />
                    <span className="hidden sm:inline">כלים חכמים</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent className="sm:hidden p-2 text-xs">
                <p>כלים חכמים</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-56 shadow-lg border-border">
              <DropdownMenuLabel className="font-semibold">פיצ'רים מבוססי AI ועוד</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/recommendations" className="flex items-center w-full cursor-pointer hover:bg-muted/50">
                  <Brain className="ml-2 h-4 w-4 text-primary" /> המלצות AI
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/nutritional-advisor" className="flex items-center w-full cursor-pointer hover:bg-muted/50">
                  <HeartPulse className="ml-2 h-4 w-4 text-green-500" /> יועץ תזונה
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/food-radar" className="flex items-center w-full cursor-pointer hover:bg-muted/50">
                  <MapIcon className="ml-2 h-4 w-4 text-orange-500" /> רדאר אוכל וטרנדים
                </Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/spin-wheel" className="flex items-center w-full cursor-pointer hover:bg-muted/50">
                  <Gamepad2 className="ml-2 h-4 w-4 text-teal-500" /> גלגל ההפתעות
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleTravelModeToggle} className="flex items-center w-full cursor-pointer hover:bg-muted/50">
                <Briefcase className="ml-2 h-4 w-4 text-blue-500" /> מצב נסיעות
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

           <Tooltip delayDuration={300}>
             <TooltipTrigger asChild>
                <Button variant="ghost" asChild size="icon" className="relative hover:bg-primary/10" title="התראות">
                  <Link href="/notifications" aria-label="התראות"><span className="relative flex items-center justify-center w-full h-full">
                    <Bell className="h-5 w-5" />
                    {showNotificationDot && <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs animate-pulse">2</Badge>}
                  </span></Link>
                </Button>
            </TooltipTrigger>
            <TooltipContent className="p-2 text-xs"><p>התראות</p></TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button variant="ghost" asChild size="icon" className="relative hover:bg-primary/10" title="עגלת קניות">
                <Link href="/cart" aria-label={`עגלת קניות, ${itemCount} פריטים`}><span className="relative flex items-center justify-center w-full h-full">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                      {itemCount}
                    </Badge>
                  )}
                </span></Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="p-2 text-xs"><p>עגלת קניות ({itemCount})</p></TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" asChild title="החשבון שלי / כניסה" className="hover:border-primary hover:bg-primary/5">
                <Link href="/account/profile"><span className="flex items-center"><UserCircle className="h-4 w-4 mr-0 sm:mr-2" /><span className="hidden sm:inline">החשבון שלי</span></span></Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden p-2 text-xs"><p>החשבון שלי</p></TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleLanguageToggle} className="flex items-center hover:bg-primary/10" aria-label="החלף שפה" title="החלף שפה">
                <span className="flex items-center">
                    <Languages className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">EN</span>
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden p-2 text-xs"><p>English</p></TooltipContent>
          </Tooltip>
        </nav>
      </div>
      </TooltipProvider>
    </header>
  );
};

export default Header;
