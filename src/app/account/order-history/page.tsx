
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListOrdered, RotateCcw, Eye, PackageSearch, CalendarClock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const mockOrderHistory = [
  { id: 'hist123', date: '2024-07-15', restaurantName: 'פיצה פאלאס', total: 75.50, status: 'DELIVERED' as OrderStatus, scheduled: false },
  { id: 'hist456', date: '2024-07-10', restaurantName: 'בורגר בוננזה', total: 55.00, status: 'DELIVERED' as OrderStatus, scheduled: true },
  { id: 'hist789', date: '2024-07-01', restaurantName: 'סלט סנסיישנס', total: 42.00, status: 'CANCELLED' as OrderStatus, scheduled: false },
  { id: 'hist101', date: '2024-06-25', restaurantName: 'פסטה פרפקשן', total: 98.00, status: 'DELIVERED' as OrderStatus, scheduled: false },
];

const getStatusBadgeVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'DELIVERED': return 'default';
        case 'CANCELLED': return 'destructive';
        case 'SCHEDULED': return 'secondary';
        default: return 'outline';
    }
};

const getStatusTextAndIcon = (status: OrderStatus, scheduled: boolean): { text: string; variant: "default" | "secondary" | "destructive" | "outline"; icon?: React.ElementType } => {
    switch (status) {
        case 'DELIVERED': return { text: 'נמסר', variant: 'default', icon: scheduled ? CalendarClock : undefined };
        case 'CANCELLED': return { text: 'בוטל', variant: 'destructive' };
        case 'SCHEDULED': return { text: 'מתוכנן', variant: 'secondary', icon: CalendarClock };
        default: return { text: status, variant: 'outline' };
    }
};


export default function UserOrderHistoryPage() {
  const { toast } = useToast();

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
        {mockOrderHistory.length === 0 ? (
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
              {mockOrderHistory.map((order) => {
                const statusInfo = getStatusTextAndIcon(order.status, order.scheduled);
                const Icon = statusInfo.icon;
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString('he-IL')}</TableCell>
                    <TableCell>{order.restaurantName}</TableCell>
                    <TableCell>₪{order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant} className={cn(statusInfo.variant === 'default' && 'bg-green-500 text-white', statusInfo.variant === 'secondary' && 'bg-blue-500 text-white')}>
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
        {mockOrderHistory.length > 10 && <Button variant="outline">טען הזמנות נוספות (בקרוב)</Button>}
      </CardFooter>
    </Card>
  );
}
