
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell, Settings } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { AutoTranslateText } from "@/components/translation/auto-translate-text";

export default function NotificationsPage() {
  const { t, currentLanguage, isRTL } = useLanguage();
  
  // Mock notifications
  const mockNotifications = [
    { 
      id: 1, 
      titleKey: 'notifications.orderDelivered.title',
      titleFallback: 'Order #12345 delivered!',
      descriptionKey: 'notifications.orderDelivered.description',
      descriptionFallback: 'Your order from Pizza Palace has arrived. Enjoy!',
      timeKey: 'notifications.time.fiveMinutesAgo',
      timeFallback: '5 minutes ago',
      read: false 
    },
    { 
      id: 2, 
      titleKey: 'notifications.newDeal.title',
      titleFallback: 'New deal at Burger Bonanza',
      descriptionKey: 'notifications.newDeal.description',
      descriptionFallback: 'Get 20% off all burgers today.',
      timeKey: 'notifications.time.twoHoursAgo',
      timeFallback: '2 hours ago',
      read: true 
    },
    { 
      id: 3, 
      titleKey: 'notifications.courierOnWay.title',
      titleFallback: 'Courier on the way!',
      descriptionKey: 'notifications.courierOnWay.description',
      descriptionFallback: 'Yossi is on the way to you with the order from Salad Sensations.',
      timeKey: 'notifications.time.yesterday',
      timeFallback: 'Yesterday',
      read: true 
    },
  ];

  return (
    <div className="container mx-auto py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center mb-6">
        <AutoTranslateText 
          translationKey="notifications.title" 
          fallback="Notifications & Updates"
          as="h1"
          className="text-3xl font-bold font-headline text-primary flex items-center"
        >
          <Bell className="mr-3 h-7 w-7" />
        </AutoTranslateText>
        <Button variant="outline" size="sm" disabled>
            <Settings className="mr-2 h-4 w-4" /> 
            <AutoTranslateText 
              translationKey="notifications.settings" 
              fallback="Notification Settings (Coming Soon)"
            />
        </Button>
      </div>
      
      {mockNotifications.length === 0 ? (
        <Card className="text-center py-12">
            <CardContent>
                 <Bell className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <AutoTranslateText 
                  translationKey="notifications.empty" 
                  fallback="You have no new notifications at the moment."
                  as="p"
                  className="text-lg text-muted-foreground"
                />
            </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
            {mockNotifications.map(notification => (
                <Card key={notification.id} className={`shadow-md ${!notification.read ? 'bg-primary/5 border-primary/30' : 'bg-card'}`}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <AutoTranslateText 
                              translationKey={notification.titleKey} 
                              fallback={notification.titleFallback}
                              as="h3"
                              className={`text-md ${!notification.read ? 'text-primary font-semibold' : 'text-foreground'}`}
                            />
                            <AutoTranslateText 
                              translationKey={notification.timeKey} 
                              fallback={notification.timeFallback}
                              as="span"
                              className={`text-xs ${!notification.read ? 'text-primary/80' : 'text-muted-foreground'}`}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <AutoTranslateText 
                          translationKey={notification.descriptionKey} 
                          fallback={notification.descriptionFallback}
                          as="p"
                          className={`text-sm ${!notification.read ? 'text-primary/90' : 'text-muted-foreground'}`}
                        />
                    </CardContent>                    {!notification.read && (
                         <CardFooter className="p-3 border-t">
                            <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                              <AutoTranslateText 
                                translationKey="notifications.markAsRead" 
                                fallback="Mark as Read (Demo)"
                              />
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            ))}
        </div>
      )}
       <AutoTranslateText 
         translationKey="notifications.footer" 
         fallback="Full notification management, including Push notifications, will be developed later."
         as="p"
         className="text-xs text-muted-foreground text-center mt-8"
       />
    </div>
  );
}
