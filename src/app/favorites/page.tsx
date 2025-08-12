
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, ShoppingBasket } from "lucide-react";
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context';

export default function FavoritesPage() {
  const { isRTL } = useLanguage();
  
  return (
    <div className="container mx-auto py-8 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
      <Heart className="mx-auto h-20 w-20 text-pink-500 mb-6 animate-pulse" />
      <AutoTranslateText 
        translationKey="pages.favorites.title" 
        fallback="My Favorites"
        as="h1"
        className="text-4xl font-bold font-headline text-primary mb-4"
      />
      <AutoTranslateText 
        translationKey="pages.favorites.description" 
        fallback="Your favorite restaurants, stores and items will appear here for quick access."
        as="p"
        className="text-lg text-muted-foreground mb-8"
      />
      <AutoTranslateText 
        translationKey="pages.favorites.comingSoon" 
        fallback="(This feature is in development and will be available soon!)"
        as="p"
        className="text-muted-foreground mb-8"
      />
      <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
        <Link href="/restaurants">
          <ShoppingBasket className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          <AutoTranslateText 
            translationKey="pages.favorites.discoverMore" 
            fallback="Discover More Businesses"
          />
        </Link>
      </Button>
    </div>
  );
}
