
import Image from 'next/image';
import Link from 'next/link';
import type { Restaurant } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Clock, Tag, MapPin, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card text-card-foreground rounded-lg">
      <Link href={`/restaurants/${restaurant.id}`} className="block group">
        <div className="relative w-full h-48">
          <Image
            src={restaurant.imageUrl} // This will be a placehold.co URL from mockData
            alt={restaurant.name}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={restaurant.dataAiHint || "restaurant exterior food"} // Ensure hint is descriptive
          />
           {restaurant.hasDeliveryArena && (
            <Badge variant="default" className="absolute top-2 right-2 bg-accent text-accent-foreground">
              <Zap className="h-3 w-3 mr-1" /> Arena
            </Badge>
          )}
        </div>
        <CardHeader>
          <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{restaurant.name}</CardTitle>
          <CardDescription className="text-sm h-10 overflow-hidden text-ellipsis">{restaurant.description}</CardDescription>
        </CardHeader>
      </Link>
      <CardContent className="flex-grow space-y-2 text-sm">
        <div className="flex items-center text-muted-foreground">
          <Tag className="h-4 w-4 mr-2 text-accent" />
          <span>{restaurant.cuisineType}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Star className="h-4 w-4 mr-2 text-yellow-500 fill-yellow-500" />
          <span>{restaurant.rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-4 w-4 mr-2 text-accent" />
          <span>{restaurant.deliveryTimeEstimate}</span>
        </div>
         <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 text-accent" />
          <span className="truncate">{restaurant.location}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/restaurants/${restaurant.id}`}>View Menu</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
