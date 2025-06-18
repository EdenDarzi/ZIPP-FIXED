
'use client'; // Marking as client component to use hooks like useToast

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Users, BarChart3, Settings, ChefHat, Truck, Home, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function SuperAdminDashboardPage() {
  const { toast } = useToast();

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
    { label: 'הגדרות מערכת כלליות', icon: Settings, action: () => handlePlaceholderClick('הגדרות מערכת') },
    { label: 'ניתוחי פלטפורמה מקיפים', icon: BarChart3, action: () => handlePlaceholderClick('ניתוחי פלטפורMA') },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline text-purple-700 flex items-center">
            <ShieldCheck className="mr-3 h-8 w-8" />
            לוח בקרה - סופר אדמין
          </CardTitle>
          <CardDescription className="text-purple-600">
            ניהול מרכזי של פלטפורמת LivePick. מכאן תוכל לגשת לכל חלקי המערכת, לנהל משתמשים, הגדרות ולקבל תובנות גלובליות.
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
              <CardHeader>
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

      <Card>
        <CardHeader>
          <CardTitle>כלי ניהול מרכזיים (בקרוב)</CardTitle>
          <CardDescription>פיצ'רים אלו בפיתוח ויאפשרו ניהול מתקדם של הפלטפורמה.</CardDescription>
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
            <p className="text-xs text-muted-foreground">עדכון אחרון: ממש עכשיו</p>
          </CardContent>
        </Card>

    </div>
  );
}
