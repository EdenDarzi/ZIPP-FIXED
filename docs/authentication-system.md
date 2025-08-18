# Sistema de Autenticação LivePick

Este documento descreve o sistema de autenticação implementado para a plataforma LivePick.

## Visão Geral

O sistema de autenticação oferece:
- ✅ Registro de usuários com validação
- ✅ Login com email e senha
- ✅ Autenticação social (Google, Facebook, Apple)
- ✅ Gerenciamento de sessões com JWT
- ✅ Middleware de autenticação
- ✅ Diferentes roles de usuário
- ✅ Hash seguro de senhas
- ✅ Contexto React para estado global

## Estrutura do Sistema

### APIs de Autenticação

```
src/app/api/auth/
├── register/route.ts    # Registro de usuários
├── login/route.ts       # Login de usuários
├── logout/route.ts      # Logout de usuários
├── me/route.ts          # Verificar status de autenticação
├── google/route.ts      # Autenticação Google
├── facebook/route.ts    # Autenticação Facebook
└── apple/route.ts       # Autenticação Apple
```

### Componentes Frontend

```
src/components/auth/
├── login-form.tsx       # Formulário de login
├── register-form.tsx    # Formulário de registro
└── auth-status.tsx      # Status de autenticação no header
```

### Contexto e Hooks

```
src/context/auth-context.tsx    # Contexto de autenticação
src/lib/auth-middleware.ts      # Middleware para APIs
```

## Roles de Usuário

O sistema suporta os seguintes roles:

1. **CUSTOMER** - Cliente padrão
2. **RESTAURANT_OWNER** - Proprietário de restaurante
3. **COURIER** - Entregador
4. **ADMIN** - Administrador do sistema

## Como Usar

### 1. Registro de Usuário

```typescript
const { register } = useAuth();

await register('João Silva', 'joao@email.com', 'minhasenha123');
```

### 2. Login

```typescript
const { login } = useAuth();

await login('joao@email.com', 'minhasenha123');
```

### 3. Verificar Status

```typescript
const { user, isLoading } = useAuth();

if (isLoading) return <div>Carregando...</div>;
if (!user) return <div>Não autenticado</div>;

return <div>Olá, {user.name}!</div>;
```

### 4. Logout

```typescript
const { logout } = useAuth();

await logout();
```

### 5. Middleware em APIs

```typescript
import { requireAuth, requireRole } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  // Verificar se está autenticado
  const user = requireAuth(request);
  
  // Ou verificar role específico
  const admin = requireRole(request, ['ADMIN']);
  
  // Sua lógica aqui...
}
```

## Segurança

### Hash de Senhas
- Utiliza `bcryptjs` com salt rounds de 12
- Senhas nunca são armazenadas em texto plano

### Tokens JWT
- Tokens expiram em 7 dias
- Armazenados em cookies httpOnly
- Incluem userId, email e role

### Validação
- Validação de entrada com Zod
- Sanitização de dados
- Tratamento de erros apropriado

## Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/livepick_db"

# JWT Secret (use uma string forte em produção)
JWT_SECRET="sua-chave-jwt-super-secreta"

# Social Auth (Google)
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"

# Social Auth (Facebook)
FACEBOOK_APP_ID="seu-facebook-app-id"
FACEBOOK_APP_SECRET="seu-facebook-app-secret"

# Social Auth (Apple)
APPLE_ID="seu-apple-id"
APPLE_TEAM_ID="seu-apple-team-id"
APPLE_PRIVATE_KEY="sua-apple-private-key"
APPLE_KEY_ID="seu-apple-key-id"

# Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Usuários de Exemplo

Execute o script de seed para criar usuários de exemplo:

```bash
npx tsx scripts/seed-auth-users.ts
```

### Credenciais de Teste

- **Admin**: admin@livepick.com / password
- **Cliente**: joao@cliente.com / password
- **Restaurante**: maria@restaurant.com / password
- **Entregador**: pedro@courier.com / password

## Autenticação Social

### Google
- Implementação simulada para demonstração
- Em produção, configure o Google OAuth 2.0

### Facebook
- Implementação simulada para demonstração
- Em produção, configure o Facebook Login

### Apple
- Implementação simulada para demonstração
- Em produção, configure o Sign in with Apple

## Redirecionamento por Role

Após login, usuários são redirecionados baseado em seu role:

- `CUSTOMER` → `/` (homepage)
- `RESTAURANT_OWNER` → `/restaurant-admin`
- `COURIER` → `/courier/dashboard`
- `ADMIN` → `/super-admin`

## Tratamento de Erros

O sistema inclui tratamento robusto de erros:

- Validação de entrada
- Mensagens de erro amigáveis
- Logs de erro no servidor
- Fallbacks apropriados

## Próximos Passos

Para produção, considere implementar:

1. **Rate Limiting** - Prevenir ataques de força bruta
2. **2FA** - Autenticação de dois fatores
3. **Email Verification** - Verificação de email
4. **Password Reset** - Recuperação de senha
5. **Account Lockout** - Bloqueio após tentativas falhas
6. **Audit Logs** - Logs de auditoria
7. **Social Auth Real** - Implementação real das APIs sociais
