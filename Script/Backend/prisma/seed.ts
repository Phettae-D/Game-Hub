import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@gamehub.com' },
    update: {},
    create: {
      username: 'demo_user',
      email: 'demo@gamehub.com',
      password: hashedPassword,
      fullName: 'Demo User',
      bio: 'This is a demo account for testing Game Hub',
    },
  });

  console.log('✅ Created demo user:', user.username);

  // You can add more seed data here (demo games, etc.)

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
