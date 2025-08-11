
'use client';

import Link from 'next/link';
import { ShoppingCart, UserCircle, Home, Utensils, Brain, Truck, ChefHat, TrendingUp, Languages, Send, HeartPulse, MapIcon, Briefcase, Users, Store, Bell, Heart, PackageSearch, ShieldCheck, Sparkles, Settings2, Award, Flame, PackagePlus, Route, ListChecks, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import type { Language } from '@/context/language-context';
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
import ThemeToggle from '@/components/layout/theme-toggle';


const Header = () => {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { toast } = useToast();
  const { currentLanguage, languages, changeLanguage, t } = useLanguage();
  const [showNotificationDot, setShowNotificationDot] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // This effect runs only on the client after hydration
    if (isClient) {
      // Simulate a condition for showing notification dot
      // In a real app, this might come from an API or other client-side logic
      if (Math.random() > 0.7) {
        setShowNotificationDot(true);
      }
    }
  }, [isClient]);


  const handleLanguageChange = (language: Language) => {
    changeLanguage(language);
    toast({
      title: t('language.changed'),
      description: `${t('common.success')} - ${languages[language].nativeName}`,
    });
  };

  const handleTravelModeToggle = () => {
    toast({ 
      title: t('travelModeDemo', 'מצב נסיעות (הדגמה)'), 
      description: t('travelModeDesc', 'המלצות מותאמות למיקום ושירותים בינלאומיים יגיעו. (הדגמה של פונקציונליות זו).') 
    });
  };

  // Get current language info
  const getCurrentLanguageInfo = () => {
    return languages[currentLanguage];
  };

  const navLinks = [
    { href: "/", label: t('nav.home', 'בית'), icon: Home, showAlways: true, showSm: true, showMd: true, showLg: true, showXl: true },
    { href: "/restaurants", label: t('nav.restaurants', 'עסקים'), icon: Utensils, showAlways: true, showSm: true, showMd: true, showLg: true, showXl: true },
    { href: "/marketplace", label: t('nav.marketplace', 'יד 2'), icon: Store, showAlways: false, showSm: false, showMd: false, showLg: true, showXl: true },
    { href: "/send-package", label: t('nav.sendPackage', 'שלח חבילה'), icon: Send, showAlways: false, showSm: false, showMd: false, showLg: true, showXl: true },
    { href: "/livepick-sale", label: t('nav.zippSale', 'ZIPP Sale'), icon: PackageSearch, showAlways: false, showSm: true, showMd: true, showLg: true, showXl: true },
    { href: "/visual-search", label: t('nav.trendScanner', 'סורק טרנדים'), icon: TrendingUp, showAlways: true, showSm: true, showMd: true, showLg: true, showXl: true },
    { href: "/favorites", label: t('nav.favorites', 'מועדפים'), icon: Heart, showAlways: false, showSm: false, showMd: true, showLg: true, showXl: true },
    { href: "/affiliate", label: t('nav.partners', 'שותפים'), icon: Users, showAlways: false, showSm: false, showMd: true, showLg: true, showXl: true },
    { href: "/courier/dashboard", label: t('nav.couriers', 'שליחים'), icon: Truck, showAlways: false, showSm: false, showMd: false, showLg: false, showXl: true },
    { href: "/restaurant-admin", label: t('nav.businessManagement', 'ניהול עסק'), icon: ChefHat, showAlways: false, showSm: false, showMd: false, showLg: false, showXl: true },
    { href: "/super-admin", label: t('nav.superAdmin', 'סופר אדמין'), icon: ShieldCheck, showAlways: false, showSm: false, showMd: false, showLg: false, showXl: true, className: "text-purple-600" },
  ];


  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <TooltipProvider>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex flex-col items-start" aria-label="ZIPP - דף הבית">
          <span className="text-2xl font-bold text-primary font-headline">ZIPP</span>
          <span className="text-xs text-muted-foreground -mt-1">{t('site.tagline')}</span>
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
                    hover:bg-primary/20 dark:hover:bg-primary/10 hover:text-primary transition-colors
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
                  <Button variant="ghost" size="sm" className="inline-flex items-center hover:bg-accent/20 dark:hover:bg-accent/10 hover:text-accent transition-colors" title="כלים חכמים">
                    <Sparkles className="h-4 w-4 sm:mr-1 text-accent" />
                    <span className="hidden sm:inline">{t('tools.smart')}</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent className="sm:hidden p-2 text-xs">
                <p>{t('tools.smart')}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-56 shadow-lg border-border">
              <DropdownMenuLabel className="font-semibold">{t('smartTools.title')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/recommendations" className="flex items-center w-full cursor-pointer hover:bg-muted/80 dark:hover:bg-muted/50 transition-colors">
                  <Brain className="ml-2 h-4 w-4 text-primary" /> {t('smartTools.aiRecommendations')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/nutritional-advisor" className="flex items-center w-full cursor-pointer hover:bg-muted/80 dark:hover:bg-muted/50 transition-colors">
                  <HeartPulse className="ml-2 h-4 w-4 text-green-500" /> {t('smartTools.nutritionalAdvisor')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/food-radar" className="flex items-center w-full cursor-pointer hover:bg-muted/80 dark:hover:bg-muted/50 transition-colors">
                  <MapIcon className="ml-2 h-4 w-4 text-orange-500" /> {t('smartTools.foodRadar')}
                </Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/spin-wheel" className="flex items-center w-full cursor-pointer hover:bg-muted/80 dark:hover:bg-muted/50 transition-colors">
                  <Award className="ml-2 h-4 w-4 text-teal-500" /> {t('smartTools.surpriseWheel')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleTravelModeToggle} className="flex items-center w-full cursor-pointer hover:bg-muted/80 dark:hover:bg-muted/50 transition-colors">
                <Briefcase className="ml-2 h-4 w-4 text-blue-500" /> {t('smartTools.travelMode')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <ThemeToggle />

           <Tooltip delayDuration={300}>
             <TooltipTrigger asChild>
                <Button variant="ghost" asChild size="icon" className="relative hover:bg-primary/20 dark:hover:bg-primary/10 hover:text-primary transition-colors" title="התראות">
                  <Link href="/notifications" aria-label="התראות"><span className="relative flex items-center justify-center w-full h-full">
                    <Bell className="h-5 w-5" />
                    {isClient && showNotificationDot && <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs animate-pulse">2</Badge>}
                  </span></Link>
                </Button>
            </TooltipTrigger>
            <TooltipContent className="p-2 text-xs"><p>התראות</p></TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button variant="ghost" asChild size="icon" className="relative hover:bg-primary/20 dark:hover:bg-primary/10 hover:text-primary transition-colors" title="עגלת קניות">
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
            <TooltipContent className="p-2 text-xs"><p>{t('header.cart')} ({itemCount})</p></TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" asChild title={t('header.myAccount')} className="hover:border-primary hover:bg-primary/10 dark:hover:bg-primary/5 hover:text-primary transition-colors">
                <Link href="/account/profile"><span className="flex items-center"><UserCircle className="h-4 w-4 mr-0 sm:mr-2" /><span className="hidden sm:inline">{t('header.myAccount')}</span></span></Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden p-2 text-xs"><p>{t('header.myAccount')}</p></TooltipContent>
          </Tooltip>

          <DropdownMenu dir={currentLanguage === 'he' || currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center hover:bg-primary/20 dark:hover:bg-primary/10 hover:text-primary transition-colors" aria-label={t('header.language')} title={t('header.language')}>
                    <span className="flex items-center">
                      <Languages className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">{getCurrentLanguageInfo().flag} {getCurrentLanguageInfo().nativeName}</span>
                      <span className="inline sm:hidden">{getCurrentLanguageInfo().flag}</span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent className="sm:hidden p-2 text-xs">
                <p>{t('header.language')}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-48 shadow-lg border-border">
              <DropdownMenuLabel className="font-semibold">{t('header.language')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.values(languages).map((lang) => (
                <DropdownMenuItem 
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    "flex items-center w-full cursor-pointer hover:bg-muted/80 dark:hover:bg-muted/50 transition-colors",
                    currentLanguage === lang.code && "bg-muted font-medium"
                  )}
                >
                  <span className="ml-2 text-lg">{lang.flag}</span>
                  <span className="flex-1">{lang.nativeName}</span>
                  {currentLanguage === lang.code && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
      </TooltipProvider>
    </header>
  );
};

export default Header;
