
'use client';

import { getItemById } from '@/lib/mock-data';
import type { MenuItem, SelectedAddon, MenuItemAddonGroup, MenuItemAddonChoice } from '@/types';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Minus, Plus, ShoppingCart, ArrowLeft, Star, Share2, Award, Heart, Info } from 'lucide-react'; 
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from '@/lib/utils';

interface ItemPageParams {
  params: {
    restaurantId: string;
    itemId: string;
  };
}

type SelectedAddonsState = Record<string, string | string[] | undefined>;


export default function ItemPage({ params }: ItemPageParams) {
  const item: MenuItem | undefined = getItemById(params.restaurantId, params.itemId);
  const { addToCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddonsState>({});

  useEffect(() => {
    if (item?.addons) {
      const defaultSelections: SelectedAddonsState = {};
      item.addons.forEach(group => {
        if (group.type === 'radio') {
          const defaultOption = group.options.find(opt => opt.selectedByDefault);
          if (defaultOption) {
            defaultSelections[group.id!] = defaultOption.id!;
          } else if (group.required && group.options.length > 0) {
            // If required and no default, select the first one (can be adjusted)
            defaultSelections[group.id!] = group.options[0].id!;
          }
        } else if (group.type === 'checkbox') {
          const defaultOptions = group.options.filter(opt => opt.selectedByDefault).map(opt => opt.id!);
          if (defaultOptions.length > 0) {
            defaultSelections[group.id!] = defaultOptions;
          }
        }
      });
      setSelectedAddons(defaultSelections);
    }
  }, [item]);


  const currentTotalPrice = useMemo(() => {
    if (!item) return 0;
    let addonsPrice = 0;
    if (item.addons) {
      for (const group of item.addons) {
        const selection = selectedAddons[group.id!];
        if (selection) {
          if (Array.isArray(selection)) { 
            selection.forEach(optionId => {
              const option = group.options.find(opt => opt.id === optionId);
              if (option) addonsPrice += option.price;
            });
          } else { 
            const option = group.options.find(opt => opt.id === selection);
            if (option) addonsPrice += option.price;
          }
        }
      }
    }
    return (item.price + addonsPrice) * quantity;
  }, [item, selectedAddons, quantity]);


  if (!item) {
    notFound();
  }

  const handleAddonSelection = (groupId: string, optionId: string, groupType: 'radio' | 'checkbox') => {
    setSelectedAddons(prev => {
      const newSelections = { ...prev };
      if (groupType === 'radio') {
        newSelections[groupId] = optionId;
      } else { 
        const currentGroupSelection = (newSelections[groupId] as string[] | undefined) || [];
        if (currentGroupSelection.includes(optionId)) {
          newSelections[groupId] = currentGroupSelection.filter(id => id !== optionId);
        } else {
          newSelections[groupId] = [...currentGroupSelection, optionId];
        }
      }
      return newSelections;
    });
  };

  const validateAddonSelections = (): SelectedAddon[] | null => {
    if (!item?.addons) return [];
    const finalSelectedAddons: SelectedAddon[] = [];

    for (const group of item.addons) {
      const currentSelection = selectedAddons[group.id!];
      const selectedCount = Array.isArray(currentSelection) ? currentSelection.length : (currentSelection ? 1 : 0);

      if (group.required && selectedCount === 0) {
        toast({ title: "בחירה חסרה", description: `קבוצת "${group.title}" היא חובה. אנא בחר/י לפחות אפשרות אחת.`, variant: "destructive" });
        return null;
      }

      if (group.type === 'checkbox') {
        if (group.minSelection && selectedCount < group.minSelection) {
          toast({ title: "בחירה לא מספקת", description: `עליך לבחור לפחות ${group.minSelection} אפשרויות מקבוצת "${group.title}". בחרת ${selectedCount}.`, variant: "destructive" });
          return null;
        }
        if (group.maxSelection && selectedCount > group.maxSelection) {
          toast({ title: "יותר מדי בחירות", description: `ניתן לבחור עד ${group.maxSelection} אפשרויות מקבוצת "${group.title}". בחרת ${selectedCount}.`, variant: "destructive" });
          return null;
        }
      }
      
      if (Array.isArray(currentSelection)) {
        currentSelection.forEach(optionId => {
          const optionDetails = group.options.find(opt => opt.id === optionId);
          if (optionDetails) {
            finalSelectedAddons.push({
              groupId: group.id!, groupTitle: group.title, optionId: optionDetails.id!, optionName: optionDetails.name, optionPrice: optionDetails.price
            });
          }
        });
      } else if (currentSelection) {
         const optionDetails = group.options.find(opt => opt.id === currentSelection);
         if (optionDetails) {
            finalSelectedAddons.push({
              groupId: group.id!, groupTitle: group.title, optionId: optionDetails.id!, optionName: optionDetails.name, optionPrice: optionDetails.price
            });
          }
      }
    }
    return finalSelectedAddons;
  };


  const handleAddToCart = () => {
    const validatedSelectedAddons = validateAddonSelections();
    if (validatedSelectedAddons === null) {
      return; 
    }
    addToCart(item, quantity, validatedSelectedAddons);
     toast({
      title: "נוסף לעגלה!",
      description: `${quantity}x ${item.name} נוספו לעגלה שלך.`,
    });
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  const handleShareItem = () => {
    toast({
      title: "שיתוף פריט (הדגמה)",
      description: `שיתפת את "${item.name}"! +5 כוכבים התווספו לחשבונך (דמו).`,
      action: <Award className="h-5 w-5 text-yellow-400" aria-label="פרס כוכבים"/>
    });
  };

  const handleAddToFavorites = () => {
    toast({
        title: "נוסף למועדפים",
        description: `"${item.name}" נוסף לספריית הטעמים שלך. תוכל למצוא אותו שם בפעם הבאה! (הדגמה)`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.back()} aria-label="חזור לתפריט">
          <ArrowLeft className="mr-2 h-4 w-4" /> חזור לתפריט
        </Button>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button variant="ghost" size="icon" onClick={handleAddToFavorites} title="הוסף למועדפים" aria-label="הוסף למועדפים">
                <Heart className="h-5 w-5 text-pink-500" />
                <span className="sr-only">הוסף למועדפים</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleShareItem} title="שתף פריט" aria-label="שתף פריט">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">שתף פריט</span>
            </Button>
        </div>
      </div>
      

      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 gap-0 md:gap-8">
          <div className="relative h-64 md:h-full min-h-[300px] md:rounded-l-lg overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.name}
              layout="fill"
              objectFit="cover"
              priority
              data-ai-hint={item.dataAiHint || "food item closeup"}
            />
          </div>
          
          <div className="flex flex-col">
            <CardHeader className="pt-6 md:pt-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-3xl md:text-4xl font-bold font-headline text-primary">{item.name}</CardTitle>
                <Badge variant="outline" className="text-sm">{item.category}</Badge>
              </div>
              <CardDescription className="text-base text-muted-foreground pt-2">{item.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 flex-grow">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(Math.random() * 2 + 3.5) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/50'}`} aria-hidden="true" />
                ))}
                <span className="text-sm text-muted-foreground">({Math.floor(Math.random() * 100 + 20)} ביקורות)</span>
              </div>
              
              <p className="text-3xl font-semibold text-accent">₪{item.price.toFixed(2)}</p>
              
              {item.addons && item.addons.length > 0 && (
                <div className="space-y-4 pt-2">
                  <Separator />
                  {item.addons.map((group) => (
                    <div key={group.id} className="space-y-2">
                      <h4 className="text-md font-semibold text-foreground flex items-center">
                        {group.title}
                        {group.required && <span className="text-destructive ml-1">*</span>}
                         <span className="text-xs text-muted-foreground ml-2">
                          {group.type === 'radio' ? '(בחר/י 1)' : 
                           (group.minSelection || group.maxSelection) ? 
                           `(בחר/י ${group.minSelection ? `לפחות ${group.minSelection}` : ''}${group.minSelection && group.maxSelection ? ' וגם ' : ''}${group.maxSelection ? `עד ${group.maxSelection}` : 'כמה שתרצה/י'})` 
                           : '(אופציונלי)'}
                        </span>
                      </h4>
                      {group.type === 'radio' && (
                        <RadioGroup
                          value={selectedAddons[group.id!] as string | undefined}
                          onValueChange={(optionId) => handleAddonSelection(group.id!, optionId, 'radio')}
                          className="space-y-1"
                          dir="rtl"
                          aria-label={group.title}
                        >
                          {group.options.map(option => (
                            <Label key={option.id} htmlFor={`${group.id}-${option.id}`} className={cn("flex items-center p-2.5 border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all", {"opacity-50 cursor-not-allowed": !item.isAvailable})}>
                              <RadioGroupItem value={option.id!} id={`${group.id}-${option.id}`} className="ml-2" disabled={!item.isAvailable} />
                              <span>{option.name}</span>
                              {option.price > 0 && <span className="mr-auto text-xs text-muted-foreground">(+₪{option.price.toFixed(2)})</span>}
                            </Label>
                          ))}
                        </RadioGroup>
                      )}
                      {group.type === 'checkbox' && (
                        <div className="space-y-1">
                          {group.options.map(option => (
                            <Label key={option.id} htmlFor={`${group.id}-${option.id}`} className={cn("flex items-center p-2.5 border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all", {"opacity-50 cursor-not-allowed": !item.isAvailable})}>
                               <Checkbox
                                id={`${group.id}-${option.id}`}
                                checked={(selectedAddons[group.id!] as string[] | undefined)?.includes(option.id!)}
                                onCheckedChange={() => handleAddonSelection(group.id!, option.id!, 'checkbox')}
                                className="ml-2"
                                disabled={!item.isAvailable}
                              />
                              <span>{option.name}</span>
                              {option.price > 0 && <span className="mr-auto text-xs text-muted-foreground">(+₪{option.price.toFixed(2)})</span>}
                            </Label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                   <Separator />
                </div>
              )}
             
              <div className="flex items-center space-x-4 rtl:space-x-reverse pt-2">
                <p className="text-lg font-semibold">כמות:</p>
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" onClick={decrementQuantity} aria-label={`הפחת כמות עבור ${item.name}`} disabled={!item.isAvailable}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-medium" aria-label={`כמות נוכחית: ${quantity}`}>{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={incrementQuantity} aria-label={`הגדל כמות עבור ${item.name}`} disabled={!item.isAvailable}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {!item.isAvailable && (
                 <Card className="mt-3 p-3 bg-destructive/10 border-destructive/30 text-center">
                    <p className="text-sm text-destructive font-medium flex items-center justify-center"><Info className="h-4 w-4 mr-2"/> פריט זה אינו זמין כרגע.</p>
                </Card>
              )}
            </CardContent>

            <CardFooter className="p-6 bg-muted/20 border-t">
              <Button size="lg" onClick={handleAddToCart} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md text-lg" aria-label={`הוסף ${quantity} ${item.name} לעגלה במחיר כולל של ${(currentTotalPrice).toFixed(2)} שקלים`} disabled={!item.isAvailable}>
                <ShoppingCart className="mr-2 h-5 w-5" /> הוסף לעגלה (₪{currentTotalPrice.toFixed(2)})
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}

