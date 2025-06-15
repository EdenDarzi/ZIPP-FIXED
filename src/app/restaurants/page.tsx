
'use client'; // For potential client-side filtering in the future

import RestaurantCard from '@/components/restaurants/restaurant-card';
import { mockRestaurants } from '@/lib/mock-data';
import type { Restaurant } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Star, Clock, MapPinIcon } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function RestaurantsPage() {
  const restaurants: Restaurant[] = mockRestaurants;
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  // Placeholder states for filters - actual filtering logic would be more complex
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [distanceFilter, setDistanceFilter] = useState('all');

  const cuisineTypes = ['All', ...Array.from(new Set(restaurants.map(r => r.cuisineType)))];

  // Basic client-side filtering example (can be expanded or moved to server)
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = cuisineFilter === 'all' || restaurant.cuisineType === cuisineFilter;
    const matchesRating = ratingFilter === 'all' || restaurant.rating >= parseFloat(ratingFilter);
    // Distance filter logic would require actual location data and calculation
    return matchesSearch && matchesCuisine && matchesRating;
  });

  const handleMoreFiltersClick = () => {
    toast({
        title: "More Filters Coming Soon!",
        description: "Advanced filtering options will be available in a future update.",
    });
  };


  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold font-headline text-primary">Explore Restaurants</h1>
        <p className="text-lg text-muted-foreground">
          Discover a variety of cuisines and find your next favorite meal.
        </p>
        <div className="relative max-w-xl">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
           <Input
            type="search"
            placeholder="Search restaurants or cuisines..."
            className="pl-10 pr-4 py-3 text-base shadow-sm focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </header>

      {/* Filter Section */}
      <div className="p-4 bg-muted/50 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
                <label htmlFor="cuisineFilter" className="text-sm font-medium text-muted-foreground">Cuisine</label>
                 <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                    <SelectTrigger id="cuisineFilter" className="w-full bg-background shadow-sm">
                        <SelectValue placeholder="All Cuisines" />
                    </SelectTrigger>
                    <SelectContent>
                        {cuisineTypes.map(cuisine => (
                            <SelectItem key={cuisine} value={cuisine.toLowerCase() === 'all' ? 'all' : cuisine}>{cuisine}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-1">
                <label htmlFor="ratingFilter" className="text-sm font-medium text-muted-foreground">Min. Rating</label>
                 <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger id="ratingFilter" className="w-full bg-background shadow-sm">
                        <Star className="inline h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                        <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Any Rating</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                        <SelectItem value="4">4.0+ Stars</SelectItem>
                        <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-1">
                <label htmlFor="distanceFilter" className="text-sm font-medium text-muted-foreground">Distance</label>
                 <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                    <SelectTrigger id="distanceFilter" className="w-full bg-background shadow-sm">
                         <MapPinIcon className="inline h-4 w-4 mr-1 text-primary" />
                        <SelectValue placeholder="Any Distance" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Any Distance (soon)</SelectItem>
                        <SelectItem value="1km">&lt; 1 km (soon)</SelectItem>
                        <SelectItem value="3km">&lt; 3 km (soon)</SelectItem>
                        <SelectItem value="5km">&lt; 5 km (soon)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button variant="outline" className="w-full bg-background shadow-sm" onClick={handleMoreFiltersClick}>
                <Filter className="mr-2 h-4 w-4" /> More Filters
            </Button>
        </div>
      </div>

      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4"/>
          <p className="text-xl text-muted-foreground">No restaurants match your current search or filters.</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
}

    