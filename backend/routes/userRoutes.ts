import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/userController';

const router = Router();

//User Registration
router.post('/register', registerUser);

//User Login
router.post('/login', loginUser);


export default router;