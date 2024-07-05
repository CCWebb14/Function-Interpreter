import { Router } from 'express';
import { llmSubmit, getQuestionList, getQuestion } from '../controllers/questionController';

const router = Router();

//User submitted answer
router.post('/submit/:id', llmSubmit);
//Get Question List
router.get('/list', getQuestionList)
//Get Question
router.get('/id/:id', getQuestion)


export default router;