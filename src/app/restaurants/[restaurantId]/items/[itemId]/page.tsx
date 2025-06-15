
'use client'; 

import { getItemById } from '@/lib/mock-data';
import type { MenuItem } from '@/types';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Minus, Plus, ShoppingCart, ArrowLeft, Star, Share2, Award, Heart } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface ItemPageParams {
  params: {
    restaurantId: string;
    itemId: string;
  };
}

export default function ItemPage({ params }: ItemPageParams) {
  const item: MenuItem | undefined = getItemById(params.restaurantId, params.itemId);
  const { addToCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  if (!item) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(item, quantity);
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  const handleShareItem = () => {
    toast({
      title: "שיתוף פריט (דמו)",
      description: `שיתפת את "${item.name}"! +5 כוכבים התווספו לחשבונך (דמו).`,
      action: <Award className="h-5 w-5 text-yellow-400"/>
    });
  };

  const handleAddToFavorites = () => {
    toast({
        title: "נוסף למועדפים (בקרוב!)",
        description: `"${item.name}" נוסף לספריית הטעמים שלך. תוכל למצוא אותו שם בפעם הבאה!`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.back()} aria-label="חזור לתפריט">
          <ArrowLeft className="mr-2 h-4 w-4" /> חזרה לתפריט
        </Button>
        <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleAddToFavorites} title="הוסף למועדפים (בקרוב)" aria-label="הוסף למועדפים (בקרוב)">
                <Heart className="h-5 w-5 text-pink-500" />
                <span className="sr-only">הוסף למועדפים</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleShareItem} className="ml-auto" title="שתף פריט" aria-label="שתף פריט">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">שתף פריט</span>
            </Button>
        </div>
      </div>
      

      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 gap-0 md:gap-8">
          <div className="relative h-64 md:h-full min-h-[300px] md:rounded-l-lg overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.name}
              layout="fill"
              objectFit="cover"
              priority
              data-ai-hint={item.dataAiHint || "food item closeup"}
            />
          </div>
          
          <div className="flex flex-col">
            <CardHeader className="pt-6 md:pt-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-3xl md:text-4xl font-bold font-headline text-primary">{item.name}</CardTitle>
                <Badge variant="outline" className="text-sm">{item.category}</Badge>
              </div>
              <CardDescription className="text-base text-muted-foreground pt-2">{item.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 flex-grow">
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(Math.random() * 2 + 3.5) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/50'}`} aria-hidden="true" />
                ))}
                <span className="text-sm text-muted-foreground">({Math.floor(Math.random() * 100 + 20)} ביקורות)</span>
              </div>
              
              <p className="text-3xl font-semibold text-accent">₪{item.price.toFixed(2)}</p>
              
              {item.options && item.options.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">אפשרויות:</h3>
                  <ul className="space-y-1">
                    {item.options.map(opt => (
                      <li key={opt.name} className="text-sm text-muted-foreground">
                        {opt.name} (+₪{opt.priceModifier.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Separator className="my-4" />
              <div className="flex items-center space-x-4">
                <p className="text-lg font-semibold">כמות:</p>
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" onClick={decrementQuantity} aria-label={`הפחת כמות עבור ${item.name}`}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-medium" aria-label={`כמות נוכחית: ${quantity}`}>{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={incrementQuantity} aria-label={`הגדל כמות עבור ${item.name}`}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-6 bg-muted/20 border-t">
              <Button size="lg" onClick={handleAddToCart} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md text-lg" aria-label={`הוסף ${quantity} ${item.name} לעגלה במחיר כולל של ${(item.price * quantity).toFixed(2)} שקלים`}>
                <ShoppingCart className="mr-2 h-5 w-5" /> הוסף לעגלה (₪{(item.price * quantity).toFixed(2)})
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}
