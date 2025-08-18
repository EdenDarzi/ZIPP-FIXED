import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';

// Schema de validação para criar uma entrega P2P
const createP2PDeliverySchema = z.object({
  pickupAddress: z.string().min(1, 'Endereço de coleta é obrigatório'),
  pickupStreet: z.string().optional(),
  pickupHouseNumber: z.string().optional(),
  pickupCity: z.string().optional(),
  pickupLocation: z.string().optional(), // JSON string
  pickupContactName: z.string().optional(),
  pickupContactPhone: z.string().optional(),
  
  destinationAddress: z.string().min(1, 'Endereço de destino é obrigatório'),
  destinationStreet: z.string().optional(),
  destinationHouseNumber: z.string().optional(),
  destinationCity: z.string().optional(),
  destinationLocation: z.string().optional(), // JSON string
  destinationContactName: z.string().optional(),
  destinationContactPhone: z.string().optional(),
  
  packageDescription: z.string().min(1, 'Descrição do pacote é obrigatória'),
  specialInstructions: z.string().optional(),
  
  isPurchaseRequired: z.boolean().default(false),
  shoppingList: z.string().optional(), // JSON string
  estimatedBudget: z.number().optional(),
  
  priority: z.enum(['NORMAL', 'URGENT', 'EXPRESS']).default('NORMAL'),
  requestedPickupTime: z.string().optional(),
  requestedDeliveryTime: z.string().optional(),
});

// GET - Listar entregas P2P do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {
      customerId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    const [deliveries, total] = await Promise.all([
      prisma.p2PDelivery.findMany({
        where,
        include: {
          courierProfile: {
            select: {
              fullName: true,
              phone: true,
              vehicleType: true,
              rating: true,
            },
          },
          bids: {
            include: {
              courier: {
                select: {
                  fullName: true,
                  phone: true,
                  vehicleType: true,
                  rating: true,
                },
              },
            },
            orderBy: {
              bidAmount: 'asc',
            },
          },
          tracking: {
            orderBy: {
              timestamp: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.p2PDelivery.count({ where }),
    ]);

    return NextResponse.json({
      deliveries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar entregas P2P:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar nova entrega P2P
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createP2PDeliverySchema.parse(body);

    // Gerar número único do pedido
    const orderNumber = `P2P${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Calcular taxa de entrega baseada na distância (simulado)
    const deliveryFee = calculateDeliveryFee(
      validatedData.pickupLocation,
      validatedData.destinationLocation,
      validatedData.priority
    );

    const totalAmount = deliveryFee + (validatedData.estimatedBudget || 0);

    const delivery = await prisma.p2PDelivery.create({
      data: {
        orderNumber,
        customerId: session.user.id,
        ...validatedData,
        requestedPickupTime: validatedData.requestedPickupTime
          ? new Date(validatedData.requestedPickupTime)
          : null,
        requestedDeliveryTime: validatedData.requestedDeliveryTime
          ? new Date(validatedData.requestedDeliveryTime)
          : null,
        status: 'PENDING',
        deliveryFee,
        totalAmount,
        trackingCode: generateTrackingCode(),
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Criar registro inicial de rastreamento
    await prisma.p2PTracking.create({
      data: {
        deliveryId: delivery.id,
        status: 'PENDING',
        description: 'Entrega criada e aguardando entregador',
      },
    });

    return NextResponse.json(delivery, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erro ao criar entrega P2P:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função auxiliar para calcular taxa de entrega
function calculateDeliveryFee(
  pickupLocation?: string,
  destinationLocation?: string,
  priority: string = 'NORMAL'
): number {
  let baseFee = 15.0; // Taxa base em R$

  // Calcular distância (simulado - em produção usar Google Maps API)
  if (pickupLocation && destinationLocation) {
    try {
      const pickup = JSON.parse(pickupLocation);
      const destination = JSON.parse(destinationLocation);
      
      // Fórmula simples de distância (Haversine seria mais precisa)
      const distance = Math.sqrt(
        Math.pow(destination.lat - pickup.lat, 2) +
        Math.pow(destination.lng - pickup.lng, 2)
      ) * 111; // Aproximação em km

      baseFee += distance * 2.5; // R$ 2,50 por km
    } catch (e) {
      // Se não conseguir parsear as coordenadas, usar taxa base
    }
  }

  // Multiplicadores por prioridade
  const priorityMultipliers = {
    NORMAL: 1.0,
    URGENT: 1.5,
    EXPRESS: 2.0,
  };

  return Math.round(baseFee * (priorityMultipliers[priority as keyof typeof priorityMultipliers] || 1.0) * 100) / 100;
}

// Função auxiliar para gerar código de rastreamento
function generateTrackingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ZP';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}