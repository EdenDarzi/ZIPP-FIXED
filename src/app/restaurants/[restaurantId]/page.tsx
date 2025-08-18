'use client'; 

import { useParams } from 'next/navigation';
import { getEnhancedRestaurantById } from '@/lib/enhanced-restaurant-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Phone, Truck, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import type { MenuItem, CartItem, SelectedAddon } from '@/types';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, selectedAddons?: SelectedAddon[]) => void;
}

function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();

  const handleAddonChange = (groupId: string, groupTitle: string, optionId: string, optionName: string, optionPrice: number, isSelected: boolean) => {
    setSelectedAddons(prev => {
      if (isSelected) {
        return [...prev, { groupId, groupTitle, optionId, optionName, optionPrice }];
      } else {
        return prev.filter(addon => !(addon.groupId === groupId && addon.optionId === optionId));
      }
    });
  };

  const calculateTotalPrice = () => {
    const addonPrice = selectedAddons.reduce((sum, addon) => sum + addon.optionPrice, 0);
    return item.price + addonPrice;
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    onAddToCart(item, selectedAddons);
    
    toast({
      title: "נוסף לעגלה!",
      description: `${item.name} נוסף לעגלת הקניות שלך`,
    });
    
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={item.imageUrl} 
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={item.dataAiHint}
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg">לא זמין</Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <CardDescription className="text-sm">{item.description}</CardDescription>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">₪{calculateTotalPrice().toFixed(2)}</span>
          {selectedAddons.length > 0 && (
            <span className="text-sm text-muted-foreground">
              (בסיס: ₪{item.price.toFixed(2)})
            </span>
          )}
        </div>
      </CardHeader>

      {item.addons && item.addons.length > 0 && (
        <CardContent className="pt-0 space-y-4">
          {item.addons.map(group => (
            <div key={group.id} className="space-y-2">
              <h4 className="font-semibold text-sm">
                {group.title}
                {group.required && <span className="text-red-500 ml-1">*</span>}
              </h4>
              <div className="space-y-1">
                {group.options.map(option => {
                  const isSelected = selectedAddons.some(addon => 
                    addon.groupId === group.id && addon.optionId === option.id
                  );
                  
                  return (
                    <label key={option.id} className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <input
                          type={group.type === 'radio' ? 'radio' : 'checkbox'}
                          name={group.id}
                          checked={isSelected}
                          onChange={(e) => handleAddonChange(
                            group.id!, group.title, option.id!, option.name, option.price, e.target.checked
                          )}
                          className="rounded"
                        />
                        <span className="text-sm">{option.name}</span>
                      </div>
                      {option.price > 0 && (
                        <span className="text-sm text-muted-foreground">+₪{option.price.toFixed(2)}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      )}

      <div className="p-4 pt-2">
        <Button 
          onClick={handleAddToCart}
          disabled={!item.isAvailable || isAddingToCart}
          className="w-full"
        >
          {isAddingToCart ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              מוסיף...
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 mr-2" />
              הוסף לעגלה - ₪{calculateTotalPrice().toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}

export default function RestaurantDetailPage() {
  const params = useParams();
  const { t } = useLanguage();
  const { toast } = useToast();
  const restaurantId = params.restaurantId as string;
  
  const restaurant = getEnhancedRestaurantById(restaurantId);
  
  if (!restaurant) {
    return (
      <div className="container mx-auto py-8">
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>המסעדה לא נמצאה</CardTitle>
            <CardDescription>המסעדה שחיפשת אינה קיימת במערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/restaurants">חזור לרשימת המסעדות</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddToCart = (item: MenuItem, selectedAddons: SelectedAddon[] = []) => {
    // כאן תהיה הלוגיקה להוספה לעגלה
    console.log('Adding to cart:', { item, selectedAddons });
  };

  // Group menu items by category
  const menuByCategory = restaurant.menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-8">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          fill
          className="object-cover"
          data-ai-hint={restaurant.dataAiHint}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex flex-wrap gap-2 mb-3">
            {restaurant.tags?.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-lg opacity-90 mb-3">{restaurant.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{restaurant.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{restaurant.deliveryTimeEstimate}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{restaurant.location}</span>
          </div>
            <div className="flex items-center gap-1">
              <Truck className="h-4 w-4" />
              <span>{restaurant.cuisineType}</span>
        </div>
        </div>
        </div>
        </div>

      {/* Delivery Options */}
      <Card>
            <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            אפשרויות משלוח ואיסוף
                </CardTitle>
            </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {restaurant.hasDeliveryArena && (
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Delivery Arena</h4>
                  <p className="text-sm text-muted-foreground">משלוח חינם עם שליחים מקומיים</p>
                </div>
                </div>
            )}
            
            {restaurant.supportsTakeaway && (
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">איסוף עצמי</h4>
                  <p className="text-sm text-muted-foreground">אספו ישירות מהמסעדה</p>
      </div>
            </div>
            )}
            
            {restaurant.supportsCurbsidePickup && (
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="h-5 w-5 text-blue-600" />
                        </div>
                <div>
                  <h4 className="font-semibold">איסוף מהרכב</h4>
                  <p className="text-sm text-muted-foreground">איסוף נוח ישירות לרכב</p>
                      </div>
                    </div>
            )}
          </div>
        </CardContent>
                  </Card>

      {/* Menu */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">התפריט</h2>
        
        {Object.entries(menuByCategory).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
        ))}
                </div>
    </div>
  );
}
