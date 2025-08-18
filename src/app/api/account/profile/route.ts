import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';
import { z } from 'zod';

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(3).optional().nullable(),
  city: z.string().min(1).optional().nullable(),
  address: z.string().min(1).optional().nullable(),
});

export async function GET(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      city: true,
      address: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.fullName,
    email: user.email,
    phone: user.phone,
    city: user.city,
    address: user.address,
    createdAt: user.createdAt,
  });
}

export async function PUT(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = updateProfileSchema.parse(body);

    const updated = await prisma.user.update({
      where: { id: auth.userId },
      data: {
        fullName: data.fullName ?? undefined,
        email: data.email ?? undefined,
        phone: data.phone ?? undefined,
        city: data.city ?? undefined,
        address: data.address ?? undefined,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        city: true,
        address: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.fullName,
      email: updated.email,
      phone: updated.phone,
      city: updated.city,
      address: updated.address,
      createdAt: updated.createdAt,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao atualizar perfil' }, { status: 400 });
  }
}


