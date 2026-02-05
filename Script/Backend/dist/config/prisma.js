"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
exports.default = prisma;
const connectDatabase = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully (Prisma)');
    }
    catch (error) {
        console.error('❌ Database connection error:', error);
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    await prisma.$disconnect();
};
exports.disconnectDatabase = disconnectDatabase;
//# sourceMappingURL=prisma.js.map