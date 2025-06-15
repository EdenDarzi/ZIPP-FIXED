
'use client'; // Made client component for culinary assistant state

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, ShoppingCart, Brain, ArrowRight, MapPin, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RestaurantCard from "@/components/restaurants/restaurant-card";
import { mockRestaurants } from "@/lib/mock-data";
import type { Restaurant } from "@/types";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getCulinarySuggestion, CulinaryAssistantInput } from "@/ai/flows/culinary-assistant-flow"; // Assuming path

export default function HomePage() {
  const restaurants: Restaurant[] = mockRestaurants.slice(0,3); // Show a few examples
  const [culinarySuggestion, setCulinarySuggestion] = useState<string | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(true);

  useEffect(() => {
    async function fetchSuggestion() {
      setIsLoadingSuggestion(true);
      try {
        // In a real app, userId would come from auth
        const input: CulinaryAssistantInput = { userId: "mockUser123", currentDay: new Date().toLocaleString('en-us', { weekday: 'long' }) };
        const result = await getCulinarySuggestion(input);
        setCulinarySuggestion(result.suggestion);
      } catch (error) {
        console.error("Failed to get culinary suggestion:", error);
        setCulinarySuggestion("Explore our amazing restaurants today!"); // Fallback
      } finally {
        setIsLoadingSuggestion(false);
      }
    }
    fetchSuggestion();
  }, []);

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold font-headline text-primary mb-6">Welcome to SwiftServe</h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto mb-8">
          Your one-stop solution for fast and reliable delivery from your favorite local restaurants, shops, and cafes.
        </p>
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="What are you craving? (e.g., Pizza, Sushi, 'something light')"
              className="w-full pl-12 pr-4 py-3 text-lg rounded-full shadow-md focus:ring-primary focus:border-primary"
              aria-label="Search for food or restaurants"
            />
          </div>
        </div>
        <div className="space-x-4">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform hover:scale-105">
            <Link href="/restaurants">
              Browse Restaurants <Utensils className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="shadow-md transition-transform hover:scale-105">
            <Link href="/auth/register">
              Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section>
        <Card className="bg-primary/5 border-primary/20 shadow-md hover:shadow-lg transition-shadow">
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
            <Button variant="link" className="p-0 h-auto mt-2 text-primary" asChild>
              <Link href="/recommendations">Get more personalized recommendations &rarr;</Link>
            </Button>
          </CardContent>
        </Card>
      </section>


      <section>
        <div className="flex items-center mb-4">
          <MapPin className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold font-headline text-foreground">Near You & Recommended</h2>
        </div>
        {restaurants.length > 0 ? (
          // Responsive grid for restaurant cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Finding recommendations near you...</p>
        )}
        <div className="text-center mt-6">
            <Button variant="link" asChild>
                <Link href="/restaurants">View all restaurants <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <Utensils className="h-10 w-10 text-accent mb-2" />
            <CardTitle className="font-headline">Wide Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Explore a diverse range of cuisines and products from numerous local businesses.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <ShoppingCart className="h-10 w-10 text-accent mb-2" />
            <CardTitle className="font-headline">Easy Ordering</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              A seamless and intuitive ordering process from browsing to checkout.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <Brain className="h-10 w-10 text-accent mb-2" />
            <CardTitle className="font-headline">Smart Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Get personalized item and restaurant suggestions powered by our AI engine.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      <section className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="https://placehold.co/1200x400.png"
          alt="Delicious food delivery"
          layout="fill"
          objectFit="cover"
          data-ai-hint="food delivery collage"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h3 className="text-4xl font-bold text-white text-center font-headline p-4">
            Fast, Fresh, Delivered. Experience the Courier Arena.
          </h3>
        </div>
      </section>
    </div>
  );
}
