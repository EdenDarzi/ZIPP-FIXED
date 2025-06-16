
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, Navigation, MessageSquare, PhoneCall, Clock, AlertCircle, Filter, CheckCircle, Edit, Search } from 'lucide-react'; // Added Search
import type { Order, OrderStatus } from '@/types'; 
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';


const mockActiveOrders: Partial<Order>[] = [
  { id: 'active123', restaurantName: 'פיצה האט', deliveryAddress: 'רחוב הרצל 1, תל אביב', status: 'OUT_FOR_DELIVERY', estimatedDeliveryTime: '10-15 דק\'' , items: [{menuItemId: 'p1', name: 'פיצה פפרוני', quantity: 1, price: 50}], customerNotes: "נא לצלצל בפעמון חזק, לא שומעים טוב." },
  { id: 'active456', restaurantName: 'בורגר קינג', deliveryAddress: 'שדרות רוטשילד 22, חיפה', status: 'AWAITING_PICKUP', estimatedDeliveryTime: '~5 דק\' לאיסוף', items: [{menuItemId: 'b1', name: 'וופר כפול', quantity:1, price:45}] },
  { id: 'active789', restaurantName: 'סושי בר המקומי', deliveryAddress: 'סמטת הפרחים 5, ירושלים', status: 'PREPARING_AT_RESTAURANT', estimatedDeliveryTime: 'מוכן בעוד ~12 דק\'', items: [{menuItemId: 's1', name: 'קומבינציית סלמון', quantity:1, price:70}], customerNotes: "בלי וואסבי בבקשה." },
];


const getStatusText = (status: OrderStatus | undefined): string => {
    if (!status) return 'לא ידוע';
    const map: Record<OrderStatus, string> = {
        PENDING_PAYMENT: 'ממתין לתשלום',
        SCHEDULED: 'מתוכנן',
        MATCHING_COURIER: 'מחפש שליח',
        COURIER_ASSIGNED: 'שליח שובץ',
        PREPARING_AT_RESTAURANT: 'בהכנה במסעדה',
        AWAITING_PICKUP: 'ממתין לאיסוף',
        OUT_FOR_DELIVERY: 'בדרך ללקוח',
        DELIVERED: 'נמסר',
        CANCELLED: 'בוטל'
    };
    return map[status] || status.replace(/_/g, ' ').toLowerCase();
}

const getStatusBadgeVariant = (status: OrderStatus | undefined): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return 'outline';
    switch (status) {
        case 'PREPARING_AT_RESTAURANT': return 'default'; 
        case 'AWAITING_PICKUP': return 'secondary'; 
        case 'OUT_FOR_DELIVERY': return 'default'; 
        case 'DELIVERED': return 'default'; 
        case 'CANCELLED': return 'destructive';
        default: return 'outline';
    }
};


export default function ActiveOrdersPage() {
  const [orders, setOrders] = useState<Partial<Order>[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setOrders(mockActiveOrders);
  }, []);
  
  const filteredOrders = orders.filter(order => 
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.restaurantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.deliveryAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigate = (address: string | undefined) => {
    if (!address) {
        toast({ title: "כתובת לא זמינה", variant: "destructive"});
        return;
    }
    toast({ title: "ניווט (דמו)", description: `פותח אפליקציית ניווט לכתובת: ${address}` });
  };

  const handleChat = (orderId: string | undefined, entity: 'customer' | 'support') => {
    if(!orderId) return;
    toast({ title: `צ'אט עם ${entity === 'customer' ? 'לקוח' : 'מוקד'} (דמו)`, description: `מתחיל צ'אט עבור הזמנה ${orderId}` });
  };
  
  const handleUpdateStatus = (orderId: string | undefined, newStatus: OrderStatus) => {
    if(!orderId) return;
    setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? {...o, status: newStatus, estimatedDeliveryTime: newStatus === 'DELIVERED' ? 'נמסר' : o.estimatedDeliveryTime } : o));
    toast({ title: "סטטוס עודכן (דמו)", description: `סטטוס הזמנה ${orderId} עודכן ל: ${getStatusText(newStatus)}`});
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">ניהול הזמנות פעילות</CardTitle>
          <CardDescription>צפה ועקוב אחר המשלוחים הנוכחיים שלך, עדכן סטטוסים ותקשר עם לקוחות או התמיכה.</CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 bg-muted/30 rounded-lg">
        <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="חפש לפי מזהה, מסעדה, כתובת..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background pl-10"
                aria-label="חיפוש הזמנות פעילות"
            />
        </div>
        <Button variant="outline" disabled className="w-full sm:w-auto bg-background">
            <Filter className="mr-2 h-4 w-4"/> פילטרים (בקרוב)
        </Button>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="text-center py-10">
             <CardContent>
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">
                    {searchTerm ? "לא נמצאו הזמנות פעילות התואמות לחיפוש שלך." : "אין כרגע הזמנות פעילות."}
                </p>
             </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
            {filteredOrders.map((order) => (
            <Card key={order.id} className="shadow-md">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <CardTitle className="text-lg text-primary">הזמנה #{order.id?.substring(order.id.length-5)} מ{order.restaurantName}</CardTitle>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs">
                            {getStatusText(order.status)}
                        </Badge>
                    </div>
                    <CardDescription className="text-sm">אל: {order.deliveryAddress}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p><span className="font-medium">פריטים:</span> {order.items?.map(i => `${i.name} (x${i.quantity})`).join(', ') || 'לא זמין'}</p>
                    <p className="flex items-center"><Clock className="h-4 w-4 mr-1 text-accent"/> <span className="font-medium">זמן הגעה/סטטוס משוער:</span> {order.estimatedDeliveryTime || 'לא זמין'}</p>
                    {order.customerNotes && (
                        <p className="flex items-start text-xs text-muted-foreground bg-blue-50 p-2 rounded-md border border-blue-200">
                            <Edit className="h-3 w-3 mr-1.5 mt-0.5 text-blue-600 flex-shrink-0"/>
                            <span className="font-medium mr-1">הערות לקוח:</span> {order.customerNotes}
                        </p>
                    )}
                </CardContent>
                <CardFooter className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t pt-3">
                    <Button variant="default" size="sm" onClick={() => handleNavigate(order.deliveryAddress)} className="bg-blue-600 hover:bg-blue-700">
                        <Navigation className="mr-1 h-4 w-4"/> נווט
                    </Button>
                     <Button variant="outline" size="sm" onClick={() => handleChat(order.id, 'customer')}>
                        <MessageSquare className="mr-1 h-4 w-4"/> צ'אט עם לקוח
                    </Button>
                     <Button variant="outline" size="sm" onClick={() => handleChat(order.id, 'support')}>
                        <AlertCircle className="mr-1 h-4 w-4"/> צ'אט עם מוקד
                    </Button>
                    {order.status === 'AWAITING_PICKUP' && 
                        <Button variant="secondary" size="sm" onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}>סמן כ"נאסף"</Button>}
                    {order.status === 'OUT_FOR_DELIVERY' && 
                        <Button variant="secondary" size="sm" onClick={() => handleUpdateStatus(order.id, 'DELIVERED')} className="bg-green-500 hover:bg-green-600 text-white">
                            <CheckCircle className="mr-1 h-4 w-4"/> סמן כ"נמסר"
                        </Button>}
                </CardFooter>
            </Card>
            ))}
        </div>
      )}
    </div>
  );
}
