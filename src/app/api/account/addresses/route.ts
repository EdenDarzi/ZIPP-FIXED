import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';
import { z } from 'zod';

const addressSchema = z.object({
  label: z.string().min(1),
  street: z.string().min(1),
  streetLine2: z.string().optional().nullable(),
  city: z.string().min(1),
  state: z.string().optional().nullable(),
  country: z.string().min(2),
  postalCode: z.string().optional().nullable(),
  isPrimary: z.boolean().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

export async function GET(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: auth.userId },
    orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(addresses);
}

export async function POST(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const body = await request.json();
  const data = addressSchema.parse(body);

  // If setting a new primary, unset others
  if (data.isPrimary) {
    await prisma.address.updateMany({
      where: { userId: auth.userId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  const created = await prisma.address.create({
    data: {
      userId: auth.userId,
      label: data.label,
      street: data.street,
      streetLine2: data.streetLine2 ?? null,
      city: data.city,
      state: data.state ?? null,
      country: data.country,
      postalCode: data.postalCode ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
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
  const data = addressSchema.partial().parse(body);

  if (data.isPrimary) {
    await prisma.address.updateMany({ where: { userId: auth.userId, isPrimary: true }, data: { isPrimary: false } });
  }

  const updated = await prisma.address.update({
    where: { id },
    data: {
      label: data.label ?? undefined,
      street: data.street ?? undefined,
      streetLine2: data.streetLine2 ?? undefined,
      city: data.city ?? undefined,
      state: data.state ?? undefined,
      country: data.country ?? undefined,
      postalCode: data.postalCode ?? undefined,
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
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

  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ success: true });
}


