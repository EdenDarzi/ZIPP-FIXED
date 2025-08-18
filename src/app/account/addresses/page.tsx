
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Edit2, Trash2, PlusCircle, Star, Search, MapPinIcon, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from 'react';

interface Address {
  id: string;
  label: string;
  street: string;
  streetLine2?: string | null;
  city: string;
  state?: string | null;
  country: string;
  postalCode?: string | null;
  isPrimary: boolean;
}

export default function UserAddressesPage() {
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'he' || currentLanguage === 'ar';
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ label: '', street: '', streetLine2: '', city: '', state: '', country: '', postalCode: '', isPrimary: false });
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editForm, setEditForm] = useState({ label: '', street: '', streetLine2: '', city: '', state: '', country: '', postalCode: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [deliveryValidation, setDeliveryValidation] = useState<{ valid: boolean; message: string } | null>(null);

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/account/addresses');
      if (!res.ok) throw new Error('Falha');
      const data = await res.json();
      setAddresses(data);
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível carregar endereços', variant: 'destructive' });
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  // Função para buscar endereço por CEP usando Zippopotam.us
  const lookupPostalCode = async (postalCode: string, isEdit = false) => {
    if (!postalCode.trim()) return;
    
    setLookupLoading(true);
    try {
      // Primeiro tenta detectar o país pelo formato do CEP
      const country = detectCountryFromPostalCode(postalCode);
      
      const response = await fetch(`http://api.zippopotam.us/${country}/${postalCode}`);
      if (!response.ok) throw new Error('CEP não encontrado');
      
      const data = await response.json();
      const place = data.places[0];
      
      const updates = {
        city: place['place name'] || '',
        state: place['state'] || '',
        country: data.country || '',
        latitude: parseFloat(place.latitude) || null,
        longitude: parseFloat(place.longitude) || null,
      };
      
      if (isEdit) {
        setEditForm(prev => ({ ...prev, ...updates }));
      } else {
        setForm(prev => ({ ...prev, ...updates }));
      }
      
      // Validar área de entrega
      await validateDeliveryArea(updates.latitude, updates.longitude);
      
      toast({ 
        title: t('addresses.cepFound', 'CEP encontrado'), 
        description: t('addresses.cepFoundDesc', 'Endereço preenchido automaticamente') 
      });
    } catch (error) {
      toast({ 
        title: t('addresses.cepNotFound', 'CEP não encontrado'), 
        description: t('addresses.cepNotFoundDesc', 'Verifique o código postal e tente novamente'),
        variant: 'destructive' 
      });
    } finally {
      setLookupLoading(false);
    }
  };

  // Detecta país pelo formato do CEP
  const detectCountryFromPostalCode = (postalCode: string): string => {
    const cleaned = postalCode.replace(/\D/g, '');
    
    if (/^\d{5}-?\d{3}$/.test(postalCode)) return 'BR'; // Brasil: 12345-678
    if (/^\d{5}$/.test(cleaned)) return 'US'; // EUA: 12345
    if (/^\d{7}$/.test(cleaned)) return 'IL'; // Israel: 1234567
    if (/^\d{5}$/.test(cleaned)) return 'FR'; // França: 12345
    if (/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/.test(postalCode.toUpperCase())) return 'CA'; // Canadá: K1A 0A6
    
    return 'IL'; // Default para Israel
  };

  // Usar geolocalização do usuário
  const useMyLocation = async (isEdit = false) => {
    if (!navigator.geolocation) {
      toast({ 
        title: t('addresses.geoNotSupported', 'Geolocalização não suportada'), 
        variant: 'destructive' 
      });
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Geocoding reverso usando Nominatim (gratuito)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=${currentLanguage}`
          );
          
          if (!response.ok) throw new Error('Geocoding failed');
          
          const data = await response.json();
          const address = data.address || {};
          
          const updates = {
            street: `${address.road || ''} ${address.house_number || ''}`.trim(),
            city: address.city || address.town || address.village || '',
            state: address.state || '',
            country: address.country || '',
            postalCode: address.postcode || '',
            latitude,
            longitude,
          };
          
          if (isEdit) {
            setEditForm(prev => ({ ...prev, ...updates }));
          } else {
            setForm(prev => ({ ...prev, ...updates }));
          }
          
          // Validar área de entrega
          await validateDeliveryArea(latitude, longitude);
          
          toast({ 
            title: t('addresses.locationFound', 'Localização encontrada'), 
            description: t('addresses.locationFoundDesc', 'Endereço preenchido com sua localização atual') 
          });
        } catch (error) {
          toast({ 
            title: t('addresses.geoError', 'Erro na geolocalização'), 
            description: t('addresses.geoErrorDesc', 'Não foi possível obter o endereço da sua localização'),
            variant: 'destructive' 
          });
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        setGeoLoading(false);
        toast({ 
          title: t('addresses.geoPermission', 'Permissão negada'), 
          description: t('addresses.geoPermissionDesc', 'Permita o acesso à localização para usar esta funcionalidade'),
          variant: 'destructive' 
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
    );
  };

  // Validar se está na área de entrega (exemplo para Israel)
  const validateDeliveryArea = async (lat: number | null, lng: number | null) => {
    if (!lat || !lng) {
      setDeliveryValidation(null);
      return;
    }

    // Área aproximada de Israel (exemplo simplificado)
    const israelBounds = {
      north: 33.4,
      south: 29.5,
      east: 35.9,
      west: 34.2
    };

    const isInIsrael = lat >= israelBounds.south && lat <= israelBounds.north && 
                      lng >= israelBounds.west && lng <= israelBounds.east;

    if (isInIsrael) {
      setDeliveryValidation({
        valid: true,
        message: t('addresses.deliveryAvailable', 'Entrega disponível nesta área')
      });
    } else {
      setDeliveryValidation({
        valid: false,
        message: t('addresses.deliveryNotAvailable', 'Entrega não disponível nesta área')
      });
    }
  };

  const handleAddNewAddress = async () => {
    setSaving(true);
    try {
      const isPrimary = addresses.length === 0 || form.isPrimary;
      const res = await fetch('/api/account/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, isPrimary }) });
      if (!res.ok) throw new Error('Failed');
      await fetchAddresses();
      setOpen(false);
      setForm({ label: '', street: '', streetLine2: '', city: '', state: '', country: '', postalCode: '', isPrimary: false });
      toast({ title: t('addresses.saved', 'הכתובת נשמרה') });
    } catch {
      toast({ title: t('addresses.error', 'שגיאה'), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleEditAddress = (addressId: string) => {
    const addr = addresses.find(a => a.id === addressId);
    if (!addr) return;
    setEditingId(addressId);
    setEditForm({
      label: addr.label,
      street: addr.street,
      streetLine2: addr.streetLine2 || '',
      city: addr.city,
      state: addr.state || '',
      country: addr.country,
      postalCode: addr.postalCode || '',
    });
    setEditOpen(true);
  };

  const submitEditAddress = async () => {
    if (!editingId) return;
    setEditSaving(true);
    try {
      const res = await fetch(`/api/account/addresses?id=${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed');
      await fetchAddresses();
      setEditOpen(false);
      setEditingId(null);
      toast({ title: t('addresses.saved', 'הכתובת נשמרה') });
    } catch {
      toast({ title: t('addresses.error', 'שגיאה'), variant: 'destructive' });
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    const confirmDel = confirm(t('addresses.removeConfirm', 'להסיר כתובת זו?'));
    if (!confirmDel) return;
    const res = await fetch(`/api/account/addresses?id=${addressId}`, { method: 'DELETE' });
    if (res.ok) { await fetchAddresses(); toast({ title: t('addresses.saved', 'הכתובת נשמרה') }); } else { toast({ title: t('addresses.error', 'שגיאה'), variant: 'destructive' }); }
  };

  return (
    <Card dir={currentLanguage === 'he' || currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center"><MapPin className="mr-2 h-6 w-6 text-primary"/> {t('addresses.title')}</CardTitle>
        <CardDescription>{t('addresses.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {addresses.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <MapPin className="mx-auto h-12 w-12 mb-3" />
            <p>{t('addresses.noSavedAddresses')}</p>
          </div>
        )}
        {addresses.map(addr => (
          <Card key={addr.id} className="p-4 bg-muted/30">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-1">
                  <Home className="mr-2 h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">{addr.label}</h3>
                  {addr.isPrimary && <Badge variant="default" className="mr-2 bg-green-500 text-white"><Star className="h-3 w-3 mr-1"/>{t('addresses.primaryAddress')}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{addr.street}{addr.streetLine2 ? `, ${addr.streetLine2}` : ''}, {addr.city}{addr.state ? `, ${addr.state}` : ''}</p>
                <p className="text-xs text-muted-foreground">{addr.country} • {t('addresses.postalCode', 'מיקוד')}: {addr.postalCode || '-'}</p>
              </div>
              <div className="flex space-x-1 rtl:space-x-reverse">
                <Button variant="ghost" size="icon" onClick={() => handleEditAddress(addr.id)} title={t('addresses.editAddress')}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(addr.id)} className="text-destructive hover:text-destructive" title={t('addresses.deleteAddress')}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> {t('addresses.addNewAddress')}
            </Button>
          </DialogTrigger>
          <DialogContent dir={isRTL ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle>{t('addresses.addNewAddress')}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 md:col-span-2">
                <Label>{t('addresses.postalCode', 'מיקוד')}</Label>
                <div className="flex gap-2">
                  <Input 
                    value={form.postalCode} 
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })} 
                    placeholder={t('addresses.placeholder.postalCode', '6100001')} 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => lookupPostalCode(form.postalCode)}
                    disabled={lookupLoading}
                  >
                    {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1 md:col-span-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => useMyLocation()}
                  disabled={geoLoading}
                >
                  {geoLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MapPinIcon className="mr-2 h-4 w-4" />
                  )}
                  {t('addresses.useMyLocation', 'השתמש במיקום שלי')}
                </Button>
              </div>

              <div className="space-y-1">
                <Label>{t('addresses.label', 'תווית')}</Label>
                <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder={t('addresses.placeholder.label', 'בית, עבודה...')} />
              </div>
              <div className="space-y-1">
                <Label>{t('addresses.country', 'מדינה')}</Label>
                <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder={t('addresses.placeholder.country', 'ישראל')} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>{t('addresses.street', 'רחוב')}</Label>
                <Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder={t('addresses.placeholder.street', 'רחוב הרצל 10')} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>{t('addresses.street2', 'כתובת (שורה 2)')}</Label>
                <Input value={form.streetLine2} onChange={(e) => setForm({ ...form, streetLine2: e.target.value })} placeholder={t('addresses.placeholder.street2', 'דירה 5 (אופציונלי)')} />
              </div>
              <div className="space-y-1">
                <Label>{t('addresses.city', 'עיר')}</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder={t('addresses.placeholder.city', 'תל אביב-יפו')} />
              </div>
              <div className="space-y-1">
                <Label>{t('addresses.state', 'מחוז/מדינה')}</Label>
                <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder={t('addresses.placeholder.state', 'מרכז')} />
              </div>
            </div>
            
            {deliveryValidation && (
              <Alert className={deliveryValidation.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <AlertDescription className={deliveryValidation.valid ? 'text-green-800' : 'text-red-800'}>
                  {deliveryValidation.message}
                </AlertDescription>
              </Alert>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>{t('addresses.cancel', 'ביטול')}</Button>
              <Button onClick={handleAddNewAddress} disabled={saving}>{t('addresses.save', 'שמור')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent dir={isRTL ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle>{t('addresses.editAddress')}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 md:col-span-2">
                <Label>{t('addresses.postalCode', 'מיקוד')}</Label>
                <div className="flex gap-2">
                  <Input 
                    value={editForm.postalCode} 
                    onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })} 
                    placeholder={t('addresses.placeholder.postalCode', '6100001')} 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => lookupPostalCode(editForm.postalCode, true)}
                    disabled={lookupLoading}
                  >
                    {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1 md:col-span-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => useMyLocation(true)}
                  disabled={geoLoading}
                >
                  {geoLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MapPinIcon className="mr-2 h-4 w-4" />
                  )}
                  {t('addresses.useMyLocation', 'השתמש במיקום שלי')}
                </Button>
              </div>

              <div className="space-y-1">
                <Label>{t('addresses.label', 'תווית')}</Label>
                <Input value={editForm.label} onChange={(e) => setEditForm({ ...editForm, label: e.target.value })} placeholder={t('addresses.placeholder.label', 'בית, עבודה...')} />
              </div>
              <div className="space-y-1">
                <Label>{t('addresses.country', 'מדינה')}</Label>
                <Input value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} placeholder={t('addresses.placeholder.country', 'ישראל')} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>{t('addresses.street', 'רחוב')}</Label>
                <Input value={editForm.street} onChange={(e) => setEditForm({ ...editForm, street: e.target.value })} placeholder={t('addresses.placeholder.street', 'רחוב הרצל 10')} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>{t('addresses.street2', 'כתובת (שורה 2)')}</Label>
                <Input value={editForm.streetLine2} onChange={(e) => setEditForm({ ...editForm, streetLine2: e.target.value })} placeholder={t('addresses.placeholder.street2', 'דירה 5 (אופציונלי)')} />
              </div>
              <div className="space-y-1">
                <Label>{t('addresses.city', 'עיר')}</Label>
                <Input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} placeholder={t('addresses.placeholder.city', 'תל אביב-יפו')} />
              </div>
              <div className="space-y-1">
                <Label>{t('addresses.state', 'מחוז/מדינה')}</Label>
                <Input value={editForm.state} onChange={(e) => setEditForm({ ...editForm, state: e.target.value })} placeholder={t('addresses.placeholder.state', 'מרכז')} />
              </div>
            </div>
            
            {deliveryValidation && (
              <Alert className={deliveryValidation.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <AlertDescription className={deliveryValidation.valid ? 'text-green-800' : 'text-red-800'}>
                  {deliveryValidation.message}
                </AlertDescription>
              </Alert>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>{t('addresses.cancel', 'ביטול')}</Button>
              <Button onClick={submitEditAddress} disabled={editSaving}>{t('addresses.save', 'שמור')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
