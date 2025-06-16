
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ListOrdered, ShoppingCart, Users, AlertTriangle, Settings, LayoutList, Palette, BarChart3, Video, Info, CheckCircle } from "lucide-react"; // Added CheckCircle
import Link from "next/link";
import Image from "next/image";

export default function RestaurantAdminDashboard() {
  const stats = {
    todayOrders: 12,
    pendingOrders: 3,
    totalRevenueToday: 450.75,
    popularItem: "מוצר הדגל",
    systemStatus: "כל המערכות פועלות כשורה",
    newReviews: 2, 
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
          <Link href="/restaurants/restaurant1" target="_blank"> 
            <span>צפה בחנות החיה</span>
          </Link>
        </Button>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-lg text-blue-700 flex items-center"><Info className="mr-2 h-5 w-5" /> ברוכים השבים לממשק הניהול!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-600">
            כאן תוכלו לעדכן את פרטי העסק שלכם, לנהל מוצרים ושירותים, לעקוב אחר הזמנות, לצפות בניתוחים ועוד.
          </p>
          <p className="text-xs text-blue-500 mt-1">
            <strong>הערה למפתחים:</strong> ממשק זה הוא הדגמה. הקמת עסק חדש תתבצע דרך תהליך נפרד.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הזמנות היום (דמו)</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">+5 מאתמול</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הזמנות ממתינות (דמו)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">נדרשת פעולה</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הכנסות היום (דמו)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₪{stats.totalRevenueToday.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+10% מאתמול</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">פריט פופולרי (דמו)</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{stats.popularItem}</div>
            <p className="text-xs text-muted-foreground">מבוסס על מכירות אחרונות</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>פעולות מהירות</CardTitle>
          <CardDescription>נווט במהירות לאזורי ניהול מרכזיים.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Button key={link.href} variant="outline" asChild className="justify-start text-left h-auto py-3 hover:bg-primary/5 hover:border-primary/30">
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

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>התראות ועדכונים (דמו)</CardTitle>
            <CardDescription>עדכונים חשובים ופעולות נדרשות.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded-md bg-green-50 text-green-700">
              <p className="font-medium flex items-center"><CheckCircle className="mr-2 h-4 w-4"/> סטטוס מערכת: {stats.systemStatus}</p>
            </div>
             <div className="p-3 border rounded-md bg-yellow-50 text-yellow-700">
              <p className="font-medium flex items-center"><Users className="mr-2 h-4 w-4"/> התקבלו {stats.newReviews} ביקורות חדשות לטיפולך (דמו)</p>
            </div>
             <div className="text-center text-muted-foreground py-4">
              <p className="text-xs">במערכת חיה, התראות חשובות יופיעו כאן.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Video className="mr-2 h-5 w-5 text-red-500" /> LiveKitchen סטטוס (דמו)</CardTitle>
            <CardDescription>שתף את הלקוחות שלך במה שקורה מאחורי הקלעים!</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <p className="text-lg font-medium text-muted-foreground">פיד ה-LiveKitchen שלך <span className="text-red-600 font-semibold">לא פעיל</span> כרגע.</p>
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center border data-ai-hint='kitchen live stream preview'">
                <Video className="h-16 w-16 text-muted-foreground/50"/>
            </div>
            <Button variant="outline" disabled>הפעל שידור חי (בקרוב)</Button>
            <p className="text-xs text-muted-foreground">הגבר אמון ועניין עם שידורים חיים מהמטבח או אזור העבודה שלך.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
    