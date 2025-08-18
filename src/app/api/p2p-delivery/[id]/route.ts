import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const updateP2PDeliverySchema = z.object({
  status: z.enum(['PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']).optional(),
  actualPurchaseAmount: z.number().optional(),
  purchaseReceipt: z.string().optional(),
  customerRating: z.number().min(1).max(5).optional(),
  courierRating: z.number().min(1).max(5).optional(),
  customerFeedback: z.string().optional(),
  courierFeedback: z.string().optional(),
});

// GET - Obter detalhes de uma entrega específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const delivery = await prisma.p2PDelivery.findFirst({
      where: {
        id: params.id,
        OR: [
          { customerId: session.user.id },
          { courierProfile: { userId: session.user.id } },
        ],
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        courierProfile: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            vehicleType: true,
            rating: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
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
                totalDeliveries: true,
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
        },
      },
    });

    if (!delivery) {
      return NextResponse.json(
        { error: 'Entrega não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(delivery);
  } catch (error) {
    console.error('Erro ao buscar entrega P2P:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar entrega P2P
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateP2PDeliverySchema.parse(body);

    // Verificar se o usuário tem permissão para atualizar esta entrega
    const existingDelivery = await prisma.p2PDelivery.findFirst({
      where: {
        id: params.id,
        OR: [
          { customerId: session.user.id },
          { courierProfile: { userId: session.user.id } },
        ],
      },
      include: {
        courierProfile: true,
      },
    });

    if (!existingDelivery) {
      return NextResponse.json(
        { error: 'Entrega não encontrada ou sem permissão' },
        { status: 404 }
      );
    }

    // Validar transições de status
    if (validatedData.status) {
      const isValidTransition = validateStatusTransition(
        existingDelivery.status,
        validatedData.status,
        session.user.id,
        existingDelivery.customerId,
        existingDelivery.courierProfile?.userId
      );

      if (!isValidTransition) {
        return NextResponse.json(
          { error: 'Transição de status inválida' },
          { status: 400 }
        );
      }
    }

    const updatedDelivery = await prisma.p2PDelivery.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
        // Definir timestamps baseados no status
        ...(validatedData.status === 'PICKED_UP' && !existingDelivery.actualPickupTime
          ? { actualPickupTime: new Date() }
          : {}),
        ...(validatedData.status === 'DELIVERED' && !existingDelivery.actualDeliveryTime
          ? { actualDeliveryTime: new Date(), paymentStatus: 'PAID' }
          : {}),
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        courierProfile: {
          select: {
            fullName: true,
            phone: true,
            vehicleType: true,
            rating: true,
          },
        },
      },
    });

    // Criar registro de rastreamento para mudanças de status
    if (validatedData.status && validatedData.status !== existingDelivery.status) {
      await prisma.p2PTracking.create({
        data: {
          deliveryId: params.id,
          status: validatedData.status,
          description: getStatusDescription(validatedData.status),
        },
      });
    }

    return NextResponse.json(updatedDelivery);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erro ao atualizar entrega P2P:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Cancelar entrega P2P
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const delivery = await prisma.p2PDelivery.findFirst({
      where: {
        id: params.id,
        customerId: session.user.id, // Apenas o cliente pode cancelar
      },
    });

    if (!delivery) {
      return NextResponse.json(
        { error: 'Entrega não encontrada ou sem permissão' },
        { status: 404 }
      );
    }

    // Verificar se a entrega pode ser cancelada
    if (!['PENDING', 'ASSIGNED'].includes(delivery.status)) {
      return NextResponse.json(
        { error: 'Entrega não pode ser cancelada neste status' },
        { status: 400 }
      );
    }

    const cancelledDelivery = await prisma.p2PDelivery.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        paymentStatus: 'REFUNDED',
        updatedAt: new Date(),
      },
    });

    // Criar registro de rastreamento
    await prisma.p2PTracking.create({
      data: {
        deliveryId: params.id,
        status: 'CANCELLED',
        description: 'Entrega cancelada pelo cliente',
      },
    });

    return NextResponse.json(cancelledDelivery);
  } catch (error) {
    console.error('Erro ao cancelar entrega P2P:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função auxiliar para validar transições de status
function validateStatusTransition(
  currentStatus: string,
  newStatus: string,
  userId: string,
  customerId: string,
  courierId?: string
): boolean {
  const isCustomer = userId === customerId;
  const isCourier = userId === courierId;

  const validTransitions: Record<string, string[]> = {
    PENDING: ['ASSIGNED', 'CANCELLED'],
    ASSIGNED: ['PICKED_UP', 'CANCELLED'],
    PICKED_UP: ['IN_TRANSIT'],
    IN_TRANSIT: ['DELIVERED'],
    DELIVERED: [], // Status final
    CANCELLED: [], // Status final
  };

  // Verificar se a transição é válida
  if (!validTransitions[currentStatus]?.includes(newStatus)) {
    return false;
  }

  // Verificar permissões específicas
  switch (newStatus) {
    case 'CANCELLED':
      return isCustomer; // Apenas cliente pode cancelar
    case 'PICKED_UP':
    case 'IN_TRANSIT':
    case 'DELIVERED':
      return isCourier; // Apenas entregador pode atualizar estes status
    case 'ASSIGNED':
      return true; // Sistema pode atribuir automaticamente
    default:
      return false;
  }
}

// Função auxiliar para obter descrição do status
function getStatusDescription(status: string): string {
  const descriptions: Record<string, string> = {
    PENDING: 'Aguardando entregador',
    ASSIGNED: 'Entregador atribuído',
    PICKED_UP: 'Pacote coletado',
    IN_TRANSIT: 'Em trânsito',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado',
  };

  return descriptions[status] || 'Status atualizado';
}