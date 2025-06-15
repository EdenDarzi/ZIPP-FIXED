
import RestaurantCard from '@/components/restaurants/restaurant-card';
import { mockRestaurants } from '@/lib/mock-data';
import type { Restaurant } from '@/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// This component will be a server component for initial load,
// but filtering/searching might require client-side logic or server actions later.
export default function RestaurantsPage() {
  const restaurants: Restaurant[] = mockRestaurants;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold font-headline text-primary">Explore Restaurants</h1>
        <p className="text-lg text-muted-foreground">
          Discover a variety of cuisines and find your next favorite meal.
        </p>
        <div className="relative max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
           <Input type="search" placeholder="Search restaurants or cuisines..." className="pl-10 py-2 text-base" />
        </div>
      </header>

      {restaurants.length > 0 ? (
        // Responsive grid for restaurant cards
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No restaurants available at the moment. Please check back later.</p>
        </div>
      )}
    </div>
  );
}
