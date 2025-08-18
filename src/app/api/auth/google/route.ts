import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Para demonstração - normalmente você usaria o Google OAuth
  const searchParams = request.nextUrl.searchParams;
  const redirectUrl = searchParams.get('redirect') || '/';
  
  // URL do Google OAuth (simulada para demonstração)
  const googleOAuthUrl = `https://accounts.google.com/oauth/authorize?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/google/callback')}&` +
    `response_type=code&` +
    `scope=email profile&` +
    `state=${encodeURIComponent(redirectUrl)}`;

  // Para demonstração, vamos simular o sucesso
  return NextResponse.json({
    message: 'Redirecionamento para Google OAuth',
    url: googleOAuthUrl,
    demo: true,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    // Em um cenário real, você verificaria o token com o Google
    // e extrairia as informações do usuário
    
    // Para demonstração, vamos simular um usuário do Google
    const mockGoogleUser = {
      id: 'google_' + Date.now(),
      name: 'Usuário Google',
      email: 'user@gmail.com',
      picture: '',
    };

    return NextResponse.json({
      success: true,
      message: 'Autenticação Google simulada',
      user: mockGoogleUser,
      demo: true,
    });
  } catch (error) {
    console.error('Erro na autenticação Google:', error);
    return NextResponse.json(
      { error: 'Erro na autenticação Google' },
      { status: 500 }
    );
  }
}
