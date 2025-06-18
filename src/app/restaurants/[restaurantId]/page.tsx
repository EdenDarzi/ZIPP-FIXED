
'use client'; 

import { getRestaurantById } from '@/lib/mock-data';
import type { Restaurant, MenuItem } from '@/types';
import ItemCard from '@/components/items/item-card';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation'; 
import { Star, Clock, MapPin, Utensils, Share2, Award, MessageCircle, Edit, Send, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MockReview {
  id: string;
  userName: string;
  avatarFallback: string;
  rating: number;
  text: string;
  date: string;
}

const mockReviews: MockReview[] = [
  { id: 'review1', userName: 'ישראל ישראלי', avatarFallback: 'יש', rating: 5, text: 'האוכל היה מדהים והשירות היה מעולה! מומלץ בחום.', date: 'לפני יומיים' },
  { id: 'review2', userName: 'חווה כהן', avatarFallback: 'חו', rating: 4, text: 'מקום נחמד, אווירה טובה. המנות היו טעימות אבל קצת קטנות למחיר.', date: 'לפני שבוע' },
  { id: 'review3', userName: 'דוד לוי', avatarFallback: 'דל', rating: 3, text: 'חיכינו הרבה זמן למנות, והמלצר היה קצת מבולבל. האוכל עצמו היה בסדר.', date: 'לפני 3 ימים' },
];


export default function RestaurantPage() {
  const params = useParams<{ restaurantId: string }>(); 
  const restaurant: Restaurant | undefined = getRestaurantById(params.restaurantId);
  const { toast } = useToast();

  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [hoverReviewRating, setHoverReviewRating] = useState(0);
  const [pageReviewCount, setPageReviewCount] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageReviewCount(Math.floor(Math.random() * 200 + 50));
    }
  }, []); 

  if (!restaurant) {
    notFound();
  }

  const menuItemsByCategory: Record<string, MenuItem[]> = restaurant.menu.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const handleShareRestaurant = () => {
    toast({
      title: "שיתוף מסעדה (דמו)",
      description: `שיתפת את מסעדת "${restaurant.name}"! +10 כוכבים התווספו לחשבונך (דמו).`,
      action: <Award className="h-5 w-5 text-yellow-400"/>
    });
  };
  
  const handleSubmitReview = () => {
    if (newReviewRating === 0) {
      toast({ title: "חסר דירוג", description: "אנא בחר/י דירוג כוכבים לפני שליחת הביקורת.", variant: "destructive" });
      return;
    }
    if (newReviewText.trim().length < 10) {
      toast({ title: "ביקורת קצרה מדי", description: "אנא כתוב/י לפחות 10 תווים בביקורת שלך.", variant: "destructive" });
      return;
    }
    console.log("New Review Submitted:", { rating: newReviewRating, text: newReviewText, restaurantId: restaurant.id });
    toast({
      title: "הביקורת נשלחה!",
      description: "תודה על המשוב. הביקורת שלך תפורסם לאחר אישור (דמו).",
    });
    setNewReviewText('');
    setNewReviewRating(0);
  };


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
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-white">{restaurant.name}</h1>
            <p className="text-lg text-gray-200 mt-1">{restaurant.description}</p>
          </div>
          <Button variant="outline" size="icon" onClick={handleShareRestaurant} className="bg-white/20 hover:bg-white/30 text-white border-white/50 backdrop-blur-sm ml-4">
            <Share2 className="h-5 w-5" />
            <span className="sr-only">שתף מסעדה</span>
          </Button>
        </div>
      </header>

      <section className="grid md:grid-cols-3 gap-6 text-sm bg-card p-4 rounded-lg shadow"> {/* Increased gap */}
        <div className="flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-primary" />
          <span className="text-foreground">{restaurant.location}</span>
        </div>
        <div className="flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-500 fill-yellow-500" />
          <span className="text-foreground">
            {restaurant.rating.toFixed(1)} 
            {pageReviewCount === null ? 
              <span className="text-xs animate-pulse"> (טוען ביקורות...)</span> : 
              <span className="text-xs"> ({pageReviewCount} ביקורות)</span>
            }
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          <span className="text-foreground">{restaurant.deliveryTimeEstimate}</span>
        </div>
      </section>

      {restaurant.id === 'restaurant1' && ( 
        <Card className="bg-red-50 border-red-200">
            <CardHeader>
                <CardTitle className="text-xl text-red-700 flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5 animate-pulse" /> 🎬 SwiftServe LiveKitchen פעיל! (דמו) {/* Updated name */}
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <div className="aspect-video bg-black rounded-md flex items-center justify-center mb-2 data-ai-hint='kitchen live stream placeholder'">
                    <p className="text-white">שידור חי מהמטבח (Placeholder)</p>
                </div>
                <CardDescription className="text-sm text-red-600">צפו בנו מכינים את המנות שלכם בזמן אמת!</CardDescription>
            </CardContent>
        </Card>
      )}
      
      <div className="flex items-center space-x-2 text-primary">
        <Utensils className="h-6 w-6" />
        <h2 className="text-3xl font-bold font-headline">תפריט</h2>
      </div>

      {Object.entries(menuItemsByCategory).map(([category, items]) => (
        <section key={category} className="space-y-4">
          <h3 className="text-2xl font-semibold font-headline text-foreground/90 border-b-2 border-primary/30 pb-2">{category}</h3>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap */}
              {items.map((item) => (
                <ItemCard key={item.id} item={item} restaurantId={restaurant.id} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">אין פריטים בקטגוריה זו.</p>
          )}
          <Separator className="my-6" />
        </section>
      ))}
       {restaurant.menu.length === 0 && (
         <p className="text-muted-foreground text-lg text-center py-8">במסעדה זו אין כרגע פריטים בתפריט.</p>
       )}

        <section className="mt-10 p-6 bg-muted/30 rounded-lg shadow-md">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-semibold font-headline text-foreground/90 flex items-center">
                <MessageCircle className="mr-3 h-6 w-6 text-primary" />
                מה הקהילה חושבת על {restaurant.name}?
              </CardTitle>
            </CardHeader>

            {mockReviews.length > 0 ? (
              <div className="space-y-6 mb-8">
                {mockReviews.map(review => (
                  <Card key={review.id} className="bg-card p-4 shadow">
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={`https://placehold.co/40x40.png?text=${review.avatarFallback}`} alt={review.userName} data-ai-hint="user avatar" />
                        <AvatarFallback>{review.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-foreground">{review.userName}</p>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex items-center my-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={cn(
                                "h-4 w-4",
                                review.rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{review.text}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center mb-8">עדיין אין ביקורות לעסק זה. היה/י הראשון/ה!</p>
            )}
            
            <Separator className="my-6"/>

            <Card className="bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Edit className="mr-2 h-5 w-5 text-accent" />
                  הוסף/י ביקורת או טיפ משלך
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reviewRating" className="mb-1.5 block text-sm font-medium">הדירוג שלך:</Label>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse" dir="ltr">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={`new-review-star-${star}`}
                        className={cn("h-7 w-7 cursor-pointer transition-colors",
                          (hoverReviewRating || newReviewRating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300 hover:text-yellow-200"
                        )}
                        onClick={() => setNewReviewRating(star)}
                        onMouseEnter={() => setHoverReviewRating(star)}
                        onMouseLeave={() => setHoverReviewRating(0)}
                        aria-label={`דרג ${star} כוכבים`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="reviewText" className="mb-1.5 block text-sm font-medium">הביקורת / הטיפ שלך:</Label>
                  <Textarea
                    id="reviewText"
                    placeholder={`שתף/י את החוויה שלך מ${restaurant.name}...`}
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSubmitReview} className="w-full sm:w-auto btn-gradient-hover-accent" disabled={newReviewRating === 0 || newReviewText.trim().length < 10}>
                  <Send className="mr-2 h-4 w-4" /> שלח ביקורת (דמו)
                </Button>
              </CardFooter>
            </Card>
        </section>
    </div>
  );
}

