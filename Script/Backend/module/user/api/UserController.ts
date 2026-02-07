import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../../../Config/Prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'a3f8d9c2e1b4f6a9c8d7e3f1a9b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0';

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { username, email, password, fullName } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ error: 'Username, email, and password are required' });
            }

            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [{ username }, { email }],
                },
            });

            if (existingUser) {
                return res.status(400).json({ error: 'username or email already exists' });
            }

            const hashed = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashed,
                    fullName: fullName || username,
                },
            });

            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

            res.json({
                message: 'user registered successfully',
                token,
                userId: user.id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
            });
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ error: 'Registration failed', details: err.message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, username, password } = req.body;
            const loginIdentifier = email || username;

            if (!loginIdentifier || !password) {
                return res.status(400).json({ error: 'Identifier (email or username) and password are required' });
            }

            const user = await prisma.user.findFirst({
                where: {
                    OR: [{ email: loginIdentifier }, { username: loginIdentifier }],
                },
            });

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const passwordMatches = await bcrypt.compare(password, user.password);
            if (!passwordMatches) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

            res.json({
                message: 'Login successful',
                token,
                userId: user.id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
            });
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ error: 'Login failed', details: err.message });
        }
    }
}