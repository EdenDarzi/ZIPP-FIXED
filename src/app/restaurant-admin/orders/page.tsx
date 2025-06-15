
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Printer, MessageSquare, CheckCircle, Package, Clock, AlertCircle, Search, Filter } from 'lucide-react';
import type { Order, OrderStatus } from '@/types'; // Assuming Order type is defined
import { Input } from '@/components/ui/input';
import { DatePickerWithRange } from '@/components/ui/date-range-picker'; // Assuming this exists

// Mock Data
const mockLiveOrders: Order[] = [
  {
    id: 'order123', userId: 'userABC', items: [{ menuItemId: 'item1', name: 'Margherita Pizza', price: 12.99, quantity: 1 }],
    totalAmount: 12.99, deliveryPreference: 'arena', deliveryFee: 0, discountAmount: 0, finalAmount: 12.99,
    status: 'PREPARING_AT_RESTAURANT', deliveryAddress: '123 Main St', restaurantId: 'restaurant1', restaurantName: 'Pizza Palace',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), updatedAt: new Date().toISOString(),
    estimatedDeliveryTime: '15-20 min',
    orderTimeline: [{ status: 'PREPARING_AT_RESTAURANT', timestamp: new Date().toISOString(), notes: "Order received by kitchen."}]
  },
  {
    id: 'order124', userId: 'userDEF', items: [{ menuItemId: 'item3', name: 'Classic Burger', price: 9.99, quantity: 2 }, { menuItemId: 'item6', name: 'Coca-Cola', price: 2.50, quantity: 2 }],
    totalAmount: 24.98, deliveryPreference: 'fastest', deliveryFee: 5, discountAmount: 0, finalAmount: 29.98,
    status: 'AWAITING_PICKUP', deliveryAddress: '456 Oak Ave', restaurantId: 'restaurant1', restaurantName: 'Pizza Palace',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(), updatedAt: new Date().toISOString(),
    estimatedDeliveryTime: '5-10 min for pickup',
    assignedCourier: { id: 'courier1', name: 'Speedy Sam', rating: 4.8, vehicleType: 'motorcycle', currentEtaMinutes: 7 },
    orderTimeline: [
        { status: 'PREPARING_AT_RESTAURANT', timestamp: new Date(Date.now() - 10 * 60000).toISOString()},
        { status: 'AWAITING_PICKUP', timestamp: new Date().toISOString(), notes: "Food ready. Courier notified."}
    ]
  },
];

const mockOrderHistory: Order[] = [
 {
    id: 'order101', userId: 'userXYZ', items: [{ menuItemId: 'item2', name: 'Pepperoni Pizza', price: 14.99, quantity: 1 }],
    totalAmount: 14.99, deliveryPreference: 'arena', deliveryFee: 0, discountAmount: 0, finalAmount: 14.99,
    status: 'DELIVERED', deliveryAddress: '789 Pine Ln', restaurantId: 'restaurant1', restaurantName: 'Pizza Palace',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(), updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60000 + 30 * 60000).toISOString(),
    actualDeliveryTime: new Date(Date.now() - 2 * 24 * 60 * 60000 + 30 * 60000).toISOString(),
    orderTimeline: [{ status: 'DELIVERED', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000 + 30 * 60000).toISOString()}]
  },
];


const getStatusBadgeVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'PREPARING_AT_RESTAURANT': return 'default'; // Blueish
        case 'AWAITING_PICKUP': return 'secondary'; // Orange/Yellowish (using accent)
        case 'OUT_FOR_DELIVERY': return 'default'; // Primary again for active
        case 'DELIVERED': return 'default'; // Greenish (not a shadcn default, but will use 'default' that might be greenish)
        case 'CANCELLED': return 'destructive';
        case 'MATCHING_COURIER': return 'outline';
        default: return 'outline';
    }
};

export default function OrderManagementPage() {
  const [liveOrders, setLiveOrders] = useState<Order[]>(mockLiveOrders);
  const [orderHistory, setOrderHistory] = useState<Order[]>(mockOrderHistory);

  // Mock function to update order status
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setLiveOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
      )
    );
    // Add to history if it's a final status like DELIVERED or CANCELLED
    if (newStatus === 'DELIVERED' || newStatus === 'CANCELLED') {
        const orderToMove = liveOrders.find(o => o.id === orderId);
        if(orderToMove) {
            setOrderHistory(prevHistory => [ {...orderToMove, status: newStatus}, ...prevHistory]);
            setLiveOrders(prevLive => prevLive.filter(o => o.id !== orderId));
        }
    }
  };

  const handlePrintReceipt = (orderId: string) => {
    alert(`Printing receipt for order ${orderId} (mock). PDF/ESC-POS integration needed.`);
  };
  
  const handleChat = (orderId: string, entity: 'courier' | 'customer') => {
     alert(`Opening chat for order ${orderId} with ${entity} (mock). Socket.IO integration needed.`);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Order Management</CardTitle>
          <CardDescription>View live orders, update statuses, and access order history.</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="live">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <TabsList>
                <TabsTrigger value="live">Live Orders ({liveOrders.length})</TabsTrigger>
                <TabsTrigger value="history">Order History ({orderHistory.length})</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input placeholder="Search orders..." className="max-w-xs" disabled/>
                <Button variant="outline" disabled><Filter className="mr-2 h-4 w-4"/> Filters (Soon)</Button>
            </div>
        </div>

        <TabsContent value="live">
          <Card>
            <CardHeader>
              <CardTitle>Current Live Orders</CardTitle>
              <CardDescription>Monitor and manage orders as they come in.</CardDescription>
            </CardHeader>
            <CardContent>
              {liveOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">No live orders at the moment.</p>
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>ETA / Time</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id.substring(order.id.length - 6)}</TableCell>
                      <TableCell>{order.items.map(i => `${i.name} (x${i.quantity})`).join(', ').substring(0,30)}...</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                          {order.status.replace(/_/g, ' ').toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.estimatedDeliveryTime || new Date(order.createdAt).toLocaleTimeString()}</TableCell>
                      <TableCell className="text-right">₪{order.finalAmount.toFixed(2)}</TableCell>
                      <TableCell className="space-x-1">
                        {/* Example status updates */}
                        {order.status === 'PREPARING_AT_RESTAURANT' && (
                          <Button variant="outline" size="sm" onClick={() => updateOrderStatus(order.id, 'AWAITING_PICKUP')}>
                            <CheckCircle className="mr-1 h-3 w-3"/> Ready
                          </Button>
                        )}
                         {order.status === 'AWAITING_PICKUP' && (
                          <Button variant="outline" size="sm" onClick={() => updateOrderStatus(order.id, 'OUT_FOR_DELIVERY')} disabled={!order.assignedCourier}>
                            <Package className="mr-1 h-3 w-3"/> Picked Up
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handlePrintReceipt(order.id)} title="Print Receipt (Mock)"><Printer className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleChat(order.id, 'customer')} title="Chat with Customer (Mock)"><MessageSquare className="h-4 w-4"/></Button>
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
              <CardTitle>Order History</CardTitle>
              <CardDescription>Review past orders.</CardDescription>
              {/* Placeholder for date range picker */}
              {/* <DatePickerWithRange className="mt-2" /> */}
            </CardHeader>
            <CardContent>
               {orderHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">No past orders found.</p>
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer (Mock)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderHistory.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id.substring(order.id.length-6)}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>User {order.userId.substring(0,5)}...</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                          {order.status.replace(/_/g, ' ').toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">₪{order.finalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                         <Button variant="ghost" size="icon" onClick={() => handlePrintReceipt(order.id)} title="Print Receipt (Mock)"><Printer className="h-4 w-4"/></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <p className="text-xs text-muted-foreground text-center mt-4">Alerts for new orders and real-time updates require backend and WebSocket (e.g. Socket.IO) integration.</p>
    </div>
  );
}
