import { Request, Response } from 'express';
import prisma from '../config/prisma';

export class UserController {
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          profilePicture: true,
          bio: true,
          createdAt: true,
        },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: 'Error fetching profile', details: err.message });
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { fullName, bio } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          fullName: fullName || undefined,
          bio: bio !== undefined ? bio : undefined,
        },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          profilePicture: true,
          bio: true,
          createdAt: true,
        },
      });

      res.json({
        message: 'Profile updated',
        user,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Error updating profile', details: err.message });
    }
  }
}
