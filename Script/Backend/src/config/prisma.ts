import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully (Prisma)');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};
