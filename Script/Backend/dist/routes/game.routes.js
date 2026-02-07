"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GameController_1 = require("../controllers/GameController");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
router.post('/addGame', upload_1.upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'gameFile', maxCount: 1 },
]), GameController_1.GameController.addGame);
router.get('/games', GameController_1.GameController.getAllGames);
router.get('/games/:gameId', GameController_1.GameController.getGameById);
router.get('/play/:gameId', GameController_1.GameController.playGame);
exports.default = router;
//# sourceMappingURL=game.routes.js.map