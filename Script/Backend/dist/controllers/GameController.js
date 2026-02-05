"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const fileUtils_1 = require("../utils/fileUtils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class GameController {
    static async addGame(req, res) {
        try {
            console.log('\n========== ADD GAME ==========');
            console.log('Body:', req.body);
            console.log('Files:', req.files);
            console.log('Title:', req.body.title);
            console.log('Creator ID:', req.body.creatorId);
            // Validation
            if (!req.body.title || !req.body.title.trim()) {
                res.status(400).json({ error: 'Title is required' });
                return;
            }
            const files = req.files;
            if (!files?.gameFile || files.gameFile.length === 0) {
                res.status(400).json({ error: 'Game file is required' });
                return;
            }
            if (!files?.coverImage || files.coverImage.length === 0) {
                res.status(400).json({ error: 'Cover image is required' });
                return;
            }
            let gameFilePath = null;
            const zipFile = files.gameFile[0];
            console.log('Processing zip file:', zipFile.originalname);
            console.log('Zip file size:', zipFile.size, 'bytes');
            try {
                gameFilePath = await (0, fileUtils_1.unzipGameFile)(zipFile.path, req.body.title);
                console.log('✅ Game extracted to:', gameFilePath);
                // Delete the original zip file after extraction
                fs_1.default.unlinkSync(zipFile.path);
                console.log('✅ Original zip file deleted');
            }
            catch (unzipErr) {
                console.error('❌ Unzip error:', unzipErr.message);
                res.status(500).json({
                    error: 'Error extracting game file',
                    details: unzipErr.message,
                });
                return;
            }
            // Create game document
            const game = await prisma_1.default.game.create({
                data: {
                    title: req.body.title.trim(),
                    shortDesc: req.body.shortDesc?.trim() || '',
                    fullDesc: req.body.fullDesc?.trim() || '',
                    gameType: req.body.gameType?.trim() || 'Other',
                    tags: req.body.tags ? req.body.tags.split(',').map((t) => t.trim()).filter((t) => t) : [],
                    coverImage: files.coverImage[0].path.replace(/\\/g, '/'),
                    gameFile: gameFilePath,
                    creatorId: req.body.creatorId || null,
                },
            });
            console.log('✅ Game saved to database:', game.id);
            console.log('========== END ADD GAME ==========\n');
            res.json({
                message: 'Game uploaded successfully',
                game,
            });
        }
        catch (err) {
            console.error('❌ Add game error:', err);
            res.status(500).json({
                error: 'Error uploading game',
                details: err.message,
            });
        }
    }
    static async getAllGames(req, res) {
        try {
            const games = await prisma_1.default.game.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    creator: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                        },
                    },
                },
            });
            res.json(games);
        }
        catch (err) {
            res.status(500).json({ error: 'Error fetching games', details: err.message });
        }
    }
    static async getGameById(req, res) {
        try {
            const { gameId } = req.params;
            const game = await prisma_1.default.game.findUnique({
                where: { id: gameId },
                include: {
                    creator: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                        },
                    },
                },
            });
            if (!game) {
                res.status(404).json({ error: 'Game not found' });
                return;
            }
            res.json(game);
        }
        catch (err) {
            res.status(500).json({ error: 'Error fetching game', details: err.message });
        }
    }
    static async playGame(req, res) {
        try {
            const { gameId } = req.params;
            const game = await prisma_1.default.game.findUnique({ where: { id: gameId } });
            if (!game) {
                res.status(404).send('Game not found');
                return;
            }
            // Serve the game's index.html
            const gamePath = path_1.default.join(__dirname, '../../../uploads', game.gameFile || '', 'index.html');
            if (fs_1.default.existsSync(gamePath)) {
                res.sendFile(gamePath);
            }
            else {
                res.status(404).send('Game files not found. index.html is missing.');
            }
        }
        catch (err) {
            console.error('Error loading game:', err);
            res.status(500).send('Error loading game');
        }
    }
}
exports.GameController = GameController;
//# sourceMappingURL=GameController.js.map