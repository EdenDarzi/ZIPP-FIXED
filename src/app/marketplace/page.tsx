'use client';

import { useState, useEffect } from 'react';
import { secondHandCategories } from '@/lib/mock-data';
import type { SecondHandItemCategory } from '@/types';
import type { MarketplaceItem, MarketplaceApiResponse } from '@/types/marketplace';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PlusCircle, Search, Filter, Store, PackageSearch, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import SecondHandItemCard from '@/components/marketplace/second-hand-item-card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { Label } from '@/components/ui/label';

export default function MarketplacePage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SecondHandItemCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/marketplace/products');
      const data: MarketplaceApiResponse = await response.json();
      
      if (response.ok) {
        setItems(data.products);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'שגיאה',
        description: 'שגיאה בטעינת המוצרים',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
      title: t('marketplace.moreFilters.toast.title'),
      description: t('marketplace.moreFilters.toast.description')
    });
  };

  return (
    <div className="space-y-8">
      <Card className="group relative overflow-hidden rounded-xl !bg-white/40 dark:!bg-gray-950/80 bg-clip-padding backdrop-blur-xl backdrop-saturate-150 !border !border-white/20 dark:!border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        <CardHeader className="text-center items-center relative z-10">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-30"></div>
              <Store className="relative h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-primary dark:to-accent">{t('marketplace.title')}</CardTitle>
            <CardDescription className="text-gray-700/80 dark:text-gray-300/80">{t('marketplace.subtitle')}</CardDescription>
            <Button asChild className="mt-4 bg-gradient-to-r from-accent to-orange-400 hover:from-accent/90 hover:to-orange-500 text-white shadow-lg">
                <Link href="/marketplace/publish">
                <PlusCircle className="mr-2 h-4 w-4" /> {t('marketplace.publishNew')}
                </Link>
            </Button>
        </CardHeader>
      </Card>

      <Card className="group relative overflow-hidden rounded-xl !bg-white/40 dark:!bg-gray-950/80 bg-clip-padding backdrop-blur-xl backdrop-saturate-150 !border !border-white/20 dark:!border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.12)]">
        <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center"><Filter className="mr-2 h-5 w-5"/> {t('marketplace.filtersTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <div className="space-y-1">
                    <Label htmlFor="searchTerm" className="text-xs font-medium text-muted-foreground">{t('marketplace.search.label')}</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        id="searchTerm"
                        type="search"
                        placeholder={t('marketplace.search.placeholder')}
                         className="pl-10 bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-white/10 shadow-sm rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="categoryFilter" className="text-xs font-medium text-muted-foreground">{t('marketplace.category.label')}</Label>
                    <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as SecondHandItemCategory | 'all')}>
                        <SelectTrigger id="categoryFilter" className="w-full bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-white/10 shadow-sm rounded-xl">
                            <SelectValue placeholder={t('marketplace.category.all')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('marketplace.category.all')}</SelectItem>
                            {secondHandCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="sortBy" className="text-xs font-medium text-muted-foreground">{t('marketplace.sort.label')}</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger id="sortBy" className="w-full bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-white/10 shadow-sm rounded-xl">
                            <SelectValue placeholder={t('marketplace.sort.placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">{t('marketplace.sort.newest')}</SelectItem>
                            <SelectItem value="price-asc">{t('marketplace.sort.priceAsc')}</SelectItem>
                            <SelectItem value="price-desc">{t('marketplace.sort.priceDesc')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <Button variant="outline" className="w-full sm:w-auto bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-white/10 shadow-sm rounded-xl hover:ring-1 hover:ring-primary/40" onClick={handleMoreFilters}>
                    <SlidersHorizontal className="mr-2 h-4 w-4" /> {t('marketplace.moreFilters')}
                </Button>
            </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card className="text-center py-12 premium-card-hover">
            <CardContent className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                <p className="text-xl text-muted-foreground">טוען מוצרים...</p>
            </CardContent>
        </Card>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"> {/* Increased gap */}
          {filteredItems.map((item) => (
            <SecondHandItemCard key={item.id} item={item as any} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 premium-card-hover">
            <CardContent className="flex flex-col items-center gap-4">
                <PackageSearch className="h-16 w-16 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">{t('marketplace.noResults.title')}</p>
                <p className="text-sm">{t('marketplace.noResults.suggestion')}</p>
            </CardContent>
        </Card>
      )}
      {items.length > 12 && (
         <div className="text-center mt-8">
            <Button variant="outline" onClick={() => toast({description: t('marketplace.loadMore.toast')})}>{t('marketplace.loadMore')}</Button>
        </div>
      )}
    </div>
  );
}
