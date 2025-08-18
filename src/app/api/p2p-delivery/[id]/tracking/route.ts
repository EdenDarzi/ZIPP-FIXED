import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const createTrackingSchema = z.object({
  status: z.string().min(1, 'Status é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  location: z.string().optional(), // JSON: { lat, lng, address }
  courierLocation: z.string().optional(), // JSON: Current courier location
  estimatedArrival: z.string().optional(), // ISO date string
  photo: z.string().optional(), // URL da foto
  signature: z.string().optional(), // Assinatura digital
});

// GET - Obter histórico de rastreamento
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se o usuário tem acesso a esta entrega
    const delivery = await prisma.p2PDelivery.findFirst({
      where: {
        id: params.id,
        OR: [
          { customerId: session.user.id },
          { courierProfile: { userId: session.user.id } },
        ],
      },
    });

    if (!delivery) {
      return NextResponse.json(
        { error: 'Entrega não encontrada' },
        { status: 404 }
      );
    }

    const tracking = await prisma.p2PTracking.findMany({
      where: {
        deliveryId: params.id,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Incluir informações da entrega para contexto
    const deliveryInfo = {
      id: delivery.id,
      orderNumber: delivery.orderNumber,
      status: delivery.status,
      trackingCode: delivery.trackingCode,
      pickupAddress: delivery.pickupAddress,
      destinationAddress: delivery.destinationAddress,
      packageDescription: delivery.packageDescription,
      estimatedDeliveryTime: delivery.estimatedDeliveryTime,
      actualPickupTime: delivery.actualPickupTime,
      actualDeliveryTime: delivery.actualDeliveryTime,
    };

    return NextResponse.json({
      delivery: deliveryInfo,
      tracking,
    });
  } catch (error) {
    console.error('Erro ao buscar rastreamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Adicionar novo evento de rastreamento (apenas entregador)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se o usuário é o entregador desta entrega
    const delivery = await prisma.p2PDelivery.findFirst({
      where: {
        id: params.id,
        courierProfile: {
          userId: session.user.id,
        },
      },
      include: {
        courierProfile: {
          select: {
            fullName: true,
          },
        },
      },
    });

    if (!delivery) {
      return NextResponse.json(
        { error: 'Entrega não encontrada ou sem permissão' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = createTrackingSchema.parse(body);

    const tracking = await prisma.p2PTracking.create({
      data: {
        deliveryId: params.id,
        ...validatedData,
        estimatedArrival: validatedData.estimatedArrival
          ? new Date(validatedData.estimatedArrival)
          : null,
      },
    });

    // Atualizar localização atual da entrega se fornecida
    if (validatedData.courierLocation) {
      await prisma.p2PDelivery.update({
        where: { id: params.id },
        data: {
          currentLocation: validatedData.courierLocation,
        },
      });
    }

    // Notificar o cliente sobre a atualização (implementar posteriormente)
    // await notifyCustomerTrackingUpdate(delivery.customerId, tracking, delivery);

    return NextResponse.json(tracking, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erro ao criar rastreamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}