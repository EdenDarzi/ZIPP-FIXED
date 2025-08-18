'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Star,
  MessageCircle
} from 'lucide-react';

interface P2PDelivery {
  id: string;
  orderNumber: string;
  trackingCode: string;
  status: string;
  priority: string;
  packageDescription: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupContactName?: string;
  pickupContactPhone?: string;
  destinationContactName?: string;
  destinationContactPhone?: string;
  specialInstructions?: string;
  deliveryFee: number;
  totalAmount: number;
  isPurchaseRequired: boolean;
  shoppingList?: string;
  estimatedBudget?: number;
  requestedPickupTime?: string;
  requestedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
  assignedCourier?: {
    id: string;
    fullName: string;
    phone: string;
    vehicleType: string;
    rating: number;
  };
  tracking: Array<{
    id: string;
    status: string;
    description: string;
    location?: string;
    lat?: number;
    lng?: number;
    createdAt: string;
  }>;
}

const statusConfig = {
  PENDING: { label: 'Aguardando Entregador', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  COURIER_ASSIGNED: { label: 'Entregador Designado', color: 'bg-blue-100 text-blue-800', icon: User },
  PICKUP_IN_PROGRESS: { label: 'Indo para Coleta', color: 'bg-orange-100 text-orange-800', icon: Truck },
  PICKED_UP: { label: 'Coletado', color: 'bg-purple-100 text-purple-800', icon: Package },
  IN_TRANSIT: { label: 'Em Trânsito', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  DELIVERED: { label: 'Entregue', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: AlertCircle },
};

const priorityConfig = {
  NORMAL: { label: 'Normal', color: 'bg-gray-100 text-gray-800' },
  URGENT: { label: 'Urgente', color: 'bg-orange-100 text-orange-800' },
  EXPRESS: { label: 'Express', color: 'bg-red-100 text-red-800' },
};

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [delivery, setDelivery] = useState<P2PDelivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const trackingCode = params.trackingCode as string;

  useEffect(() => {
    if (trackingCode) {
      fetchDeliveryData();
      // Set up polling for real-time updates
      const interval = setInterval(fetchDeliveryData, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [trackingCode]);

  const fetchDeliveryData = async () => {
    try {
      const response = await fetch(`/api/p2p-delivery?trackingCode=${trackingCode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar dados da entrega');
      }

      if (data.deliveries && data.deliveries.length > 0) {
        setDelivery(data.deliveries[0]);
      } else {
        setError('Entrega não encontrada');
      }
    } catch (error: any) {
      console.error('Error fetching delivery:', error);
      setError(error.message || 'Erro ao carregar dados da entrega');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !delivery) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Entrega não encontrada</h2>
            <p className="text-gray-600 mb-4">
              {error || 'Não foi possível encontrar uma entrega com este código de rastreamento.'}
            </p>
            <Button onClick={() => router.push('/')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStatus = statusConfig[delivery.status as keyof typeof statusConfig];
  const currentPriority = priorityConfig[delivery.priority as keyof typeof priorityConfig];
  const StatusIcon = currentStatus?.icon || AlertCircle;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button onClick={() => router.back()} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Rastreamento de Entrega</h1>
        <p className="text-gray-600">Código: {delivery.trackingCode}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StatusIcon className="h-5 w-5" />
              Status Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={currentStatus?.color}>
                  {currentStatus?.label}
                </Badge>
                <Badge className={currentPriority?.color}>
                  {currentPriority?.label}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pedido #{delivery.orderNumber}</p>
                <p className="text-sm text-gray-600">Criado em {formatDateTime(delivery.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Detalhes da Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Descrição:</p>
                <p className="text-sm text-gray-600">{delivery.packageDescription}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Taxa de Entrega:</p>
                  <p>R$ {delivery.deliveryFee.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-medium">Total:</p>
                  <p className="font-semibold">R$ {delivery.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-green-700 mb-2">Coleta</h4>
                <p className="text-sm mb-2">{delivery.pickupAddress}</p>
                {delivery.pickupContactName && (
                  <div className="text-sm text-gray-600">
                    <p className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {delivery.pickupContactName}
                    </p>
                    {delivery.pickupContactPhone && (
                      <p className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {delivery.pickupContactPhone}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-blue-700 mb-2">Destino</h4>
                <p className="text-sm mb-2">{delivery.destinationAddress}</p>
                {delivery.destinationContactName && (
                  <div className="text-sm text-gray-600">
                    <p className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {delivery.destinationContactName}
                    </p>
                    {delivery.destinationContactPhone && (
                      <p className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {delivery.destinationContactPhone}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courier Info */}
        {delivery.assignedCourier && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Entregador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{delivery.assignedCourier.fullName}</p>
                    <p className="text-sm text-gray-600">{delivery.assignedCourier.vehicleType}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{delivery.assignedCourier.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Ligar
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Mensagem
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Purchase Details */}
        {delivery.isPurchaseRequired && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Detalhes da Compra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {delivery.shoppingList && (
                  <div>
                    <p className="font-medium mb-1">Lista de Compras:</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{delivery.shoppingList}</p>
                  </div>
                )}
                {delivery.estimatedBudget && (
                  <div>
                    <p className="font-medium">Orçamento Estimado:</p>
                    <p className="text-sm">R$ {delivery.estimatedBudget.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Special Instructions */}
        {delivery.specialInstructions && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Instruções Especiais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{delivery.specialInstructions}</p>
            </CardContent>
          </Card>
        )}

        {/* Tracking History */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Histórico de Rastreamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {delivery.tracking.length > 0 ? (
                delivery.tracking.map((event, index) => {
                  const eventStatus = statusConfig[event.status as keyof typeof statusConfig];
                  const EventIcon = eventStatus?.icon || AlertCircle;
                  
                  return (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full ${eventStatus?.color || 'bg-gray-100'}`}>
                          <EventIcon className="h-4 w-4" />
                        </div>
                        {index < delivery.tracking.length - 1 && (
                          <div className="w-px h-8 bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{eventStatus?.label || event.status}</p>
                          <p className="text-sm text-gray-500">{formatDateTime(event.createdAt)}</p>
                        </div>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        {event.location && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhum evento de rastreamento ainda.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}