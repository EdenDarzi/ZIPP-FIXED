
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, Users, DollarSign, Utensils, Star, TrendingUp, Clock } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for charts
constยอดขายรายวันData = [
  { date: 'Mon', sales: 4000 }, { date: 'Tue', sales: 3000 }, { date: 'Wed', sales: 2000 },
  { date: 'Thu', sales: 2780 }, { date: 'Fri', sales: 1890 }, { date: 'Sat', sales: 2390 }, { date: 'Sun', sales: 3490 },
];
const chartConfigSales: ChartConfig = {ยอดขาย: { label: "Sales (₪)", color: "hsl(var(--primary))" } };


const popularDishesData = [
  { name: 'Pizza', sold: 400, fill: "hsl(var(--chart-1))" }, { name: 'Burger', sold: 300, fill: "hsl(var(--chart-2))" },
  { name: 'Pasta', sold: 300, fill: "hsl(var(--chart-3))" }, { name: 'Salad', sold: 200, fill: "hsl(var(--chart-4))" },
];
const chartConfigDishes: ChartConfig = {
  pizza: { label: "Pizza", color: "hsl(var(--chart-1))" },
  burger: { label: "Burger", color: "hsl(var(--chart-2))" },
  pasta: { label: "Pasta", color: "hsl(var(--chart-3))" },
  salad: { label: "Salad", color: "hsl(var(--chart-4))" },
}

const customerFeedbackData = [
  { name: '5 Stars', value: 120, fill: "hsl(var(--chart-1))" }, { name: '4 Stars', value: 80, fill: "hsl(var(--chart-2))" },
  { name: '3 Stars', value: 30, fill: "hsl(var(--chart-3))" }, { name: '2 Stars', value: 10, fill: "hsl(var(--chart-4))" }, { name: '1 Star', value: 5, fill: "hsl(var(--chart-5))" },
];


export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Analytics & Performance</CardTitle>
          <CardDescription>Track your restaurant's key metrics and performance indicators.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (Last 30 Days)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪12,345.67</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders (Last 30 Days)</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+12 orders from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6 <span className="text-sm text-muted-foreground">/ 5</span></div>
            <p className="text-xs text-muted-foreground">Based on 150 reviews</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/> Sales Overview (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] -ml-2">
            <ChartContainer config={chartConfigSales} className="h-full w-full">
                <RechartsBarChart data={ยอดขายรายวันData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis tickLine={false} tickMargin={10} axisLine={false} unit="₪" />
                    <ChartTooltipContent />
                    <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><PieChart className="mr-2 h-5 w-5 text-primary"/> Popular Dishes (Sold Units)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
             <ChartContainer config={chartConfigDishes} className="mx-auto aspect-square h-full">
                <RechartsPieChart>
                    <ChartTooltipContent nameKey="name" hideLabel />
                    <Pie data={popularDishesData} dataKey="sold" nameKey="name" labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                         {popularDishesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </RechartsPieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="flex items-center"><Clock className="mr-2 h-5 w-5 text-primary"/> Average Preparation Time Trends</CardTitle>
            <CardDescription>Mock data showing preparation time trends.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] -ml-2">
            <ChartContainer config={{ prepTime: { label: "Avg Prep Time (min)", color: "hsl(var(--accent))" } }} className="h-full w-full">
                <RechartsLineChart data={[{day: "Mon", prepTime: 15}, {day: "Tue", prepTime: 12}, {day: "Wed", prepTime: 14}, {day: "Thu", prepTime: 13}, {day: "Fri", prepTime: 16}, {day: "Sat", prepTime: 18}, {day: "Sun", prepTime: 17}]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis unit=" min"/>
                    <ChartTooltipContent />
                    <Legend />
                    <Line type="monotone" dataKey="prepTime" stroke="var(--color-prepTime)" strokeWidth={2} dot={{r: 4, fill: "var(--color-prepTime)"}} activeDot={{r:6}}/>
                </RechartsLineChart>
            </ChartContainer>
        </CardContent>
       </Card>


      <p className="text-xs text-muted-foreground text-center mt-4">
        Advanced analytics and custom reports will require further backend data processing and integration.
      </p>
    </div>
  );
}
