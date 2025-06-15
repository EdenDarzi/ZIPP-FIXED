
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ListOrdered, ShoppingCart, Users, AlertTriangle, Settings, LayoutList, Palette, BarChart3, Video, Info } from "lucide-react"; // Added Info
import Link from "next/link";
import Image from "next/image";

export default function RestaurantAdminDashboard() {
  const stats = {
    todayOrders: 12,
    pendingOrders: 3,
    totalRevenueToday: 450.75,
    popularItem: "מוצר הדגל",
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
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-blue-700 flex items-center"><Info className="mr-2 h-5 w-5" /> מידע חשוב</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-600">
            ברוכים הבאים לממשק ניהול העסק! כאן תוכלו לעדכן את פרטי העסק שלכם, לנהל מוצרים ושירותים, לעקוב אחר הזמנות, לצפות בניתוחים ועוד.
          </p>
          <p className="text-sm text-blue-600 mt-1">
            <strong>הערה:</strong> ממשק זה מיועד לניהול עסק קיים. הקמת עסק חדש והרשמה לפלטפורמה יתאפשרו בקרוב דרך תהליך ייעודי.
          </p>
        </CardContent>
      </Card>

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

      <div className="grid md:grid-cols-2 gap-6">
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Video className="mr-2 h-5 w-5 text-red-500" /> LiveKitchen סטטוס</CardTitle>
            <CardDescription>שתף את הלקוחות שלך במה שקורה מאחורי הקלעים!</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <p className="text-lg font-medium text-muted-foreground">פיד ה-LiveKitchen שלך <span className="text-red-600 font-semibold">לא פעיל</span> כרגע.</p>
            <Image src="https://placehold.co/300x150.png" alt="LiveKitchen Placeholder" width={300} height={150} className="mx-auto rounded-md border data-ai-hint='kitchen live stream preview'" />
            <Button variant="outline" disabled>הפעל שידור חי (בקרוב)</Button>
            <p className="text-xs text-muted-foreground">הגבר אמון ועניין עם שידורים חיים מהמטבח או אזור העבודה שלך.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
