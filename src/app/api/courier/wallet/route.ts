import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // First, verify the user is a courier
    const courierProfile = await prisma.courierProfile.findUnique({
      where: { userId },
    });

    if (!courierProfile) {
      return NextResponse.json({ error: 'Courier profile not found' }, { status: 404 });
    }

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
      // If wallet doesn't exist for the courier, create one
      const newWallet = await prisma.wallet.create({
        data: {
          userId: userId,
          balance: 0, // Initial balance
          currency: 'ILS',
        },
        include: {
          transactions: true,
        },
      });
      return NextResponse.json(newWallet);
    }

    return NextResponse.json(wallet);
  } catch (error) {
    console.error('Error fetching courier wallet data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
