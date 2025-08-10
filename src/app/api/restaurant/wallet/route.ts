import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import type { Wallet, TransactionType, TransactionStatus } from '@/types';

export async function GET() {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // We'll assume 'admin' role is required to access restaurant wallet.
  // This can be adjusted based on your actual Clerk role setup.
  if (orgRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Insufficient role' }, { status: 403 });
  }

  try {
    let wallet = await prisma.wallet.findUnique({
      where: {
        // Wallets for restaurants are linked to the organization ID
        userId: orgId, 
      },
      include: {
        transactions: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!wallet) {
      // If no wallet exists for the restaurant (organization), create one
      wallet = await prisma.wallet.create({
        data: {
          userId: orgId, // Link wallet to the Clerk organization ID
          balance: 0,
          transactions: {
            create: [{
                description: 'ארנק נוצר',
                amount: 0,
                type: 'CREDIT',
            }]
          }
        },
        include: {
            transactions: true
        }
      });
    }

    // Convert Prisma model to Wallet type
    const walletResponse: Wallet = {
      userId: wallet.userId,
      balance: wallet.balance,
      transactions: wallet.transactions.map(tx => ({
        id: tx.id,
        amount: tx.amount,
        type: tx.type as TransactionType,
        description: tx.description,
        date: tx.date.toISOString(),
        reference: tx.reference || undefined,
        status: 'completed' as TransactionStatus,
      })),
      lastUpdatedAt: wallet.updatedAt.toISOString(),
    };

    return NextResponse.json(walletResponse);
  } catch (error) {
    console.error('Error fetching restaurant wallet:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
