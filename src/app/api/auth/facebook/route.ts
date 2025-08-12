import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    // Para demonstração, vamos simular um usuário do Facebook
    const mockFacebookUser = {
      id: 'facebook_' + Date.now(),
      name: 'Usuário Facebook',
      email: 'user@facebook.com',
      picture: '',
    };

    return NextResponse.json({
      success: true,
      message: 'Autenticação Facebook simulada',
      user: mockFacebookUser,
      demo: true,
    });
  } catch (error) {
    console.error('Erro na autenticação Facebook:', error);
    return NextResponse.json(
      { error: 'Erro na autenticação Facebook' },
      { status: 500 }
    );
  }
}
