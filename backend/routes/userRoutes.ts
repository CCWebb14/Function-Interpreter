import { Router } from 'express';
import { registerUser } from '../controllers/userController';

const router = Router();

//User Registration
router.post('/register', registerUser);

//User Login

export default router;