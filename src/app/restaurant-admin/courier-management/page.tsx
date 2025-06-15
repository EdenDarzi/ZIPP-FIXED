
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockCourierProfiles } from '@/lib/mock-data';
import type { CourierProfile, DeliveryVehicle } from '@/types';
import { Bike, Car, Footprints, UserCheck, UserX, MapPin, TrendingUp, Clock, Star, Map as MapIconLucide } from 'lucide-react'; // Renamed Map to MapIconLucide
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from '@/lib/utils';

// Helper to get vehicle icon
const VehicleIcon = ({ type, className }: { type: DeliveryVehicle | undefined, className?: string }) => {
  const iconProps = { className: cn(className || "inline h-4 w-4 mr-1", "text-muted-foreground") };
  if (type === 'motorcycle') return <Bike {...iconProps} title="Motorcycle" />;
  if (type === 'scooter') return <Bike {...iconProps} title="Scooter" />;
  if (type === 'car') return <Car {...iconProps} title="Car" />;
  if (type === 'bicycle') return <Bike {...iconProps} title="Bicycle"/>;
  if (type === 'foot') return <Footprints {...iconProps} title="Foot"/>;
  return null;
};

const mockDeliveriesPerHourData = [
  { hour: '08:00', deliveries: 5 }, { hour: '09:00', deliveries: 8 }, { hour: '10:00', deliveries: 12 },
  { hour: '11:00', deliveries: 15 }, { hour: '12:00', deliveries: 22 }, { hour: '13:00', deliveries: 25 },
  { hour: '14:00', deliveries: 18 }, { hour: '15:00', deliveries: 14 }, { hour: '16:00', deliveries: 10 },
  { hour: '17:00', deliveries: 16 }, { hour: '18:00', deliveries: 20 }, { hour: '19:00', deliveries: 28 },
  { hour: '20:00', deliveries: 24 }, { hour: '21:00', deliveries: 15 },
];
const chartConfigDeliveries: ChartConfig = { deliveries: { label: "Deliveries", color: "hsl(var(--primary))" } };


export default function CourierManagementDashboard() {
  const activeCouriers = mockCourierProfiles.filter(c => c.isActive).length;
  const totalCouriers = mockCourierProfiles.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Courier Management Dashboard</CardTitle>
          <CardDescription>Oversee courier activity, performance, and operational zones.</CardDescription>
        </CardHeader>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Couriers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCouriers} / {totalCouriers}</div>
            <p className="text-xs text-muted-foreground">Currently online and available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries (Today - Mock)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+15% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Delivery Time (Mock)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28 min</div>
            <p className="text-xs text-muted-foreground">-2 min from last week</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Courier Rating (Mock)</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.72 <span className="text-sm text-muted-foreground">/ 5</span></div>
            <p className="text-xs text-muted-foreground">Based on 250+ customer ratings</p>
          </CardContent>
        </Card>
      </div>

      {/* Courier Activity Table & Zone Management Placeholder */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Courier Activity</CardTitle>
            <CardDescription>Real-time status of all registered couriers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location (Mock)</TableHead>
                  <TableHead>Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCourierProfiles.slice(0, 5).map((courier) => ( // Display first 5 for brevity
                  <TableRow key={courier.id}>
                    <TableCell className="font-medium">{courier.name}</TableCell>
                    <TableCell><VehicleIcon type={courier.vehicleType} /> {courier.vehicleType}</TableCell>
                    <TableCell>
                      <Badge variant={courier.isActive ? 'default' : 'outline'} className={cn(courier.isActive ? 'bg-green-500 hover:bg-green-600 text-primary-foreground' : 'border-muted-foreground text-muted-foreground')}>
                        {courier.isActive ? <UserCheck className="mr-1 h-3 w-3"/> : <UserX className="mr-1 h-3 w-3"/>}
                        {courier.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                        <MapPin className="inline h-3 w-3 mr-1"/>
                        {courier.currentLocation.lat.toFixed(2)}, {courier.currentLocation.lng.toFixed(2)}
                    </TableCell>
                     <TableCell>
                        <Star className="inline h-3 w-3 mr-1 text-yellow-400 fill-yellow-400"/>
                        {courier.rating.toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {mockCourierProfiles.length > 5 && <p className="text-xs text-muted-foreground text-center mt-2">Showing first 5 couriers. Full list pagination coming soon.</p>}
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><MapIconLucide className="mr-2 h-5 w-5 text-primary"/> Zone Management</CardTitle>
                <CardDescription>Define and manage delivery zones.</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground py-8">
                <MapIconLucide className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Zone creation & assignment tools</p>
                <p className="text-xs">(Feature Coming Soon)</p>
              </CardContent>
            </Card>
        </div>
      </div>


        {/* Performance Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/> Deliveries Per Hour (Today - Mock)</CardTitle>
             <CardDescription>Peak times and delivery distribution throughout the day.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] -ml-2 pr-2"> {/* Adjusted padding for axis labels */}
            <ChartContainer config={chartConfigDeliveries} className="h-full w-full">
                <RechartsBarChart data={mockDeliveriesPerHourData} accessibilityLayer margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="hour" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis tickLine={false} tickMargin={10} axisLine={false} unit=" del." width={40}/>
                    <ChartTooltipContent />
                    <Bar dataKey="deliveries" fill="var(--color-deliveries)" radius={4} />
                </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Advanced courier analytics, real-time tracking, and zone optimization features will require further backend and data integration.
      </p>
    </div>
  );
}
