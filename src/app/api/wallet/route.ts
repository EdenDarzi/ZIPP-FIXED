import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!wallet) {
      // If wallet doesn't exist, create one for the user
      const newWallet = await prisma.wallet.create({
        data: {
          userId: userId,
          balance: 0,
          currency: 'ILS',
        },
        include: {
          transactions: true,
        }
      });
      return NextResponse.json(newWallet);
    }

    return NextResponse.json(wallet);
  } catch (error) {
    console.error('Error fetching or creating wallet data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
