
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Printer, MessageSquare, CheckCircle, Package, Clock, AlertCircle, Search, Filter, CalendarClock, Edit } from 'lucide-react'; // Added CalendarClock, Edit
import type { Order, OrderStatus } from '@/types'; 
import { Input } from '@/components/ui/input';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { mockLiveOrdersForAdmin, mockOrderHistoryForAdmin } from '@/lib/mock-data'; // Using specific mock data

const getStatusBadgeVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'SCHEDULED': return 'outline';
        case 'PREPARING_AT_RESTAURANT': return 'default'; 
        case 'AWAITING_PICKUP': return 'secondary'; 
        case 'OUT_FOR_DELIVERY': return 'default'; 
        case 'DELIVERED': return 'default'; 
        case 'CANCELLED': return 'destructive';
        case 'MATCHING_COURIER': return 'outline';
        default: return 'outline';
    }
};

const getStatusText = (status: OrderStatus): string => {
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


export default function OrderManagementPage() {
  const [liveOrders, setLiveOrders] = useState<Order[]>(mockLiveOrdersForAdmin);
  const [orderHistory, setOrderHistory] = useState<Order[]>(mockOrderHistoryForAdmin);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Mock function to update order status
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setLiveOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString(), orderTimeline: [...(order.orderTimeline || []), {status: newStatus, timestamp: new Date().toISOString(), notes: `סטטוס עודכן ל: ${getStatusText(newStatus)}`}] } : order
      )
    );
    
    if (newStatus === 'DELIVERED' || newStatus === 'CANCELLED') {
        const orderToMove = liveOrders.find(o => o.id === orderId);
        if(orderToMove) {
            setOrderHistory(prevHistory => [ {...orderToMove, status: newStatus, actualDeliveryTime: newStatus === 'DELIVERED' ? new Date().toISOString() : undefined }, ...prevHistory]);
            setLiveOrders(prevLive => prevLive.filter(o => o.id !== orderId));
        }
    }
  };

  const handlePrintReceipt = (orderId: string) => {
    alert(`מדפיס קבלה להזמנה ${orderId} (דמו). נדרשת אינטגרציה עם PDF/ESC-POS.`);
  };

  const handleChat = (orderId: string, entity: 'courier' | 'customer') => {
     alert(`פותח צ'אט להזמנה ${orderId} עם ${entity === 'courier' ? 'השליח' : 'הלקוח'} (דמו). נדרשת אינטגרציה עם Socket.IO.`);
  }

  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange);
    console.log("Selected date range:", newRange);
    // In a real app, you would refetch or filter orderHistory based on newRange
    // For now, we'll manually filter the mockOrderHistory if a date range is selected
    if (newRange?.from && newRange?.to) {
        setOrderHistory(
            mockOrderHistoryForAdmin.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= newRange.from! && orderDate <= newRange.to!;
            })
        );
    } else if (!newRange?.from && !newRange?.to) { // Handle clearing the filter
        setOrderHistory(mockOrderHistoryForAdmin);
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">ניהול הזמנות</CardTitle>
          <CardDescription>צפה בהזמנות חיות, עדכן סטטוסים וגש להיסטוריית הזמנות.</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="live">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <TabsList>
                <TabsTrigger value="live">הזמנות חיות ({liveOrders.length})</TabsTrigger>
                <TabsTrigger value="history">היסטוריית הזמנות</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input placeholder="חפש הזמנות..." className="max-w-xs" disabled/>
                <Button variant="outline" disabled><Filter className="mr-2 h-4 w-4"/> פילטרים (בקרוב)</Button>
            </div>
        </div>

        <TabsContent value="live">
          <Card>
            <CardHeader>
              <CardTitle>הזמנות חיות נוכחיות</CardTitle>
              <CardDescription>עקוב ונהל הזמנות כשהן נכנסות.</CardDescription>
            </CardHeader>
            <CardContent>
              {liveOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">אין הזמנות חיות כרגע.</p>
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>מזהה הזמנה</TableHead>
                    <TableHead>פריטים</TableHead>
                    <TableHead>הערות לקוח</TableHead>
                    <TableHead>סטטוס</TableHead>
                    <TableHead>זמן/מתוכנן</TableHead>
                    <TableHead className="text-right">סך הכל</TableHead>
                    <TableHead>פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id.substring(order.id.length - 6)}</TableCell>
                      <TableCell>{order.items.map(i => `${i.name} (x${i.quantity})`).join(', ').substring(0,30)}...</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {order.customerNotes ? (
                            <span title={order.customerNotes} className="cursor-help truncate block max-w-[100px]">{order.customerNotes}</span>
                        ) : (
                            '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                          {getStatusText(order.status)}
                          {order.status === 'SCHEDULED' && <CalendarClock className="inline h-3 w-3 ml-1" />}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.scheduledDeliveryTime || order.estimatedDeliveryTime || new Date(order.createdAt).toLocaleTimeString('he-IL', {hour: '2-digit', minute: '2-digit'})}</TableCell>
                      <TableCell className="text-right">₪{order.finalAmount.toFixed(2)}</TableCell>
                      <TableCell className="space-x-1 rtl:space-x-reverse">
                        {order.status === 'SCHEDULED' && (
                             <Button variant="outline" size="sm" onClick={() => updateOrderStatus(order.id, 'PREPARING_AT_RESTAURANT')}>
                                <CheckCircle className="mr-1 h-3 w-3"/> התחל הכנה
                             </Button>
                        )}
                        {order.status === 'PREPARING_AT_RESTAURANT' && (
                          <Button variant="outline" size="sm" onClick={() => updateOrderStatus(order.id, 'AWAITING_PICKUP')}>
                            <CheckCircle className="mr-1 h-3 w-3"/> מוכן לאיסוף
                          </Button>
                        )}
                         {order.status === 'AWAITING_PICKUP' && (
                          <Button variant="outline" size="sm" onClick={() => updateOrderStatus(order.id, 'OUT_FOR_DELIVERY')} disabled={!order.assignedCourier}>
                            <Package className="mr-1 h-3 w-3"/> נאסף ע"י שליח
                          </Button>
                        )}
                         {order.status === 'OUT_FOR_DELIVERY' && (
                          <Button variant="default" size="sm" onClick={() => updateOrderStatus(order.id, 'DELIVERED')} className="bg-green-600 hover:bg-green-600 text-white">
                            <CheckCircle className="mr-1 h-3 w-3"/> נמסר
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handlePrintReceipt(order.id)} title="הדפס קבלה (דמו)"><Printer className="h-4 w-4"/></Button>
                        {order.assignedCourier && <Button variant="ghost" size="icon" onClick={() => handleChat(order.id, 'courier')} title="צ'אט עם שליח (דמו)"><MessageSquare className="h-4 w-4 text-blue-500"/></Button>}
                        <Button variant="ghost" size="icon" onClick={() => handleChat(order.id, 'customer')} title="צ'אט עם לקוח (דמו)"><MessageSquare className="h-4 w-4 text-green-500"/></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>היסטוריית הזמנות</CardTitle>
              <CardDescription>צפה בהזמנות קודמות. השתמש בפילטר התאריכים כדי לצמצם את התוצאות.</CardDescription>
              <DatePickerWithRange className="mt-2" onDateChange={handleDateRangeChange} />
            </CardHeader>
            <CardContent>
               {orderHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">לא נמצאו הזמנות קודמות בטווח התאריכים שנבחר או בכלל.</p>
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>מזהה הזמנה</TableHead>
                    <TableHead>תאריך</TableHead>
                    <TableHead>לקוח (דמו)</TableHead>
                     <TableHead>הערות</TableHead>
                    <TableHead>סטטוס</TableHead>
                    <TableHead>שעת מסירה/תכנון</TableHead>
                    <TableHead className="text-right">סך הכל</TableHead>
                    <TableHead>פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderHistory.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id.substring(order.id.length-6)}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString('he-IL')}</TableCell>
                      <TableCell>משתמש {order.userId.substring(0,5)}...</TableCell>
                       <TableCell className="text-xs text-muted-foreground">
                        {order.customerNotes ? (
                            <span title={order.customerNotes} className="cursor-help truncate block max-w-[100px]">{order.customerNotes}</span>
                        ) : (
                            '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                          {getStatusText(order.status)}
                           {order.scheduledDeliveryTime && (order.status === 'DELIVERED' || order.status === 'SCHEDULED') && <CalendarClock className="inline h-3 w-3 ml-1" />}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.status === 'DELIVERED' && order.actualDeliveryTime ? new Date(order.actualDeliveryTime).toLocaleTimeString('he-IL', {hour: '2-digit', minute: '2-digit'}) : order.scheduledDeliveryTime || '-'}
                      </TableCell>
                      <TableCell className="text-right">₪{order.finalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                         <Button variant="ghost" size="icon" onClick={() => handlePrintReceipt(order.id)} title="הדפס קבלה (דמו)"><Printer className="h-4 w-4"/></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">מוצגות {orderHistory.length} הזמנות מההיסטוריה.</p>
             </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      <p className="text-xs text-muted-foreground text-center mt-4">התראות על הזמנות חדשות ועדכונים בזמן אמת דורשים אינטגרציה עם השרת ו-WebSocket (למשל Socket.IO).</p>
    </div>
  );
}
