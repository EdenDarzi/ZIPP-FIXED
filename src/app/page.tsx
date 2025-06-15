
'use client'; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, ShoppingCart, Brain, ArrowLeft, MapPin, Search, Sparkles, Heart, History, Award, Flame, Gift, Gem, UsersIcon, MapIcon as FoodRadarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RestaurantCard from "@/components/restaurants/restaurant-card";
import { mockRestaurants } from "@/lib/mock-data";
import type { Restaurant } from "@/types";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getCulinarySuggestion, CulinaryAssistantInput } from "@/ai/flows/culinary-assistant-flow"; 
import SurpriseFeatureCard from "@/components/surprise/surprise-feature-card";

export default function HomePage() {
  const allRestaurants: Restaurant[] = mockRestaurants;
  const recommendedForYou = allRestaurants.filter(r => r.tags?.includes('Recommended')).slice(0, 3);
  const newInArea = allRestaurants.filter(r => r.tags?.includes('New')).slice(0, 3);
  const recentlyViewedMock = allRestaurants.slice(1,4); 

  const [culinarySuggestion, setCulinarySuggestion] = useState<string | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(true);

  useEffect(() => {
    async function fetchSuggestion() {
      setIsLoadingSuggestion(true);
      try {
        const input: CulinaryAssistantInput = { userId: "mockUser123", currentDay: new Date().toLocaleString('he-IL', { weekday: 'long' }) };
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
  }, []);

  return (
    <div className="space-y-16">
      <section className="text-center py-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl shadow-xl overflow-hidden">
        <div className="animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-bold font-headline text-primary mb-6" style={{textShadow: '2px 2px 4px hsl(var(--foreground) / 0.1)'}}>
            ברוכים הבאים ל-SwiftServe
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto mb-10">
            הפתרון האחד שלכם למשלוח מהיר ואמין מהעסקים המקומיים האהובים עליכם.
          </p>
        </div>
        <div className="max-w-xl mx-auto mb-10 animate-fadeInUp animation-delay-200">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="מה מתחשק לכם היום? (למשל, פיצה, פרחים, ייעוץ)"
              className="w-full pr-12 pl-4 py-3 text-lg rounded-full shadow-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              aria-label="Search for food, products, or services"
            />
          </div>
        </div>
        <div className="space-x-4 animate-fadeInUp animation-delay-400">
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform hover:scale-105 px-8 py-6 text-lg">
            <Link href="/restaurants">
              <span className="flex items-center justify-center w-full">
                <Utensils className="ml-2 h-5 w-5" />
                חיפוש עסקים 
              </span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="shadow-md transition-transform hover:scale-105 px-8 py-6 text-lg">
            <Link href="/auth/register">
               <span className="flex items-center justify-center w-full">
                 <ArrowLeft className="ml-2 h-5 w-5" />
                 הרשמה 
               </span>
            </Link>
          </Button>
        </div>
      </section>

      <section className="animate-fadeInUp animation-delay-600">
        <Card className="bg-primary/5 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-headline text-primary flex items-center">
              <Sparkles className="h-6 w-6 ml-2 text-yellow-500" />
              העוזר האישי שלך
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSuggestion ? (
              <p className="text-muted-foreground animate-pulse">חושב על משהו מיוחד בשבילך...</p>
            ) : (
              <p className="text-lg text-foreground/90">{culinarySuggestion}</p>
            )}
            <Button variant="link" className="p-0 h-auto mt-2 text-primary hover:text-accent transition-colors" asChild>
              <Link href="/recommendations"><span>קבל המלצות אישיות נוספות &larr;</span></Link>
            </Button>
          </CardContent>
        </Card>
      </section>
      
      <SurpriseFeatureCard />

      {/* New Feature Links Section */}
      <section className="grid md:grid-cols-3 gap-4 animate-fadeInUp animation-delay-700">
        <Link href="/food-radar" passHref>
          <Card className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full flex flex-col items-center justify-center text-center p-4">
            <FoodRadarIcon className="h-10 w-10 text-primary mb-2" />
            <CardTitle className="text-lg font-semibold">Food Radar</CardTitle>
            <CardDescription className="text-xs">גלה מה חם סביבך!</CardDescription>
          </Card>
        </Link>
        <Link href="/vip" passHref>
           <Card className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full flex flex-col items-center justify-center text-center p-4">
            <Gem className="h-10 w-10 text-purple-500 mb-2" />
            <CardTitle className="text-lg font-semibold">SwiftServe VIP</CardTitle>
            <CardDescription className="text-xs">הטבות פרימיום בלעדיות</CardDescription>
          </Card>
        </Link>
        <Link href="/affiliate" passHref>
          <Card className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full flex flex-col items-center justify-center text-center p-4">
            <UsersIcon className="h-10 w-10 text-green-500 mb-2" />
            <CardTitle className="text-lg font-semibold">תוכנית שותפים</CardTitle>
            <CardDescription className="text-xs">הרווח כסף על המלצות!</CardDescription>
          </Card>
        </Link>
      </section>


      {recommendedForYou.length > 0 && (
        <section className="animate-fadeInUp animation-delay-800">
          <div className="flex items-center mb-6">
            <Heart className="h-7 w-7 ml-3 text-pink-500" />
            <h2 className="text-3xl font-bold font-headline text-foreground">מומלץ עבורך</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedForYou.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>
      )}

      {newInArea.length > 0 && (
        <section className="animate-fadeInUp animation-delay-1000">
          <div className="flex items-center mb-6">
            <MapPin className="h-7 w-7 ml-3 text-green-500" />
            <h2 className="text-3xl font-bold font-headline text-foreground">חדש באזורך</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newInArea.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>
      )}

      {recentlyViewedMock.length > 0 && (
         <section className="animate-fadeInUp animation-delay-1200">
          <div className="flex items-center mb-6">
            <History className="h-7 w-7 ml-3 text-blue-500" />
            <h2 className="text-3xl font-bold font-headline text-foreground">הזמן שוב מועדפים</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewedMock.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>
      )}
      
      <section className="animate-fadeInUp animation-delay-1400">
        <div className="flex items-center mb-6">
          <Award className="h-7 w-7 ml-3 text-purple-500" />
          <h2 className="text-3xl font-bold font-headline text-foreground">גלה את כל העסקים</h2>
        </div>
        {allRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allRestaurants.slice(0,3).map((restaurant) => ( 
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">מחפש המלצות בקרבתך...</p>
        )}
        <div className="text-center mt-8">
            <Button variant="link" asChild className="text-lg text-primary hover:text-accent transition-colors">
                <Link href="/restaurants">
                  <span className="flex items-center justify-center w-full">
                    <ArrowLeft className="mr-1 h-4 w-4" /> הצג את כל העסקים
                  </span>
                </Link>
            </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 animate-fadeInUp animation-delay-1600">
        <Card className="hover:shadow-xl transition-all duration-300 hover:border-primary border-2 border-transparent">
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
        <Card className="hover:shadow-xl transition-all duration-300 hover:border-primary border-2 border-transparent">
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
        <Card className="hover:shadow-xl transition-all duration-300 hover:border-primary border-2 border-transparent">
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
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/30 to-transparent flex items-center">
          <h3 className="text-3xl md:text-5xl font-bold text-white font-headline p-8 md:p-12 max-w-lg leading-tight">
            מהיר, טרי, במשלוח. <br/> חוו את <span className="text-accent">זירת השליחים</span>.
          </h3>
        </div>
      </section>
      <style jsx global>{`
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1200 { animation-delay: 1.2s; }
        .animation-delay-1400 { animation-delay: 1.4s; }
        .animation-delay-1600 { animation-delay: 1.6s; }
        .animation-delay-1800 { animation-delay: 1.8s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0; 
        }
      `}</style>
    </div>
  );
}
