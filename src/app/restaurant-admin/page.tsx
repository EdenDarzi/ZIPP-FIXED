
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ListOrdered, ShoppingCart, Users, AlertTriangle, Settings, LayoutList, Palette, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function RestaurantAdminDashboard() {
  // Mock data - in a real app, this would come from a backend
  const stats = {
    todayOrders: 12,
    pendingOrders: 3,
    totalRevenueToday: 450.75,
    popularItem: "מוצר הדגל", // Generic popular item
  };

  const quickLinks = [
    { href: '/restaurant-admin/settings', label: 'הגדרות עסק', icon: Settings },
    { href: '/restaurant-admin/menu', label: 'נהל מוצרים/שירותים', icon: LayoutList },
    { href: '/restaurant-admin/design', label: 'התאם אישית את החנות', icon: Palette },
    { href: '/restaurant-admin/orders', label: 'צפה בהזמנות', icon: ShoppingCart },
    { href: '/restaurant-admin/analytics', label: 'צפה בניתוחים', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline text-primary">לוח בקרה לעסק</h1>
        <Button asChild>
          {/* Assuming restaurant1 is a generic ID or could be dynamic */}
          <Link href="/restaurants/restaurant1" target="_blank"> 
            <span>צפה בחנות החיה</span>
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הזמנות היום</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">+5 מאתמול (דמו)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הזמנות ממתינות</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">נדרשת פעולה</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הכנסות היום</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{stats.totalRevenueToday.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+10% מאתמול (דמו)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">המוצר/שירות הפופולרי ביותר</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{stats.popularItem}</div>
            <p className="text-xs text-muted-foreground">מבוסס על מכירות אחרונות</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links Section */}
      <Card>
        <CardHeader>
          <CardTitle>פעולות מהירות</CardTitle>
          <CardDescription>נווט במהירות לאזורי ניהול מרכזיים.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Button key={link.href} variant="outline" asChild className="justify-start text-left h-auto py-3">
              <Link href={link.href}>
                <span className="flex items-center w-full">
                  <link.icon className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-semibold">{link.label}</p>
                  </div>
                </span>
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Placeholder for Recent Activity or Important Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>התראות ועדכונים</CardTitle>
          <CardDescription>עדכונים חשובים ופעולות נדרשות.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Users className="h-12 w-12 mx-auto mb-4" />
            <p>אין התראות חדשות או עדכונים קריטיים כרגע.</p>
            <p className="text-xs mt-1">סטטוס מערכת: כל המערכות פועלות כשורה.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
