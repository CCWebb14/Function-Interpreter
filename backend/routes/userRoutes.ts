import { Router } from 'express';
import { registerUser, loginUser, checkAuth, logoutUser } from '../controllers/userController';

const router = Router();

//User Registration
router.post('/register', registerUser);
//User Login
router.post('/login', loginUser);
//User Logout
router.post('/logout', logoutUser)
//Auth
router.get('/checkAuth', checkAuth);



export default router;