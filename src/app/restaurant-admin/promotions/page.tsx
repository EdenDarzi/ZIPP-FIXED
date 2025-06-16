
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit3, Trash2, Megaphone, Percent, Tag, CalendarDays, Zap, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Mock data for existing promotions
const mockPromotions = [
  { id: 'promo1', name: 'הנחת סופ"ש 15%', type: 'Percentage', value: '15%', status: 'Active', startDate: '2024-07-26', endDate: '2024-07-28', items: 'כל התפריט' },
  { id: 'promo2', name: 'קנה 1 קבל 1 על פיצות', type: 'BOGO', value: 'פיצה מרגריטה', status: 'Scheduled', startDate: '2024-08-01', endDate: '2024-08-07', items: 'פיצות נבחרות' },
  { id: 'promo3', name: 'משלוח חינם מעל 100₪', type: 'Free Shipping', value: 'מעל 100₪', status: 'Expired', startDate: '2024-07-01', endDate: '2024-07-15', items: 'כל ההזמנות' },
];

export default function PromotionsManagementPage() {
  const { toast } = useToast();
  const [promotions, setPromotions] = useState(mockPromotions);

  const handleCreatePromotion = () => {
    toast({
      title: 'יצירת מבצע חדש (הדגמה)',
      description: 'טופס ליצירת מבצע חדש (אחוז הנחה, קנה-קבל, קופון, וכו\') יופיע כאן.',
    });
  };

  const handleEditPromotion = (promoId: string) => {
    toast({
      title: `עריכת מבצע ${promoId} (הדגמה)`,
      description: 'טופס לעריכת פרטי המבצע יופיע כאן.',
    });
  };

  const handleDeletePromotion = (promoId: string) => {
    // Mock deletion
    setPromotions(prev => prev.filter(p => p.id !== promoId));
    toast({
      title: `מבצע ${promoId} נמחק (הדגמה)`,
      variant: 'destructive',
    });
  };
  
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    if (status === 'Active') return 'default'; // Will be styled green below
    if (status === 'Scheduled') return 'secondary'; // Will be styled blue below
    if (status === 'Expired') return 'destructive';
    return 'outline';
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-headline flex items-center">
                <Megaphone className="mr-2 h-6 w-6 text-primary"/> ניהול מבצעים וקופונים
            </CardTitle>
            <CardDescription>צור, ערוך ועקוב אחר מבצעים, הנחות וקופונים עבור העסק שלך.</CardDescription>
          </div>
          <Button onClick={handleCreatePromotion} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> צור מבצע חדש
          </Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>מבצעים קיימים</CardTitle>
        </CardHeader>
        <CardContent>
          {promotions.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Percent className="h-16 w-16 mx-auto mb-4" />
              <p>אין כרגע מבצעים פעילים או מתוכננים.</p>
              <p className="text-sm">לחץ על "צור מבצע חדש" כדי להתחיל.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם המבצע</TableHead>
                  <TableHead>סוג</TableHead>
                  <TableHead>ערך</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead><CalendarDays className="inline h-4 w-4 mr-1"/>תוקף</TableHead>
                  <TableHead>פריטים רלוונטיים</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.name}</TableCell>
                    <TableCell>{promo.type}</TableCell>
                    <TableCell>{promo.value}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadgeVariant(promo.status)} 
                        className={cn(
                            "capitalize",
                            promo.status === 'Active' && 'bg-green-500 text-white hover:bg-green-600',
                            promo.status === 'Scheduled' && 'bg-blue-500 text-white hover:bg-blue-600'
                        )}
                      >
                        {promo.status === 'Active' && <Zap className="inline h-3 w-3 mr-1"/>}
                        {promo.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{promo.startDate} - {promo.endDate}</TableCell>
                    <TableCell className="text-xs">{promo.items}</TableCell>
                    <TableCell className="space-x-1 rtl:space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => handleEditPromotion(promo.id)} title="ערוך מבצע">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeletePromotion(promo.id)} title="מחק מבצע" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0"/>
                מערכת מבצעים מלאה תכלול הגדרת תנאים, קופונים ייחודיים, מעקב שימוש ועוד.
            </p>
        </CardFooter>
      </Card>
      
       <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-lg text-blue-700 flex items-center"><Lightbulb className="mr-2 h-4 w-4"/>טיפ AI לקידום (הדגמה)</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-blue-600">
                    "לקוחות הגיבו טוב למבצעי 'ארוחה עסקית' בעבר. שקול להפעיל מבצע דומה בימי חול בין 12:00-15:00 כדי להגדיל מכירות בשעות אלו."
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
