
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ListOrdered, ShoppingCart, Users, AlertTriangle, Settings, LayoutList, Palette, BarChart3, Video, Info, CheckCircle, Loader2, TrendingUp, Megaphone, Users2, Sparkles, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useToast } from '@/hooks/use-toast';

interface Stats {
  todayOrders: number | null;
  pendingOrders: number | null;
  totalRevenueToday: number | null;
  popularItem: string | null;
  systemStatus: string | null;
  newReviews: number | null;
  newCustomersToday: number | null;
  activeCampaigns: number | null;
}

export default function RestaurantAdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats>({
    todayOrders: null,
    pendingOrders: null,
    totalRevenueToday: null,
    popularItem: null,
    systemStatus: null,
    newReviews: null,
    newCustomersToday: null,
    activeCampaigns: null,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    setIsLoadingStats(true);
    const timer = setTimeout(() => {
      setStats({
        todayOrders: Math.floor(Math.random() * 20) + 5,
        pendingOrders: Math.floor(Math.random() * 5),
        totalRevenueToday: parseFloat((Math.random() * 800 + 200).toFixed(2)),
        popularItem: mockPopularItems[Math.floor(Math.random() * mockPopularItems.length)],
        systemStatus: "כל המערכות פועלות כשורה",
        newReviews: Math.floor(Math.random() * 5),
        newCustomersToday: Math.floor(Math.random() * 10 + 1),
        activeCampaigns: Math.floor(Math.random() * 3 + 1),
      });
      setIsLoadingStats(false);
    }, 700); 
    return () => clearTimeout(timer);
  }, []);

  const mockPopularItems = ["פיצה מרגריטה", "המבורגר קלאסי", "סלט קיסר", "קפה הפוך"];

  const quickLinks = [
    { href: '/restaurant-admin/settings', label: 'הגדרות עסק', icon: Settings },
    { href: '/restaurant-admin/menu', label: 'נהל מוצרים/שירותים', icon: LayoutList },
    { href: '/restaurant-admin/design', label: 'התאם אישית את החנות', icon: Palette },
    { href: '/restaurant-admin/orders', label: 'צפה בהזמנות', icon: ShoppingCart },
    { href: '/restaurant-admin/analytics', label: 'צפה בניתוחים', icon: BarChart3 },
    { href: '/restaurant-admin/promotions', label: 'נהל מבצעים', icon: Megaphone },
  ];

  return (
    <div className="space-y-8"> 
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">לוח בקרה לעסק</h1>
        <Button asChild className="btn-gradient-hover-accent">
          <Link href="/restaurants/restaurant1" target="_blank"> 
            <span>צפה בחנות החיה</span>
          </Link>
        </Button>
      </div>

      <Card className="bg-blue-500/5 border-blue-500/20 shadow-lg premium-card-hover">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-xl text-blue-700 flex items-center"><Info className="mr-2 h-5 w-5" /> ברוכים השבים לממשק הניהול!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-blue-600">
            כאן תוכלו לעדכן את פרטי העסק שלכם, לנהל מוצרים ושירותים, לעקוב אחר הזמנות, לצפות בניתוחים ועוד.
          </p>
          <p className="text-xs text-blue-500 mt-1">
            <strong>הערה למפתחים:</strong> ממשק זה הוא הדגמה. הקמת עסק חדש תתבצע דרך תהליך נפרד.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הזמנות היום</CardTitle>
            <ListOrdered className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats || stats.todayOrders === null ? <Loader2 className="h-7 w-7 animate-spin text-primary"/> : <div className="text-3xl font-bold text-primary">{stats.todayOrders}</div>}
            {!isLoadingStats && stats.todayOrders !== null && <p className="text-xs text-muted-foreground">+5 מאתמול (הדגמה)</p>}
          </CardContent>
        </Card>
        <Card className="premium-card-hover border-orange-400 hover:border-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הזמנות ממתינות</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            {isLoadingStats || stats.pendingOrders === null ? <Loader2 className="h-7 w-7 animate-spin text-orange-600"/> : <div className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</div>}
            {!isLoadingStats && stats.pendingOrders !== null && <p className="text-xs text-muted-foreground">נדרשת פעולה מיידית</p>}
          </CardContent>
        </Card>
        <Card className="premium-card-hover border-green-400 hover:border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הכנסות היום</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
             {isLoadingStats || stats.totalRevenueToday === null ? <Loader2 className="h-7 w-7 animate-spin text-green-600"/> : <div className="text-3xl font-bold text-green-600">₪{stats.totalRevenueToday.toFixed(2)}</div>}
            {!isLoadingStats && stats.totalRevenueToday !== null && <p className="text-xs text-muted-foreground">+10% מאתמול (הדגמה)</p>}
          </CardContent>
        </Card>
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">פריט פופולרי היום</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoadingStats || stats.popularItem === null ? <Loader2 className="h-7 w-7 animate-spin text-accent"/> : <div className="text-xl font-bold truncate text-accent">{stats.popularItem}</div>}
            {!isLoadingStats && stats.popularItem !== null && <p className="text-xs text-muted-foreground">מבוסס על מכירות אחרונות</p>}
          </CardContent>
        </Card>
         <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">לקוחות חדשים היום</CardTitle>
            <Users2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats || stats.newCustomersToday === null ? <Loader2 className="h-7 w-7 animate-spin text-blue-500"/> : <div className="text-3xl font-bold text-blue-500">{stats.newCustomersToday}</div>}
            {!isLoadingStats && stats.newCustomersToday !== null && <p className="text-xs text-muted-foreground">ברכות על הצמיחה!</p>}
          </CardContent>
        </Card>
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">קמפיינים פעילים</CardTitle>
            <Megaphone className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats || stats.activeCampaigns === null ? <Loader2 className="h-7 w-7 animate-spin text-purple-500"/> : <div className="text-3xl font-bold text-purple-500">{stats.activeCampaigns}</div>}
            {!isLoadingStats && stats.activeCampaigns !== null && <p className="text-xs text-muted-foreground">הצג ביצועים ונהל</p>}
          </CardContent>
        </Card>
         <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">קמפיינים מומלצים (AI)</CardTitle>
            <Sparkles className="h-5 w-5 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">"הצע 1+1 על משקאות קלים בימי חמישי"</p>
            <Button variant="link" size="sm" className="p-0 h-auto text-xs">הפעל קמפיין (דמו)</Button>
          </CardContent>
        </Card>
         <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הכנסות בלייב (מדומה)</CardTitle>
            <Briefcase className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">₪1,234.50</div>
            <p className="text-xs text-muted-foreground">מעודכן כל דקה</p>
          </CardContent>
        </Card>
      </div>

      <Card className="premium-card-hover">
        <CardHeader>
          <CardTitle className="text-2xl">פעולות מהירות</CardTitle>
          <CardDescription>נווט במהירות לאזורי ניהול מרכזיים בעסק שלך.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link) => (
            <Button key={link.href} variant="outline" size="lg" asChild className="justify-start text-left h-auto py-4 hover:bg-primary/5 hover:border-primary/30 hover:shadow-md transition-all">
              <Link href={link.href}>
                <span className="flex items-center w-full">
                  <link.icon className="mr-3 h-6 w-6 text-primary flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-semibold text-base">{link.label}</p>
                  </div>
                </span>
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="premium-card-hover">
          <CardHeader>
            <CardTitle className="text-xl">התראות ועדכונים (דמו)</CardTitle>
            <CardDescription>עדכונים חשובים ופעולות נדרשות עבור העסק שלך.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-green-500/10 text-green-700 border-green-500/30">
                {isLoadingStats || stats.systemStatus === null ? <Loader2 className="h-5 w-5 animate-spin"/> : <p className="font-medium flex items-center text-base"><CheckCircle className="mr-2 h-5 w-5"/> סטטוס מערכת: {stats.systemStatus}</p>}
            </div>
             <div className="p-4 border rounded-md bg-yellow-500/10 text-yellow-700 border-yellow-500/30">
               {isLoadingStats || stats.newReviews === null ? <Loader2 className="h-5 w-5 animate-spin"/> : <p className="font-medium flex items-center text-base"><Users className="mr-2 h-5 w-5"/> התקבלו {stats.newReviews} ביקורות חדשות לטיפולך (דמו)</p>}
            </div>
             <div className="text-center text-muted-foreground py-4">
              <p className="text-sm">במערכת חיה, התראות חשובות ומותאמות אישית יופיעו כאן.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center text-xl"><Video className="mr-2 h-6 w-6 text-red-500" /> SwiftServe LiveKitchen סטטוס (דמו)</CardTitle> {/* Updated name */}
            <CardDescription>שתף את הלקוחות שלך במה שקורה מאחורי הקלעים בזמן אמת!</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg font-medium text-muted-foreground">פיד ה-LiveKitchen שלך <span className="text-red-600 font-semibold">לא פעיל</span> כרגע.</p>
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center border data-ai-hint='kitchen live stream preview' shadow-inner">
                <Video className="h-16 w-16 text-muted-foreground/30"/>
            </div>
            <Button variant="outline" size="lg" onClick={() => toast({title: "הפעלת LiveKitchen", description: "השידור החי יתחיל כעת. (הדגמה)"})}>הפעל שידור חי</Button>
            <p className="text-sm text-muted-foreground">הגבר אמון ועניין עם שידורים חיים מהמטבח או אזור העבודה שלך.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

