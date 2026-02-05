import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../.env' });

// Export the URL used for migrations (migrate uses this file)
export const migrateUrl = process.env.DATABASE_URL ?? process.env.PRISMA_MIGRATE_URL ?? '';

// Helper to return the proper PrismaClient constructor args.
// If you use Prisma Accelerate, set PRISMA_ACCELERATE_URL.
// Otherwise set DATABASE_URL for a direct DB connection.
export function getPrismaClientArgs(): Record<string, unknown> {
  const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
  const databaseUrl = process.env.DATABASE_URL;

  if (accelerateUrl) {
    return { accelerateUrl };
  }

  if (databaseUrl) {
    // Pass adapter for direct DB connection
    return { adapter: { url: databaseUrl } };
  }

  return {};
}

export default { migrateUrl, getPrismaClientArgs };
