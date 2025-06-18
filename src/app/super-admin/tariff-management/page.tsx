'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Edit2, Settings, MapPin, CloudRain, Moon, AlertTriangle, Zap, Percent, Shield, Info, Briefcase, BarChart3, X, PlusCircle, Wallet } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface RegionalSurcharge {
  id: string;
  region: string;
  surcharge: number;
}

export default function TariffManagementPage() {
  const { toast } = useToast();
  const [basePricing, setBasePricing] = useState({ firstKm: 20, subsequentKm: 5 });
  const [surcharges, setSurcharges] = useState({ weightLarge: 15, stairsWalking: 10 });
  const [cancellationFees, setCancellationFees] = useState({ beforeDispatch: 5, afterDispatch: 20 });
  const [dynamicSurcharges, setDynamicSurcharges] = useState({
    peakHours: { enabled: true, amount: 1.2, isPercent: true }, // 20% more
    night: { enabled: true, amount: 1.5, isPercent: true }, // 50% more
    weekend: { enabled: true, amount: 5, isPercent: false }, // +5 ILS
    rain: { enabled: false, amount: 7, isPercent: false }, // +7 ILS (AI or manual)
  });
  const [expressFee, setExpressFee] = useState(10);
  const [insuranceFeePercent, setInsuranceFeePercent] = useState(2);
  const [regionalSurcharges, setRegionalSurcharges] = useState<RegionalSurcharge[]>([
    { id: 'eilat1', region: 'אילת', surcharge: 20 },
    { id: 'north_remote', region: 'צפון רחוק (מעל 80קמ)', surcharge: 15 },
  ]);
  const [newRegion, setNewRegion] = useState('');
  const [newRegionSurcharge, setNewRegionSurcharge] = useState<number | string>('');


  const handleSaveAll = () => {
    // In a real app, this would send all state objects to the backend
    console.log({
      basePricing,
      surcharges,
      cancellationFees,
      dynamicSurcharges,
      expressFee,
      insuranceFeePercent,
      regionalSurcharges,
    });
    toast({
      title: 'הגדרות תעריפים נשמרו (הדגמה)',
      description: 'כל תעריפי המשלוחים עודכנו במערכת.',
    });
  };
  
  const handleAddRegionalSurcharge = () => {
    if (!newRegion.trim() || (typeof newRegionSurcharge === 'string' && !newRegionSurcharge.trim()) || Number(newRegionSurcharge) <= 0) {
        toast({ title: "שדות חסרים או לא תקינים", description: "אנא הזן שם אזור ותוספת מחיר חיובית.", variant: "destructive"});
        return;
    }
    setRegionalSurcharges(prev => [...prev, { id: `rs_${Date.now()}`, region: newRegion, surcharge: Number(newRegionSurcharge) }]);
    setNewRegion('');
    setNewRegionSurcharge('');
  };

  const handleRemoveRegionalSurcharge = (id: string) => {
    setRegionalSurcharges(prev => prev.filter(rs => rs.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <DollarSign className="mr-2 h-6 w-6 text-primary" /> ניהול תעריפי משלוחים דינמיים
          </CardTitle>
          <CardDescription>הגדר את כל הפרמטרים המשפיעים על תמחור המשלוחים במערכת SwiftServe.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center"><MapPin className="mr-2 h-5 w-5" /> תמחור בסיסי לפי מרחק</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstKmPrice">מחיר לק"מ הראשון (₪)</Label>
            <Input id="firstKmPrice" type="number" value={basePricing.firstKm} onChange={e => setBasePricing(s => ({...s, firstKm: Number(e.target.value)}))} />
          </div>
          <div>
            <Label htmlFor="subsequentKmPrice">מחיר לכל ק"מ נוסף (₪)</Label>
            <Input id="subsequentKmPrice" type="number" value={basePricing.subsequentKm} onChange={e => setBasePricing(s => ({...s, subsequentKm: Number(e.target.value)}))} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center"><Briefcase className="mr-2 h-5 w-5" /> תוספות מיוחדות</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weightLargeSurcharge">תוספת למשקל/גודל חריג (₪)</Label>
            <Input id="weightLargeSurcharge" type="number" value={surcharges.weightLarge} onChange={e => setSurcharges(s => ({...s, weightLarge: Number(e.target.value)}))} />
          </div>
          <div>
            <Label htmlFor="stairsWalkingSurcharge">תוספת כניסה רגלית / מדרגות (₪)</Label>
            <Input id="stairsWalkingSurcharge" type="number" value={surcharges.stairsWalking} onChange={e => setSurcharges(s => ({...s, stairsWalking: Number(e.target.value)}))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center"><X className="mr-2 h-5 w-5 text-destructive" /> דמי ביטול הזמנה</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cancelBeforeDispatch">ביטול לפני יציאת שליח (₪)</Label>
            <Input id="cancelBeforeDispatch" type="number" value={cancellationFees.beforeDispatch} onChange={e => setCancellationFees(s => ({...s, beforeDispatch: Number(e.target.value)}))} />
          </div>
          <div>
            <Label htmlFor="cancelAfterDispatch">ביטול לאחר יציאת שליח (₪)</Label>
            <Input id="cancelAfterDispatch" type="number" value={cancellationFees.afterDispatch} onChange={e => setCancellationFees(s => ({...s, afterDispatch: Number(e.target.value)}))} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center"><BarChart3 className="mr-2 h-5 w-5" /> תוספות דינמיות לפי שעה/מצב</CardTitle>
          <CardDescription>הפעל והגדר תוספות אוטומטיות. סכום יכול להיות קבוע (₪) או מכפיל (לדוגמה, 1.2 ל-20% תוספת).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(dynamicSurcharges).map(([key, val]) => {
            let labelText = '';
            let Icon = Zap;
            switch(key as keyof typeof dynamicSurcharges) {
                case 'peakHours': labelText = 'שעות שיא'; Icon = Zap; break;
                case 'night': labelText = 'שעות לילה'; Icon = Moon; break;
                case 'weekend': labelText = 'סוף שבוע / חג'; Icon = Wallet; break;
                case 'rain': labelText = 'תנאי מזג אוויר קשים (גשם וכו\')'; Icon = CloudRain; break;
            }
            return (
            <div key={key} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
              <div className="flex items-center">
                <Icon className="mr-2 h-4 w-4 text-primary"/>
                <Label htmlFor={`dyn-${key}-enabled`} className="text-sm">{labelText}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id={`dyn-${key}-enabled`} checked={val.enabled} onCheckedChange={c => setDynamicSurcharges(s => ({...s, [key]: {...s[key as keyof typeof s], enabled: c}}))} />
                <Input type="number" step="0.01" value={val.amount} onChange={e => setDynamicSurcharges(s => ({...s, [key]: {...s[key as keyof typeof s], amount: Number(e.target.value)}}))} className="w-20 h-8" disabled={!val.enabled} />
                <Select value={val.isPercent ? "percent" : "fixed"} onValueChange={v => setDynamicSurcharges(s => ({...s, [key]: {...s[key as keyof typeof s], isPercent: v === 'percent'}}))} disabled={!val.enabled}>
                    <SelectTrigger className="w-24 h-8 text-xs"><SelectValue/></SelectTrigger>
                    <SelectContent><SelectItem value="fixed">₪</SelectItem><SelectItem value="percent">מכפיל</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          )})}
           <p className="text-xs text-muted-foreground p-2 bg-blue-50 border border-blue-200 rounded-md flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0"/>
                <span>מצב גשם יכול להיות מופעל ידנית על ידי מנהל מערכת או אוטומטית על ידי AI המזהה תנאי מזג אוויר קשים (בפיתוח).</span>
            </p>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Zap className="mr-2 h-5 w-5 text-orange-500"/> משלוח אקספרס</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="expressFee">תוספת קבועה למשלוח אקספרס (₪)</Label>
            <Input id="expressFee" type="number" value={expressFee} onChange={e => setExpressFee(Number(e.target.value))} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Shield className="mr-2 h-5 w-5 text-green-500"/> ביטוח משלוח</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="insuranceFee">אחוז ביטוח (מערך החבילה)</Label>
            <div className="flex items-center gap-2">
              <Input id="insuranceFee" type="number" step="0.1" value={insuranceFeePercent} onChange={e => setInsuranceFeePercent(Number(e.target.value))} />
              <Percent className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="text-lg flex items-center"><MapPin className="mr-2 h-5 w-5"/> תוספות אזוריות</CardTitle>
            <CardDescription>הגדר תוספות תשלום מיוחדות לאזורים ספציפיים.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-3 mb-4">
                {regionalSurcharges.map(rs => (
                    <div key={rs.id} className="flex items-center justify-between p-2 border rounded-md">
                        <span className="text-sm">{rs.region}: ₪{rs.surcharge.toFixed(2)}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveRegionalSurcharge(rs.id)} className="h-7 w-7 text-destructive"><X className="h-4 w-4"/></Button>
                    </div>
                ))}
                {regionalSurcharges.length === 0 && <p className="text-xs text-muted-foreground text-center">אין כרגע תוספות אזוריות מוגדרות.</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_auto] gap-2 items-end p-3 border-t pt-3">
                <Input placeholder="שם אזור (לדוגמה: אילת)" value={newRegion} onChange={e => setNewRegion(e.target.value)} />
                <Input type="number" placeholder="תוספת (₪)" value={newRegionSurcharge} onChange={e => setNewRegionSurcharge(e.target.value)} />
                <Button onClick={handleAddRegionalSurcharge}><PlusCircle className="mr-2 h-4 w-4"/>הוסף אזור</Button>
            </div>
        </CardContent>
      </Card>


      <div className="flex justify-end mt-8">
        <Button onClick={handleSaveAll} size="lg" className="bg-primary hover:bg-primary/90 text-lg">
          <Edit2 className="mr-2 h-5 w-5" /> שמור את כל הגדרות התעריפים
        </Button>
      </div>
       <p className="text-xs text-muted-foreground text-center mt-4">
        שינויים בתעריפים ישפיעו על חישובי עלות משלוח חדשים. המערכת תשתמש בהגדרות אלו באופן דינמי.
      </p>
    </div>
  );
}