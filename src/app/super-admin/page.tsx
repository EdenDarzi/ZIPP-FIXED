
'use client'; // Marking as client component to use hooks like useToast

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, Users, BarChart3, Settings, ChefHat, Truck, Home, AlertCircle, CheckCircle, KeyRound, UserCog, VenetianMask, Server, Settings2, Activity, Link as LinkIcon, Eye, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface IpRestriction {
    id: string;
    type: string;
    ip: string;
    status: string;
}

interface Subscription {
    id: string;
    name: string;
    type: string;
    plan: string;
    status: string;
    renewal: string;
}

const initialMockIpRestrictions: IpRestriction[] = [
    { id: 'user123', type: 'עסק', ip: '192.168.1.100', status: 'פעיל' },
    { id: 'courier789', type: 'שליח', ip: '203.0.113.45', status: 'פעיל' },
];

const initialMockSubscriptions: Subscription[] = [
    { id: 'restaurant456', name: 'מסעדת הכוכב', type: 'עסק', plan: 'Pro Business', status: 'פעיל', renewal: '2024-08-15' },
    { id: 'courier007', name: 'יוסי השליח', type: 'שליח', plan: 'Premium Courier', status: 'פג תוקף', renewal: '2024-07-01' },
    { id: 'business789', name: 'חנות הפרחים', type: 'עסק', plan: 'Basic Business', status: 'מושהה', renewal: '2024-09-01' },
];


export default function SuperAdminDashboardPage() {
  const { toast } = useToast();
  const [ipUserId, setIpUserId] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [subUserId, setSubUserId] = useState('');
  const [subPlan, setSubPlan] = useState('');
  const [subStatus, setSubStatus] = useState('');

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [ipRestrictions, setIpRestrictions] = useState<IpRestriction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    setIsLoadingData(true);
    // Simulate fetching data
    const timer = setTimeout(() => {
      setIpRestrictions(initialMockIpRestrictions);
      setSubscriptions(initialMockSubscriptions);
      setIsLoadingData(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);


  const handlePlaceholderClick = (featureName: string) => {
    toast({
      title: "בקרוב!",
      description: `התכונה '${featureName}' עדיין בפיתוח ותהיה זמינה בעדכונים הבאים.`,
    });
  };

  const quickLinks = [
    { href: '/restaurant-admin', label: 'פורטל ניהול עסקים', icon: ChefHat, description: "נהל עסקים, תפריטים והזמנות." },
    { href: '/courier/dashboard', label: 'פורטל שליחים', icon: Truck, description: "עקוב אחר שליחים, הצעות וביצועים." },
    { href: '/', label: 'תצוגת לקוח ראשית', icon: Home, description: "חווה את האפליקציה כלקוח." },
  ];

  const adminTools = [
    { label: 'ניהול משתמשים גלובלי', icon: Users, action: () => handlePlaceholderClick('ניהול משתמשים') },
    { label: 'ניתוחי פלטפורמה מקיפים', icon: BarChart3, action: () => handlePlaceholderClick('ניתוחי פלטפורמה') },
    { label: 'יומני מערכת וביקורת', icon: Server, action: () => handlePlaceholderClick('יומני מערכת') },
  ];

  const handleAddIpRestriction = () => {
    if (!ipUserId || !ipAddress) {
        toast({ title: "שדות חסרים", description: "אנא מלא מזהה משתמש וכתובת IP.", variant: "destructive" });
        return;
    }
    const newRestriction: IpRestriction = { id: ipUserId, type: 'לא ידוע', ip: ipAddress, status: 'פעיל' }; // Type can be fetched or determined
    setIpRestrictions(prev => [newRestriction, ...prev]);
    toast({ title: "הגבלת IP עודכנה (דמו)", description: `הגבלת IP עבור משתמש ${ipUserId} לכתובת ${ipAddress} עודכנה במערכת.` });
    setIpUserId('');
    setIpAddress('');
  };

  const handleUpdateSubscription = () => {
     if (!subUserId || !subPlan || !subStatus) {
        toast({ title: "שדות חסרים", description: "אנא מלא מזהה משתמש, תוכנית וסטטוס.", variant: "destructive" });
        return;
    }
    const updatedSub: Subscription = { id: subUserId, name: 'משתמש מעודכן', type: 'לא ידוע', plan: subPlan, status: subStatus, renewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('he-IL')};
    
    setSubscriptions(prev => {
      const existingIndex = prev.findIndex(s => s.id === subUserId);
      if (existingIndex >= 0) {
        const newArray = [...prev];
        newArray[existingIndex] = updatedSub;
        return newArray;
      } else {
        return [...prev, updatedSub];
      }
    });

    toast({ title: "מנוי עודכן (דמו)", description: `מנוי עבור משתמש ${subUserId} עודכן לתוכנית ${subPlan} בסטטוס ${subStatus}.` });
    setSubUserId('');
    setSubPlan('');
    setSubStatus('');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline text-purple-700 flex items-center">
            <ShieldCheck className="mr-3 h-8 w-8" />
            לוח בקרה - סופר אדמין
          </CardTitle>
          <CardDescription className="text-purple-600">
            ניהול מרכזי של פלטפורמת SwiftServe. מכאן תוכל לגשת לכל חלקי המערכת, לנהל משתמשים, הגדרות ולקבל תובנות גלובליות.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>קישורים מהירים לפורטלים</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          {quickLinks.map(link => (
            <Card key={link.href} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center"><link.icon className="mr-2 h-5 w-5 text-primary" /> {link.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={link.href}>עבור לפורטל</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-xl"><KeyRound className="mr-2 h-5 w-5 text-primary"/> ניהול גישה ואבטחה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold">הגבלת כניסה לפי IP</h3>
                <div className="space-y-2 p-3 border rounded-md bg-muted/30">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="ipUserId">מזהה משתמש (עסק/שליח)</Label>
                            <Input id="ipUserId" placeholder="user_id_123" value={ipUserId} onChange={(e) => setIpUserId(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="ipAddress">כתובת IP מורשית</Label>
                            <Input id="ipAddress" placeholder="123.123.123.123" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} />
                        </div>
                    </div>
                    <Button onClick={handleAddIpRestriction} size="sm" className="w-full">הוסף/עדכן הגבלת IP</Button>
                </div>
                <h4 className="text-md font-medium pt-2">הגבלות IP קיימות:</h4>
                {isLoadingData ? <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary"/></div> : ipRestrictions.length === 0 ? <p className="text-xs text-muted-foreground text-center">אין הגבלות IP מוגדרות.</p> :
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>משתמש</TableHead><TableHead>סוג</TableHead><TableHead>כתובת IP</TableHead><TableHead>סטטוס</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ipRestrictions.map(r => (
                            <TableRow key={r.id + r.ip}>
                                <TableCell className="text-xs">{r.id}</TableCell>
                                <TableCell className="text-xs">{r.type}</TableCell>
                                <TableCell className="text-xs">{r.ip}</TableCell>
                                <TableCell className="text-xs"><Badge variant={r.status === 'פעיל' ? 'default' : 'outline'} className={r.status === 'פעיל' ? 'bg-green-100 text-green-700' : ''}>{r.status}</Badge></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>}
                 <Button variant="outline" size="sm" className="w-full" onClick={() => handlePlaceholderClick("ניהול חוקי חומת אש (WAF)")}><Settings2 className="mr-2"/> חוקי WAF (בקרוב)</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-xl"><UserCog className="mr-2 h-5 w-5 text-primary"/> ניהול מנויים ומפעילים</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold">עדכון סטטוס מנוי</h3>
                 <div className="space-y-2 p-3 border rounded-md bg-muted/30">
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                        <div>
                            <Label htmlFor="subUserId">מזהה משתמש</Label>
                            <Input id="subUserId" placeholder="business_id_456" value={subUserId} onChange={(e) => setSubUserId(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="subPlan">בחר תוכנית</Label>
                             <Select value={subPlan} onValueChange={setSubPlan}>
                                <SelectTrigger id="subPlan"><SelectValue placeholder="בחר תוכנית..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic_business">עסק בסיסי</SelectItem>
                                    <SelectItem value="pro_business">עסק Pro</SelectItem>
                                    <SelectItem value="standard_courier">שליח רגיל</SelectItem>
                                    <SelectItem value="premium_courier">שליח פרימיום</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div>
                            <Label htmlFor="subStatus">בחר סטטוס</Label>
                             <Select value={subStatus} onValueChange={setSubStatus}>
                                <SelectTrigger id="subStatus"><SelectValue placeholder="בחר סטטוס..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">פעיל</SelectItem>
                                    <SelectItem value="suspended">מושהה</SelectItem>
                                    <SelectItem value="expired">פג תוקף</SelectItem>
                                    <SelectItem value="cancelled">בוטל</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleUpdateSubscription} size="sm" className="w-full">עדכן מנוי</Button>
                </div>
                <h4 className="text-md font-medium pt-2">מנויים לדוגמה:</h4>
                {isLoadingData ? <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary"/></div> : subscriptions.length === 0 ? <p className="text-xs text-muted-foreground text-center">אין מנויים להצגה.</p> :
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>שם/מזהה</TableHead><TableHead>סוג</TableHead><TableHead>תוכנית</TableHead><TableHead>סטטוס</TableHead><TableHead>חידוש</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptions.map(s => (
                            <TableRow key={s.id}>
                                <TableCell className="text-xs">{s.name}</TableCell>
                                <TableCell className="text-xs">{s.type}</TableCell>
                                <TableCell className="text-xs">{s.plan}</TableCell>
                                <TableCell className="text-xs"><Badge variant={s.status === 'פעיל' ? 'default' : s.status === 'פג תוקף' ? 'destructive' : 'secondary'} className={s.status === 'פעיל' ? 'bg-green-100 text-green-700' : ''}>{s.status}</Badge></TableCell>
                                <TableCell className="text-xs">{s.renewal}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>}
                <Button variant="outline" size="sm" className="w-full" onClick={() => handlePlaceholderClick("הגדרות תוכניות מנויים גלובליות")}><VenetianMask className="mr-2"/> תוכניות מנויים (בקרוב)</Button>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>כלי ניהול מערכת נוספים (בקרוב)</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          {adminTools.map(tool => (
            <Button key={tool.label} variant="secondary" className="justify-start text-left h-auto py-3" onClick={tool.action}>
              <span className="flex items-center w-full">
                <tool.icon className="mr-3 h-5 w-5 text-muted-foreground" />
                <div className="flex-grow">
                  <p className="font-semibold">{tool.label}</p>
                </div>
              </span>
            </Button>
          ))}
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סטטוס מערכת (מדומה)</CardTitle>
             <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">כל המערכות פועלות כשורה</div>
            <p className="text-xs text-muted-foreground">בדיקה אחרונה: ממש עכשיו. תעבורת רשת: מתונה. עומס שרתים: נמוך.</p>
          </CardContent>
          <CardFooter>
            <Button variant="link" size="sm" onClick={() => handlePlaceholderClick("דף סטטוס מערכת מלא")}><LinkIcon className="h-3 w-3 mr-1"/>דף סטטוס מלא</Button>
          </CardFooter>
        </Card>

    </div>
  );
}

    
