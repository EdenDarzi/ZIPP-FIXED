import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';
import { z } from 'zod';

const topupSchema = z.object({
  amount: z.number().positive(),
  description: z.string().optional().default('Wallet Top Up'),
});

export async function POST(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const data = topupSchema.parse(body);

    const wallet = await prisma.wallet.upsert({
      where: { userId: auth.userId },
      update: {},
      create: { userId: auth.userId, balance: 0, currency: 'ILS' },
    });

    const tx = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: data.amount,
        type: 'CREDIT',
        description: data.description,
      },
    });

    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: wallet.balance + data.amount },
      include: { transactions: { orderBy: { date: 'desc' } } },
    });

    return NextResponse.json({ wallet: updatedWallet, transaction: tx }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
  }
}



