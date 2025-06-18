
'use client'; 

import RestaurantCard from '@/components/restaurants/restaurant-card';
import { mockRestaurants, mockLivePickSaleItems } from '@/lib/mock-data';
import type { Restaurant, LivePickSaleItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Star, Clock, MapPinIcon, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';

export default function RestaurantsPage() {
  const restaurants: Restaurant[] = mockRestaurants;
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [activeLivePickSaleItems, setActiveLivePickSaleItems] = useState<LivePickSaleItem[]>([]);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 19 && currentHour < 23) { 
        setActiveLivePickSaleItems(mockLivePickSaleItems.filter(item => item.isActive));
    }
  }, []);


  const cuisineTypes = ['הכל', ...Array.from(new Set(restaurants.map(r => r.cuisineType)))];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = cuisineFilter === 'all' || restaurant.cuisineType === cuisineFilter;
    const matchesRating = ratingFilter === 'all' || restaurant.rating >= parseFloat(ratingFilter);
    return matchesSearch && matchesCuisine && matchesRating;
  });

  const handleMoreFiltersClick = () => {
    toast({
        title: "פילטרים נוספים בקרוב!",
        description: "אפשרויות סינון מתקדמות יתווספו בעדכון עתידי.",
    });
  };


  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold font-headline text-primary">גלה מסעדות ועסקים</h1>
        <p className="text-lg text-muted-foreground">
          מצא מגוון רחב של מטבחים ושירותים ומצא את הארוחה או השירות הבא האהוב עליך.
        </p>
        <div className="relative max-w-xl">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
           <Input
            type="search"
            placeholder="חפש מסעדות, עסקים או מטבחים..."
            className="pl-10 pr-4 py-3 text-base shadow-sm focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="חיפוש מסעדות, עסקים או מטבחים"
            />
        </div>
      </header>

      {activeLivePickSaleItems.length > 0 && (
        <section className="animate-fadeInUp">
            <Card className="bg-red-500 text-white shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center">
                        <ShoppingBag className="h-7 w-7 mr-3 animate-bounce" /> 🔥 מבצעי SwiftServe Sale פעילים כעת! {/* Updated Name */}
                    </CardTitle>
                    <CardDescription className="text-red-100">שקיות הפתעה מסוף היום במחירים מיוחדים! מהרו לפני שייגמר.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {activeLivePickSaleItems.slice(0,3).map(item => ( 
                            <Card key={item.id} className="bg-white text-card-foreground">
                                <CardHeader className="p-3 pb-1">
                                     <div className="relative h-24 w-full rounded-t-md overflow-hidden mb-2">
                                        <Image src={item.imageUrl || "https://placehold.co/200x100.png?text=הפתעה!"} alt={item.name} layout="fill" objectFit="cover" data-ai-hint={item.dataAiHint || "surprise bag food bakery"} />
                                    </div>
                                    <CardTitle className="text-sm font-semibold truncate">{item.name}</CardTitle>
                                    <CardDescription className="text-xs">מאת: {item.restaurantName}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-3 pt-0">
                                    <p className="text-lg font-bold text-primary">₪{item.price.toFixed(2)} <span className="text-xs line-through text-muted-foreground">₪{item.originalPrice?.toFixed(2)}</span></p>
                                </CardContent>
                                <CardFooter className="p-2 pt-0">
                                     <Button size="sm" className="w-full" asChild aria-label={`הוסף ${item.name} לעגלה`}>
                                        <Link href={`/livepick-sale#${item.id}`}>הוסף לעגלה</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    {activeLivePickSaleItems.length > 3 && (
                        <div className="text-center mt-4">
                            <Button variant="link" asChild className="text-white hover:text-red-200">
                                <Link href="/livepick-sale">הצג את כל מבצעי SwiftServe Sale...</Link> {/* Updated Name */}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
      )}

      <div className="p-4 bg-muted/50 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
                <label htmlFor="cuisineFilter" className="text-sm font-medium text-muted-foreground">סוג מטבח/עסק</label>
                 <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                    <SelectTrigger id="cuisineFilter" className="w-full bg-background shadow-sm" aria-label="סנן לפי סוג מטבח או עסק">
                        <SelectValue placeholder="כל הסוגים" />
                    </SelectTrigger>
                    <SelectContent>
                        {cuisineTypes.map(cuisine => (
                            <SelectItem key={cuisine} value={cuisine.toLowerCase() === 'הכל' ? 'all' : cuisine}>{cuisine}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-1">
                <label htmlFor="ratingFilter" className="text-sm font-medium text-muted-foreground">דירוג מינימלי</label>
                 <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger id="ratingFilter" className="w-full bg-background shadow-sm" aria-label="סנן לפי דירוג מינימלי">
                        <Star className="inline h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                        <SelectValue placeholder="כל דירוג" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">כל דירוג</SelectItem>
                        <SelectItem value="4.5">4.5+ כוכבים</SelectItem>
                        <SelectItem value="4">4.0+ כוכבים</SelectItem>
                        <SelectItem value="3.5">3.5+ כוכבים</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-1">
                <label htmlFor="distanceFilter" className="text-sm font-medium text-muted-foreground">מרחק</label>
                 <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                    <SelectTrigger id="distanceFilter" className="w-full bg-background shadow-sm" aria-label="סנן לפי מרחק (בקרוב)">
                         <MapPinIcon className="inline h-4 w-4 mr-1 text-primary" />
                        <SelectValue placeholder="כל מרחק (בקרוב)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">כל מרחק (בקרוב)</SelectItem>
                        <SelectItem value="1km" disabled>&lt; 1 ק"מ (בקרוב)</SelectItem>
                        <SelectItem value="3km" disabled>&lt; 3 ק"מ (בקרוב)</SelectItem>
                        <SelectItem value="5km" disabled>&lt; 5 ק"מ (בקרוב)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button variant="outline" className="w-full bg-background shadow-sm" onClick={handleMoreFiltersClick} aria-label="אפשרויות סינון נוספות (בקרוב)">
                <Filter className="mr-2 h-4 w-4" /> עוד פילטרים
            </Button>
        </div>
      </div>

      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap */}
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4"/>
          <p className="text-xl text-muted-foreground">לא נמצאו מסעדות או עסקים התואמים לחיפוש או לפילטרים שלך.</p>
          <p className="text-sm text-muted-foreground mt-1">נסה לשנות את מונחי החיפוש או הפילטרים.</p>
        </div>
      )}
    </div>
  );
}
