
'use client';

import { useState, useEffect } from 'react';
import { mockSecondHandItems, secondHandCategories } from '@/lib/mock-data';
import type { SecondHandItem, SecondHandItemCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PlusCircle, Search, Filter, Store, PackageSearch, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import SecondHandItemCard from '@/components/marketplace/second-hand-item-card';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export default function MarketplacePage() {
  const [items, setItems] = useState<SecondHandItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<SecondHandItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SecondHandItemCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState('newest');
  const { toast } = useToast();

  useEffect(() => {
    setItems(mockSecondHandItems.filter(item => !item.isSold));
  }, []);

  useEffect(() => {
    let tempItems = [...items];

    if (categoryFilter !== 'all') {
      tempItems = tempItems.filter(item => item.category === categoryFilter);
    }

    if (searchTerm) {
      tempItems = tempItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === 'price-asc') {
      tempItems.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      tempItems.sort((a, b) => b.price - a.price);
    } else { 
      tempItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    setFilteredItems(tempItems);
  }, [items, searchTerm, categoryFilter, sortBy]);

  const handleMoreFilters = () => {
    toast({
      title: "פילטרים נוספים",
      description: "אפשרויות סינון מתקדמות כגון טווח מחירים, דירוג מוכר ועוד יתווספו. (הדגמה)"
    });
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg premium-card-hover">
        <CardHeader className="text-center items-center">
            <Store className="h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-3xl font-headline text-primary">SwiftServe יד 2 - לוח קהילתי</CardTitle> {/* Updated name */}
            <CardDescription>
                קנה ומכור פריטי יד שנייה בתוך קהילת SwiftServe. מצא מציאות או פנה מקום בבית! {/* Updated name */}
            </CardDescription>
            <Button asChild className="mt-4 btn-gradient-hover-accent">
                <Link href="/marketplace/publish">
                <PlusCircle className="mr-2 h-4 w-4" /> פרסם מוצר חדש
                </Link>
            </Button>
        </CardHeader>
      </Card>

      <Card className="p-4 bg-muted/30">
        <CardHeader className="p-0 pb-3">
            <CardTitle className="text-lg flex items-center"><Filter className="mr-2 h-5 w-5"/> סינון וחיפוש מודעות</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <div className="space-y-1">
                    <Label htmlFor="searchTerm" className="text-xs font-medium text-muted-foreground">חיפוש חופשי</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        id="searchTerm"
                        type="search"
                        placeholder="חפש לפי כותרת, תיאור, מיקום..."
                        className="pl-10 bg-background shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="categoryFilter" className="text-xs font-medium text-muted-foreground">קטגוריה</Label>
                    <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as SecondHandItemCategory | 'all')}>
                        <SelectTrigger id="categoryFilter" className="w-full bg-background shadow-sm">
                            <SelectValue placeholder="כל הקטגוריות" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">כל הקטגוריות</SelectItem>
                            {secondHandCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="sortBy" className="text-xs font-medium text-muted-foreground">מיין לפי</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger id="sortBy" className="w-full bg-background shadow-sm">
                            <SelectValue placeholder="מיון..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">החדש ביותר</SelectItem>
                            <SelectItem value="price-asc">מחיר: מהנמוך לגבוה</SelectItem>
                            <SelectItem value="price-desc">מחיר: מהגבוה לנמוך</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <Button variant="outline" className="w-full sm:w-auto bg-background shadow-sm" onClick={handleMoreFilters}>
                    <SlidersHorizontal className="mr-2 h-4 w-4" /> עוד פילטרים
                </Button>
            </div>
        </CardContent>
      </Card>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"> {/* Increased gap */}
          {filteredItems.map((item) => (
            <SecondHandItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 premium-card-hover">
            <CardContent className="flex flex-col items-center gap-4">
                <PackageSearch className="h-16 w-16 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">לא נמצאו מוצרים התואמים לחיפוש שלך.</p>
                <p className="text-sm">נסה לשנות את מונחי החיפוש או הפילטרים.</p>
            </CardContent>
        </Card>
      )}
      {items.length > 12 && (
         <div className="text-center mt-8">
            <Button variant="outline" onClick={() => toast({description: "טעינת מוצרים נוספים (הדגמה)."})}>טען עוד</Button>
        </div>
      )}
    </div>
  );
}
