
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MenuItem } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Eye, PlusCircle } from 'lucide-react';

interface ItemCardProps {
  item: MenuItem;
  restaurantId: string;
}

export default function ItemCard({ item, restaurantId }: ItemCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/restaurants/${restaurantId}/items/${item.id}`} className="block group">
        <div className="relative w-full h-40">
          <Image
            src={item.imageUrl}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={item.dataAiHint || "food dish"}
          />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors">{item.name}</CardTitle>
          <CardDescription className="text-xs h-10 overflow-hidden text-ellipsis">
            {item.description}
          </CardDescription>
        </CardHeader>
      </Link>
      <CardContent className="flex-grow pt-0">
        <p className="text-lg font-semibold text-primary">₪{item.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" asChild className="w-full sm:w-auto flex-1">
          <Link href={`/restaurants/${restaurantId}/items/${item.id}`}>
            <span className="flex items-center justify-center w-full">
              <Eye className="mr-2 h-4 w-4" /> הצג
            </span>
          </Link>
        </Button>
        <Button onClick={handleAddToCart} className="w-full sm:w-auto flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> הוסף
        </Button>
      </CardFooter>
    </Card>
  );
}
