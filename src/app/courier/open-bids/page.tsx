
'use client';

import { mockOpenOrdersForBidding, getRestaurantById } from '@/lib/mock-data';
import type { OrderDetailsForBidding, DeliveryVehicle } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Clock, Package, DollarSign, ArrowRight, AlertTriangle, Bike, Car, Footprints, Info, ListFilter, SlidersHorizontal, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';


const VehicleIcon = ({ type }: { type: DeliveryVehicle | undefined }) => {
  if (type === 'motorcycle') return <Bike className="inline h-4 w-4" title="אופנוע" />;
  if (type === 'scooter') return <Bike className="inline h-4 w-4" title="קטנוע" />; 
  if (type === 'car') return <Car className="inline h-4 w-4" title="רכב" />;
  if (type === 'bicycle') return <Bike className="inline h-4 w-4" title="אופניים" />;
  if (type === 'foot') return <Footprints className="inline h-4 w-4" title="הולך רגל" />;
  return null;
};

export default function OpenBidsPage() {
  const [openOrders, setOpenOrders] = useState<OrderDetailsForBidding[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDetailsForBidding[]>([]);
  const [sortBy, setSortBy] = useState('reward'); 
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setOpenOrders(mockOpenOrdersForBidding);
  }, []);

  useEffect(() => {
    let tempOrders = [...openOrders];

    // Search filter
    if (searchTerm) {
      tempOrders = tempOrders.filter(order =>
        order.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.itemsDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'reward') {
      tempOrders.sort((a, b) => b.baseCommission - a.baseCommission);
    } else if (sortBy === 'distance') {
      tempOrders.sort((a, b) => (a.estimatedRouteDistanceKm || a.estimatedDistanceKm) - (b.estimatedRouteDistanceKm || b.estimatedDistanceKm));
    }
    // Add time sort logic if available in data

    setFilteredOrders(tempOrders);
  }, [openOrders, searchTerm, sortBy]);
  
  const handleMoreFilters = () => {
    toast({
      title: "פילטרים נוספים",
      description: "אפשרויות סינון מתקדמות כמו סוג רכב נדרש, מרחק מקסימלי וכו' יתווספו. (הדגמה)"
    });
  };


  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold font-headline text-primary">הצעות משלוח פתוחות</h1>
        <p className="text-lg text-muted-foreground">
          מצא והגש הצעות להזדמנויות משלוח זמינות. הזדמנויות חדשות מופיעות בזמן אמת.
        </p>
      </header>

      <Card className="p-4 bg-muted/30">
        <CardHeader className="p-0 pb-3">
            <CardTitle className="text-lg flex items-center"><ListFilter className="mr-2 h-5 w-5"/> סינון וחיפוש הצעות</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <div className="space-y-1">
                    <Label htmlFor="searchTermBids" className="text-xs font-medium text-muted-foreground">חיפוש חופשי</Label>
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="searchTermBids"
                            type="search"
                            placeholder="חפש מסעדה, כתובת, פריטים..."
                            className="pl-10 bg-background shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="sortBy" className="text-xs font-medium text-muted-foreground">מיין לפי</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger id="sortBy" className="w-full bg-background shadow-sm">
                            <SelectValue placeholder="בחר מיון..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="reward">תגמול (גבוה לנמוך)</SelectItem>
                            <SelectItem value="distance">מרחק (קצר לארוך)</SelectItem>
                            <SelectItem value="time" disabled>זמן (בקרוב)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                     <Label htmlFor="filterDistance" className="text-xs font-medium text-muted-foreground">מרחק מקסימלי (ק"מ)</Label>
                    <Input type="number" id="filterDistance" placeholder="לדוגמה: 5" className="bg-background shadow-sm" disabled />
                </div>
                 <Button variant="outline" className="w-full sm:w-auto bg-background shadow-sm" onClick={handleMoreFilters}>
                    <SlidersHorizontal className="mr-2 h-4 w-4" /> עוד פילטרים
                </Button>
            </div>
        </CardContent>
      </Card>


      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const restaurant = getRestaurantById(order.restaurantName === 'פיצה פאלאס' ? 'restaurant1' : order.restaurantName === 'בורגר בוננזה' ? 'restaurant2' : 'restaurant3'); 
            return (
            <Card key={order.orderId} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-headline text-primary truncate">הזמנה מ{order.restaurantName}</CardTitle>
                    <Badge variant="secondary">~{order.estimatedRouteDistanceKm || order.estimatedDistanceKm} ק"מ</Badge>
                </div>
                <CardDescription>משלוח אל: {order.deliveryAddress}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-grow">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Package className="h-4 w-4 mr-2 text-accent flex-shrink-0" />
                  <span className="truncate">{order.itemsDescription}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
                  <span>עמלה בסיסית: ₪{order.baseCommission.toFixed(2)} (ערך: ~₪{order.orderValue?.toFixed(2)})</span>
                </div>
                 <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-accent flex-shrink-0" />
                  <span>איסוף: {order.expectedPickupTime}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-accent flex-shrink-0" />
                  <span className="truncate">מסעדה: {restaurant?.location || 'לא זמין'}</span>
                </div>
                {order.requiredVehicleType && order.requiredVehicleType.length > 0 && (
                    <div className="flex items-center text-xs text-muted-foreground">
                        <AlertTriangle className="h-3 w-3 mr-1 text-yellow-600 flex-shrink-0" />
                        <span>רכב נדרש: {order.requiredVehicleType.map(v => <VehicleIcon key={v} type={v as DeliveryVehicle} />).reduce((prev, curr, idx) => <>{prev}{idx > 0 ? ', ' : ''}{curr}</>, <></>)}</span>
                    </div>
                )}
                {order.customerNotes && (
                  <div className="flex items-start text-xs text-muted-foreground p-1.5 bg-blue-50 border border-blue-100 rounded">
                    <Info className="h-3 w-3 mr-1.5 mt-0.5 text-blue-500 flex-shrink-0" />
                    <span className="italic truncate">הערה: {order.customerNotes}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href={`/courier/bids/${order.orderId}`}>
                    צפה והגש הצעה <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h2 className="text-2xl font-bold text-primary mb-4">
            {searchTerm ? "לא נמצאו הצעות התואמות לחיפוש שלך." : "אין כרגע הצעות פתוחות"}
          </h2>
          <p className="text-muted-foreground">
            {searchTerm ? "נסה לשנות את מונחי החיפוש או הפילטרים." : "אנא בדוק/י שוב בקרוב להזדמנויות משלוח חדשות."}
          </p>
        </div>
      )}
      <p className="text-center text-sm text-muted-foreground mt-8">
        הערה: באפליקציה אמיתית, דף זה יתעדכן בזמן אמת עם הזמנות חדשות.
      </p>
    </div>
  );
}
