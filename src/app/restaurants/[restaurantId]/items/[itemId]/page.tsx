'use client'; // This page needs client-side interactivity for cart

import { getItemById } from '@/lib/mock-data';
import type { MenuItem } from '@/types';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Minus, Plus, ShoppingCart, ArrowLeft, Star } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

  if (!item) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(item, quantity);
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div className="space-y-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
      </Button>

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
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(Math.random() * 2 + 3.5) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/50'}`} />
                ))}
                <span className="text-sm text-muted-foreground">({Math.floor(Math.random() * 100 + 20)} reviews)</span>
              </div>
              
              <p className="text-3xl font-semibold text-accent">${item.price.toFixed(2)}</p>
              
              {item.options && item.options.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Options:</h3>
                  <ul className="space-y-1">
                    {item.options.map(opt => (
                      <li key={opt.name} className="text-sm text-muted-foreground">
                        {opt.name} (+${opt.priceModifier.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Separator className="my-4" />
              <div className="flex items-center space-x-4">
                <p className="text-lg font-semibold">Quantity:</p>
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" onClick={decrementQuantity} aria-label="Decrease quantity">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={incrementQuantity} aria-label="Increase quantity">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-6 bg-muted/20 border-t">
              <Button size="lg" onClick={handleAddToCart} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md text-lg">
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart (${(item.price * quantity).toFixed(2)})
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}
