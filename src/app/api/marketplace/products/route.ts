import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema de validação para criação de produto
const createProductSchema = z.object({
  title: z.string().min(3, 'כותרת המוצר חייבת להכיל לפחות 3 תווים'),
  category: z.string().min(1, 'חובה לבחור קטגוריה'),
  price: z.number().positive('מחיר חייב להיות מספר חיובי'),
  description: z.string().min(10, 'תיאור המוצר חייב להכיל לפחות 10 תווים'),
  location: z.string().min(2, 'מיקום חייב להכיל לפחות 2 תווים'),
  contactDetails: z.string().min(5, 'פרטי יצירת קשר הם שדה חובה'),
  imageUrl1: z.string().url().optional().or(z.literal('')),
  dataAiHint1: z.string().optional(),
  imageUrl2: z.string().url().optional().or(z.literal('')),
  dataAiHint2: z.string().optional(),
  imageUrl3: z.string().url().optional().or(z.literal('')),
  dataAiHint3: z.string().optional(),
  condition: z.enum(['NEW', 'USED', 'REFURBISHED']).optional(),
});

// GET - Buscar produtos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
      isSold: false,
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { publishedAt: 'desc' };
    if (sortBy === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price-desc') {
      orderBy = { price: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.marketplaceItem.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          seller: {
            select: {
              id: true,
              fullName: true,
              city: true,
            },
          },
        },
      }),
      prisma.marketplaceItem.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching marketplace products:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת המוצרים' },
      { status: 500 }
    );
  }
}

// POST - Criar novo produto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação dos dados
    const validatedData = createProductSchema.parse(body);

    // Mock user ID - em produção isso viria da autenticação
    const sellerId = 'mock-user-id';

    // Criar ou buscar usuário mock se não existir
    let user = await prisma.user.findUnique({
      where: { id: sellerId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: sellerId,
          fullName: 'משתמש דמו',
          email: 'demo@example.com',
          password: 'hashed_password',
          role: 'CUSTOMER',
          phone: '050-1234567',
          city: 'תל אביב',
        },
      });
    }

    // Criar o produto
    const product = await prisma.marketplaceItem.create({
      data: {
        ...validatedData,
        sellerId,
        // Limpar campos de URL vazios
        imageUrl1: validatedData.imageUrl1 || null,
        imageUrl2: validatedData.imageUrl2 || null,
        imageUrl3: validatedData.imageUrl3 || null,
      },
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            city: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'המוצר נוסף בהצלחה!',
      product,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'נתונים לא תקינים',
          details: error.errors.map(e => e.message)
        },
        { status: 400 }
      );
    }

    console.error('Error creating marketplace product:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת המוצר' },
      { status: 500 }
    );
  }
}
