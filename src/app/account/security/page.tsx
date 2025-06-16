
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShieldCheck, KeyRound, BellRing, AtSign, Fingerprint, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function UserSecurityPage() {
  const { toast } = useToast();

  const handleToggle = (featureName: string, enabled: boolean) => {
    toast({
      title: `${featureName} ${enabled ? 'הופעל' : 'כובה'} (דמו)`,
      description: `הגדרת ${featureName.toLowerCase()} עודכנה (זוהי הדגמה בלבד).`,
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "שינוי סיסמה (בקרוב)",
      description: "יופנה לדף ייעודי לשינוי סיסמה.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center"><ShieldCheck className="mr-2 h-6 w-6 text-primary"/> אבטחה והתראות</CardTitle>
        <CardDescription>נהל את הגדרות האבטחה של חשבונך והעדפות התראה.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">הגדרות אבטחה</h3>
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="twoFactorAuthSwitch" className="text-base flex items-center cursor-pointer"><Fingerprint className="mr-2 h-4 w-4 text-primary"/>אימות דו-שלבי (2FA)</Label>
              <p className="text-sm text-muted-foreground">הוסף שכבת אבטחה נוספת לחשבונך.</p>
            </div>
            <Switch id="twoFactorAuthSwitch" onCheckedChange={(checked) => handleToggle('אימות דו-שלבי', checked)} />
          </div>
          <Button onClick={handleChangePassword} variant="outline">
            <KeyRound className="mr-2 h-4 w-4" /> שנה סיסמה (בקרוב)
          </Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">העדפות התראות</h3>
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="loginAlertsSwitch" className="text-base flex items-center cursor-pointer"><AtSign className="mr-2 h-4 w-4 text-blue-500"/> התראות אימייל על כניסות חדשות</Label>
              <p className="text-sm text-muted-foreground">קבל התראה באימייל כאשר יש כניסה לחשבונך ממכשיר חדש.</p>
            </div>
            <Switch id="loginAlertsSwitch" defaultChecked onCheckedChange={(checked) => handleToggle('התראות אימייל על כניסות', checked)} />
          </div>
           <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="suspiciousAlertsSmsSwitch" className="text-base flex items-center cursor-pointer"><Smartphone className="mr-2 h-4 w-4 text-orange-500"/> התראות SMS על פעילות חשודה</Label>
              <p className="text-sm text-muted-foreground">קבל התראת SMS אם נזהה פעילות שאינה אופיינית בחשבונך.</p>
            </div>
            <Switch id="suspiciousAlertsSmsSwitch" onCheckedChange={(checked) => handleToggle('התראות SMS על פעילות חשודה', checked)} />
          </div>
           <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="promotionalNotificationsSwitch" className="text-base flex items-center cursor-pointer"><BellRing className="mr-2 h-4 w-4 text-green-500"/> התראות על מבצעים ועדכונים</Label>
              <p className="text-sm text-muted-foreground">הישאר מעודכן במבצעים חדשים, פיצ'רים וחדשות מ-LivePick.</p>
            </div>
            <Switch id="promotionalNotificationsSwitch" defaultChecked onCheckedChange={(checked) => handleToggle('התראות על מבצעים', checked)} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <p className="text-xs text-muted-foreground">
          שמירה על אבטחת חשבונך היא באחריותך. בחר סיסמה חזקה ושמור עליה בסוד.
        </p>
      </CardFooter>
    </Card>
  );
}
