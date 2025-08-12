
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MapPin, DollarSign, PackageCheck, CheckCircle, XCircle, Search, AlertTriangle, Route, BarChart3, ListChecks, Lightbulb, Zap, Loader2, Trophy, CalendarClock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context';

export default function CourierDashboardPage() {
  const { isRTL } = useLanguage();
  const [isActive, setIsActive] = useState(true);
  const [dailyEarnings, setDailyEarnings] = useState<number | null>(null);
  const [dailyDeliveries, setDailyDeliveries] = useState<number | null>(null);
  const [openBidCount, setOpenBidCount] = useState<number | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoadingStats(true);
    const timer = setTimeout(() => {
        setDailyEarnings(parseFloat((Math.random() * 150 + 50).toFixed(2)));
        setDailyDeliveries(Math.floor(Math.random() * 10 + 3));
        setOpenBidCount(Math.floor(Math.random() * 5 + 1));
        setIsLoadingStats(false);
    }, 700); 
    
    // Mock bonus alert
    const bonusAlertTimeout = setTimeout(() => {
      if (isActive && Math.random() > 0.7) {
        toast({
          title: "🚀 Area Bonus Available!",
          description: "₪10 extra for each delivery from 'City Center' area in the next hour! (Demo)",
          duration: 10000,
          className: "bg-yellow-400 text-black border-yellow-500"
        });
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(bonusAlertTimeout);
    }
  }, [isActive]); // Rerun if isActive changes, to potentially show bonus if newly active

  const handleActivityToggle = (checked: boolean) => {
    setIsActive(checked);
    toast({
      title: `Activity status updated to: ${checked ? 'Active' : 'Inactive'}`,
      description: checked ? "You are now available to receive delivery offers." : "You will not receive new delivery offers until reactivated.",
    });
  };

  return (
    <div className="space-y-8" dir={isRTL ? 'rtl' : 'ltr'}> {/* Increased spacing */}
      <Card className="shadow-xl premium-card-hover"> {/* Added shadow and hover effect */}
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <AutoTranslateText 
              translationKey="courier.dashboard.title" 
              fallback="Your Courier Dashboard!"
              as={CardTitle}
              className="text-2xl md:text-3xl font-headline text-primary"
            />
            <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 border rounded-lg bg-background shadow-sm">
              <Label htmlFor="activityStatus" className="text-lg font-medium">
                <AutoTranslateText translationKey="courier.status" fallback="Status" />: <span className={isActive ? "text-green-600" : "text-destructive"}>
                  <AutoTranslateText translationKey={isActive ? "courier.active" : "courier.inactive"} fallback={isActive ? "Active" : "Inactive"} />
                </span>
              </Label>
              <Switch
                id="activityStatus"
                checked={isActive}
                onCheckedChange={handleActivityToggle}
                aria-label="הפעל או כבה זמינות למשלוחים"
              />
              {isActive ? <CheckCircle className="h-6 w-6 text-green-600" /> : <XCircle className="h-6 w-6 text-destructive" />}
            </div>
          </div>
          <AutoTranslateText 
            translationKey="courier.dashboard.description" 
            fallback="Manage your availability, track performance and find new delivery opportunities."
            as={CardDescription}
            className="mt-1"
          />
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-6"> {/* Changed to 3 cols for new card */}
        <Card className="premium-card-hover">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <MapPin className={`h-5 w-5 text-accent ${isRTL ? 'ml-2' : 'mr-2'}`}/> 
              <AutoTranslateText translationKey="courier.hotZones.title" fallback="Hot Zones Map" />
            </CardTitle>
            <AutoTranslateText 
              translationKey="courier.hotZones.description" 
              fallback="View areas with high concentration of orders right now."
              as={CardDescription}
            />
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
              <Image
                src="https://placehold.co/600x350.png"
                alt="מפת אזורים חמים"
                layout="fill"
                objectFit="cover"
                data-ai-hint="city map delivery hotspots"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-4 text-center">
                <AutoTranslateText 
                  translationKey="courier.liveMapDemo" 
                  fallback="Live Map View (Demo)"
                  as="p"
                  className="text-white text-lg font-semibold"
                />
                <div className="mt-2 space-y-1 text-xs">
                    <Badge variant="destructive" className="bg-red-500/80 text-white animate-pulse">
                      <AlertTriangle className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`}/> 
                      <AutoTranslateText translationKey="courier.highDemandZone" fallback="High Demand Zone: City Center" />
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-500/80 text-white">
                      <Lightbulb className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`}/> 
                      <AutoTranslateText translationKey="courier.recommendedLocation" fallback="AI Recommended Location: Near Central Mall" />
                    </Badge>
                </div>
              </div>
            </div>
            <AutoTranslateText 
              translationKey="courier.bonusNote" 
              fallback="Note: Bonus alerts in hot zones will appear as toast notifications."
              as="p"
              className="text-xs text-muted-foreground mt-2"
            />
          </CardContent>
        </Card>
        
        <Card className="premium-card-hover">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <DollarSign className={`h-5 w-5 text-green-600 ${isRTL ? 'ml-2' : 'mr-2'}`}/> 
              <AutoTranslateText translationKey="courier.dailyPerformance" fallback="Daily Performance" />
            </CardTitle>
            <AutoTranslateText 
              translationKey="courier.dailyPerformance.description" 
              fallback="Summary of your activity for today."
              as={CardDescription}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-md">
              <AutoTranslateText translationKey="courier.todayEarnings" fallback="Today's Earnings:" as="p" className="font-medium" />
              {isLoadingStats || dailyEarnings === null ? <Loader2 className="h-6 w-6 animate-spin text-green-700" /> : <p className="text-2xl font-bold text-green-700">₪{dailyEarnings.toFixed(2)}</p>}
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
              <AutoTranslateText translationKey="courier.completedDeliveries" fallback="Deliveries Completed Today:" as="p" className="font-medium" />
              {isLoadingStats || dailyDeliveries === null ? <Loader2 className="h-6 w-6 animate-spin text-blue-700" /> : <p className="text-2xl font-bold text-blue-700">{dailyDeliveries}</p>}
            </div>
             <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-md">
              <AutoTranslateText translationKey="courier.openBids" fallback="Open Bids Right Now:" as="p" className="font-medium" />
              {isLoadingStats || openBidCount === null ? <Loader2 className="h-6 w-6 animate-spin text-orange-700" /> : <p className="text-2xl font-bold text-orange-700">{openBidCount}</p>}
            </div>
            <Button asChild size="lg" className="w-full btn-gradient-hover-primary">
                <Link href="/courier/performance">
                    <BarChart3 className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`}/> 
                    <AutoTranslateText translationKey="courier.viewFullPerformance" fallback="View Full Performance" />
                </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="premium-card-hover">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Trophy className={`h-5 w-5 text-yellow-500 ${isRTL ? 'ml-2' : 'mr-2'}`}/> 
              <AutoTranslateText translationKey="courier.tasksAndBonuses" fallback="Tasks & Bonuses" />
            </CardTitle>
            <AutoTranslateText 
              translationKey="courier.tasksAndBonuses.description" 
              fallback="Track your progress and bonus opportunities."
              as={CardDescription}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border border-dashed border-yellow-400 rounded-md bg-yellow-50">
                <AutoTranslateText 
                  translationKey="courier.weekendTask" 
                  fallback="Weekend Task (Demo):"
                  as="p"
                  className="font-semibold text-yellow-700"
                />
                <AutoTranslateText 
                  translationKey="courier.weekendTask.description" 
                  fallback="Complete 5 deliveries between Friday and Saturday and get ₪20 bonus!"
                  as="p"
                  className="text-sm text-yellow-600"
                />
                <div className="w-full bg-yellow-200 rounded-full h-2.5 mt-1">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${( (dailyDeliveries || 0) % 5 / 5) * 100}%` }}></div> {/* Mock progress */}
                </div>
                <p className="text-xs text-yellow-500 mt-1">
                  <AutoTranslateText translationKey="courier.progress" fallback="Progress" />: {(dailyDeliveries || 0) % 5}/5
                </p>
            </div>
            <div className="p-3 border rounded-md bg-purple-50 text-purple-700">
                <p className="font-semibold">
                  <AutoTranslateText translationKey="courier.vipRating" fallback="VIP Rating (Demo)" />: 
                  <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                    <AutoTranslateText translationKey="courier.gold" fallback="Gold" />
                  </Badge>
                </p>
                <AutoTranslateText 
                  translationKey="courier.vipBenefits" 
                  fallback="VIP couriers get priority in profitable offers."
                  as="p"
                  className="text-xs"
                />
            </div>
            <Button variant="outline" className="w-full" onClick={() => toast({title: "Coming Soon", description: "A full page for managing tasks, achievements and VIP program will be added."})}>
                <CalendarClock className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`}/> 
                <AutoTranslateText translationKey="courier.showAllTasks" fallback="Show All Tasks" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="text-center premium-card-hover">
        <CardHeader>
            <AutoTranslateText 
              translationKey="courier.lookingForNext" 
              fallback="Looking for your next delivery?"
              as={CardTitle}
              className="text-xl"
            />
        </CardHeader>
        <CardContent>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-7 shadow-lg relative overflow-hidden group btn-gradient-hover-accent">
              <Link href="/courier/open-bids" className="flex items-center">
                <Zap className="mr-3 h-6 w-6 text-yellow-300 group-hover:animate-pulse absolute left-4 opacity-75"/> 
                <Search className="mr-3 h-6 w-6"/> 
                <AutoTranslateText translationKey="courier.findDeliveries" fallback="Find Deliveries Now" /> ({isLoadingStats || openBidCount === null ? <Loader2 className="inline-block h-5 w-5 animate-spin" /> : openBidCount} <AutoTranslateText translationKey="courier.openOffers" fallback="open offers" />)
              </Link>
            </Button>
        </CardContent>
         <CardFooter className="justify-center pt-2">
            <AutoTranslateText 
              translationKey="courier.realTimeOffers" 
              fallback="Offers arena updates in real time. Offers tailored for you by AI."
              as="p"
              className="text-xs text-muted-foreground"
            />
         </CardFooter>
      </Card>
      
       <div className="grid md:grid-cols-2 gap-6">
           <Card className="hover:shadow-md transition-shadow premium-card-hover">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <PackageCheck className={`h-5 w-5 text-primary ${isRTL ? 'ml-2' : 'mr-2'}`}/> 
                      <AutoTranslateText translationKey="courier.activeOrdersManagement" fallback="Active Orders Management" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AutoTranslateText 
                      translationKey="courier.activeOrders.description" 
                      fallback="View and track your current deliveries."
                      as="p"
                      className="text-sm text-muted-foreground mb-3"
                    />
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/courier/active-orders">
                          <AutoTranslateText translationKey="courier.goToActiveOrders" fallback="Go to Active Orders" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
             <Card className="hover:shadow-md transition-shadow premium-card-hover">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <ListChecks className={`h-5 w-5 text-primary ${isRTL ? 'ml-2' : 'mr-2'}`}/> 
                      <AutoTranslateText translationKey="courier.quickOffers" fallback="Quick Offers" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AutoTranslateText 
                      translationKey="courier.quickOffers.description" 
                      fallback="See the latest offers received or submitted."
                      as="p"
                      className="text-sm text-muted-foreground mb-3"
                    />
                    <Button variant="outline" onClick={() => toast({title: "Quick Offers", description: "Ability to view quick offers will be added here. (Demo)"})} className="w-full">
                        <AutoTranslateText translationKey="courier.showQuickOffers" fallback="Show Quick Offers" />
                    </Button>
                </CardContent>
            </Card>
       </div>
    </div>
  );
}
