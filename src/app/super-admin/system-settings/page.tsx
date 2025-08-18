'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Settings, Database, Mail, Bell, Shield, Globe, Palette, Clock, Server, Save, RefreshCw, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context';

interface SystemSettings {
  general: {
    platformName: string;
    supportEmail: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    defaultLanguage: string;
    timezone: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    orderUpdates: boolean;
    systemAlerts: boolean;
  };
  security: {
    twoFactorRequired: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireStrongPasswords: boolean;
  };
  payments: {
    commissionRate: number;
    minimumPayout: number;
    payoutFrequency: string;
    acceptedCurrencies: string[];
  };
  delivery: {
    maxDeliveryRadius: number;
    defaultDeliveryTime: number;
    enableRealTimeTracking: boolean;
    requireSignature: boolean;
  };
}

const defaultSettings: SystemSettings = {
  general: {
    platformName: 'ZIPP',
    supportEmail: 'support@zipp.co.il',
    maintenanceMode: false,
    registrationEnabled: true,
    defaultLanguage: 'he',
    timezone: 'Asia/Jerusalem'
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    systemAlerts: true
  },
  security: {
    twoFactorRequired: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPasswords: true
  },
  payments: {
    commissionRate: 15,
    minimumPayout: 100,
    payoutFrequency: 'weekly',
    acceptedCurrencies: ['ILS', 'USD', 'EUR']
  },
  delivery: {
    maxDeliveryRadius: 50,
    defaultDeliveryTime: 30,
    enableRealTimeTracking: true,
    requireSignature: false
  }
};

export default function SystemSettingsPage() {
  const { toast } = useToast();
  const { isRTL } = useLanguage();
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (category: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'הגדרות נשמרו בהצלחה',
        description: 'כל השינויים נשמרו במערכת',
      });
      setHasChanges(false);
    } catch (error) {
      toast({
        title: 'שגיאה בשמירת הגדרות',
        description: 'אנא נסה שוב מאוחר יותר',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast({
      title: 'הגדרות אופסו',
      description: 'כל ההגדרות חזרו לברירת המחדל',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.systemSettings" 
                fallback="System Settings"
              />
            </h1>
            <p className="text-muted-foreground">
              <AutoTranslateText 
                translationKey="superAdmin.systemSettingsDesc" 
                fallback="Configure platform-wide settings and preferences"
              />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            איפוס
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={!hasChanges || isLoading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'שומר...' : 'שמור הגדרות'}
          </Button>
        </div>
      </div>

      {/* Warning for changes */}
      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                יש לך שינויים שלא נשמרו. אל תשכח לשמור את ההגדרות.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            כללי
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            התראות
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            אבטחה
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            תשלומים
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            משלוחים
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                הגדרות כלליות
              </CardTitle>
              <CardDescription>
                הגדרות בסיסיות של הפלטפורמה
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platformName">שם הפלטפורמה</Label>
                  <Input
                    id="platformName"
                    value={settings.general.platformName}
                    onChange={(e) => updateSetting('general', 'platformName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">אימייל תמיכה</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">שפת ברירת מחדל</Label>
                  <Select 
                    value={settings.general.defaultLanguage} 
                    onValueChange={(value) => updateSetting('general', 'defaultLanguage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="he">עברית</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="ru">Русский</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">אזור זמן</Label>
                  <Select 
                    value={settings.general.timezone} 
                    onValueChange={(value) => updateSetting('general', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Jerusalem">ירושלים (GMT+2)</SelectItem>
                      <SelectItem value="Europe/London">לונדון (GMT+0)</SelectItem>
                      <SelectItem value="America/New_York">ניו יורק (GMT-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>מצב תחזוקה</Label>
                    <p className="text-sm text-muted-foreground">
                      כאשר מופעל, המערכת תהיה זמינה רק למנהלים
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>הרשמה מופעלת</Label>
                    <p className="text-sm text-muted-foreground">
                      אפשר למשתמשים חדשים להירשם לפלטפורמה
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.registrationEnabled}
                    onCheckedChange={(checked) => updateSetting('general', 'registrationEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                הגדרות התראות
              </CardTitle>
              <CardDescription>
                נהל התראות ועדכונים למשתמשים
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>התראות אימייל</Label>
                    <p className="text-sm text-muted-foreground">
                      שלח התראות באמצעות אימייל
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>התראות SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      שלח התראות באמצעות הודעות טקסט
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'smsNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>התראות Push</Label>
                    <p className="text-sm text-muted-foreground">
                      שלח התראות דחיפה לאפליקציה
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>עדכוני הזמנות</Label>
                    <p className="text-sm text-muted-foreground">
                      התראות על שינויים בסטטוס הזמנות
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.orderUpdates}
                    onCheckedChange={(checked) => updateSetting('notifications', 'orderUpdates', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>התראות מערכת</Label>
                    <p className="text-sm text-muted-foreground">
                      התראות על בעיות ועדכוני מערכת
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) => updateSetting('notifications', 'systemAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                הגדרות אבטחה
              </CardTitle>
              <CardDescription>
                נהל אבטחה ואימות משתמשים
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">זמן פקיעת סשן (דקות)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">מספר ניסיונות התחברות מקסימלי</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">אורך סיסמה מינימלי</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>אימות דו-שלבי חובה</Label>
                    <p className="text-sm text-muted-foreground">
                      דרוש אימות דו-שלבי לכל המשתמשים
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorRequired}
                    onCheckedChange={(checked) => updateSetting('security', 'twoFactorRequired', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>דרוש סיסמאות חזקות</Label>
                    <p className="text-sm text-muted-foreground">
                      סיסמאות חייבות לכלול אותיות, מספרים וסימנים
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.requireStrongPasswords}
                    onCheckedChange={(checked) => updateSetting('security', 'requireStrongPasswords', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Settings */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                הגדרות תשלומים
              </CardTitle>
              <CardDescription>
                נהל עמלות ותשלומים
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="commissionRate">שיעור עמלה (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    step="0.1"
                    value={settings.payments.commissionRate}
                    onChange={(e) => updateSetting('payments', 'commissionRate', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumPayout">סכום מינימלי לתשלום (₪)</Label>
                  <Input
                    id="minimumPayout"
                    type="number"
                    value={settings.payments.minimumPayout}
                    onChange={(e) => updateSetting('payments', 'minimumPayout', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payoutFrequency">תדירות תשלומים</Label>
                  <Select 
                    value={settings.payments.payoutFrequency} 
                    onValueChange={(value) => updateSetting('payments', 'payoutFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">יומי</SelectItem>
                      <SelectItem value="weekly">שבועי</SelectItem>
                      <SelectItem value="monthly">חודשי</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Settings */}
        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                הגדרות משלוחים
              </CardTitle>
              <CardDescription>
                נהל פרמטרי משלוחים ומעקב
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxDeliveryRadius">רדיוס משלוח מקסימלי (ק"מ)</Label>
                  <Input
                    id="maxDeliveryRadius"
                    type="number"
                    value={settings.delivery.maxDeliveryRadius}
                    onChange={(e) => updateSetting('delivery', 'maxDeliveryRadius', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultDeliveryTime">זמן משלוח ברירת מחדל (דקות)</Label>
                  <Input
                    id="defaultDeliveryTime"
                    type="number"
                    value={settings.delivery.defaultDeliveryTime}
                    onChange={(e) => updateSetting('delivery', 'defaultDeliveryTime', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>מעקב בזמן אמת</Label>
                    <p className="text-sm text-muted-foreground">
                      אפשר מעקב GPS בזמן אמת אחר משלוחים
                    </p>
                  </div>
                  <Switch
                    checked={settings.delivery.enableRealTimeTracking}
                    onCheckedChange={(checked) => updateSetting('delivery', 'enableRealTimeTracking', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>דרוש חתימה</Label>
                    <p className="text-sm text-muted-foreground">
                      דרוש חתימה דיגיטלית בעת מסירת המשלוח
                    </p>
                  </div>
                  <Switch
                    checked={settings.delivery.requireSignature}
                    onCheckedChange={(checked) => updateSetting('delivery', 'requireSignature', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}