import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, ShoppingCart, Brain, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold font-headline text-primary mb-6">Welcome to SwiftServe</h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto mb-8">
          Your one-stop solution for fast and reliable delivery from your favorite local restaurants, shops, and cafes.
        </p>
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
            <CardTitle className="font-headline">Smart Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Get personalized item suggestions powered by our AI engine.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      <section className="text-center py-10">
        <h2 className="text-3xl font-bold font-headline text-primary mb-4">Ready to Order?</h2>
        <p className="text-lg text-foreground/80 mb-6">
          Experience the convenience of SwiftServe today.
        </p>
        <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transition-transform hover:scale-105">
          <Link href="/restaurants">
            Find Your Next Meal <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
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
          <h3 className="text-4xl font-bold text-white text-center font-headline">
            Fast, Fresh, Delivered.
          </h3>
        </div>
      </section>
    </div>
  );
}
