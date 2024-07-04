import { Router } from 'express';
import { registerUser, loginUser, checkAuth, logoutUser, llmSubmit, getQuestionList, getQuestion } from '../controllers/userController';

const router = Router();

//User Registration
router.post('/register', registerUser);
//User Login
router.post('/login', loginUser);
//User Logout
router.post('/logout', logoutUser)
//Auth
router.get('/checkAuth', checkAuth);
//LLM 
router.post('/submit/:id', llmSubmit);
//Get Question List
router.get('/questions', getQuestionList)
//Get Question
router.get('/question/:id', getQuestion)


export default router;