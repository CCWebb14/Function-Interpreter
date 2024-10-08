import { Request, Response } from 'express';
import { getTopScores } from '../models/attempts';

export const getTop10Scores = async (req: Request, res: Response) => {
    // check user is authenticated
    if (req.isAuthenticated()) {
        try {
            // returns top 10 scores as map
            const result = await getTopScores();
            // Return a success message
            return res.status(201).json({ success: true, message: result });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } else {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
};