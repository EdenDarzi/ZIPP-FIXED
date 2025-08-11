
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
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';

export default function RestaurantsPage() {
  const { t } = useLanguage();
  const restaurants: Restaurant[] = mockRestaurants;
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [activeZippSaleItems, setActiveZippSaleItems] = useState<LivePickSaleItem[]>([]);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 19 && currentHour < 23) { 
        setActiveZippSaleItems(mockLivePickSaleItems.filter(item => item.isActive));
    }
  }, []);


  const cuisineTypes = [t('restaurants.filters.all'), ...Array.from(new Set(restaurants.map(r => r.cuisineType.startsWith('restaurant.') ? t(r.cuisineType) : r.cuisineType)))];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const restaurantName = restaurant.name.startsWith('restaurant.') ? t(restaurant.name) : restaurant.name;
    const restaurantCuisine = restaurant.cuisineType.startsWith('restaurant.') ? t(restaurant.cuisineType) : restaurant.cuisineType;
    
    const matchesSearch = restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          restaurantCuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = cuisineFilter === 'all' || cuisineFilter === t('restaurants.filters.all') || 
                          restaurantCuisine === cuisineFilter || restaurant.cuisineType === cuisineFilter;
    const matchesRating = ratingFilter === 'all' || restaurant.rating >= parseFloat(ratingFilter);
    return matchesSearch && matchesCuisine && matchesRating;
  });

  const handleMoreFiltersClick = () => {
    toast({
        title: t('restaurants.filters.moreToast.title'),
        description: t('restaurants.filters.moreToast.description'),
    });
  };


  return (
    <div className="space-y-8">
      <header className="space-y-6">
        <Card className="group relative overflow-hidden rounded-xl !bg-white/40 dark:!bg-gray-950/80 bg-clip-padding backdrop-blur-xl backdrop-saturate-150 !border !border-white/20 dark:!border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
          <CardHeader className="relative z-10 text-center items-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-30"></div>
              <MapPinIcon className="relative h-10 w-10 text-primary dark:text-primary/80" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-headline text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-primary dark:to-accent">{t('restaurants.title')}</CardTitle>
            <CardDescription className="text-gray-700/80 dark:text-gray-300/80 text-base">{t('restaurants.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('restaurants.search.placeholder')}
                className="pl-10 pr-4 py-3 text-base shadow-sm focus:ring-primary focus:border-primary rounded-xl bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label={t('restaurants.search.ariaLabel')}
              />
            </div>
          </CardContent>
        </Card>
      </header>

      {activeZippSaleItems.length > 0 && (
        <section className="animate-fadeInUp">
            <Card className="bg-red-500 text-white shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center">
                        <ShoppingBag className="h-7 w-7 mr-3 animate-bounce" /> {t('restaurants.zippSale.active')}
                    </CardTitle>
                    <CardDescription className="text-red-100">{t('restaurants.zippSale.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {activeZippSaleItems.slice(0,3).map(item => ( 
                            <Card key={item.id} className="bg-white text-card-foreground">
                                <CardHeader className="p-3 pb-1">
                                     <div className="relative h-24 w-full rounded-t-md overflow-hidden mb-2">
                                        <Image src={item.imageUrl || "https://placehold.co/200x100.png?text=הפתעה!"} alt={item.name} layout="fill" objectFit="cover" data-ai-hint={item.dataAiHint || "surprise bag food bakery"} />
                                    </div>
                                    <CardTitle className="text-sm font-semibold truncate">{item.name}</CardTitle>
                                    <CardDescription className="text-xs">{t('restaurants.zippSale.from')} {item.restaurantName}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-3 pt-0">
                                    <p className="text-lg font-bold text-primary">₪{item.price.toFixed(2)} <span className="text-xs line-through text-muted-foreground">₪{item.originalPrice?.toFixed(2)}</span></p>
                                </CardContent>
                                <CardFooter className="p-2 pt-0">
                                     <Button size="sm" className="w-full" asChild aria-label={`${t('restaurants.zippSale.addToCart')} ${item.name}`}>
                                        <Link href={`/livepick-sale#${item.id}`}>{t('restaurants.zippSale.addToCart')}</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    {activeZippSaleItems.length > 3 && (
                        <div className="text-center mt-4">
                            <Button variant="link" asChild className="text-white hover:text-red-200">
                                <Link href="/livepick-sale">{t('restaurants.zippSale.viewAll')}</Link> 
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
      )}

      <Card className="group relative overflow-hidden rounded-xl !bg-white/40 dark:!bg-gray-950/80 bg-clip-padding backdrop-blur-xl backdrop-saturate-150 !border !border-white/20 dark:!border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.12)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100"><Filter className="h-5 w-5"/> {t('restaurants.filters.more')}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{t('restaurants.search.placeholder')}</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
                <label htmlFor="cuisineFilter" className="text-sm font-medium text-muted-foreground">{t('restaurants.filters.cuisine')}</label>
                 <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                    <SelectTrigger id="cuisineFilter" className="w-full bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-white/10 shadow-sm rounded-xl" aria-label={t('restaurants.filters.cuisine')}>
                        <SelectValue placeholder={t('restaurants.filters.allTypes')} />
                    </SelectTrigger>
                    <SelectContent>
                        {cuisineTypes.map(cuisine => (
                            <SelectItem key={cuisine} value={cuisine === t('restaurants.filters.all') ? 'all' : cuisine}>{cuisine}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-1">
                <label htmlFor="ratingFilter" className="text-sm font-medium text-muted-foreground">{t('restaurants.filters.rating')}</label>
                 <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger id="ratingFilter" className="w-full bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-white/10 shadow-sm rounded-xl" aria-label={t('restaurants.filters.rating')}>
                        <Star className="inline h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                        <SelectValue placeholder={t('restaurants.filters.allRatings')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('restaurants.filters.allRatings')}</SelectItem>
                        <SelectItem value="4.5">{t('restaurants.filters.stars45')}</SelectItem>
                        <SelectItem value="4">{t('restaurants.filters.stars4')}</SelectItem>
                        <SelectItem value="3.5">{t('restaurants.filters.stars35')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-1">
                <label htmlFor="distanceFilter" className="text-sm font-medium text-muted-foreground">{t('restaurants.filters.distance')}</label>
                 <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                    <SelectTrigger id="distanceFilter" className="w-full bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-white/10 shadow-sm rounded-xl" aria-label={t('restaurants.filters.allDistances')}>
                         <MapPinIcon className="inline h-4 w-4 mr-1 text-primary" />
                        <SelectValue placeholder={t('restaurants.filters.allDistances')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('restaurants.filters.allDistances')}</SelectItem>
                        <SelectItem value="1km" disabled>{t('restaurants.filters.distance1km')}</SelectItem>
                        <SelectItem value="3km" disabled>{t('restaurants.filters.distance3km')}</SelectItem>
                        <SelectItem value="5km" disabled>{t('restaurants.filters.distance5km')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button variant="outline" className="w-full bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-white/10 shadow-sm rounded-xl hover:ring-1 hover:ring-primary/40" onClick={handleMoreFiltersClick} aria-label={t('restaurants.filters.more')}>
                <Filter className="mr-2 h-4 w-4" />{t('restaurants.filters.more')}
            </Button>
        </div>
        </CardContent>
      </Card>

      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> 
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4"/>
          <p className="text-xl text-muted-foreground">{t('restaurants.noResults.title')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('restaurants.noResults.suggestion')}</p>
        </div>
      )}
    </div>
  );
}

