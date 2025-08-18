import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Criando usuários de exemplo...');

  // Usuários de exemplo
  const users = [
    {
      fullName: 'Admin LivePick',
      email: 'admin@livepick.com',
      password: 'password',
      role: 'ADMIN',
      city: 'Tel Aviv',
    },
    {
      fullName: 'João Silva',
      email: 'joao@cliente.com',
      password: 'password',
      role: 'CUSTOMER',
      city: 'Jerusalem',
    },
    {
      fullName: 'Maria Restaurante',
      email: 'maria@restaurant.com',
      password: 'password',
      role: 'RESTAURANT_OWNER',
      city: 'Haifa',
    },
    {
      fullName: 'Pedro Entregador',
      email: 'pedro@courier.com',
      password: 'password',
      role: 'COURIER',
      city: 'Tel Aviv',
    },
    {
      fullName: 'Sarah Cohen',
      email: 'sarah@livepick.com',
      password: 'password',
      role: 'CUSTOMER',
      city: 'Jerusalem',
    },
  ];

  for (const userData of users) {
    try {
      // Verificar se o usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`✅ Usuário ${userData.email} já existe`);
        continue;
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });

      // Criar carteira para o usuário
      await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: Math.floor(Math.random() * 500), // Saldo aleatório para demonstração
          currency: 'ILS',
        },
      });

      // Se for um entregador, criar perfil de entregador
      if (userData.role === 'COURIER') {
        await prisma.courierProfile.create({
          data: {
            userId: user.id,
            fullName: userData.fullName,
            phone: '+972-50-123-4567',
            email: userData.email,
            vehicleType: 'SCOOTER',
            city: userData.city,
            rating: 4.5 + Math.random() * 0.5, // Rating entre 4.5 e 5.0
            trustScore: 80 + Math.random() * 20, // Trust score entre 80 e 100
            totalDeliveries: Math.floor(Math.random() * 200),
            isActive: true,
          },
        });
      }

      console.log(`✅ Usuário ${userData.email} criado com sucesso`);
    } catch (error) {
      console.error(`❌ Erro ao criar usuário ${userData.email}:`, error);
    }
  }

  console.log('🎉 Seed de usuários concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
