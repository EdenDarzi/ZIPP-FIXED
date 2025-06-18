
'use client'; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, ShoppingCart, Brain, ArrowLeft, MapPin, Search, Sparkles, Heart, History, Award, Flame, Gift, Users as UsersIcon, MapIcon as FoodRadarIcon, ShoppingBag as LivePickSaleIcon, TrendingUp as LiveTrendIcon, MessageCircle, ExternalLink, Info, ShoppingBasket, ListChecks, Route, Send, PackagePlus, Loader2, Target } from "lucide-react";
import { GamepadIcon as Gamepad2 } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import RestaurantCard from "@/components/restaurants/restaurant-card";
import { mockRestaurants } from "@/lib/mock-data";
import type { Restaurant } from "@/types";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getCulinarySuggestion, CulinaryAssistantInput } from "@/ai/flows/culinary-assistant-flow"; 
import SurpriseFeatureCard from "@/components/surprise/surprise-feature-card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function HomePage() {
  const allRestaurants: Restaurant[] = mockRestaurants;
  const recommendedForYou = allRestaurants.filter(r => r.tags?.includes('Recommended')).slice(0, 3);
  const newInArea = allRestaurants.filter(r => r.tags?.includes('New')).slice(0, 3);
  const recentlyViewedMock = allRestaurants.slice(1,4); 

  const [culinarySuggestion, setCulinarySuggestion] = useState<string | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(true);
  const [showLivePickSaleBanner, setShowLivePickSaleBanner] = useState(true); 
  const [availableCouriers, setAvailableCouriers] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSuggestion() {
      setIsLoadingSuggestion(true);
      try {
        const input: CulinaryAssistantInput = { userId: "mockUser123", currentDay: new Date().toLocaleString('he-IL', { weekday: 'long' }) };
        await new Promise(resolve => setTimeout(resolve, 600));
        const result = await getCulinarySuggestion(input);
        setCulinarySuggestion(result.suggestion);
      } catch (error) {
        console.error("Failed to get culinary suggestion:", error);
        setCulinarySuggestion("גלה את המסעדות והעסקים המדהימים שלנו היום!"); 
      } finally {
        setIsLoadingSuggestion(false);
      }
    }
    fetchSuggestion();

    // Simulate fetching available couriers count only on client
    const courierTimeout = setTimeout(() => {
      setAvailableCouriers(Math.floor(Math.random() * 20) + 8); 
    }, 800);

    return () => clearTimeout(courierTimeout);

  }, []);

  const handlePartnershipsClick = () => {
    toast({
        title: "שותפויות והטבות (הדגמה)",
        description: "אזור זה יציג שיתופי פעולה ודילים חמים עם מותגים ומשפיענים.",
    });
  };

  return (
    <div className="space-y-12 md:space-y-16"> {/* Increased spacing */}
      <section className="text-center py-12 md:py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-xl shadow-xl overflow-hidden border border-border">
        <div className="animate-fadeInUp">
          <Sparkles className="h-12 w-12 text-accent mx-auto mb-4" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline text-primary mb-6" style={{textShadow: '1px 1px 3px hsl(var(--foreground) / 0.1)'}}>
            ברוכים הבאים ל-LivePick
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto mb-8 sm:mb-10">
            הפתרון האחד שלכם למשלוח מהיר ואמין מהעסקים המקומיים האהובים עליכם, עם טוויסט חכם וקהילתי!
          </p>
        </div>
        <div className="max-w-xl mx-auto mb-8 sm:mb-10 animate-fadeInUp animation-delay-200">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="search"
                    placeholder="מה בא לכם? חפשו 'פיצה חריפה', 'זר ורדים' או 'קפה קר'"
                    className="w-full pr-12 pl-4 py-3.5 text-base md:text-lg rounded-full shadow-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    aria-label="חפש אוכל, מוצרים או שירותים"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>נסה לחפש מנה, סוג מטבח, שם עסק, או אפילו טרנד!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-4 animate-fadeInUp animation-delay-400">
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform hover:scale-105 px-8 py-3 text-lg btn-gradient-hover-accent">
            <Link href="/restaurants">
              <span className="flex items-center justify-center w-full">
                <Utensils className="ml-2 h-5 w-5" />
                לכל העסקים
              </span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="shadow-md transition-transform hover:scale-105 px-8 py-3 text-lg border-primary text-primary hover:bg-primary/5">
            <Link href="/auth/register">
               <span className="flex items-center justify-center w-full">
                 <ArrowLeft className="ml-2 h-5 w-5" />
                 הרשמה מהירה
               </span>
            </Link>
          </Button>
        </div>
      </section>

      {showLivePickSaleBanner && (
        <section className="animate-fadeInUp animation-delay-500">
            <Card className="bg-red-500 text-white shadow-xl hover:shadow-2xl transition-shadow cursor-pointer border-2 border-red-600 premium-card-hover">
                <Link href="/livepick-sale">
                    <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-center text-center gap-3 sm:gap-4">
                        <LivePickSaleIcon className="h-10 w-10 sm:h-12 sm:w-12 animate-bounce" />
                        <div>
                            <CardTitle className="text-2xl sm:text-3xl font-headline">🔥 מבצעי LivePick Sale לוהטים!</CardTitle>
                            <CardDescription className="text-red-100 text-sm sm:text-base">שקיות הפתעה מסוף היום בהנחות ענק! מהרו לפני שייגמר.</CardDescription>
                        </div>
                    </CardContent>
                </Link>
            </Card>
        </section>
      )}

      <section className="animate-fadeInUp animation-delay-600">
        <Card className="bg-primary/5 border-primary/20 shadow-lg premium-card-hover">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary flex items-center">
              <Brain className="h-7 w-7 ml-3 text-yellow-400" /> {/* Updated icon */}
              העוזר הקולינרי החכם שלך
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSuggestion ? (
              <p className="text-muted-foreground animate-pulse flex items-center"><Loader2 className="h-5 w-5 mr-2 animate-spin"/>ה-AI שלנו רוקח משהו מיוחד בשבילך...</p>
            ) : (
              <p className="text-lg text-foreground/90">{culinarySuggestion}</p>
            )}
            <Button variant="link" className="p-0 h-auto mt-3 text-primary hover:text-accent transition-colors text-base" asChild>
              <Link href="/recommendations"><span>קבל המלצות AI נוספות &larr;</span></Link>
            </Button>
          </CardContent>
        </Card>
      </section>
      
      <SurpriseFeatureCard />

      <section className="grid md:grid-cols-2 gap-6 animate-fadeInUp animation-delay-680">
        <Card className="premium-card-hover h-full flex flex-col items-center justify-center text-center p-6 bg-green-500/5 border-green-500/20">
           <Route className="h-12 w-12 text-green-600 mb-3" />
           <CardTitle className="text-xl font-semibold text-green-700">שליחים פעילים באזורך כעת!</CardTitle>
           {availableCouriers === null ? (
             <CardDescription className="text-md text-green-600/90 mt-1 animate-pulse flex items-center justify-center"><Loader2 className="h-4 w-4 mr-1 animate-spin"/>בודק זמינות...</CardDescription>
           ) : (
             <CardDescription className="text-md text-green-600/90 mt-1">
               כעת יש כ-<strong className="text-2xl">{availableCouriers}</strong> שליחים זמינים!
             </CardDescription>
           )}
        </Card>
        <Card className="premium-card-hover h-full flex flex-col items-center justify-center text-center p-6 bg-blue-500/5 border-blue-500/20">
           <PackagePlus className="h-12 w-12 text-blue-600 mb-3" />
           <CardTitle className="text-xl font-semibold text-blue-700">צריך לשלוח חפץ או מסמך?</CardTitle>
           <CardDescription className="text-md text-blue-600/90 mt-1">שירות משלוחי P2P לשליחת חפצים, מסמכים, או אפילו לבקש מהשליח לרכוש עבורך משהו קטן.</CardDescription>
           <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700 text-white btn-gradient-hover-primary">
             <Link href="/send-package">
               התחל משלוח P2P <ArrowLeft className="mr-2 h-4 w-4" />
             </Link>
           </Button>
        </Card>
      </section>


      <section className="grid md:grid-cols-2 gap-6 animate-fadeInUp animation-delay-700"> {/* Changed to 2 columns after VIP removal */}
        <Link href="/food-radar" passHref>
          <Card className="premium-card-hover h-full flex flex-col items-center justify-center text-center p-6 transition-all hover:border-primary">
            <FoodRadarIcon className="h-10 w-10 text-primary mb-2" />
            <CardTitle className="text-lg font-semibold">Food Radar & Live Trends</CardTitle>
            <CardDescription className="text-sm">גלה מה חם סביבך בזמן אמת!</CardDescription>
          </Card>
        </Link>
        <Link href="/affiliate" passHref>
          <Card className="premium-card-hover h-full flex flex-col items-center justify-center text-center p-6 transition-all hover:border-green-500">
            <UsersIcon className="h-10 w-10 text-green-500 mb-2" />
            <CardTitle className="text-lg font-semibold">תוכנית שותפים</CardTitle>
            <CardDescription className="text-sm">הרווח כסף והטבות על המלצות.</CardDescription>
          </Card>
        </Link>
      </section>
      
       <section className="animate-fadeInUp animation-delay-750">
        <Card className="border-orange-500/30 bg-orange-500/5 premium-card-hover">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-2xl font-headline text-orange-600 flex items-center justify-center">
              <Flame className="h-7 w-7 ml-2" /> שיתופי פעולה ודילים חמים
            </CardTitle>
            <CardDescription className="text-orange-700/80 text-base">מבצעים בלעדיים בשיתוף עם מותגים מובילים, בהשראת הטרנדים החמים ביותר!</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-orange-700/90 space-y-3">
            <p className="text-md">"<strong>בלעדי ל-LivePick!</strong> קבלו 20% הנחה על כל קולקציית הקינוחים החדשה של 'Sweet Dreams Bakery' בהשראת טרנד ה'קרופי' שזוהה ב-TrendScanner!"</p>
            <Button variant="link" size="sm" className="text-orange-600 hover:text-orange-700 p-0 h-auto mt-2 text-base" onClick={handlePartnershipsClick}>
                גלה שיתופי פעולה נוספים <ExternalLink className="h-4 w-4 mr-1"/>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="animate-fadeInUp animation-delay-650">
          <Card className="bg-teal-500/10 border-teal-500/30 premium-card-hover">
            <CardHeader className="items-center text-center">
              <Gamepad2 className="h-10 w-10 text-teal-600 mb-2" />
              <CardTitle className="text-2xl font-headline text-teal-700">🎡 גלגל ההפתעות של LivePick!</CardTitle>
              <CardDescription className="text-teal-600/80 text-base">מרגיש בר מזל? סובב את הגלגל וזכה בהנחות, קינוחים, משלוחים חינם ועוד הפתעות!</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg btn-gradient-hover-primary px-10 py-3 text-lg">
                <Link href="/spin-wheel">
                  סובב את הגלגל היומי
                </Link>
              </Button>
            </CardContent>
          </Card>
      </section>

      {recommendedForYou.length > 0 && (
        <section className="animate-fadeInUp animation-delay-800">
          <div className="flex items-center mb-6">
            <Target className="h-8 w-8 ml-3 text-pink-500" /> {/* Changed icon */}
            <h2 className="text-3xl font-bold font-headline text-foreground">🎯 במיוחד בשבילך: ממצאים שאסור לפספס!</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap */}
            {recommendedForYou.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>
      )}

      {newInArea.length > 0 && (
        <section className="animate-fadeInUp animation-delay-1000">
          <div className="flex items-center mb-6">
            <Sparkles className="h-8 w-8 ml-3 text-green-500" /> {/* Changed icon */}
            <h2 className="text-3xl font-bold font-headline text-foreground">✨ חדש חם מהתנור: גלה מה נפתח לידך!</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap */}
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
            <h2 className="text-3xl font-bold font-headline text-foreground">הזמן שוב מועדפים בקליק</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap */}
            {recentlyViewedMock.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>
      )}
      
      <section className="animate-fadeInUp animation-delay-1400 bg-muted/30 p-6 sm:p-8 rounded-xl">
        <div className="flex items-center mb-6">
          <ListChecks className="h-8 w-8 ml-3 text-gray-500" />
          <h2 className="text-3xl font-bold font-headline text-foreground">גלה את כל העסקים</h2>
        </div>
        {allRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap */}
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
                    <ArrowLeft className="mr-2 h-5 w-5" /> הצג את כל העסקים והחנויות
                  </span>
                </Link>
            </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 animate-fadeInUp animation-delay-1600">
        <Card className="premium-card-hover hover:border-accent">
          <CardHeader className="items-center text-center">
            <Utensils className="h-12 w-12 text-accent mb-3" />
            <CardTitle className="font-headline text-xl">מבחר רחב</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              גלו מגוון רחב של מוצרים ושירותים ממספר רב של עסקים מקומיים.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="premium-card-hover hover:border-accent">
          <CardHeader className="items-center text-center">
            <ShoppingCart className="h-12 w-12 text-accent mb-3" />
            <CardTitle className="font-headline text-xl">הזמנה קלה</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              תהליך הזמנה חלק ואינטואיטיבי מעיון ועד תשלום.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="premium-card-hover hover:border-accent">
          <CardHeader className="items-center text-center">
            <Brain className="h-12 w-12 text-accent mb-3" />
            <CardTitle className="font-headline text-xl">הצעות חכמות</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              קבלו הצעות אישיות לפריטים ועסקים המופעלות על ידי מנוע ה-AI שלנו.
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
            מהיר, טרי, במשלוח. <br/> חוו את <span className="text-accent">זירת השליחים</span> החכמה של LivePick.
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
            transform: translateY(25px); /* Slightly more noticeable */
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.7s ease-out forwards; /* Slightly longer duration */
          opacity: 0; 
        }
        .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards; /* Slightly longer duration */
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
    
