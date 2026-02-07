import { Router } from "express";
import { UserController } from './UserController';

const router = Router();

router.get('/:userId', UserController.getProfile);
router.put('/:userId', UserController.updateProfile);

export default router;
