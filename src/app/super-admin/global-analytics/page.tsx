'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, MapPin, Clock, Download, Filter, Calendar, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalRestaurants: number;
  averageOrderValue: number;
  conversionRate: number;
  customerRetention: number;
  platformGrowth: number;
}

interface RegionData {
  region: string;
  orders: number;
  revenue: number;
  restaurants: number;
  growth: number;
}

interface TopRestaurant {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  rating: number;
  category: string;
}

interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
  growth: number;
}

const mockAnalytics: AnalyticsData = {
  totalRevenue: 2450000,
  totalOrders: 45678,
  totalUsers: 12340,
  totalRestaurants: 567,
  averageOrderValue: 89.5,
  conversionRate: 3.2,
  customerRetention: 68.5,
  platformGrowth: 15.8
};

const mockRegionData: RegionData[] = [
  { region: 'תל אביב', orders: 15234, revenue: 1250000, restaurants: 189, growth: 18.5 },
  { region: 'ירושלים', orders: 8967, revenue: 720000, restaurants: 134, growth: 12.3 },
  { region: 'חיפה', orders: 6543, revenue: 580000, restaurants: 98, growth: 9.7 },
  { region: 'באר שבע', orders: 4321, revenue: 380000, restaurants: 67, growth: 22.1 },
  { region: 'נתניה', orders: 3890, revenue: 340000, restaurants: 45, growth: 14.2 },
  { region: 'פתח תקווה', orders: 3567, revenue: 310000, restaurants: 34, growth: 16.8 },
  { region: 'אשדוד', orders: 3156, revenue: 275000, restaurants: 28, growth: 11.4 }
];

const mockTopRestaurants: TopRestaurant[] = [
  { id: '1', name: 'מסעדת הבית', orders: 1234, revenue: 125000, rating: 4.8, category: 'ישראלית' },
  { id: '2', name: 'פיצה פלוס', orders: 1156, revenue: 98000, rating: 4.6, category: 'פיצה' },
  { id: '3', name: 'סושי טוקיו', orders: 987, revenue: 145000, rating: 4.9, category: 'יפנית' },
  { id: '4', name: 'המבורגר ברחוב', orders: 876, revenue: 87000, rating: 4.5, category: 'מהיר' },
  { id: '5', name: 'שווארמה הכרם', orders: 765, revenue: 65000, rating: 4.4, category: 'מזרח תיכונית' },
  { id: '6', name: 'קפה ברחוב', orders: 654, revenue: 45000, rating: 4.3, category: 'קפה' },
  { id: '7', name: 'פלאפל הדוד', orders: 543, revenue: 38000, rating: 4.2, category: 'רחוב' },
  { id: '8', name: 'מסעדת הים', orders: 432, revenue: 78000, rating: 4.7, category: 'דגים' }
];

const mockRevenueData: RevenueData[] = [
  { month: 'ינואר', revenue: 180000, orders: 3456, growth: 12.5 },
  { month: 'פברואר', revenue: 195000, orders: 3678, growth: 8.3 },
  { month: 'מרץ', revenue: 210000, orders: 3890, growth: 7.7 },
  { month: 'אפריל', revenue: 225000, orders: 4123, growth: 7.1 },
  { month: 'מאי', revenue: 240000, orders: 4356, growth: 6.7 },
  { month: 'יוני', revenue: 255000, orders: 4567, growth: 6.3 },
  { month: 'יולי', revenue: 270000, orders: 4789, growth: 5.9 },
  { month: 'אוגוסט', revenue: 285000, orders: 4912, growth: 5.6 },
  { month: 'ספטמבר', revenue: 300000, orders: 5134, growth: 5.3 },
  { month: 'אוקטובר', revenue: 315000, orders: 5345, growth: 5.0 },
  { month: 'נובמבר', revenue: 330000, orders: 5567, growth: 4.8 },
  { month: 'דצמבר', revenue: 345000, orders: 5789, growth: 4.5 }
];

export default function GlobalAnalyticsPage() {
  const { toast } = useToast();
  const { isRTL } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleExportData = (type: string) => {
    toast({
      title: 'ייצוא נתונים',
      description: `נתוני ${type} יוצאו בהצלחה`,
    });
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (growth < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.globalAnalytics" 
                fallback="Global Analytics"
              />
            </h1>
            <p className="text-muted-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.globalAnalyticsDesc" 
                fallback="Comprehensive platform analytics and insights"
              />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">יומי</SelectItem>
              <SelectItem value="week">שבועי</SelectItem>
              <SelectItem value="month">חודשי</SelectItem>
              <SelectItem value="year">שנתי</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            ייצא דוח
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">סה"כ הכנסות</p>
                <p className="text-2xl font-bold">₪{mockAnalytics.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(mockAnalytics.platformGrowth)}
                  <span className={`text-sm ${getGrowthColor(mockAnalytics.platformGrowth)}`}>
                    {mockAnalytics.platformGrowth}%
                  </span>
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">סה"כ הזמנות</p>
                <p className="text-2xl font-bold">{mockAnalytics.totalOrders.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(12.3)}
                  <span className={`text-sm ${getGrowthColor(12.3)}`}>
                    12.3%
                  </span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">משתמשים פעילים</p>
                <p className="text-2xl font-bold">{mockAnalytics.totalUsers.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(8.7)}
                  <span className={`text-sm ${getGrowthColor(8.7)}`}>
                    8.7%
                  </span>
                </div>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">מסעדות פעילות</p>
                <p className="text-2xl font-bold">{mockAnalytics.totalRestaurants}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getGrowthIcon(15.2)}
                  <span className={`text-sm ${getGrowthColor(15.2)}`}>
                    15.2%
                  </span>
                </div>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">ממוצע הזמנה</p>
              <p className="text-xl font-bold">₪{mockAnalytics.averageOrderValue}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">שיעור המרה</p>
              <p className="text-xl font-bold">{mockAnalytics.conversionRate}%</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">שימור לקוחות</p>
              <p className="text-xl font-bold">{mockAnalytics.customerRetention}%</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">צמיחת פלטפורמה</p>
              <p className="text-xl font-bold">{mockAnalytics.platformGrowth}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            הכנסות
          </TabsTrigger>
          <TabsTrigger value="regions" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            אזורים
          </TabsTrigger>
          <TabsTrigger value="restaurants" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            מסעדות מובילות
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            ביצועים
          </TabsTrigger>
        </TabsList>

        {/* Revenue Analytics */}
        <TabsContent value="revenue">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    מגמות הכנסות
                  </span>
                  <Button variant="outline" onClick={() => handleExportData('הכנסות')}>
                    <Download className="h-4 w-4 mr-2" />
                    ייצא נתונים
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockRevenueData.slice(-3).map((data, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">{data.month}</div>
                        <div className="text-2xl font-bold">₪{data.revenue.toLocaleString()}</div>
                        <div className="flex items-center gap-1 text-sm">
                          {getGrowthIcon(data.growth)}
                          <span className={getGrowthColor(data.growth)}>
                            {data.growth}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>חודש</TableHead>
                        <TableHead>הכנסות</TableHead>
                        <TableHead>הזמנות</TableHead>
                        <TableHead>צמיחה</TableHead>
                        <TableHead>ממוצע הזמנה</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRevenueData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{data.month}</TableCell>
                          <TableCell>₪{data.revenue.toLocaleString()}</TableCell>
                          <TableCell>{data.orders.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getGrowthIcon(data.growth)}
                              <span className={getGrowthColor(data.growth)}>
                                {data.growth}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>₪{(data.revenue / data.orders).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Regional Analytics */}
        <TabsContent value="regions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    ביצועים לפי אזור
                  </span>
                  <Button variant="outline" onClick={() => handleExportData('אזורים')}>
                    <Download className="h-4 w-4 mr-2" />
                    ייצא נתונים
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>אזור</TableHead>
                      <TableHead>הזמנות</TableHead>
                      <TableHead>הכנסות</TableHead>
                      <TableHead>מסעדות</TableHead>
                      <TableHead>צמיחה</TableHead>
                      <TableHead>נתח שוק</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRegionData.map((region, index) => {
                      const marketShare = (region.revenue / mockAnalytics.totalRevenue * 100);
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{region.region}</TableCell>
                          <TableCell>{region.orders.toLocaleString()}</TableCell>
                          <TableCell>₪{region.revenue.toLocaleString()}</TableCell>
                          <TableCell>{region.restaurants}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getGrowthIcon(region.growth)}
                              <span className={getGrowthColor(region.growth)}>
                                {region.growth}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={marketShare} className="w-16" />
                              <span className="text-sm">{marketShare.toFixed(1)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Top Restaurants */}
        <TabsContent value="restaurants">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    מסעדות מובילות
                  </span>
                  <div className="flex items-center gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="קטגוריה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">כל הקטגוריות</SelectItem>
                        <SelectItem value="ישראלית">ישראלית</SelectItem>
                        <SelectItem value="פיצה">פיצה</SelectItem>
                        <SelectItem value="יפנית">יפנית</SelectItem>
                        <SelectItem value="מהיר">מזון מהיר</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => handleExportData('מסעדות')}>
                      <Download className="h-4 w-4 mr-2" />
                      ייצא נתונים
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>דירוג</TableHead>
                      <TableHead>מסעדה</TableHead>
                      <TableHead>קטגוריה</TableHead>
                      <TableHead>הזמנות</TableHead>
                      <TableHead>הכנסות</TableHead>
                      <TableHead>דירוג</TableHead>
                      <TableHead>ממוצע הזמנה</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTopRestaurants.map((restaurant, index) => (
                      <TableRow key={restaurant.id}>
                        <TableCell>
                          <Badge variant={index < 3 ? 'default' : 'secondary'}>
                            #{index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{restaurant.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{restaurant.category}</Badge>
                        </TableCell>
                        <TableCell>{restaurant.orders.toLocaleString()}</TableCell>
                        <TableCell>₪{restaurant.revenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span>{restaurant.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>₪{(restaurant.revenue / restaurant.orders).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Analytics */}
        <TabsContent value="performance">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    זמני משלוח ממוצעים
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">זמן הכנה ממוצע</span>
                      <span className="font-medium">18 דקות</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">זמן משלוח ממוצע</span>
                      <span className="font-medium">32 דקות</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">זמן כולל ממוצע</span>
                      <span className="font-medium">50 דקות</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">שיעור משלוחים בזמן</span>
                      <span className="font-medium text-green-600">87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    סטטיסטיקות לקוחות
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">לקוחות חדשים החודש</span>
                      <span className="font-medium">1,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">לקוחות חוזרים</span>
                      <span className="font-medium">68.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ממוצע הזמנות ללקוח</span>
                      <span className="font-medium">3.7</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">שביעות רצון ממוצעת</span>
                      <span className="font-medium text-green-600">4.6/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>מדדי ביצועים מפתח</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">שיעור המרה</span>
                      <span className="font-medium">{mockAnalytics.conversionRate}%</span>
                    </div>
                    <Progress value={mockAnalytics.conversionRate * 10} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">שימור לקוחות</span>
                      <span className="font-medium">{mockAnalytics.customerRetention}%</span>
                    </div>
                    <Progress value={mockAnalytics.customerRetention} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">צמיחת פלטפורמה</span>
                      <span className="font-medium">{mockAnalytics.platformGrowth}%</span>
                    </div>
                    <Progress value={mockAnalytics.platformGrowth * 5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}