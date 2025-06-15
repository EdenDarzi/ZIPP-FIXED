
'use client';

import { useState } from 'react';
import type { MenuItem as MenuItemType, Restaurant, MenuItemAddonGroup } from '@/types';
import { mockRestaurants } from '@/lib/mock-data'; // Assuming mockRestaurants includes menu items with addons
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Edit3, Trash2, Copy, GripVertical, PackageSearch, Image as ImageIcon, Tag, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label'; // Correct import for Label

// Enhanced Zod schema for MenuItem including addons
const menuItemAddonChoiceSchema = z.object({
  id: z.string().uuid().optional(), // Optional for new items
  name: z.string().min(1, "שם האפשרות הוא שדה חובה"),
  price: z.preprocess(val => Number(val), z.number().min(0, "מחיר לא יכול להיות שלילי")),
  selectedByDefault: z.boolean().optional(),
});

const menuItemAddonGroupSchema = z.object({
  id: z.string().uuid().optional(), // Optional for new items
  title: z.string().min(1, "כותרת קבוצת תוספות היא שדה חובה"),
  type: z.enum(['radio', 'checkbox']),
  minSelection: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().min(0, "מספר בחירות מינימלי לא יכול להיות שלילי").optional()
  ),
  maxSelection: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().min(0, "מספר בחירות מקסימלי לא יכול להיות שלילי").optional()
  ),
  options: z.array(menuItemAddonChoiceSchema).min(1, "נדרשת לפחות אפשרות אחת בקבוצת תוספות"),
  required: z.boolean().optional().default(false),
});

const menuItemFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "שם המוצר/שירות חייב להכיל לפחות 3 תווים"),
  description: z.string().min(10, "תיאור חייב להכיל לפחות 10 תווים"),
  price: z.preprocess(val => parseFloat(val as string), z.number().positive("מחיר חייב להיות מספר חיובי")),
  imageUrl: z.string().url("כתובת URL של תמונה לא תקינה").or(z.literal('')),
  dataAiHint: z.string().optional(),
  category: z.string().min(1, "קטגוריה היא שדה חובה"),
  newCategoryName: z.string().optional(),
  isAvailable: z.boolean().default(true),
  addons: z.array(menuItemAddonGroupSchema).optional(),
}).refine(data => {
  if (data.category === 'NEW_CATEGORY_INPUT') {
    return !!data.newCategoryName && data.newCategoryName.trim().length > 0;
  }
  return true;
}, {
  message: "שם קטגוריה חדשה לא יכול להיות ריק אם 'צור קטגוריה חדשה' נבחרה.",
  path: ['newCategoryName'],
});


type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;

// Assume restaurantId 'restaurant1' is the one being managed
const managedRestaurantId = 'restaurant1'; // This ID might need to be more generic or dynamically set for a "Business Admin"
const initialRestaurant = mockRestaurants.find(r => r.id === managedRestaurantId);


export default function MenuManagementPage() {
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>(initialRestaurant); // Restaurant type might need generalization
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      dataAiHint: '',
      category: '',
      newCategoryName: '',
      isAvailable: true,
      addons: [],
    },
  });

  const { fields: addonGroups, append: appendAddonGroup, remove: removeAddonGroup } = useFieldArray({
    control: form.control,
    name: "addons",
  });

  const categories = restaurant ? Array.from(new Set(restaurant.menu.map(item => item.category))) : [];

  const handleEditItem = (item: MenuItemType) => {
    setEditingItem(item);
    setShowNewCategoryInput(false); // Reset new category input visibility
    form.reset({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      dataAiHint: item.dataAiHint,
      category: item.category,
      newCategoryName: '',
      isAvailable: item.isAvailable === undefined ? true : item.isAvailable,
      addons: item.addons?.map(ag => ({
        ...ag,
        options: ag.options.map(opt => ({...opt})) // Ensure deep copy
      })) || [],
    });
    setIsFormOpen(true);
  };

  const handleAddNewItem = () => {
    setEditingItem(null);
    setShowNewCategoryInput(false); // Reset
    form.reset({ // Reset to default values for a new item
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      dataAiHint: '',
      category: categories.length > 0 ? categories[0] : '',
      newCategoryName: '',
      isAvailable: true,
      addons: [],
    });
    setIsFormOpen(true);
  };

  const handleDuplicateItem = (itemToDuplicate: MenuItemType) => {
    if (!restaurant) return;
    const newItem: MenuItemType = {
      ...itemToDuplicate,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2,7)}`, // Ensure new ID
      name: `${itemToDuplicate.name} (עותק)`,
      restaurantId: restaurant.id, // This might need to be businessId
    };
    setRestaurant(prev => prev ? ({ ...prev, menu: [...prev.menu, newItem] }) : undefined);
    toast({ title: "פריט שוכפל", description: `${newItem.name} נוסף לרשימה שלך.` });
  };

  const handleDeleteItem = (itemId: string) => {
     if (!restaurant) return;
     setRestaurant(prev => prev ? ({ ...prev, menu: prev.menu.filter(item => item.id !== itemId) }) : undefined);
     toast({ title: "פריט נמחק", description: `הפריט הוסר מהרשימה שלך.`, variant: "destructive" });
  };

  const toggleItemAvailability = (itemId: string) => {
    if (!restaurant) return;
    setRestaurant(prev => prev ? ({
      ...prev,
      menu: prev.menu.map(item =>
        item.id === itemId ? { ...item, isAvailable: !(item.isAvailable === undefined ? true : item.isAvailable) } : item
      )
    }) : undefined);
  };

  function onSubmit(values: MenuItemFormValues) {
    if (!restaurant) return;

    let finalCategory = values.category;
    if (values.category === 'NEW_CATEGORY_INPUT' && values.newCategoryName && values.newCategoryName.trim() !== '') {
      finalCategory = values.newCategoryName.trim();
    } else if (values.category === 'NEW_CATEGORY_INPUT') {
        form.setError("newCategoryName", { type: "manual", message: "שם קטגוריה חדשה הוא שדה חובה."});
        return; // Stop submission if new category selected but name is empty
    }


    const submittedItem: MenuItemType = {
      id: editingItem?.id || `item-${Date.now()}`, // Use existing ID if editing, else generate
      restaurantId: restaurant.id, // businessId
      name: values.name,
      description: values.description,
      price: Number(values.price), // Ensure price is number
      imageUrl: values.imageUrl,
      dataAiHint: values.dataAiHint,
      category: finalCategory,
      isAvailable: values.isAvailable,
      addons: values.addons?.map(ag => ({
        ...ag,
        id: ag.id || `addon-group-${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
        minSelection: ag.minSelection ? Number(ag.minSelection) : undefined,
        maxSelection: ag.maxSelection ? Number(ag.maxSelection) : undefined,
        options: ag.options.map(opt => ({
          ...opt,
          id: opt.id || `addon-choice-${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
          price: Number(opt.price)
        }))
      }))
    };

    if (editingItem) {
      // Update existing item
      setRestaurant(prev => prev ? ({
        ...prev,
        menu: prev.menu.map(item => item.id === editingItem.id ? submittedItem : item)
      }) : undefined);
      toast({ title: "פריט עודכן", description: `${submittedItem.name} עודכן.` });
    } else {
      // Add new item
      setRestaurant(prev => prev ? ({ ...prev, menu: [...prev.menu, submittedItem] }) : undefined);
      toast({ title: "פריט נוסף", description: `${submittedItem.name} נוסף לרשימה שלך.` });
    }
    setIsFormOpen(false);
    setShowNewCategoryInput(false);
    form.reset(); // Reset form after submission
  }

  if (!restaurant) {
    return <p>נתוני העסק לא נמצאו. אנא הגדר את פרטי העסק שלך.</p>;
  }
  
  const currentCategories = restaurant ? Array.from(new Set(restaurant.menu.map(item => item.category))) : [];


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CardHeader className="p-0">
            <CardTitle className="text-2xl font-headline">ניהול מוצרים/שירותים</CardTitle>
            <CardDescription>הוסף, ערוך וארגן את המוצרים או השירותים והקטגוריות שלך.</CardDescription>
        </CardHeader>
        <Button onClick={handleAddNewItem}>
          <PlusCircle className="mr-2 h-4 w-4" /> הוסף מוצר/שירות חדש
        </Button>
      </div>

      {/* Category Sections */}
      {currentCategories.length === 0 && restaurant.menu.length === 0 && (
         <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center gap-4">
              <PackageSearch className="h-16 w-16 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">אין עדיין מוצרים או שירותים.</p>
              <p>התחל על ידי הוספת המוצר או השירות הראשון שלך!</p>
              <Button onClick={handleAddNewItem} size="lg">
                <PlusCircle className="mr-2 h-5 w-5" /> הוסף מוצר/שירות ראשון
              </Button>
            </CardContent>
          </Card>
      )}

      {currentCategories.map(category => (
        <section key={category}>
          <h2 className="text-xl font-semibold mb-3 sticky top-0 bg-muted/80 backdrop-blur-sm py-2 px-3 rounded-md z-10 -mx-3">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {restaurant.menu.filter(item => item.category === category).map(item => (
              <Card key={item.id} className="flex flex-col overflow-hidden">
                <div className="relative h-40 w-full">
                  <Image
                    src={item.imageUrl || 'https://placehold.co/600x400.png?text=No+Image'}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={item.dataAiHint || "product service item"}
                    className={!(item.isAvailable === undefined ? true : item.isAvailable) ? 'opacity-50 grayscale' : ''}
                  />
                  {!(item.isAvailable === undefined ? true : item.isAvailable) && (
                    <Badge variant="destructive" className="absolute top-2 right-2">לא זמין</Badge>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md truncate">{item.name}</CardTitle>
                  <CardDescription className="text-xs h-8 overflow-hidden text-ellipsis">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow py-0">
                  <p className="text-lg font-semibold text-primary">₪{item.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-2 grid grid-cols-2 gap-2 border-t mt-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}><Edit3 className="mr-1 h-3 w-3"/> ערוך</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDuplicateItem(item)}><Copy className="mr-1 h-3 w-3"/> שכפל</Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive col-span-1" onClick={() => handleDeleteItem(item.id)}><Trash2 className="mr-1 h-3 w-3"/> מחק</Button>
                     <div className="flex items-center justify-end space-x-2 col-span-1">
                        <Switch
                            id={`available-${item.id}`}
                            checked={item.isAvailable === undefined ? true : item.isAvailable}
                            onCheckedChange={() => toggleItemAvailability(item.id)}
                            aria-label={`שנה זמינות עבור ${item.name}`}
                        />
                        <Label htmlFor={`available-${item.id}`} className="text-xs">זמין</Label>
                    </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      ))}

      {/* Fallback for items without category */}
       {restaurant.menu.filter(item => !item.category || item.category.trim() === "").length > 0 && (
         <section>
          <h2 className="text-xl font-semibold mb-3 sticky top-0 bg-muted/80 backdrop-blur-sm py-2 px-3 rounded-md z-10 -mx-3 text-orange-600">פריטים ללא קטגוריה</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {restaurant.menu.filter(item => !item.category || item.category.trim() === "").map(item => (
              <Card key={item.id} className="flex flex-col overflow-hidden border-orange-500">
                 <div className="relative h-40 w-full">
                  <Image
                    src={item.imageUrl || 'https://placehold.co/600x400.png?text=No+Image'}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={item.dataAiHint || "product service item"}
                    className={!(item.isAvailable === undefined ? true : item.isAvailable) ? 'opacity-50 grayscale' : ''}
                  />
                   {!(item.isAvailable === undefined ? true : item.isAvailable) && (
                    <Badge variant="destructive" className="absolute top-2 right-2">לא זמין</Badge>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md truncate">{item.name}</CardTitle>
                  <CardDescription className="text-xs h-8 overflow-hidden text-ellipsis">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow py-0">
                  <p className="text-lg font-semibold text-primary">₪{item.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-2 grid grid-cols-2 gap-2 border-t mt-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}><Edit3 className="mr-1 h-3 w-3"/> ערוך</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDuplicateItem(item)}><Copy className="mr-1 h-3 w-3"/> שכפל</Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive col-span-1" onClick={() => handleDeleteItem(item.id)}><Trash2 className="mr-1 h-3 w-3"/> מחק</Button>
                     <div className="flex items-center justify-end space-x-2 col-span-1">
                        <Switch
                            id={`available-${item.id}`}
                            checked={item.isAvailable === undefined ? true : item.isAvailable}
                            onCheckedChange={() => toggleItemAvailability(item.id)}
                             aria-label={`שנה זמינות עבור ${item.name}`}
                        />
                        <Label htmlFor={`available-${item.id}`} className="text-xs">זמין</Label>
                    </div>
                </CardFooter>
              </Card>
            ))}
          </div>
         </section>
       )}


      {/* Add/Edit Item Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setShowNewCategoryInput(false); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'ערוך מוצר/שירות' : 'הוסף מוצר/שירות חדש'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'עדכן את פרטי המוצר/שירות הזה.' : 'מלא את הפרטים עבור המוצר/שירות החדש.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto flex-grow pr-2">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>שם המוצר/שירות</FormLabel><FormControl><Input {...field} placeholder="לדוגמה: חולצת טי-שירט, ייעוץ עסקי" /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>תיאור קצר</FormLabel><FormControl><Textarea {...field} placeholder="לדוגמה: 100% כותנה, שעת ייעוץ אסטרטגי" /></FormControl><FormMessage /></FormItem>
              )}/>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>מחיר (₪)</FormLabel><FormControl><Input type="number" step="0.01" {...field} placeholder="לדוגמה: 99.90" /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>קטגוריה</FormLabel>
                    <Select
                        onValueChange={(value) => {
                            field.onChange(value);
                            setShowNewCategoryInput(value === 'NEW_CATEGORY_INPUT');
                        }}
                        defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="בחר קטגוריה" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currentCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        <SelectItem value="NEW_CATEGORY_INPUT">צור קטגוריה חדשה...</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>
              </div>
              {showNewCategoryInput && (
                <FormField
                  control={form.control}
                  name="newCategoryName"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>שם קטגוריה חדשה</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="הזן שם קטגוריה חדשה" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>כתובת URL של תמונה</FormLabel><FormControl><Input {...field} placeholder="https://example.com/image.jpg" /></FormControl>
                <FormDescription>כתובת URL של תמונת המוצר/שירות. השתמש בשירותים כמו Placehold.co לתמונות זמניות.</FormDescription><FormMessage /></FormItem>
              )}/>
               <FormField control={form.control} name="dataAiHint" render={({ field }) => (
                <FormItem><FormLabel>רמז AI לתמונה (אופציונלי)</FormLabel><FormControl><Input {...field} placeholder="לדוגמה: חולצה כחולה, טלפון נייד" /></FormControl>
                <FormDescription>מילת מפתח או שתיים לחיפוש תמונות AI אם זו תמונת Placeholder.</FormDescription><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="isAvailable" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5"><FormLabel>זמין להזמנה</FormLabel>
                    <FormDescription>האם מוצר/שירות זה זמין כעת ללקוחות?</FormDescription></div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )}/>

              {/* Addon Groups */}
              <Card>
                <CardHeader className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-md">אפשרויות נוספות / תוספות</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => appendAddonGroup({ title: '', type: 'checkbox', minSelection:0, maxSelection: undefined, options: [{ name: '', price: 0, selectedByDefault: false }], required: false })}>
                            <PlusCircle className="mr-2 h-4 w-4"/> הוסף קבוצה
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3 max-h-60 overflow-y-auto">
                    {addonGroups.map((groupField, groupIndex) => (
                        <Card key={groupField.id} className="p-3 bg-muted/50">
                            <div className="flex justify-between items-center mb-2">
                                <FormField control={form.control} name={`addons.${groupIndex}.title`} render={({ field }) => (
                                    <FormItem className="flex-grow mr-2"><FormLabel className="text-xs">כותרת קבוצה</FormLabel><FormControl><Input {...field} placeholder="לדוגמה: מידות, צבעים" className="h-8"/></FormControl><FormMessage className="text-xs"/></FormItem>
                                )}/>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeAddonGroup(groupIndex)} className="text-destructive h-8 w-8"><Trash2 className="h-4 w-4"/></Button>
                            </div>
                             <div className="grid grid-cols-2 gap-2 mb-2">
                                 <FormField control={form.control} name={`addons.${groupIndex}.type`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-xs">סוג בחירה</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger className="h-8"><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                          <SelectItem value="checkbox">בחירה מרובה (Checkbox)</SelectItem>
                                          <SelectItem value="radio">בחירה יחידה (Radio)</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    <FormMessage className="text-xs"/></FormItem>
                                )}/>
                                 <FormField control={form.control} name={`addons.${groupIndex}.required`} render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 pt-5"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl><FormLabel className="text-xs !mt-0">קבוצת חובה</FormLabel><FormMessage className="text-xs"/></FormItem>
                                )}/>
                             </div>
                             <div className="grid grid-cols-2 gap-2 mb-2">
                                 <FormField control={form.control} name={`addons.${groupIndex}.minSelection`} render={({ field }) => (
                                     <FormItem><FormLabel className="text-xs">מינימום בחירות (אופציונלי)</FormLabel><FormControl><Input type="number" {...field} placeholder="לדוגמה: 1" className="h-8"/></FormControl><FormMessage className="text-xs"/></FormItem>
                                 )}/>
                                  <FormField control={form.control} name={`addons.${groupIndex}.maxSelection`} render={({ field }) => (
                                     <FormItem><FormLabel className="text-xs">מקסימום בחירות (אופציונלי)</FormLabel><FormControl><Input type="number" {...field} placeholder="לדוגמה: 3" className="h-8"/></FormControl><FormMessage className="text-xs"/></FormItem>
                                 )}/>
                             </div>

                            <p className="text-xs font-medium mb-1">אפשרויות:</p>
                            <AddonOptionsArray groupIndex={groupIndex} control={form.control} />
                        </Card>
                    ))}
                     {addonGroups.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">לא הוגדרו קבוצות תוספות.</p>}
                </CardContent>
              </Card>

            </form>
          </Form>
          <DialogFooter className="pt-4 border-t">
            <DialogClose asChild><Button type="button" variant="outline">ביטול</Button></DialogClose>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "שומר..." : (editingItem ? 'שמור שינויים' : 'הוסף פריט')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


function AddonOptionsArray({ groupIndex, control }: { groupIndex: number, control: any }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `addons.${groupIndex}.options`
  });

  return (
    <div className="space-y-2">
      {fields.map((optionField, optionIndex) => (
        <div key={optionField.id} className="flex items-end gap-2 p-2 border rounded bg-background/70">
          <FormField control={control} name={`addons.${groupIndex}.options.${optionIndex}.name`} render={({ field }) => (
            <FormItem className="flex-grow"><FormLabel className="text-xs">שם אפשרות</FormLabel><FormControl><Input {...field} placeholder="לדוגמה: גבינה נוספת" className="h-8"/></FormControl><FormMessage className="text-xs"/></FormItem>
          )}/>
          <FormField control={control} name={`addons.${groupIndex}.options.${optionIndex}.price`} render={({ field }) => (
            <FormItem className="w-24"><FormLabel className="text-xs">מחיר (₪)</FormLabel><FormControl><Input type="number" step="0.01" {...field} placeholder="0.00" className="h-8"/></FormControl><FormMessage className="text-xs"/></FormItem>
          )}/>
          <FormField control={control} name={`addons.${groupIndex}.options.${optionIndex}.selectedByDefault`} render={({ field }) => (
            <FormItem className="flex flex-col items-center pt-5"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="h-4 w-7 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0"/></FormControl><FormLabel className="text-xs whitespace-nowrap">ברירת מחדל</FormLabel><FormMessage className="text-xs"/></FormItem>
          )}/>
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(optionIndex)} className="text-destructive h-8 w-8 self-end"><Trash2 className="h-3 w-3"/></Button>
        </div>
      ))}
      <Button type="button" variant="link" size="sm" onClick={() => append({ name: '', price: 0, selectedByDefault: false })} className="text-xs p-0 h-auto">
        <PlusCircle className="mr-1 h-3 w-3"/> הוסף אפשרות
      </Button>
    </div>
  );
}
