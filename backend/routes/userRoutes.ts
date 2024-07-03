import { Router } from 'express';
import { registerUser, loginUser, checkAuth, llmSubmit } from '../controllers/userController';

const router = Router();

//User Registration
router.post('/register', registerUser);
//User Login
router.post('/login', loginUser);
//Auth
router.get('/checkAuth', checkAuth);
//LLM 
router.post('/submit/:id', llmSubmit);



export default router;