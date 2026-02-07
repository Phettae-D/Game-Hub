"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const prisma_1 = require("./config/prisma");
const fileUtils_1 = require("./utils/fileUtils");
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const game_routes_1 = __importDefault(require("./routes/game.routes"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, '../../')));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../uploads')));
app.use('/games', express_1.default.static(path_1.default.join(__dirname, '../../uploads/games')));
// Better static file serving for game assets
app.use('/uploads/games/:gameName', express_1.default.static(path_1.default.join(__dirname, '../../uploads/games'), {
    setHeaders: (res, filePath) => {
        // Set proper MIME types for common game files
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        else if (filePath.endsWith('.wasm')) {
            res.setHeader('Content-Type', 'application/wasm');
        }
        else if (filePath.endsWith('.data')) {
            res.setHeader('Content-Type', 'application/octet-stream');
        }
        else if (filePath.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/json');
        }
    },
}));
// Test route
app.get('/test', (req, res) => {
    res.json({
        message: 'Server is running',
        port: PORT,
        database: 'Connected',
        version: '2.0.0 (TypeScript + SQL + Prisma)',
    });
});
// API Routes
app.use('/', auth_routes_1.default);
app.use('/profile', user_routes_1.default);
app.use('/', game_routes_1.default);
// Initialize database and start server
const startServer = async () => {
    try {
        // Ensure uploads directories exist
        (0, fileUtils_1.ensureUploadsDirectory)();
        console.log('✅ Uploads directory ready');
        // Initialize database
        await (0, prisma_1.connectDatabase)();
        // Start server
        app.listen(PORT, () => {
            console.log(`\n✅ Server running on http://localhost:${PORT}`);
            console.log(`✅ API available at http://localhost:${PORT}/test`);
            console.log(`✅ Backend: TypeScript + SQL (Prisma)\n`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await (0, prisma_1.disconnectDatabase)();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await (0, prisma_1.disconnectDatabase)();
    process.exit(0);
});
startServer();
//# sourceMappingURL=server.js.map