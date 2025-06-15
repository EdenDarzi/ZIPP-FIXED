
'use client'; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, ShoppingCart, Brain, ArrowRight, MapPin, Search, Sparkles, Heart, History, Award, Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RestaurantCard from "@/components/restaurants/restaurant-card";
import { mockRestaurants } from "@/lib/mock-data";
import type { Restaurant } from "@/types";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getCulinarySuggestion, CulinaryAssistantInput } from "@/ai/flows/culinary-assistant-flow"; 

export default function HomePage() {
  const allRestaurants: Restaurant[] = mockRestaurants;
  const recommendedForYou = allRestaurants.filter(r => r.tags?.includes('Recommended')).slice(0, 3);
  const newInArea = allRestaurants.filter(r => r.tags?.includes('New')).slice(0, 3);
  const recentlyViewedMock = allRestaurants.slice(1,4); // Mock "recently viewed"

  const [culinarySuggestion, setCulinarySuggestion] = useState<string | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(true);

  useEffect(() => {
    async function fetchSuggestion() {
      setIsLoadingSuggestion(true);
      try {
        const input: CulinaryAssistantInput = { userId: "mockUser123", currentDay: new Date().toLocaleString('en-us', { weekday: 'long' }) };
        const result = await getCulinarySuggestion(input);
        setCulinarySuggestion(result.suggestion);
      } catch (error) {
        console.error("Failed to get culinary suggestion:", error);
        setCulinarySuggestion("Explore our amazing restaurants today!"); 
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
            Welcome to SwiftServe
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto mb-10">
            Your one-stop solution for fast and reliable delivery from your favorite local restaurants, shops, and cafes.
          </p>
        </div>
        <div className="max-w-xl mx-auto mb-10 animate-fadeInUp animation-delay-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="What are you craving? (e.g., Pizza, Sushi, 'something light')"
              className="w-full pl-12 pr-4 py-3 text-lg rounded-full shadow-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              aria-label="Search for food or restaurants"
            />
          </div>
        </div>
        <div className="space-x-4 animate-fadeInUp animation-delay-400">
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform hover:scale-105 px-8 py-6 text-lg">
            <Link href="/restaurants">
              Browse Restaurants <Utensils className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="shadow-md transition-transform hover:scale-105 px-8 py-6 text-lg">
            <Link href="/auth/register">
              Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="animate-fadeInUp animation-delay-600">
        <Card className="bg-primary/5 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-headline text-primary flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-yellow-500" /> Your Culinary Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSuggestion ? (
              <p className="text-muted-foreground animate-pulse">Thinking of something delicious for you...</p>
            ) : (
              <p className="text-lg text-foreground/90">{culinarySuggestion}</p>
            )}
            <Button variant="link" className="p-0 h-auto mt-2 text-primary hover:text-accent transition-colors" asChild>
              <Link href="/recommendations">Get more personalized recommendations &rarr;</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Customized Services Sections */}
      {recommendedForYou.length > 0 && (
        <section className="animate-fadeInUp animation-delay-800">
          <div className="flex items-center mb-6">
            <Heart className="h-7 w-7 mr-3 text-pink-500" />
            <h2 className="text-3xl font-bold font-headline text-foreground">Recommended For You</h2>
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
            <MapPin className="h-7 w-7 mr-3 text-green-500" />
            <h2 className="text-3xl font-bold font-headline text-foreground">New In Your Area</h2>
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
            <History className="h-7 w-7 mr-3 text-blue-500" />
            <h2 className="text-3xl font-bold font-headline text-foreground">Reorder Favorites</h2>
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
          <Award className="h-7 w-7 mr-3 text-purple-500" />
          <h2 className="text-3xl font-bold font-headline text-foreground">Explore All Restaurants</h2>
        </div>
        {allRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allRestaurants.slice(0,3).map((restaurant) => ( // Show a few more examples
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Finding recommendations near you...</p>
        )}
        <div className="text-center mt-8">
            <Button variant="link" asChild className="text-lg text-primary hover:text-accent transition-colors">
                <Link href="/restaurants">View all restaurants <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 animate-fadeInUp animation-delay-1600">
        <Card className="hover:shadow-xl transition-all duration-300 hover:border-primary border-2 border-transparent">
          <CardHeader className="items-center text-center">
            <Utensils className="h-12 w-12 text-accent mb-3" />
            <CardTitle className="font-headline text-xl">Wide Selection</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              Explore a diverse range of cuisines and products from numerous local businesses.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-all duration-300 hover:border-primary border-2 border-transparent">
          <CardHeader className="items-center text-center">
            <ShoppingCart className="h-12 w-12 text-accent mb-3" />
            <CardTitle className="font-headline text-xl">Easy Ordering</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              A seamless and intuitive ordering process from browsing to checkout.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-all duration-300 hover:border-primary border-2 border-transparent">
          <CardHeader className="items-center text-center">
            <Brain className="h-12 w-12 text-accent mb-3" />
            <CardTitle className="font-headline text-xl">Smart Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              Get personalized item and restaurant suggestions powered by our AI engine.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      <section className="relative h-72 md:h-96 rounded-xl overflow-hidden shadow-2xl animate-fadeInUp animation-delay-1800">
        <Image
          src="https://placehold.co/1200x400.png"
          alt="Delicious food delivery collage"
          layout="fill"
          objectFit="cover"
          data-ai-hint="food delivery collage promotion"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
          <h3 className="text-3xl md:text-5xl font-bold text-white font-headline p-8 md:p-12 max-w-lg leading-tight">
            Fast, Fresh, Delivered. <br/> Experience the <span className="text-accent">Courier Arena</span>.
          </h3>
        </div>
      </section>
      <style jsx global>{`
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
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
