import { PrismaClient } from '@prisma/client';
import { getPrismaClientArgs } from '../../DataBase/prisma.config';

const clientArgs = getPrismaClientArgs();

const prisma = new PrismaClient({
  ...clientArgs,
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