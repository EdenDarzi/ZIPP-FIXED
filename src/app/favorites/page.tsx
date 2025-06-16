
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, ShoppingBasket } from "lucide-react";

export default function FavoritesPage() {
  return (
    <div className="container mx-auto py-8 text-center">
      <Heart className="mx-auto h-20 w-20 text-pink-500 mb-6 animate-pulse" />
      <h1 className="text-4xl font-bold font-headline text-primary mb-4">המועדפים שלי</h1>
      <p className="text-lg text-muted-foreground mb-8">
        המסעדות, החנויות והפריטים שאהבתם במיוחד יופיעו כאן לגישה מהירה.
      </p>
      <p className="text-muted-foreground mb-8">
        (פיצ'ר זה בפיתוח ויהיה זמין בקרוב!)
      </p>
      <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
        <Link href="/restaurants">
            <ShoppingBasket className="mr-2 h-5 w-5" /> גלה עוד עסקים
        </Link>
      </Button>
    </div>
  );
}
