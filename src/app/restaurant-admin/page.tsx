
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ListOrdered, ShoppingCart, Users, AlertTriangle, Settings, LayoutList, Palette, BarChart3, Video, Info, CheckCircle, Loader2, TrendingUp, Megaphone, Users2, Sparkles, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useToast } from '@/hooks/use-toast';
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context';

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
  const { isRTL } = useLanguage();
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
        systemStatus: "All systems operating normally",
        newReviews: Math.floor(Math.random() * 5),
        newCustomersToday: Math.floor(Math.random() * 10 + 1),
        activeCampaigns: Math.floor(Math.random() * 3 + 1),
      });
      setIsLoadingStats(false);
    }, 700); 
    return () => clearTimeout(timer);
  }, []);

  const mockPopularItems = ["Margherita Pizza", "Classic Burger", "Caesar Salad", "Cappuccino"];

  const quickLinks = [
    { href: '/restaurant-admin/settings', labelKey: 'restaurantAdmin.businessSettings', labelFallback: 'Business Settings', icon: Settings },
    { href: '/restaurant-admin/menu', labelKey: 'restaurantAdmin.manageProducts', labelFallback: 'Manage Products/Services', icon: LayoutList },
    { href: '/restaurant-admin/design', labelKey: 'restaurantAdmin.customizeStore', labelFallback: 'Customize Store', icon: Palette },
    { href: '/restaurant-admin/orders', labelKey: 'restaurantAdmin.viewOrders', labelFallback: 'View Orders', icon: ShoppingCart },
    { href: '/restaurant-admin/analytics', labelKey: 'restaurantAdmin.viewAnalytics', labelFallback: 'View Analytics', icon: BarChart3 },
    { href: '/restaurant-admin/promotions', labelKey: 'restaurantAdmin.managePromotions', labelFallback: 'Manage Promotions', icon: Megaphone },
  ];

  return (
    <div className="space-y-8" dir={isRTL ? 'rtl' : 'ltr'}> 
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
          <AutoTranslateText 
            translationKey="restaurantAdmin.dashboard" 
            fallback="Business Dashboard"
          />
        </h1>
        <Button asChild className="btn-gradient-hover-accent">
          <Link href="/restaurants/restaurant1" target="_blank"> 
            <span>
              <AutoTranslateText 
                translationKey="restaurantAdmin.viewLiveStore" 
                fallback="View Live Store"
              />
            </span>
          </Link>
        </Button>
      </div>

      <Card className="bg-blue-500/5 border-blue-500/20 shadow-lg premium-card-hover">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-xl text-blue-700 flex items-center">
            <Info className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} /> 
            <AutoTranslateText 
              translationKey="restaurantAdmin.welcomeBack" 
              fallback="Welcome back to the management interface!"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-blue-600">
            <AutoTranslateText 
              translationKey="restaurantAdmin.welcomeDescription" 
              fallback="Here you can update your business details, manage products and services, track orders, view analytics and more."
            />
          </p>
          <p className="text-xs text-blue-500 mt-1">
            <strong>
              <AutoTranslateText 
                translationKey="restaurantAdmin.devNote" 
                fallback="Developer note:"
              />
            </strong> 
            <AutoTranslateText 
              translationKey="restaurantAdmin.demoNote" 
              fallback="This interface is a demo. Setting up a new business will be done through a separate process."
            />
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <AutoTranslateText 
                translationKey="restaurantAdmin.todayOrders" 
                fallback="Today's Orders"
              />
            </CardTitle>
            <ListOrdered className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats || stats.todayOrders === null ? <Loader2 className="h-7 w-7 animate-spin text-primary"/> : <div className="text-3xl font-bold text-primary">{stats.todayOrders}</div>}
            {!isLoadingStats && stats.todayOrders !== null && <p className="text-xs text-muted-foreground">
              <AutoTranslateText 
                translationKey="restaurantAdmin.ordersDiff" 
                fallback="+5 from yesterday (demo)"
              />
            </p>}
          </CardContent>
        </Card>
        <Card className="premium-card-hover border-orange-400 hover:border-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <AutoTranslateText 
                translationKey="restaurantAdmin.pendingOrders" 
                fallback="Pending Orders"
              />
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            {isLoadingStats || stats.pendingOrders === null ? <Loader2 className="h-7 w-7 animate-spin text-orange-600"/> : <div className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</div>}
            {!isLoadingStats && stats.pendingOrders !== null && <p className="text-xs text-muted-foreground">
              <AutoTranslateText 
                translationKey="restaurantAdmin.immediateAction" 
                fallback="Immediate action required"
              />
            </p>}
          </CardContent>
        </Card>
        <Card className="premium-card-hover border-green-400 hover:border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <AutoTranslateText 
                translationKey="restaurantAdmin.todayRevenue" 
                fallback="Today's Revenue"
              />
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
             {isLoadingStats || stats.totalRevenueToday === null ? <Loader2 className="h-7 w-7 animate-spin text-green-600"/> : <div className="text-3xl font-bold text-green-600">₪{stats.totalRevenueToday.toFixed(2)}</div>}
            {!isLoadingStats && stats.totalRevenueToday !== null && <p className="text-xs text-muted-foreground">
              <AutoTranslateText 
                translationKey="restaurantAdmin.revenueDiff" 
                fallback="+10% from yesterday (demo)"
              />
            </p>}
          </CardContent>
        </Card>
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <AutoTranslateText 
                translationKey="restaurantAdmin.popularItem" 
                fallback="Popular Item Today"
              />
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoadingStats || stats.popularItem === null ? <Loader2 className="h-7 w-7 animate-spin text-accent"/> : <div className="text-xl font-bold truncate text-accent">{stats.popularItem}</div>}
            {!isLoadingStats && stats.popularItem !== null && <p className="text-xs text-muted-foreground">
              <AutoTranslateText 
                translationKey="restaurantAdmin.basedOnSales" 
                fallback="Based on recent sales"
              />
            </p>}
          </CardContent>
        </Card>
         <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <AutoTranslateText 
                translationKey="restaurantAdmin.newCustomers" 
                fallback="New Customers Today"
              />
            </CardTitle>
            <Users2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats || stats.newCustomersToday === null ? <Loader2 className="h-7 w-7 animate-spin text-blue-500"/> : <div className="text-3xl font-bold text-blue-500">{stats.newCustomersToday}</div>}
            {!isLoadingStats && stats.newCustomersToday !== null && <p className="text-xs text-muted-foreground">
              <AutoTranslateText 
                translationKey="restaurantAdmin.congratsGrowth" 
                fallback="Congratulations on the growth!"
              />
            </p>}
          </CardContent>
        </Card>
        <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <AutoTranslateText 
                translationKey="restaurantAdmin.activeCampaigns" 
                fallback="Active Campaigns"
              />
            </CardTitle>
            <Megaphone className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats || stats.activeCampaigns === null ? <Loader2 className="h-7 w-7 animate-spin text-purple-500"/> : <div className="text-3xl font-bold text-purple-500">{stats.activeCampaigns}</div>}
            {!isLoadingStats && stats.activeCampaigns !== null && <p className="text-xs text-muted-foreground">
              <AutoTranslateText 
                translationKey="restaurantAdmin.showPerformance" 
                fallback="Show performance and manage"
              />
            </p>}
          </CardContent>
        </Card>
         <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <AutoTranslateText 
                translationKey="restaurantAdmin.recommendedCampaigns" 
                fallback="Recommended Campaigns (AI)"
              />
            </CardTitle>
            <Sparkles className="h-5 w-5 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              "<AutoTranslateText 
                translationKey="restaurantAdmin.aiSuggestion" 
                fallback="Offer 1+1 on soft drinks on Thursdays"
              />"
            </p>
            <Button variant="link" size="sm" className="p-0 h-auto text-xs">
              <AutoTranslateText 
                translationKey="restaurantAdmin.activateCampaign" 
                fallback="Activate Campaign (Demo)"
              />
            </Button>
          </CardContent>
        </Card>
         <Card className="premium-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <AutoTranslateText 
                translationKey="restaurantAdmin.liveRevenue" 
                fallback="Live Revenue (Demo)"
              />
            </CardTitle>
            <Briefcase className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">₪1,234.50</div>
            <p className="text-xs text-muted-foreground">
              <AutoTranslateText 
                translationKey="restaurantAdmin.updatedEveryMinute" 
                fallback="Updated every minute"
              />
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="premium-card-hover">
        <CardHeader>
          <CardTitle className="text-2xl">
            <AutoTranslateText 
              translationKey="restaurantAdmin.quickActions" 
              fallback="Quick Actions"
            />
          </CardTitle>
          <CardDescription>
            <AutoTranslateText 
              translationKey="restaurantAdmin.quickActionsDesc" 
              fallback="Navigate quickly to key management areas of your business."
            />
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link) => (
            <Button key={link.href} variant="outline" size="lg" asChild className="justify-start text-left h-auto py-4 hover:bg-primary/5 hover:border-primary/30 hover:shadow-md transition-all">
              <Link href={link.href}>
                <span className="flex items-center w-full">
                  <link.icon className={`h-6 w-6 text-primary flex-shrink-0 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <div className="flex-grow">
                    <p className="font-semibold text-base">
                      <AutoTranslateText 
                        translationKey={link.labelKey} 
                        fallback={link.labelFallback}
                      />
                    </p>
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
            <CardTitle className="text-xl">
              <AutoTranslateText 
                translationKey="restaurantAdmin.alertsUpdates" 
                fallback="Alerts & Updates (Demo)"
              />
            </CardTitle>
            <CardDescription>
              <AutoTranslateText 
                translationKey="restaurantAdmin.alertsDesc" 
                fallback="Important updates and required actions for your business."
              />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-green-500/10 text-green-700 border-green-500/30">
                {isLoadingStats || stats.systemStatus === null ? <Loader2 className="h-5 w-5 animate-spin"/> : <p className="font-medium flex items-center text-base"><CheckCircle className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`}/> <AutoTranslateText translationKey="restaurantAdmin.systemStatus" fallback="System Status:" /> {stats.systemStatus}</p>}
            </div>
             <div className="p-4 border rounded-md bg-yellow-500/10 text-yellow-700 border-yellow-500/30">
               {isLoadingStats || stats.newReviews === null ? <Loader2 className="h-5 w-5 animate-spin"/> : <p className="font-medium flex items-center text-base"><Users className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`}/> <AutoTranslateText translationKey="restaurantAdmin.newReviewsReceived" fallback="Received" /> {stats.newReviews} <AutoTranslateText translationKey="restaurantAdmin.newReviewsForAttention" fallback="new reviews for your attention (demo)" /></p>}
            </div>
             <div className="text-center text-muted-foreground py-4">
              <p className="text-sm">
                <AutoTranslateText 
                  translationKey="restaurantAdmin.liveSystemNote" 
                  fallback="In a live system, important and personalized alerts will appear here."
                />
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Video className={`h-6 w-6 text-red-500 ${isRTL ? 'ml-2' : 'mr-2'}`} /> 
              <AutoTranslateText 
                translationKey="restaurantAdmin.liveKitchenStatus" 
                fallback="SwiftServe LiveKitchen Status (Demo)"
              />
            </CardTitle> {/* Updated name */}
            <CardDescription>
              <AutoTranslateText 
                translationKey="restaurantAdmin.liveKitchenDesc" 
                fallback="Share with your customers what's happening behind the scenes in real time!"
              />
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg font-medium text-muted-foreground">
              <AutoTranslateText 
                translationKey="restaurantAdmin.liveKitchenInactive" 
                fallback="Your LiveKitchen feed is"
              />{" "}
              <span className="text-red-600 font-semibold">
                <AutoTranslateText 
                  translationKey="restaurantAdmin.notActive" 
                  fallback="not active"
                />
              </span>{" "}
              <AutoTranslateText 
                translationKey="restaurantAdmin.currently" 
                fallback="currently."
              />
            </p>
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center border data-ai-hint='kitchen live stream preview' shadow-inner">
                <Video className="h-16 w-16 text-muted-foreground/30"/>
            </div>
            <Button variant="outline" size="lg" onClick={() => toast({title: "Activating LiveKitchen", description: "Live broadcast will start now. (Demo)"})}>
              <AutoTranslateText 
                translationKey="restaurantAdmin.startLiveBroadcast" 
                fallback="Start Live Broadcast"
              />
            </Button>
            <p className="text-sm text-muted-foreground">
              <AutoTranslateText 
                translationKey="restaurantAdmin.liveBroadcastBenefit" 
                fallback="Increase trust and interest with live broadcasts from your kitchen or work area."
              />
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

