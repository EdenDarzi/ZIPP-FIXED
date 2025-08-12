import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';
import { z } from 'zod';

const settingsSchema = z.object({
  twoFactorEnabled: z.boolean().optional(),
  emailLoginAlerts: z.boolean().optional(),
  smsSuspiciousAlerts: z.boolean().optional(),
  promotionalNotifications: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  let settings = await prisma.userSecuritySettings.findUnique({ where: { userId: auth.userId } });
  if (!settings) {
    settings = await prisma.userSecuritySettings.create({ data: { userId: auth.userId } });
  }
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const body = await request.json();
  const data = settingsSchema.parse(body);

  const updated = await prisma.userSecuritySettings.upsert({
    where: { userId: auth.userId },
    create: { userId: auth.userId, ...data },
    update: { ...data },
  });

  return NextResponse.json(updated);
}



