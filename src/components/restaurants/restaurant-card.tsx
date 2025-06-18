
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Restaurant, RestaurantTag } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Clock, Tag as CuisineIcon, MapPin, Zap, Award, Flame, ShoppingBag, CircleHelp, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react'; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface RestaurantCardProps {
  restaurant: Restaurant;
}

const tagIconMap: Record<RestaurantTag, React.ElementType> = {
  'Recommended': Award,
  'Hot Now': Flame,
  'Fast Delivery': Clock,
  'New': ShoppingBag, 
  'Popular': Star,
  'Delivery Arena': Zap,
};

const tagColorMap: Record<RestaurantTag, string> = {
    'Recommended': 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200/80',
    'Hot Now': 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200/80',
    'Fast Delivery': 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200/80',
    'New': 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200/80',
    'Popular': 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200/80',
    'Delivery Arena': 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200/80',
};


export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [reviewCount, setReviewCount] = useState<number | null>(null);
  const [isLivePickChoice, setIsLivePickChoice] = useState(false);

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== 'undefined') {
      setReviewCount(Math.floor(Math.random() * 150 + 50));
      if (restaurant.rating > 4.6 && Math.random() > 0.6) {
        setIsLivePickChoice(true);
      }
    }
  }, [restaurant.rating]); 

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full bg-card text-card-foreground rounded-xl border-2 border-transparent hover:border-primary/40 group premium-card-hover">
      <Link href={`/restaurants/${restaurant.id}`} className="block">
        <div className="relative w-full h-52 overflow-hidden"> 
          <Image
            src={restaurant.imageUrl} 
            alt={restaurant.name}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-110 transition-transform duration-500 ease-in-out"
            data-ai-hint={restaurant.dataAiHint || "restaurant exterior food"} 
          />
           <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5 z-10"> {/* Increased gap */}
            {isLivePickChoice && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                     <Badge variant="default" className="py-1.5 px-3 text-xs bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-lg border border-white/30">
                        <Award className="h-4 w-4 ml-1.5" /> LivePick Choice
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start" className="bg-popover text-popover-foreground p-2 text-xs rounded-md shadow-lg">
                    <p>מומלץ במיוחד על ידי צוות LivePick!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {restaurant.tags?.slice(0, isLivePickChoice ? 1 : 2).map(tag => { 
                const Icon = tagIconMap[tag] || CircleHelp;
                return (
                    <TooltipProvider key={tag}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge variant="secondary" className={cn("py-1 px-2.5 text-xs shadow-sm", tagColorMap[tag])}>
                                    <Icon className="h-3.5 w-3.5 ml-1" /> {tag}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="start" className="bg-popover text-popover-foreground p-2 text-xs rounded-md shadow-lg">
                                <p>{tag} - מאפיין מיוחד של העסק</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            })}
            </div>
        </div>
        <CardHeader className="pt-4 pb-2 px-4"> {/* Adjusted padding */}
          <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors duration-300">{restaurant.name}</CardTitle>
          <CardDescription className="text-sm h-10 overflow-hidden text-ellipsis mt-1">{restaurant.description}</CardDescription>
        </CardHeader>
      </Link>
      <CardContent className="flex-grow space-y-2.5 text-sm pt-0 pb-3 px-4"> 
        <div className="flex items-center text-muted-foreground">
          <CuisineIcon className="h-4 w-4 ml-2 text-accent" /> 
          <span>{restaurant.cuisineType}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Star className="h-4 w-4 ml-2 text-yellow-500 fill-yellow-500" /> 
          <span>{restaurant.rating.toFixed(1)}</span>
           {reviewCount !== null ? (
            <span className="mr-1 text-xs">({reviewCount} ביקורות)</span>
           ) : (
            <span className="mr-1 text-xs animate-pulse">(טוען...)</span> 
           )}
        </div>
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-4 w-4 ml-2 text-blue-500" /> 
          <span>{restaurant.deliveryTimeEstimate}</span>
        </div>
         <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 ml-2 text-green-500" /> 
          <span className="truncate">{restaurant.location}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t mt-auto">
        <Button asChild className="w-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105 btn-gradient-hover-primary">
          <Link href={`/restaurants/${restaurant.id}`}>
            <span className="flex items-center justify-center w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />הצג תפריט
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
