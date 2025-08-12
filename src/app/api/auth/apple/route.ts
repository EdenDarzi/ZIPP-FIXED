import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    // Para demonstração, vamos simular um usuário do Apple
    const mockAppleUser = {
      id: 'apple_' + Date.now(),
      name: 'Usuário Apple',
      email: 'user@icloud.com',
      picture: '',
    };

    return NextResponse.json({
      success: true,
      message: 'Autenticação Apple simulada',
      user: mockAppleUser,
      demo: true,
    });
  } catch (error) {
    console.error('Erro na autenticação Apple:', error);
    return NextResponse.json(
      { error: 'Erro na autenticação Apple' },
      { status: 500 }
    );
  }
}
