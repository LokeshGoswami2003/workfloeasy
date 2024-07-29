import User from '../models/User';
import { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {

    try {
        return res.json({ message: 'Login successful and cookie stored' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
