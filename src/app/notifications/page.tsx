
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell, Settings } from "lucide-react";

export default function NotificationsPage() {
  // Mock notifications
  const mockNotifications = [
    { id: 1, title: "הזמנה #12345 נמסרה!", description: "ההזמנה שלך מ'פיצה פאלאס' הגיעה. בתאבון!", time: "לפני 5 דקות", read: false },
    { id: 2, title: "מבצע חדש ב'בורגר בוננזה'", description: "קבל 20% הנחה על כל ההמבורגרים היום.", time: "לפני שעתיים", read: true },
    { id: 3, title: "השליח בדרך!", description: "יוסי בדרך אליך עם ההזמנה מ'סלט סנסיישנס'.", time: "אתמול", read: true },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center">
            <Bell className="mr-3 h-7 w-7" />
            התראות ועדכונים
        </h1>
        <Button variant="outline" size="sm" disabled>
            <Settings className="mr-2 h-4 w-4" /> הגדרות התראות (בקרוב)
        </Button>
      </div>
      
      {mockNotifications.length === 0 ? (
        <Card className="text-center py-12">
            <CardContent>
                 <Bell className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground">אין לך התראות חדשות כרגע.</p>
            </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
            {mockNotifications.map(notification => (
                <Card key={notification.id} className={`shadow-md ${!notification.read ? 'bg-primary/5 border-primary/30' : 'bg-card'}`}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className={`text-md ${!notification.read ? 'text-primary font-semibold' : 'text-foreground'}`}>{notification.title}</CardTitle>
                            <span className={`text-xs ${!notification.read ? 'text-primary/80' : 'text-muted-foreground'}`}>{notification.time}</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-sm ${!notification.read ? 'text-primary/90' : 'text-muted-foreground'}`}>{notification.description}</p>
                    </CardContent>
                    {!notification.read && (
                         <CardFooter className="p-3 border-t">
                            <Button variant="link" size="sm" className="p-0 h-auto text-primary">סמן כנקרא (דמו)</Button>
                         </CardFooter>
                    )}
                </Card>
            ))}
        </div>
      )}
       <p className="text-xs text-muted-foreground text-center mt-8">
        ניהול מלא של התראות, כולל התראות Push, יפותח בהמשך.
      </p>
    </div>
  );
}
