
'use client'; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, ShoppingCart, Brain, ArrowLeft, MapPin, Search, Sparkles, Heart, History, Award, Flame, Gift, Users as UsersIcon, MapIcon as FoodRadarIcon, ShoppingBag as ZippsSaleIcon, TrendingUp as LiveTrendIcon, MessageCircle, ExternalLink, Info, ShoppingBasket, ListChecks, Route, Send, PackagePlus, Loader2, Target, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RestaurantCard from "@/components/restaurants/restaurant-card";
import { mockRestaurants } from "@/lib/mock-data";
import type { Restaurant } from "@/types";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getCulinarySuggestion, CulinaryAssistantInputType } from "@/ai/flows/culinary-assistant-flow"; 

import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/context/language-context";
import MetaballsBackground from "@/components/ui/metaballs-background";

export default function HomePage() {
  const { t, currentLanguage } = useLanguage();
  const allRestaurants: Restaurant[] = mockRestaurants;
  const recommendedForYou = allRestaurants.filter(r => r.tags?.includes('Recommended')).slice(0, 3);
  const newInArea = allRestaurants.filter(r => r.tags?.includes('New')).slice(0, 3);
  const recentlyViewedMock = allRestaurants.slice(1,4); 

  const [culinarySuggestion, setCulinarySuggestion] = useState<string | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(true);
  const [showZippSaleBanner, setShowZippSaleBanner] = useState(false); 
  const [availableCouriers, setAvailableCouriers] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSuggestion() {
      setIsLoadingSuggestion(true);
      try {
        const input: CulinaryAssistantInputType = { userId: "mockUser123", currentDay: new Date().toLocaleString('he-IL', { weekday: 'long' }) };
        await new Promise(resolve => setTimeout(resolve, 600)); 
        const result = await getCulinarySuggestion(input);
        setCulinarySuggestion(result.suggestion);
      } catch (error) {
        console.error("Failed to get culinary suggestion:", error);
        setCulinarySuggestion(t('ai.chef.suggestion')); 
      } finally {
        setIsLoadingSuggestion(false);
      }
    }
    fetchSuggestion();

    const courierTimeout = setTimeout(() => {
      setAvailableCouriers(Math.floor(Math.random() * 20) + 8); 
    }, 800);

    const currentHour = new Date().getHours();
    if (currentHour >= 19 && currentHour < 23) { 
        setShowZippSaleBanner(true);
    }

    return () => clearTimeout(courierTimeout);

  }, [t]); // Adiciona 't' como dependência para recarregar quando o idioma mudar

  const handlePartnershipsClick = () => {
    toast({
        title: "שותפויות והטבות (הדגמה)",
        description: "אזור זה יציג שיתופי פעולה ודילים חמים עם מותגים ומשפיענים.",
    });
  };

  return (
    <div className="space-y-12 md:space-y-16">
      <section className="relative text-center py-12 md:py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-xl shadow-xl overflow-hidden border border-border">
        <MetaballsBackground />
        <div className="relative z-10 animate-fadeInUp">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-headline mb-6 text-gray-700 dark:text-white"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
          >
            {t('welcome.title')}
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto mb-8 sm:mb-10">
            {t('welcome.subtitle')}
          </p>
        </div>
        <div className="relative z-10 max-w-xl mx-auto mb-8 sm:mb-10 animate-fadeInUp animation-delay-200">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="search"
                    placeholder={t('search.placeholder')}
                    className="w-full pr-12 pl-4 py-3.5 text-base md:text-lg rounded-full shadow-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    aria-label="חפש אוכל, מוצרים או שירותים"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{t('search.tooltip')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="relative z-10 mt-8 sm:mt-10 flex flex-wrap justify-center gap-4 animate-fadeInUp animation-delay-400">
          <Button size="lg" variant="ghost" asChild className="shadow-md transition-all duration-300 hover:scale-105 px-8 py-3 text-lg text-black dark:text-white hover:bg-gray-900 hover:text-primary border-2 border-black dark:border-white hover:border-primary">
            <Link href="/restaurants">
              <span className="flex items-center justify-center w-full">
                <Utensils className="ml-2 h-5 w-5" />
                {t('business.all')}
              </span>
            </Link>
          </Button>
          <Button size="lg" variant="ghost" asChild className="shadow-md transition-all duration-300 hover:scale-105 px-8 py-3 text-lg text-black dark:text-white hover:bg-gray-900 hover:text-primary border-2 border-black dark:border-white hover:border-primary">
            <Link href="/auth/register">
               <span className="flex items-center justify-center w-full">
                 <ArrowLeft className="mr-2 h-5 w-5" />
                 {t('business.quickSignup')}
               </span>
            </Link>
          </Button>
        </div>
      </section>

      {showZippSaleBanner && (
        <section className="animate-fadeInUp animation-delay-500">
            <Card className="bg-red-500 text-white shadow-xl hover:shadow-2xl transition-shadow cursor-pointer border-2 border-red-600 premium-card-hover">
                <Link href="/livepick-sale">
                    <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-center text-center gap-3 sm:gap-4">
                        <ZippsSaleIcon className="h-10 w-10 sm:h-12 sm:w-12 animate-bounce" />
                        <div>
                            <CardTitle className="text-2xl sm:text-3xl font-headline">{t('zipp.sale.banner')}</CardTitle>
                            <CardDescription className="text-red-100 text-sm sm:text-base">{t('zipp.sale.description')}</CardDescription>
                        </div>
                    </CardContent>
                </Link>
            </Card>
        </section>
      )}

      <section className="animate-fadeInUp animation-delay-600 flex justify-center">
        <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 border-violet-200/50 dark:border-violet-800/30 shadow-xl premium-card-hover max-w-3xl w-full">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-400/10 to-purple-600/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-indigo-400/10 to-blue-500/10 rounded-full blur-xl"></div>
          
          <CardHeader className="relative pb-4">
            <div className="flex items-center justify-center gap-4 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full blur-md opacity-30"></div>
                <Brain className="relative h-7 w-7 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                  {t('ai.chef.title')}
            </CardTitle>
                <p className="text-sm text-violet-600/70 dark:text-violet-400/70 font-medium">
                  {t('ai.chef.subtitle')}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative pt-0">
            {isLoadingSuggestion ? (
              <div className="flex items-center justify-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-violet-200/30 dark:border-violet-700/30">
                <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
                <p className="text-violet-600 dark:text-violet-400 animate-pulse">{t('ai.loading')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-violet-200/40 dark:border-violet-700/40 backdrop-blur-sm">
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-200 font-medium text-center">
                    {culinarySuggestion}
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button 
                    asChild
                    className="group bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                  >
                    <Link href="/recommendations" className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span>{t('ai.more')}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
      

      <section className="grid md:grid-cols-2 gap-8 animate-fadeInUp animation-delay-680">
        {/* Active Couriers Card */}
        <Card className="group relative overflow-hidden rounded-xl !bg-white/40 dark:!bg-gray-950/80 bg-clip-padding backdrop-blur-xl backdrop-saturate-150 !border !border-white/20 dark:!border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-lg hover:ring-1 hover:ring-emerald-200 dark:hover:ring-emerald-500/30 dark:ring-offset-2 dark:ring-offset-gray-900 transition-all duration-500 premium-card-hover">
          {/* Background decoration */}
          <div className="hidden dark:block absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="hidden dark:block absolute -bottom-5 -left-5 w-16 h-16 bg-gradient-to-tr from-teal-400/20 to-emerald-500/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="hidden dark:block absolute inset-x-10 bottom-[-30%] h-40 bg-gradient-to-t from-emerald-500/15 via-transparent to-transparent blur-2xl"></div>
          
          <CardContent className="relative p-8 text-center space-y-4">
            {/* Icon with glow effect */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur-lg opacity-0 dark:opacity-40 dark:group-hover:opacity-80 transition-opacity duration-500"></div>
              <div className="relative bg-white p-4 dark:bg-gray-900/70 rounded-full border border-slate-200 dark:border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Route className="h-8 w-8 text-emerald-600 dark:text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            
            {/* Title with gradient */}
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-emerald-400 dark:to-green-400 group-hover:scale-105 transition-transform duration-300">
              {t('couriers.active')}
            </CardTitle>
            
            {/* Dynamic content */}
           {availableCouriers === null ? (
              <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/60 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-700 dark:text-emerald-500" />
                <p className="text-emerald-800 dark:text-emerald-400 animate-pulse font-medium">{t('couriers.checking')}</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-500/15 dark:to-green-500/15 rounded-lg blur-sm"></div>
                <div className="relative p-4 bg-gray-50 dark:bg-gray-900/70 rounded-lg border border-slate-200 dark:border-white/10 backdrop-blur-sm shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
                    <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">Live Status</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-800 dark:text-emerald-300 group-hover:scale-105 transition-transform duration-300">
                    {t('couriers.count', { count: availableCouriers })}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* P2P Delivery Card */}
        <Card className="group relative overflow-hidden rounded-xl !bg-white/40 dark:!bg-gray-950/80 bg-clip-padding backdrop-blur-xl backdrop-saturate-150 !border !border-white/20 dark:!border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-lg hover:ring-1 hover:ring-blue-200 dark:hover:ring-indigo-500/30 dark:ring-offset-2 dark:ring-offset-gray-900 transition-all duration-500 premium-card-hover">
          {/* Background decoration */}
          <div className="hidden dark:block absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="hidden dark:block absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-tr from-purple-400/20 to-blue-500/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="hidden dark:block absolute inset-x-10 bottom-[-30%] h-40 bg-gradient-to-t from-indigo-500/15 via-transparent to-transparent blur-2xl"></div>
          
          <CardContent className="relative p-8 text-center space-y-5">
            {/* Icon with glow effect */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-lg opacity-0 dark:opacity-40 dark:group-hover:opacity-80 transition-opacity duration-500"></div>
              <div className="relative bg-white p-4 dark:bg-gray-900/70 rounded-full border border-slate-200 dark:border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <PackagePlus className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            
            {/* Title with gradient */}
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-blue-400 dark:to-indigo-400 group-hover:scale-105 transition-transform duration-300">
              {t('p2p.title')}
            </CardTitle>
            
            {/* Description */}
            <div className="relative p-4 bg-gray-50 dark:bg-gray-900/70 rounded-lg border border-slate-200 dark:border-white/10 backdrop-blur-sm shadow-sm">
              <p className="text-gray-700 dark:text-blue-200 leading-relaxed font-medium">
                {t('p2p.description')}
              </p>
            </div>
            
            {/* CTA Button */}
            <Button 
              asChild 
              className="group/btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 px-6 py-3"
            >
              <Link href="/send-package" className="flex items-center gap-2">
                <Send className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                <span>{t('p2p.start')}</span>
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
             </Link>
           </Button>
          </CardContent>
        </Card>
      </section>


      <section className="grid md:grid-cols-2 gap-8 animate-fadeInUp animation-delay-700">
        {/* Food Radar Card */}
        <Link href="/food-radar" passHref>
          <Card className="group relative overflow-hidden rounded-xl !bg-white/40 dark:!bg-gray-950/80 bg-clip-padding backdrop-blur-xl backdrop-saturate-150 !border !border-white/20 dark:!border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-lg hover:ring-1 hover:ring-orange-200 dark:hover:ring-amber-500/30 dark:ring-offset-2 dark:ring-offset-gray-900 transition-all duration-500 premium-card-hover cursor-pointer">
            {/* Background decoration */}
            <div className="hidden dark:block absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
            <div className="hidden dark:block absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-yellow-400/20 to-orange-500/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700"></div>
            
            {/* Animated radar rings (visible only in dark for subtlety) */}
            <div className="absolute inset-0 hidden dark:flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 border-2 border-orange-300/40 dark:border-orange-600/30 rounded-full animate-ping"></div>
              <div className="absolute w-24 h-24 border-2 border-amber-300/50 dark:border-amber-600/40 rounded-full animate-ping animation-delay-300"></div>
              <div className="absolute w-16 h-16 border-2 border-yellow-300/60 dark:border-yellow-600/50 rounded-full animate-ping animation-delay-600"></div>
            </div>
            
            <CardContent className="relative p-8 text-center space-y-4 z-10">
              {/* Icon with radar effect */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full blur-lg opacity-0 dark:opacity-30 dark:group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative bg-white p-4 dark:bg-gray-900/70 rounded-full border border-slate-200 dark:border-white/10 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <FoodRadarIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              
              {/* Title with gradient */}
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-orange-400 dark:to-amber-400 group-hover:scale-105 transition-transform duration-300">
                {t('radar.title')}
              </CardTitle>
              
              {/* Description with live indicator */}
              <div className="relative p-4 bg-gray-50 dark:bg-gray-900/70 rounded-lg border border-slate-200 dark:border-white/10 backdrop-blur-sm shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-sm"></div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-orange-400 uppercase tracking-wide">Real Time</span>
                </div>
                <CardDescription className="text-gray-700 dark:text-amber-200 leading-relaxed font-medium">
                  {t('radar.subtitle')}
                </CardDescription>
              </div>
              
              {/* Hover indicator */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-center gap-1 text-gray-800 dark:text-orange-400">
                  <span className="text-sm font-medium">Explore Trends</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Partners Program Card */}
        <Link href="/affiliate" passHref>
          <Card className="group relative overflow-hidden rounded-xl !bg-white/40 dark:!bg-gray-950/80 bg-clip-padding backdrop-blur-xl backdrop-saturate-150 !border !border-white/20 dark:!border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-lg hover:ring-1 hover:ring-purple-200 dark:hover:ring-pink-500/30 dark:ring-offset-2 dark:ring-offset-gray-900 transition-all duration-500 premium-card-hover cursor-pointer">
            {/* Background decoration */}
            <div className="hidden dark:block absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
            <div className="hidden dark:block absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-tr from-rose-400/20 to-purple-500/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700"></div>
            
            {/* Decorative emojis removed by request */}
            
            <CardContent className="relative p-8 text-center space-y-4 z-10">
              {/* Icon with glow effect */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-lg opacity-0 dark:opacity-30 dark:group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative bg-white p-4 dark:bg-gray-900/70 rounded-full border border-slate-200 dark:border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UsersIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 group-hover:animate-pulse" />
                </div>
              </div>
              
              {/* Title with gradient */}
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-purple-400 dark:to-pink-400 group-hover:scale-105 transition-transform duration-300">
                {t('partners.program')}
              </CardTitle>
              
              {/* Description with earnings highlight */}
              <div className="relative p-4 bg-gray-50 dark:bg-gray-900/70 rounded-lg border border-slate-200 dark:border-white/10 backdrop-blur-sm shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-pink-300 uppercase tracking-wide">Earn Money</span>
                </div>
                <CardDescription className="text-gray-700 dark:text-pink-200 leading-relaxed font-medium">
                  {t('partners.description')}
                </CardDescription>
              </div>
              
              {/* Hover indicator */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-center gap-1 text-purple-700 dark:text-purple-400">
                  <span className="text-sm font-medium">Join Program</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>
      
       <section className="animate-fadeInUp animation-delay-750">
        <Card className="group relative overflow-hidden rounded-xl !bg-white/40 dark:!bg-gray-950/80 bg-clip-padding backdrop-blur-xl backdrop-saturate-150 !border !border-white/20 dark:!border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-lg hover:ring-1 hover:ring-orange-200 dark:hover:ring-orange-500/30 dark:ring-offset-2 dark:ring-offset-gray-900 premium-card-hover">
          {/* Overlays dark only */}
          <div className="hidden dark:block absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="hidden dark:block absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-tr from-amber-400/20 to-orange-500/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700"></div>
          <CardHeader className="items-center text-center relative z-10">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full blur-md opacity-30"></div>
              <Flame className="relative h-7 w-7 ml-2 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-2xl font-headline text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-orange-400 dark:to-amber-400">{t('partnerships.title')}</CardTitle>
            <CardDescription className="text-gray-700/80 dark:text-orange-200/80 text-base">{t('partnerships.description')}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4 relative z-10">
            <div className="relative p-4 bg-white/60 dark:bg-gray-900/70 rounded-lg border !border-white/20 dark:!border-white/10 backdrop-blur-sm">
              <p className="text-md text-gray-800 dark:text-orange-100">"{t('partnerships.example')}"</p>
            </div>
            <Button size="lg" className="group bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3" onClick={handlePartnershipsClick}>
                <ExternalLink className="h-4 w-4 mr-2 group-hover:translate-x-0.5 transition-transform"/>
                {t('partnerships.more')}
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="animate-fadeInUp animation-delay-650">
          <Card className="group relative overflow-hidden rounded-xl !bg-white/40 dark:!bg-gray-950/80 bg-clip-padding backdrop-blur-xl backdrop-saturate-150 !border !border-white/20 dark:!border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-lg hover:ring-1 hover:ring-teal-200 dark:hover:ring-teal-500/30 dark:ring-offset-2 dark:ring-offset-gray-900 premium-card-hover">
            {/* Decorative overlays (dark) */}
            <div className="hidden dark:block absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-teal-400/20 to-emerald-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="hidden dark:block absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-tr from-emerald-400/20 to-teal-500/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700"></div>
            <CardHeader className="items-center text-center relative z-10">
              <div className="relative mb-2">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full blur-md opacity-30"></div>
                <Award className="relative h-10 w-10 text-teal-600 dark:text-teal-400" /> 
              </div>
              <CardTitle className="text-2xl font-headline text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-teal-400 dark:to-emerald-400">{t('wheel.title')}</CardTitle>
              <CardDescription className="text-gray-700/80 dark:text-teal-300/80 text-base">{t('wheel.description')}</CardDescription>
            </CardHeader>
            <CardContent className="text-center relative z-10">
              <Button asChild size="lg" className="group/btn bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 px-10 py-3 text-lg">
                <Link href="/spin-wheel" className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                  {t('wheel.spin')}
                </Link>
              </Button>
            </CardContent>
          </Card>
      </section>

      {recommendedForYou.length > 0 && (
        <section className="animate-fadeInUp animation-delay-800">
          <div className="flex items-center mb-6">
            <Target className="h-8 w-8 ml-3 text-pink-500" />
            <h2 className="text-3xl font-bold font-headline text-foreground">{t('sections.recommended')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> 
            {recommendedForYou.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>
      )}

      {newInArea.length > 0 && (
        <section className="animate-fadeInUp animation-delay-1000">
          <div className="flex items-center mb-6">
            <Sparkles className="h-8 w-8 ml-3 text-green-500" />
            <h2 className="text-3xl font-bold font-headline text-foreground">{t('sections.new')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> 
            {newInArea.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>
      )}

      {recentlyViewedMock.length > 0 && (
         <section className="animate-fadeInUp animation-delay-1200">
          <div className="flex items-center mb-6">
            <History className="h-8 w-8 ml-3 text-blue-500" />
            <h2 className="text-3xl font-bold font-headline text-foreground">{t('sections.favorites')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> 
            {recentlyViewedMock.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>
      )}
      
      <section className="animate-fadeInUp animation-delay-1400 bg-muted/30 p-6 sm:p-8 rounded-xl">
        <div className="flex items-center mb-6">
          <ListChecks className="h-8 w-8 ml-3 text-gray-500" />
                      <h2 className="text-3xl font-bold font-headline text-foreground">{t('sections.allBusinesses')}</h2>
        </div>
        {allRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> 
            {allRestaurants.slice(0,3).map((restaurant) => ( 
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
           <Card className="text-center py-10 premium-card-hover">
            <CardContent>
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50"/>
                <p className="text-muted-foreground">לא נמצאו עסקים להצגה כרגע. אנא נסה מאוחר יותר.</p>
            </CardContent>
           </Card>
        )}
        <div className="text-center mt-10">
            <Button variant="link" asChild className="text-xl text-primary hover:text-accent transition-colors">
                <Link href="/restaurants">
                  <span className="flex items-center justify-center w-full">
                    <ArrowLeft className="mr-2 h-5 w-5" /> {t('show.all')}
                  </span>
                </Link>
            </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 animate-fadeInUp animation-delay-1600"> 
        <Card className="premium-card-hover hover:border-accent">
          <CardHeader className="items-center text-center">
            <Utensils className="h-12 w-12 text-accent mb-3" />
            <CardTitle className="font-headline text-xl">{t('features.variety')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              {t('features.variety.desc')}
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="premium-card-hover hover:border-accent">
          <CardHeader className="items-center text-center">
            <ShoppingCart className="h-12 w-12 text-accent mb-3" />
            <CardTitle className="font-headline text-xl">{t('features.easy')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              {t('features.easy.desc')}
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="premium-card-hover hover:border-accent">
          <CardHeader className="items-center text-center">
            <Brain className="h-12 w-12 text-accent mb-3" />
            <CardTitle className="font-headline text-xl">{t('features.smart')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              {t('features.smart.desc')}
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      <section className="relative h-72 md:h-96 rounded-xl overflow-hidden shadow-2xl animate-fadeInUp animation-delay-1800">
        <Image
          src="https://placehold.co/1200x400.png"
          alt="קולאז' משלוחי אוכל טעימים"
          layout="fill"
          objectFit="cover"
          data-ai-hint="food delivery collage promotion"
          className="transition-transform duration-500 ease-in-out hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent flex items-center">
          <h3 className="text-3xl md:text-5xl font-bold text-white font-headline p-8 md:p-12 max-w-lg leading-tight shadow-text-lg">
            {t('hero.subtitle')} <br/> {t('hero.description')}
          </h3>
        </div>
      </section>
      <style jsx global>{`
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-650 { animation-delay: 0.65s; }
        .animation-delay-680 { animation-delay: 0.68s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-750 { animation-delay: 0.75s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1100 { animation-delay: 1.1s; }
        .animation-delay-1200 { animation-delay: 1.2s; }
        .animation-delay-1400 { animation-delay: 1.4s; }
        .animation-delay-1600 { animation-delay: 1.6s; }
        .animation-delay-1800 { animation-delay: 1.8s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.7s ease-out forwards;
          opacity: 0; 
        }
        .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
            opacity: 0;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .shadow-text-lg {
            text-shadow: 0px 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
    

