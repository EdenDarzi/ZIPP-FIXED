
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListOrdered, RotateCcw, Eye, PackageSearch, CalendarClock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from 'react';

interface OrderRow { id: string; date: string | Date; restaurantName: string; total: number; status: OrderStatus; scheduled?: boolean }
const useOrders = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/account/order-history');
        if (!res.ok) throw new Error('Falha');
        const data = await res.json();
        setOrders(data);
      } finally { setLoading(false); }
    };
    load();
  }, []);
  return { orders, loading };
}

const getStatusTextAndIcon = (status: OrderStatus, scheduled: boolean): { text: string; variant: "default" | "secondary" | "destructive" | "outline"; icon?: React.ElementType } => {
    switch (status) {
        case 'DELIVERED': return { text: 'נמסר', variant: 'default', icon: scheduled ? CalendarClock : undefined };
        case 'CANCELLED': return { text: 'בוטל', variant: 'destructive' };
        case 'SCHEDULED': return { text: 'מתוכנן', variant: 'secondary', icon: CalendarClock };
        // Add other statuses as needed
        case 'AWAITING_PICKUP': return { text: 'ממתין לאיסוף', variant: 'secondary' };
        case 'OUT_FOR_DELIVERY': return { text: 'בדרך אליך', variant: 'default' };
        case 'PREPARING_AT_RESTAURANT': return { text: 'בהכנה', variant: 'default' };
        default: return { text: status.replace(/_/g, ' ').toLowerCase(), variant: 'outline' };
    }
};


export default function UserOrderHistoryPage() {
  const { toast } = useToast();
  const { orders, loading } = useOrders();

  const handleViewOrderDetails = (orderId: string) => {
    toast({
      title: "צפייה בפרטי הזמנה (בקרוב)",
      description: `יוצגו פרטים מלאים עבור הזמנה ${orderId}.`,
    });
  };

  const handleReorder = (orderId: string) => {
    toast({
      title: "הזמן שוב (בקרוב)",
      description: `הפריטים מהזמנה ${orderId} יועברו לעגלה שלך.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center"><ListOrdered className="mr-2 h-6 w-6 text-primary"/> היסטוריית הזמנות</CardTitle>
        <CardDescription>צפה בכל ההזמנות הקודמות שלך והזמן שוב בקלות.</CardDescription>
      </CardHeader>
      <CardContent>
        {(orders.length === 0 && !loading) ? (
          <div className="text-center py-12 text-muted-foreground">
            <PackageSearch className="mx-auto h-16 w-16 mb-4" />
            <p className="text-lg">אין עדיין הזמנות בהיסטוריה שלך.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מזהה הזמנה</TableHead>
                <TableHead>תאריך</TableHead>
                <TableHead>מסעדה/עסק</TableHead>
                <TableHead>סה"כ</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const statusInfo = getStatusTextAndIcon(order.status, order.scheduled);
                const Icon = statusInfo.icon;
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id.slice(-5)}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString('he-IL')}</TableCell>
                    <TableCell>{order.restaurantName}</TableCell>
                    <TableCell>₪{order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={statusInfo.variant} 
                        className={cn(
                            statusInfo.variant === 'default' && order.status === 'DELIVERED' && 'bg-green-500 text-white',
                            statusInfo.variant === 'secondary' && order.status === 'SCHEDULED' && 'bg-blue-500 text-white',
                            'capitalize'
                        )}
                      >
                        {Icon && <Icon className="inline h-3 w-3 mr-1"/>}
                       {statusInfo.text}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-1 rtl:space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => handleViewOrderDetails(order.id)} title="צפה בפרטים">
                        <Eye className="h-4 w-4" />
                      </Button>
                       {order.status === 'DELIVERED' && (
                        <Button variant="ghost" size="icon" onClick={() => handleReorder(order.id)} title="הזמן שוב">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        {orders.length > 10 && <Button variant="outline" disabled>טען הזמנות נוספות (בקרוב)</Button>}
      </CardFooter>
    </Card>
  );
}
