import { Router } from "express";
import { User } from "./models";
import { api } from "@shared/routes";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_dev";

authRouter.post('/signup', async (req, res) => {
    try {
        const input = api.auth.signup.input.parse(req.body);
        const existing = await User.findOne({ email: input.email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashed = await bcrypt.hash(input.password, 10);
        const newUser = await User.create({
            name: input.name,
            email: input.email,
            password: hashed,
        });

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.errors[0].message });
        }
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const input = api.auth.login.input.parse(req.body);
        const user = await User.findOne({ email: input.email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(input.password, user.password as string);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.errors[0].message });
        }
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const verifyJWT = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
