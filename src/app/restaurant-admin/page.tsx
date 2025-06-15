
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
    popularItem: "Margherita Pizza",
  };

  const quickLinks = [
    { href: '/restaurant-admin/settings', label: 'Restaurant Settings', icon: Settings },
    { href: '/restaurant-admin/menu', label: 'Manage Menu', icon: LayoutList },
    { href: '/restaurant-admin/design', label: 'Customize Store', icon: Palette },
    { href: '/restaurant-admin/orders', label: 'View Orders', icon: ShoppingCart },
    { href: '/restaurant-admin/analytics', label: 'View Analytics', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline text-primary">Restaurant Dashboard</h1>
        <Button asChild>
          <Link href="/restaurants/restaurant1" target="_blank"> {/* Assuming restaurant1 is the admin's restaurant */}
            View Live Storefront
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday (mock)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Action required</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{stats.totalRevenueToday.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+10% from yesterday (mock)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular Item</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{stats.popularItem}</div>
            <p className="text-xs text-muted-foreground">Based on recent sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Quickly navigate to key management areas.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Button key={link.href} variant="outline" asChild className="justify-start text-left h-auto py-3">
              <Link href={link.href}>
                <link.icon className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">{link.label}</p>
                  {/* <p className="text-xs text-muted-foreground">Description for {link.label}</p> */}
                </div>
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Placeholder for Recent Activity or Important Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications & Alerts</CardTitle>
          <CardDescription>Important updates and actions needed.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Users className="h-12 w-12 mx-auto mb-4" />
            <p>No new notifications or critical alerts at this time.</p>
            <p className="text-xs mt-1">System status: All systems operational.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
