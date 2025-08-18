
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, AlertTriangle, Clock, ArrowLeft, PlusCircle, Store, Info } from 'lucide-react';
import Image from 'next/image';
import { mockLivePickSaleItems } from '@/lib/mock-data';
import type { LivePickSaleItem as ZippSaleItem } from '@/types'; 
import { useCart } from '@/context/cart-context'; 
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';

export default function ZippSalePage() {
  const { t } = useLanguage();
  const [activeItems, setActiveItems] = useState<ZippSaleItem[]>([]);
  const { addToCart } = useCart(); 
  const { toast } = useToast();
  const [isSaleActiveNow, setIsSaleActiveNow] = useState(false);
  const SALE_START_HOUR = 19; 
  const SALE_END_HOUR = 23; 

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= SALE_START_HOUR && currentHour < SALE_END_HOUR) {
      setIsSaleActiveNow(true); 
    } else {
      setIsSaleActiveNow(false); 
    }
    setActiveItems(mockLivePickSaleItems.filter(item => item.isActive && item.quantityAvailable > 0));
  }, []);

  const handleAddToCart = (item: ZippSaleItem) => {
    const cartItem = {
        id: item.id, 
        name: `${t('livepick.bag')}: ${item.name}`,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl || 'https://placehold.co/600x400.png?text=Surprise!',
        dataAiHint: item.dataAiHint || 'surprise bag',
        category: t('livepick.category'), 
        restaurantId: item.restaurantId, 
    };
    addToCart(cartItem as any, 1); 
    toast({
        title: t('livepick.added'),
        description: t('livepick.added.desc').replace('{name}', item.name).replace('{restaurant}', item.restaurantName),
    });
  };

  return (
    <div className="space-y-8">
      <Card className="text-center shadow-xl bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 text-white">
        <CardHeader>
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 animate-bounce" />
          <CardTitle className="text-3xl md:text-4xl font-headline">{t('livepick.title')}</CardTitle>
          <CardDescription className="text-lg text-red-100 mt-2">{t('livepick.subtitle')}</CardDescription>
        </CardHeader>
         <CardContent>
            <Button variant="outline" className="bg-transparent hover:bg-white/10 text-white border-white/70" asChild>
                <Link href="/restaurants">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('livepick.back')}
                </Link>
            </Button>
        </CardContent>
      </Card>

      {!isSaleActiveNow && ( 
        <Card className="text-center py-12">
          <CardContent className="flex flex-col items-center gap-4">
            <Clock className="h-16 w-16 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">{t('livepick.closed')}</p>
            <p className="text-sm">{t('livepick.activeHours').replace('{start}', String(SALE_START_HOUR).padStart(2, '0')).replace('{end}', String(SALE_END_HOUR).padStart(2, '0'))}</p>
          </CardContent>
        </Card>
      )}

      {isSaleActiveNow && activeItems.length === 0 && (
        <Card className="text-center py-12">
          <CardContent className="flex flex-col items-center gap-4">
            <AlertTriangle className="h-16 w-16 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">{t('livepick.soldout')}</p>
            <p className="text-sm">{t('livepick.checkLater')}</p>
          </CardContent>
        </Card>
      )}

      {isSaleActiveNow && activeItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeItems.map(item => (
            <Card key={item.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow premium-card-hover">
              <div className="relative h-48 w-full">
                <Image
                  src={item.imageUrl || 'https://placehold.co/600x400.png?text=Surprise!'}
                  alt={item.name}
                  fill
                  style={{objectFit: 'cover'}}
                  data-ai-hint={item.dataAiHint || "surprise bag food bakery items"}
                />
                <Badge variant="destructive" className="absolute top-2 right-2 text-sm px-3 py-1">
                  🔥 {t('livepick.badge')}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold truncate">{item.name}</CardTitle>
                <CardDescription className="text-xs flex items-center">
                  <Store className="h-3 w-3 mr-1 text-muted-foreground"/> {t('livepick.by')}: {item.restaurantName}
                  </CardDescription>
                {item.description && <p className="text-sm text-muted-foreground mt-1 h-10 overflow-hidden text-ellipsis">{item.description}</p>}
              </CardHeader>
              <CardContent className="flex-grow pt-0">
                <p className="text-2xl font-bold text-primary">₪{item.price.toFixed(2)}</p>
                {item.originalPrice && (
                  <p className="text-sm text-muted-foreground line-through">{t('livepick.original')}: ₪{item.originalPrice.toFixed(2)}</p>
                )}
                <p className="text-xs text-orange-600 mt-1">{t('livepick.left')}: {item.quantityAvailable}</p>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <Button onClick={() => handleAddToCart(item)} className="w-full bg-primary hover:bg-primary/90 btn-gradient-hover-primary">
                  <PlusCircle className="mr-2 h-4 w-4" /> {t('livepick.addToCart')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
     <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center">
        <Info className="h-4 w-4 mr-2 text-blue-500"/>
        {t('livepick.disclaimer')}
      </p>
    </div>
  );
}

