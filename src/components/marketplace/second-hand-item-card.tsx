
'use client';

import Image from 'next/image';
import type { SecondHandItem } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, MapPin, Tag, MessageSquare, Phone, Star, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link'; // Potential for item details page

export default function SecondHandItemCard({ item }: { item: SecondHandItem }) {
  const { toast } = useToast();

  const handleContactSeller = () => {
    toast({
      title: 'צור קשר עם המוכר (דמו)',
      description: `פרטי יצירת הקשר של ${item.sellerName}: ${item.contactDetails || 'לא סופקו פרטים נוספים'}. לחצן WhatsApp/טלפון יתווסף בקרוב.`,
    });
    // In a real app, this might open a chat, show a phone number, or link to WhatsApp
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
      <div className="relative w-full h-48">
        <Image
          src={item.images[0]?.url || 'https://placehold.co/600x400.png?text=Missing+Image'}
          alt={item.title}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={item.images[0]?.dataAiHint || "second hand item"}
        />
        {item.isSold && (
          <Badge variant="destructive" className="absolute top-2 right-2 text-sm px-3 py-1 shadow-lg">
            נמכר
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors truncate">
          {item.title}
        </CardTitle>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>פורסם: {new Date(item.publishedAt).toLocaleDateString('he-IL')}</span>
          <Badge variant="outline" className="capitalize">{item.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-3 space-y-1.5">
        <p className="text-xl font-semibold text-primary flex items-center">
          <DollarSign className="h-5 w-5 mr-1 text-green-600" /> {item.price.toFixed(2)}₪
        </p>
        <p className="text-sm text-muted-foreground flex items-center truncate">
          <MapPin className="h-4 w-4 mr-1 text-accent flex-shrink-0" /> {item.location}
        </p>
         <p className="text-sm text-muted-foreground flex items-center">
          <Tag className="h-4 w-4 mr-1 text-muted-foreground flex-shrink-0" /> מוכר: {item.sellerName}
          {item.sellerRating && (
            <span className="flex items-center ml-2">
              <Star className="h-3 w-3 mr-0.5 text-yellow-500 fill-yellow-500"/> {item.sellerRating.toFixed(1)}
            </span>
          )}
        </p>
        <CardDescription className="text-xs h-8 overflow-hidden text-ellipsis mt-1">{item.description}</CardDescription>

      </CardContent>
      <CardFooter className="p-3 border-t mt-auto">
        <Button onClick={handleContactSeller} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={item.isSold}>
            {item.isSold ? "פריט זה נמכר" : 
                <>
                    <MessageSquare className="mr-2 h-4 w-4" /> צור קשר עם המוכר
                </>
            }
        </Button>
         {/* 
         Future: Item details page
         <Button variant="outline" asChild className="w-1/3">
          <Link href={`/marketplace/${item.id}`}><Eye className="mr-1 h-4 w-4" /> פרטים</Link>
         </Button> 
         */}
      </CardFooter>
    </Card>
  );
}
