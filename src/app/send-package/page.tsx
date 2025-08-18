'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { useState } from 'react';
import { PackagePlus, ShoppingBag, Loader2, Send, User, Phone, MapPin, Clock, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';

interface P2PDeliveryResponse {
  id: string;
  orderNumber: string;
  trackingCode: string;
  status: string;
  deliveryFee: number;
  totalAmount: number;
  createdAt: string;
}

const createP2PFormSchema = (t: (key: string) => string) => z.object({
  // Pickup Details
  pickupAddress: z.string().min(5, { message: t('sendPackage.validation.pickupAddress') }),
  pickupStreet: z.string().optional(),
  pickupHouseNumber: z.string().optional(),
  pickupCity: z.string().optional(),
  pickupContactName: z.string().optional(),
  pickupContactPhone: z.string().optional(),
  
  // Destination Details
  destinationAddress: z.string().min(5, { message: t('sendPackage.validation.destinationAddress') }),
  destinationStreet: z.string().optional(),
  destinationHouseNumber: z.string().optional(),
  destinationCity: z.string().optional(),
  destinationContactName: z.string().optional(),
  destinationContactPhone: z.string().optional(),
  
  // Package Details
  packageDescription: z.string().min(3, { message: t('sendPackage.validation.packageDescription') }),
  specialInstructions: z.string().optional(),
  
  // Purchase Details
  isPurchaseRequired: z.boolean().default(false),
  shoppingList: z.string().optional(),
  estimatedBudget: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: t('sendPackage.validation.budget') }).positive({ message: t('sendPackage.validation.budgetPositive') }).optional()
  ),
  
  // Delivery Options
  priority: z.enum(['NORMAL', 'URGENT', 'EXPRESS']).default('NORMAL'),
  requestedPickupTime: z.string().optional(),
  requestedDeliveryTime: z.string().optional(),
}).refine(data => {
  if (data.isPurchaseRequired) {
    return !!data.shoppingList && data.shoppingList.length > 0 && data.estimatedBudget !== undefined && data.estimatedBudget > 0;
  }
  return true;
}, {
  message: t('sendPackage.validation.purchaseRequired'),
  path: ['isPurchaseRequired'],
});

export default function SendPackagePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  
  const p2pFormSchema = createP2PFormSchema(t);
  type P2PFormValues = z.infer<typeof p2pFormSchema>;
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<P2PDeliveryResponse | null>(null);

  const form = useForm<P2PFormValues>({
    resolver: zodResolver(p2pFormSchema),
    defaultValues: {
      pickupAddress: '',
      pickupStreet: '',
      pickupHouseNumber: '',
      pickupCity: '',
      pickupContactName: '',
      pickupContactPhone: '',
      destinationAddress: '',
      destinationStreet: '',
      destinationHouseNumber: '',
      destinationCity: '',
      destinationContactName: '',
      destinationContactPhone: '',
      packageDescription: '',
      specialInstructions: '',
      isPurchaseRequired: false,
      shoppingList: '',
      estimatedBudget: undefined,
      priority: 'NORMAL',
      requestedPickupTime: '',
      requestedDeliveryTime: '',
    },
  });

  const isPurchaseRequired = form.watch('isPurchaseRequired');

  async function onSubmit(values: P2PFormValues) {
    setIsLoading(true);
    setDeliveryResult(null);
    
    try {
      const response = await fetch('/api/p2p-delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          requestedPickupTime: values.requestedPickupTime || undefined,
          requestedDeliveryTime: values.requestedDeliveryTime || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar entrega');
      }

      setDeliveryResult(data);
      toast({
        title: 'Entrega criada com sucesso!',
        description: `Número do pedido: ${data.orderNumber}. Código de rastreamento: ${data.trackingCode}`,
      });
      
      // Reset form on success
      form.reset();
      
    } catch (error: any) {
      console.error('Error creating P2P delivery:', error);
      toast({
        title: 'Erro ao criar entrega',
        description: error.message || 'Ocorreu um erro inesperado. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <PackagePlus className="h-12 w-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-headline text-primary">{t('sendPackage.title')}</CardTitle>
          <CardDescription>
            {t('sendPackage.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('sendPackage.deliveryDetails')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="pickupAddress" render={({ field }) => (
                    <FormItem>
                      <FormLabel><MapPin className="inline h-4 w-4 mr-1"/> {t('sendPackage.pickupAddress')}</FormLabel>
                       <FormControl><Input placeholder={t('sendPackage.addressPlaceholder')} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="pickupStreet" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('sendPackage.street')}</FormLabel>
                        <FormControl><Input placeholder={t('sendPackage.streetPlaceholder')} {...field} /></FormControl>
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="pickupHouseNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('sendPackage.houseNumber')}</FormLabel>
                        <FormControl><Input placeholder={t('sendPackage.houseNumberPlaceholder')} {...field} /></FormControl>
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="pickupCity" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('sendPackage.city')}</FormLabel>
                        <FormControl><Input placeholder={t('sendPackage.cityPlaceholder')} {...field} /></FormControl>
                      </FormItem>
                    )}/>
                  </div>

                  <FormField control={form.control} name="destinationAddress" render={({ field }) => (
                    <FormItem>
                      <FormLabel><MapPin className="inline h-4 w-4 mr-1"/> {t('sendPackage.destinationAddress')}</FormLabel>
                       <FormControl><Input placeholder={t('sendPackage.addressPlaceholder')} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="destinationStreet" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('sendPackage.street')}</FormLabel>
                        <FormControl><Input placeholder={t('sendPackage.streetPlaceholder')} {...field} /></FormControl>
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="destinationHouseNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('sendPackage.houseNumber')}</FormLabel>
                        <FormControl><Input placeholder={t('sendPackage.houseNumberPlaceholder')} {...field} /></FormControl>
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="destinationCity" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('sendPackage.city')}</FormLabel>
                        <FormControl><Input placeholder={t('sendPackage.cityPlaceholder')} {...field} /></FormControl>
                      </FormItem>
                    )}/>
                  </div>

                  <FormField control={form.control} name="packageDescription" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('sendPackage.packageTaskDescription')}</FormLabel>
                      <FormControl><Textarea placeholder={t('sendPackage.packageDescriptionPlaceholder')} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('sendPackage.contactDetails')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="pickupContactName" render={({ field }) => (
                             <FormItem><FormLabel><User className="inline h-4 w-4 mr-1"/> {t('sendPackage.pickupContact')}</FormLabel><FormControl><Input placeholder={t('sendPackage.namePlaceholder')} {...field} /></FormControl></FormItem>
                         )}/>
                         <FormField control={form.control} name="pickupContactPhone" render={({ field }) => (
                             <FormItem><FormLabel><Phone className="inline h-4 w-4 mr-1"/> {t('sendPackage.pickupPhone')}</FormLabel><FormControl><Input type="tel" placeholder={t('sendPackage.phonePlaceholder')} {...field} /></FormControl></FormItem>
                         )}/>
                    </div>
                     <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="destinationContactName" render={({ field }) => (
                             <FormItem><FormLabel><User className="inline h-4 w-4 mr-1"/> {t('sendPackage.destinationContact')}</FormLabel><FormControl><Input placeholder={t('sendPackage.namePlaceholder')} {...field} /></FormControl></FormItem>
                         )}/>
                         <FormField control={form.control} name="destinationContactPhone" render={({ field }) => (
                             <FormItem><FormLabel><Phone className="inline h-4 w-4 mr-1"/> {t('sendPackage.destinationPhone')}</FormLabel><FormControl><Input type="tel" placeholder={t('sendPackage.phonePlaceholder')} {...field} /></FormControl></FormItem>
                         )}/>
                    </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('sendPackage.deliveryOptions')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="priority" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('sendPackage.priority')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a prioridade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NORMAL">{t('sendPackage.priority.normal')}</SelectItem>
                          <SelectItem value="URGENT">{t('sendPackage.priority.urgent')}</SelectItem>
                          <SelectItem value="EXPRESS">{t('sendPackage.priority.express')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="requestedPickupTime" render={({ field }) => (
                      <FormItem>
                        <FormLabel><Clock className="inline h-4 w-4 mr-1"/> {t('sendPackage.requestedPickupTime')}</FormLabel>
                        <FormControl><Input type="datetime-local" {...field} /></FormControl>
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="requestedDeliveryTime" render={({ field }) => (
                      <FormItem>
                        <FormLabel><Clock className="inline h-4 w-4 mr-1"/> {t('sendPackage.requestedDeliveryTime')}</FormLabel>
                        <FormControl><Input type="datetime-local" {...field} /></FormControl>
                      </FormItem>
                    )}/>
                  </div>
                </CardContent>
              </Card>

              <FormField control={form.control} name="isPurchaseRequired" render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md bg-muted/20">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} id="isPurchaseRequired" /></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="isPurchaseRequired" className="cursor-pointer flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-2 text-accent"/> {t('sendPackage.courierNeedsToPurchase')}
                    </FormLabel>
                  </div>
                </FormItem>
              )}/>

              {isPurchaseRequired && (
                <Card className="animate-fadeIn bg-accent/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-2 text-accent"/> {t('sendPackage.purchaseDetails')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="shoppingList" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('sendPackage.shoppingListLabel')}</FormLabel>
                        <FormControl><Textarea placeholder={t('sendPackage.shoppingListPlaceholder')} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="estimatedBudget" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('sendPackage.estimatedBudgetLabel')}</FormLabel>
                        <FormControl><Input type="number" step="0.01" placeholder={t('sendPackage.budgetPlaceholder')} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </CardContent>
                </Card>
              )}
               {form.formState.errors.isPurchaseRequired && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.isPurchaseRequired.message}</p>
              )}


              <FormField control={form.control} name="specialInstructions" render={({ field }) => (
                <FormItem>
                  <FormLabel><AlertCircle className="inline h-4 w-4 mr-1"/> {t('sendPackage.specialInstructionsForCourier')}</FormLabel>
                  <FormControl><Textarea placeholder={t('sendPackage.specialInstructionsPlaceholder')} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('sendPackage.creatingDelivery')}</>
                ) : (
                  <><Send className="mr-2 h-4 w-4" /> {t('sendPackage.requestDelivery')}</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        {deliveryResult && (
          <Card className="border-green-200 bg-green-50 mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <p className="text-green-800 font-medium">{t('sendPackage.deliveryCreatedSuccessfully')}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('sendPackage.orderNumber')}</span>
                  <span className="font-mono font-medium">{deliveryResult.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('sendPackage.trackingCode')}</span>
                  <span className="font-mono font-medium">{deliveryResult.trackingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('sendPackage.status')}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{deliveryResult.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('sendPackage.deliveryFee')}</span>
                  <span className="font-medium">R$ {deliveryResult.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-600">{t('sendPackage.total')}</span>
                  <span>R$ {deliveryResult.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-green-200">
                <Button 
                  onClick={() => router.push(`/track/${deliveryResult.trackingCode}`)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {t('sendPackage.trackDelivery')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </Card>
    </div>
  );
}

