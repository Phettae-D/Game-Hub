"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'a3f8d9c2e1b4f6a9c8d7e3f1a9b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0';
class AuthController {
    static async register(req, res) {
        try {
            const { username, email, password, fullName } = req.body;
            if (!username || !email || !password) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }
            // Check if user exists
            const existingUser = await prisma_1.default.user.findFirst({
                where: {
                    OR: [{ username }, { email }],
                },
            });
            if (existingUser) {
                res.status(400).json({ error: 'Username or email already exists' });
                return;
            }
            // Hash password
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            // Create user
            const user = await prisma_1.default.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    fullName: fullName || username,
                },
            });
            // Generate token
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
            res.json({
                message: 'User registered successfully',
                token,
                userId: user.id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
            });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Registration failed', details: err.message });
        }
    }
    static async login(req, res) {
        try {
            const { email, username, password } = req.body;
            const loginIdentifier = email || username;
            if (!loginIdentifier || !password) {
                res.status(400).json({ error: 'Email/Username and password required' });
                return;
            }
            // Find user by email OR username
            const user = await prisma_1.default.user.findFirst({
                where: {
                    OR: [{ email: loginIdentifier }, { username: loginIdentifier }],
                },
            });
            if (!user) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            // Verify password
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            // Generate token
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
            res.json({
                message: 'Login successful',
                token,
                userId: user.id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
            });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Login failed', details: err.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map