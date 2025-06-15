
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, AlertTriangle, Clock, ArrowLeft, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { mockSwiftSaleItems } from '@/lib/mock-data';
import type { SwiftSaleItem } from '@/types';
import { useCart } from '@/context/cart-context'; // Assuming useCart can handle generic items or needs adaptation
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function SwiftSalePage() {
  const [activeItems, setActiveItems] = useState<SwiftSaleItem[]>([]);
  const { addToCart } = useCart(); // Adapt if addToCart needs more generic item type
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching active SwiftSale items
    // In a real app, this would fetch from a backend based on current time and availability
    const currentHour = new Date().getHours();
    // Example: SwiftSale active from 7 PM (19) to 11 PM (23)
    if (currentHour >= 0 && currentHour <= 23) { // For demo, always show some items
        setActiveItems(mockSwiftSaleItems.filter(item => item.isActive && item.quantityAvailable > 0));
    } else {
        setActiveItems([]);
    }
  }, []);

  const handleAddToCart = (item: SwiftSaleItem) => {
    // Adapt this to how your cart handles potentially different item structures
    // For now, creating a mock MenuItem structure for the cart
    const cartItem = {
        id: item.id,
        name: `שקית הפתעה: ${item.name}`,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl || 'https://placehold.co/600x400.png?text=הפתעה!',
        dataAiHint: 'surprise bag',
        category: 'SwiftSale',
        restaurantId: item.restaurantId, // Assuming restaurantId is present for routing/context
    };
    addToCart(cartItem, 1); // Add 1 bag
    toast({
        title: "שקית הפתעה נוספה לעגלה!",
        description: `שקית "${item.name}" מ-${item.restaurantName} בדרך אליך.`,
    });
  };

  return (
    <div className="space-y-8">
      <Card className="text-center shadow-xl bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 text-white">
        <CardHeader>
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 animate-bounce" />
          <CardTitle className="text-3xl md:text-4xl font-headline">SwiftSale - שקיות הפתעה חמות מסוף היום!</CardTitle>
          <CardDescription className="text-lg text-red-100 mt-2">
            תפסו דילים מדהימים על מוצרים איכותיים שעסקים מציעים בהנחה בסוף היום. הפחתת בזבוז, מקסימום חיסכון!
          </CardDescription>
        </CardHeader>
         <CardContent>
            <Button variant="outline" className="bg-transparent hover:bg-white/10 text-white border-white/70" asChild>
                <Link href="/restaurants">
                    <ArrowLeft className="mr-2 h-4 w-4" /> חזרה לעסקים
                </Link>
            </Button>
        </CardContent>
      </Card>

      {activeItems.length === 0 && (
        <Card className="text-center py-12">
          <CardContent className="flex flex-col items-center gap-4">
            <Clock className="h-16 w-16 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">אוי! כרגע אין שקיות הפתעה זמינות ב-SwiftSale.</p>
            <p className="text-sm">נסו שוב מאוחר יותר בערב, או בדקו עסקים אחרים.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeItems.map(item => (
          <Card key={item.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src={item.imageUrl || 'https://placehold.co/600x400.png?text=הפתעה!'}
                alt={item.name}
                layout="fill"
                objectFit="cover"
                data-ai-hint="surprise bag food bakery items"
              />
              <Badge variant="destructive" className="absolute top-2 right-2 text-sm px-3 py-1">
                🔥 SwiftSale
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold truncate">{item.name}</CardTitle>
              <CardDescription className="text-xs">מאת: {item.restaurantName}</CardDescription>
              {item.description && <p className="text-sm text-muted-foreground mt-1 h-10 overflow-hidden text-ellipsis">{item.description}</p>}
            </CardHeader>
            <CardContent className="flex-grow pt-0">
              <p className="text-2xl font-bold text-primary">₪{item.price.toFixed(2)}</p>
              {item.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">במקור: ₪{item.originalPrice.toFixed(2)}</p>
              )}
              <p className="text-xs text-orange-600 mt-1">נותרו: {item.quantityAvailable} שקיות בלבד!</p>
            </CardContent>
            <CardFooter className="p-3 border-t">
              <Button onClick={() => handleAddToCart(item)} className="w-full bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" /> הוסף שקית הפתעה לעגלה
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       <p className="text-xs text-muted-foreground text-center mt-4">
        כל שקית מגיעה עם תגית "הפתעה טעימה במחיר של פחות מקפה" (או משהו דומה). התכולה משתנה!
      </p>
    </div>
  );
}
