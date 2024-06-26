import { Request, Response } from 'express';
import db from '../db';

// Get all books
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await db('Users').select('*');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
