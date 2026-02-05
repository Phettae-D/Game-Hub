"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class UserController {
    static async getProfile(req, res) {
        try {
            const { userId } = req.params;
            const user = await prisma_1.default.user.findUnique({
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
        }
        catch (err) {
            res.status(500).json({ error: 'Error fetching profile', details: err.message });
        }
    }
    static async updateProfile(req, res) {
        try {
            const { userId } = req.params;
            const { fullName, bio } = req.body;
            const user = await prisma_1.default.user.update({
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
        }
        catch (err) {
            res.status(500).json({ error: 'Error updating profile', details: err.message });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map