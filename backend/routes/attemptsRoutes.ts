import { Router } from 'express';
import { getTop10Scores } from '../controllers/attemptsController';

const router = Router();
router.get('/top-ten', getTop10Scores)

export default router;