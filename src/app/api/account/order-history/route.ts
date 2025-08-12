import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { customerId: auth.userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      totalPrice: true,
      status: true,
      restaurant: { select: { name: true } },
    },
  });

  const result = orders.map(o => ({
    id: o.id,
    date: o.createdAt,
    total: o.totalPrice,
    status: o.status,
    restaurantName: o.restaurant.name,
  }));

  return NextResponse.json(result);
}



