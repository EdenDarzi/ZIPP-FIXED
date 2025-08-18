import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';
import { z } from 'zod';

const pmSchema = z.object({
  type: z.enum(['CARD', 'PAYPAL', 'APPLE_PAY', 'GOOGLE_PAY']).or(z.string()),
  brand: z.string().optional().nullable(),
  last4: z.string().min(2).max(4).optional().nullable(),
  expiryMonth: z.number().min(1).max(12).optional().nullable(),
  expiryYear: z.number().min(2000).max(2100).optional().nullable(),
  providerRef: z.string().optional().nullable(),
  isPrimary: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const methods = await prisma.paymentMethod.findMany({
    where: { userId: auth.userId },
    orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(methods);
}

export async function POST(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const body = await request.json();
  const data = pmSchema.parse(body);

  if (data.isPrimary) {
    await prisma.paymentMethod.updateMany({ where: { userId: auth.userId, isPrimary: true }, data: { isPrimary: false } });
  }

  const created = await prisma.paymentMethod.create({
    data: {
      userId: auth.userId,
      type: String(data.type),
      brand: data.brand ?? null,
      last4: data.last4 ?? null,
      expiryMonth: data.expiryMonth ?? null,
      expiryYear: data.expiryYear ?? null,
      providerRef: data.providerRef ?? null,
      isPrimary: data.isPrimary ?? false,
    },
  });
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  const body = await request.json();
  const data = pmSchema.partial().parse(body);

  if (data.isPrimary) {
    await prisma.paymentMethod.updateMany({ where: { userId: auth.userId, isPrimary: true }, data: { isPrimary: false } });
  }

  const updated = await prisma.paymentMethod.update({
    where: { id },
    data: {
      type: data.type ? String(data.type) : undefined,
      brand: data.brand ?? undefined,
      last4: data.last4 ?? undefined,
      expiryMonth: data.expiryMonth ?? undefined,
      expiryYear: data.expiryYear ?? undefined,
      providerRef: data.providerRef ?? undefined,
      isPrimary: data.isPrimary ?? undefined,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  await prisma.paymentMethod.delete({ where: { id } });
  return NextResponse.json({ success: true });
}



