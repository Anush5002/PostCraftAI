import { Router } from "express";
import { History } from "./models";
import { api } from "@shared/routes";
import { z } from "zod";
import { verifyJWT } from "./auth";

export const historyRouter = Router();

historyRouter.post('/save', verifyJWT, async (req: any, res) => {
    try {
        const input = api.history.save.input.parse(req.body);
        const newItem = await History.create({
            userId: req.userId,
            type: input.type,
            inputText: input.inputText,
            outputs: input.outputs,
        });
        res.status(201).json(newItem);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.errors[0].message });
        }
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

historyRouter.get('/', verifyJWT, async (req: any, res) => {
    try {
        const items = await History.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
