import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const updateBidSchema = z.object({
  action: z.enum(['ACCEPT', 'REJECT']),
});

// PUT - Aceitar ou rejeitar um lance
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; bidId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = updateBidSchema.parse(body);

    // Verificar se o usuário é o dono da entrega
    const delivery = await prisma.p2PDelivery.findFirst({
      where: {
        id: params.id,
        customerId: session.user.id,
      },
    });

    if (!delivery) {
      return NextResponse.json(
        { error: 'Entrega não encontrada ou sem permissão' },
        { status: 404 }
      );
    }

    if (delivery.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Esta entrega não está mais disponível para aceitar lances' },
        { status: 400 }
      );
    }

    // Verificar se o lance existe
    const bid = await prisma.p2PCourierBid.findFirst({
      where: {
        id: params.bidId,
        deliveryId: params.id,
        status: 'PENDING',
      },
      include: {
        courier: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            vehicleType: true,
            rating: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!bid) {
      return NextResponse.json(
        { error: 'Lance não encontrado' },
        { status: 404 }
      );
    }

    if (action === 'ACCEPT') {
      // Usar transação para garantir consistência
      const result = await prisma.$transaction(async (tx) => {
        // Atualizar o lance aceito
        const acceptedBid = await tx.p2PCourierBid.update({
          where: { id: params.bidId },
          data: { status: 'ACCEPTED' },
          include: {
            courier: {
              select: {
                id: true,
                fullName: true,
                phone: true,
                vehicleType: true,
                rating: true,
              },
            },
          },
        });

        // Rejeitar todos os outros lances
        await tx.p2PCourierBid.updateMany({
          where: {
            deliveryId: params.id,
            id: { not: params.bidId },
            status: 'PENDING',
          },
          data: { status: 'REJECTED' },
        });

        // Atualizar a entrega com o entregador atribuído
        const updatedDelivery = await tx.p2PDelivery.update({
          where: { id: params.id },
          data: {
            status: 'ASSIGNED',
            courierId: bid.courier.id,
            deliveryFee: bid.bidAmount, // Usar o valor do lance aceito
            totalAmount: bid.bidAmount + (delivery.estimatedBudget || 0),
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

        // Criar registro de rastreamento
        await tx.p2PTracking.create({
          data: {
            deliveryId: params.id,
            status: 'ASSIGNED',
            description: `Entregador ${bid.courier.fullName} foi atribuído à entrega`,
          },
        });

        return { acceptedBid, updatedDelivery };
      });

      // Notificar o entregador aceito (implementar posteriormente)
      // await notifyCourierBidAccepted(bid.courier.user.id, result.updatedDelivery);

      // Notificar entregadores rejeitados (implementar posteriormente)
      // await notifyRejectedCouriers(params.id, params.bidId);

      return NextResponse.json({
        message: 'Lance aceito com sucesso',
        bid: result.acceptedBid,
        delivery: result.updatedDelivery,
      });
    } else {
      // Rejeitar o lance
      const rejectedBid = await prisma.p2PCourierBid.update({
        where: { id: params.bidId },
        data: { status: 'REJECTED' },
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
      });

      // Notificar o entregador rejeitado (implementar posteriormente)
      // await notifyCourierBidRejected(bid.courier.user.id, delivery);

      return NextResponse.json({
        message: 'Lance rejeitado',
        bid: rejectedBid,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erro ao processar lance:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Cancelar um lance (apenas o próprio entregador)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; bidId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se o usuário é o dono do lance
    const bid = await prisma.p2PCourierBid.findFirst({
      where: {
        id: params.bidId,
        deliveryId: params.id,
        courier: {
          userId: session.user.id,
        },
        status: 'PENDING',
      },
    });

    if (!bid) {
      return NextResponse.json(
        { error: 'Lance não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    await prisma.p2PCourierBid.delete({
      where: { id: params.bidId },
    });

    return NextResponse.json({ message: 'Lance cancelado com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar lance:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}