import { Request, Response } from 'express';
import prisma from '../../../Config/Prisma';
import { unzipGameFile } from '../../../Utils/fileUtils';
import fs from 'fs';
import path from 'path';
// removed unused imports

export class GameController {
    static async addGame(req: Request, res: Response) {
        try {
            console.log('\n =======ADD GAME ========');
            console.log('body:', req.body);
            console.log('files:', req.files);
            console.log('Title:', req.body.title);
            console.log('Creator ID:', req.body.creatorId);

            if (!req.body.title || !req.body.title.trim()) {
                res.status(400).json({ error: 'Title is required' });
                return;
            }
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

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

            console.log('processing zip file:', zipFile.originalname);
            console.log('zip file path:', zipFile.size, 'bytes');

            try{
                gameFilePath = await unzipGameFile(zipFile.path, req.body.title);
                console.log("Game Extracted to:", gameFilePath);

                fs.unlinkSync(zipFile.path);
                console.log('Zip file deleted:');

            } catch (unzipErr: any) {
                console.error('Error unzipping game file:', unzipErr.message);
                res.status(500).json({ error: 'Failed to unzip game file',
                    details: unzipErr.message });
            return;
            }

            const game = await prisma.game.create({
                data: {
                    title: req.body.title.trim(),
                    shortDesc: req.body.shortDesc?.trim() || '',
                    fulldesc: req.body.fullDesc?.trim() || '',
                    gametype: req.body.gametype?.trim() || 'other',
                    tags: req.body.tags? req.body.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [],
                    coverImage: files.coverImage[0].path.replace(/\\/g, '/'),
                    gameFile: gameFilePath,
                    creatorId: req.body.creatorId || null
                },
            });

            console.log('game saved to database:', game.id);
            console.log('==== END ADD GAME =======\n');

            res.json({
                message: 'Game added successfully',
                game,

            });


        } catch (err:any) {
            console.error('Error adding game:', err);
            res.status(500).json({ error: 'Failed to add game', details: err.message });
        }
    }

    static async getAllGames(req: Request, res: Response): Promise<void> {
        try{
            const games = await prisma.game.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    creator: {
                        select: {
                            id: true,
                            username: true,
                            fullname: true,
                        },
                    },
                },
            });

            res.json(games);
        }catch (err:any) {
            res.status(500).json({ error: 'Failed to retrieve games', details: err.message });
        }
    }


    static async getGamesById(req: Request, res: Response): Promise<void> {
        try {
            const { gameId } = req.params;

            const game = await prisma.game.findUnique({
                where: { id: gameId },
                include: {
                    creator: {
                        select: {
                            id: true,
                            username: true,
                            fullname: true,
                        },
                    },
                },
            });

            if (!game) {
                res.status(404).json({ error: 'Game not found' });
                return;
            }

            res.json(game);
        } catch (err: any) {
            res.status(500).json({ error: 'Failed to retrieve game', details: err.message });
        }
    }

    static async playGame(req: Request, res: Response) {
        try {
            const {gameId} = req.params;

            const game = await prisma.game.findUnique({where: {id: gameId}})
            if (!game) {
                res.status(404).json({ error: 'Game not found' });
                return;
            }

            // ensure `gameFile` is present (Prisma may allow null)
            if (!game.gameFile) {
                res.status(404).json({ error: 'Game file not found' });
                return;
            }

            // serve the game's index.html
            const gamePath = path.join(__dirname, '../../../uploads', game.gameFile, 'index.html');

            if (fs.existsSync(gamePath)) {
                res.sendFile(gamePath);
            } else {
                res.status(404).json({ error: 'Game file not found' });
            }
        } catch (err:any) {
            console.error('Error playing game:', err);
            res.status(500).json({ error: 'Failed to play game' });
        }
    }
    
}