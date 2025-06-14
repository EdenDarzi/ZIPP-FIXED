import { getRestaurantById } from '@/lib/mock-data';
import type { Restaurant, MenuItem } from '@/types';
import ItemCard from '@/components/items/item-card';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, Clock, MapPin, Utensils } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface RestaurantPageParams {
  params: {
    restaurantId: string;
  };
}

export default function RestaurantPage({ params }: RestaurantPageParams) {
  const restaurant: Restaurant | undefined = getRestaurantById(params.restaurantId);

  if (!restaurant) {
    notFound();
  }

  const menuItemsByCategory: Record<string, MenuItem[]> = restaurant.menu.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);


  return (
    <div className="space-y-8">
      <header className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          layout="fill"
          objectFit="cover"
          priority
          data-ai-hint={restaurant.dataAiHint || "restaurant storefront"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-white">{restaurant.name}</h1>
          <p className="text-lg text-gray-200 mt-1">{restaurant.description}</p>
        </div>
      </header>

      <section className="grid md:grid-cols-3 gap-4 text-sm bg-card p-4 rounded-lg shadow">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-primary" />
          <span className="text-foreground">{restaurant.location}</span>
        </div>
        <div className="flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-500 fill-yellow-500" />
          <span className="text-foreground">{restaurant.rating.toFixed(1)} ({Math.floor(Math.random() * 200 + 50)} ratings)</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          <span className="text-foreground">{restaurant.deliveryTimeEstimate}</span>
        </div>
      </section>
      
      <div className="flex items-center space-x-2 text-primary">
        <Utensils className="h-6 w-6" />
        <h2 className="text-3xl font-bold font-headline">Menu</h2>
      </div>

      {Object.entries(menuItemsByCategory).map(([category, items]) => (
        <section key={category} className="space-y-4">
          <h3 className="text-2xl font-semibold font-headline text-foreground/90 border-b-2 border-primary/30 pb-2">{category}</h3>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} restaurantId={restaurant.id} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No items in this category.</p>
          )}
          <Separator className="my-6" />
        </section>
      ))}
       {restaurant.menu.length === 0 && (
         <p className="text-muted-foreground text-lg text-center py-8">This restaurant currently has no items on its menu.</p>
       )}
    </div>
  );
}
