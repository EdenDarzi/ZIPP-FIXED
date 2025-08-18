
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Trash2, PlusCircle, Edit2, Star, Wallet as WalletIcon, DollarSign, History, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/language-context";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentMethod {
  id: string;
  type: string;
  brand?: string | null;
  last4?: string | null;
  expiryMonth?: number | null;
  expiryYear?: number | null;
  providerRef?: string | null;
  isPrimary: boolean;
}

export default function UserPaymentMethodsPage() {
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'he' || currentLanguage === 'ar';
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cardForm, setCardForm] = useState({
    type: 'CARD',
    brand: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
    isPrimary: false
  });

  const fetchWallet = async () => {
    try {
      const res = await fetch('/api/wallet');
      if (!res.ok) throw new Error('Falha ao carregar wallet');
      const data = await res.json();
      setWalletBalance(data.balance);
    } catch {}
  };

  const fetchMethods = async () => {
    try {
      const res = await fetch('/api/account/payment-methods');
      if (!res.ok) throw new Error('Falha ao carregar métodos');
      const data = await res.json();
      setMethods(data);
    } catch {}
  };

  useEffect(() => {
    fetchWallet();
    fetchMethods();
  }, []);


  const handleAddNewMethod = async () => {
    setSaving(true);
    try {
      // Extrair últimos 4 dígitos do número do cartão
      const last4 = cardForm.cardNumber.replace(/\D/g, '').slice(-4);
      const isPrimary = methods.length === 0 || cardForm.isPrimary;
      
      const payload = {
        type: cardForm.type,
        brand: cardForm.brand,
        last4,
        expiryMonth: Number(cardForm.expiryMonth),
        expiryYear: Number(cardForm.expiryYear),
        isPrimary,
        // Em produção, aqui você enviaria para um gateway de pagamento para tokenização
        providerRef: `token_${Date.now()}` // Simulação de token
      };
      
      const res = await fetch('/api/account/payment-methods', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      if (!res.ok) throw new Error('Failed');
      
      await fetchMethods();
      setAddModalOpen(false);
      setCardForm({
        type: 'CARD',
        brand: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        holderName: '',
        isPrimary: false
      });
      toast({ title: t('payment.methodAdded', 'אמצעי תשלום נוסף') });
    } catch {
      toast({ title: t('payment.error', 'שגיאה'), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleEditMethod = async (methodId: string) => {
    const method = methods.find(m => m.id === methodId);
    if (!method) return;
    const makePrimary = confirm(t('payment.setPrimaryConfirm', 'הגדר כראשי?'));
    const res = await fetch(`/api/account/payment-methods?id=${methodId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPrimary: makePrimary }) });
    if (res.ok) { await fetchMethods(); toast({ title: t('payment.updated', 'עודכן') }); } else { toast({ title: t('payment.error', 'שגיאה'), variant: 'destructive' }); }
  };

  const handleDeleteMethod = async (methodId: string) => {
    const ok = confirm(t('payment.removeConfirm', 'להסיר אמצעי תשלום?'));
    if (!ok) return;
    const res = await fetch(`/api/account/payment-methods?id=${methodId}`, { method: 'DELETE' });
    if (res.ok) { await fetchMethods(); toast({ title: t('payment.removed', 'הוסר') }); } else { toast({ title: t('payment.error', 'שגיאה'), variant: 'destructive' }); }
  };

  // Função para formatar número do cartão
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Detectar bandeira do cartão
  const detectCardBrand = (number: string) => {
    const cleaned = number.replace(/\D/g, '');
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'MasterCard';
    if (/^3[47]/.test(cleaned)) return 'American Express';
    if (/^6/.test(cleaned)) return 'Discover';
    return '';
  };

  const handleTopUpWallet = () => {
    const amountStr = prompt(t('payment.topUpPrompt', 'סכום לטעינה (₪):'), '50');
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0) return;
    fetch('/api/wallet/topup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount }) })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setWalletBalance(data.wallet.balance);
        toast({ title: t('payment.topUpSuccess', 'הטעינה הצליחה'), description: `${t('payment.newBalance', 'יתרה חדשה')}: ₪${data.wallet.balance.toFixed(2)}` });
      })
      .catch(() => toast({ title: t('payment.error', 'שגיאה'), description: t('payment.topUpFailed', 'טעינת הארנק נכשלה'), variant: 'destructive' }));
  };
  
  const handleViewWalletTransactions = () => {
     toast({
        title: t('payment.transactionsTitle', 'היסטוריית עסקאות ארנק (בקרוב)'),
        description: t('payment.transactionsDesc', 'יוצגו כל הפעולות שבוצעו בארנק שלך.'),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center"><CreditCard className="mr-2 h-6 w-6 text-primary"/> {t('payment.title')}</CardTitle>
        <CardDescription>{t('payment.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        <section>
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-semibold text-primary flex items-center">
                        <WalletIcon className="mr-2 h-5 w-5"/> {t('payment.walletTitle')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded-md shadow-sm">
                        <span className="text-lg font-medium text-muted-foreground">{t('payment.currentBalance')}:</span>
                        {walletBalance === null ? (
                            <span className="text-2xl font-bold text-primary animate-pulse">{t('payment.loading')}</span>
                        ) : (
                            <span className="text-2xl font-bold text-primary">₪{walletBalance.toFixed(2)}</span>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button onClick={handleTopUpWallet} variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                            <DollarSign className="mr-2 h-4 w-4"/> {t('payment.topUpWallet')}
                        </Button>
                        <Button onClick={handleViewWalletTransactions} variant="outline" className="w-full">
                            <History className="mr-2 h-4 w-4"/> {t('payment.viewTransactions')}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center pt-2">{t('payment.payWithWallet')}</p>
                </CardContent>
            </Card>
        </section>
        
        <Separator />

        <section>
            <h3 className="text-lg font-semibold mb-3 text-foreground">{t('payment.savedMethods')}</h3>
            {methods.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
                <CreditCard className="mx-auto h-12 w-12 mb-3" />
                <p>{t('payment.noSavedMethods')}</p>
            </div>
            )}
            <div className="space-y-4">
            {methods.map(method => (
            <Card key={method.id} className="p-4 bg-muted/30 shadow-sm">
                <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <CreditCard className="mr-3 h-6 w-6 text-muted-foreground" />
                    <div>
                    <div className="flex items-center">
                        <p className="font-semibold text-md">
                        {method.type === 'PAYPAL' ? t('payment.paypalAccount') : `${method.brand || method.type} ${t('payment.cardEndingIn')}${method.last4 || 'XXXX'}`}
                        </p>
                        {method.isPrimary && <Badge variant="default" className="mr-2 bg-green-500 text-white text-xs px-1.5 py-0.5"><Star className="h-3 w-3 mr-1"/>{t('payment.primary')}</Badge>}
                    </div>
                    {method.type !== 'PAYPAL' && method.expiryMonth && method.expiryYear && <p className="text-xs text-muted-foreground">{t('payment.expiresOn')}: {String(method.expiryMonth).padStart(2,'0')}/{String(method.expiryYear).slice(-2)}</p>}
                    </div>
                </div>
                <div className="flex space-x-1 rtl:space-x-reverse">
                    <Button variant="ghost" size="icon" onClick={() => handleEditMethod(method.id)} title={t('payment.editMethod')}>
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteMethod(method.id)} className="text-destructive hover:text-destructive" title={t('payment.removeMethod')}>
                    <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                </div>
            </Card>
            ))}
            </div>
        </section>

      </CardContent>
      <CardFooter className="border-t pt-4">
        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" /> {t('payment.addNewMethod')}
            </Button>
          </DialogTrigger>
          <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('payment.addNewMethod')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>{t('payment.cardNumber', 'מספר כרטיס')}</Label>
                <Input
                  value={cardForm.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    const brand = detectCardBrand(e.target.value);
                    setCardForm({ ...cardForm, cardNumber: formatted, brand });
                  }}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {cardForm.brand && (
                  <p className="text-xs text-muted-foreground">{cardForm.brand}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label>{t('payment.holderName', 'שם בעל הכרטיס')}</Label>
                <Input
                  value={cardForm.holderName}
                  onChange={(e) => setCardForm({ ...cardForm, holderName: e.target.value })}
                  placeholder={t('payment.holderNamePlaceholder', 'ישראל ישראלי')}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label>{t('payment.expiryMonth', 'חודש')}</Label>
                  <Select value={cardForm.expiryMonth} onValueChange={(value) => setCardForm({ ...cardForm, expiryMonth: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>{t('payment.expiryYear', 'שנה')}</Label>
                  <Select value={cardForm.expiryYear} onValueChange={(value) => setCardForm({ ...cardForm, expiryYear: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <SelectItem key={year} value={String(year)}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>{t('payment.cvv', 'CVV')}</Label>
                  <Input
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    placeholder="123"
                    maxLength={4}
                    type="password"
                  />
                </div>
              </div>

              {methods.length > 0 && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="setPrimary"
                    checked={cardForm.isPrimary}
                    onChange={(e) => setCardForm({ ...cardForm, isPrimary: e.target.checked })}
                  />
                  <Label htmlFor="setPrimary">{t('payment.setPrimary', 'הגדר כראשי')}</Label>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                {t('payment.cancel', 'ביטול')}
              </Button>
              <Button onClick={handleAddNewMethod} disabled={saving}>
                {saving ? t('payment.saving', 'שומר...') : t('payment.save', 'שמור')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
       <p className="text-xs text-muted-foreground text-center px-6 pb-4 flex items-start">
            <Info className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0"/>
            <span>{t('payment.securityNote')}</span>
        </p>
    </Card>
  );
}
