import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const createBidSchema = z.object({
  bidAmount: z.number().min(5, 'Valor mínimo do lance é R$ 5,00'),
  etaMinutes: z.number().min(5, 'Tempo estimado mínimo é 5 minutos'),
  message: z.string().optional(),
});

// GET - Listar lances de uma entrega
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

    const bids = await prisma.p2PCourierBid.findMany({
      where: {
        deliveryId: params.id,
      },
      include: {
        courier: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            vehicleType: true,
            rating: true,
            totalDeliveries: true,
            trustScore: true,
          },
        },
      },
      orderBy: {
        bidAmount: 'asc',
      },
    });

    return NextResponse.json(bids);
  } catch (error) {
    console.error('Erro ao buscar lances:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo lance
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se o usuário é um entregador
    const courierProfile = await prisma.courierProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!courierProfile) {
      return NextResponse.json(
        { error: 'Apenas entregadores podem fazer lances' },
        { status: 403 }
      );
    }

    // Verificar se a entrega existe e está disponível para lances
    const delivery = await prisma.p2PDelivery.findUnique({
      where: { id: params.id },
    });

    if (!delivery) {
      return NextResponse.json(
        { error: 'Entrega não encontrada' },
        { status: 404 }
      );
    }

    if (delivery.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Esta entrega não está mais disponível para lances' },
        { status: 400 }
      );
    }

    // Verificar se o entregador já fez um lance
    const existingBid = await prisma.p2PCourierBid.findFirst({
      where: {
        deliveryId: params.id,
        courierId: courierProfile.id,
      },
    });

    if (existingBid) {
      return NextResponse.json(
        { error: 'Você já fez um lance para esta entrega' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = createBidSchema.parse(body);

    const bid = await prisma.p2PCourierBid.create({
      data: {
        deliveryId: params.id,
        courierId: courierProfile.id,
        ...validatedData,
      },
      include: {
        courier: {
          select: {
            fullName: true,
            phone: true,
            vehicleType: true,
            rating: true,
            totalDeliveries: true,
            trustScore: true,
          },
        },
        delivery: {
          select: {
            orderNumber: true,
            packageDescription: true,
            customer: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Notificar o cliente sobre o novo lance (implementar posteriormente)
    // await notifyCustomerNewBid(delivery.customerId, bid);

    return NextResponse.json(bid, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erro ao criar lance:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}