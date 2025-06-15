
import Image from 'next/image';
import Link from 'next/link';
import type { Restaurant, RestaurantTag } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Clock, Tag as CuisineIcon, MapPin, Zap, Award, Flame, ShoppingBag, CircleHelp, ArrowLeft } from 'lucide-react'; // ArrowRight becomes ArrowLeft
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
    'Recommended': 'bg-purple-100 text-purple-700 border-purple-300',
    'Hot Now': 'bg-red-100 text-red-700 border-red-300',
    'Fast Delivery': 'bg-blue-100 text-blue-700 border-blue-300',
    'New': 'bg-green-100 text-green-700 border-green-300',
    'Popular': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Delivery Arena': 'bg-orange-100 text-orange-700 border-orange-300',
};


export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full bg-card text-card-foreground rounded-xl border hover:border-primary/50 group">
      <Link href={`/restaurants/${restaurant.id}`} className="block">
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={restaurant.imageUrl} 
            alt={restaurant.name}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-110 transition-transform duration-500 ease-in-out"
            data-ai-hint={restaurant.dataAiHint || "restaurant exterior food"} 
          />
           <div className="absolute top-2 left-2 flex flex-col items-start gap-1"> {/* Changed to left-2 and items-start for RTL */}
            {restaurant.tags?.slice(0, 2).map(tag => {
                const Icon = tagIconMap[tag] || CircleHelp;
                return (
                    <Badge key={tag} variant="secondary" className={cn("py-1 px-2 text-xs", tagColorMap[tag])}>
                        <Icon className="h-3 w-3 ml-1" /> {tag} {/* Adjusted margin for RTL */}
                    </Badge>
                );
            })}
            </div>
        </div>
        <CardHeader className="pt-4 pb-2">
          <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors duration-300">{restaurant.name}</CardTitle>
          <CardDescription className="text-sm h-10 overflow-hidden text-ellipsis mt-1">{restaurant.description}</CardDescription>
        </CardHeader>
      </Link>
      <CardContent className="flex-grow space-y-2 text-sm pt-0 pb-3">
        <div className="flex items-center text-muted-foreground">
          <CuisineIcon className="h-4 w-4 ml-2 text-accent" /> {/* Adjusted margin for RTL */}
          <span>{restaurant.cuisineType}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Star className="h-4 w-4 ml-2 text-yellow-500 fill-yellow-500" /> {/* Adjusted margin for RTL */}
          <span>{restaurant.rating.toFixed(1)}</span>
           <span className="mr-1 text-xs">({Math.floor(Math.random() * 150 + 50)} ביקורות)</span> {/* Adjusted margin for RTL and translated */}
        </div>
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-4 w-4 ml-2 text-blue-500" /> {/* Adjusted margin for RTL */}
          <span>{restaurant.deliveryTimeEstimate}</span>
        </div>
         <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 ml-2 text-green-500" /> {/* Adjusted margin for RTL */}
          <span className="truncate">{restaurant.location}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t mt-auto">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-300 group-hover:scale-105">
          <Link href={`/restaurants/${restaurant.id}`}>
            <span className="flex items-center justify-center w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />הצג תפריט {/* Adjusted for RTL */}
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
