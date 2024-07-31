import { Router } from 'express';
import { getTop10Scores } from '../controllers/attemptsController';

const router = Router();
// includes all routes for Leaderboard (gets top 10 users)
router.get('/top-ten', getTop10Scores)

export default router;