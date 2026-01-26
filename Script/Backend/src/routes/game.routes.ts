import { Router } from 'express';
import { GameController } from '../controllers/GameController';
import { upload } from '../middleware/upload';

const router = Router();

router.post(
  '/addGame',
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'gameFile', maxCount: 1 },
  ]),
  GameController.addGame
);

router.get('/games', GameController.getAllGames);
router.get('/games/:gameId', GameController.getGameById);
router.get('/play/:gameId', GameController.playGame);

export default router;
