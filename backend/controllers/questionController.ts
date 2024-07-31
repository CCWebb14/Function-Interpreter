import { Request, Response, NextFunction } from 'express';
import { llmFunctionGeneration } from '../llm/function_gen';
import { Function_Suite_Map } from '../llm/function_suite';
import { test_function } from '../llm/function_test';
import { registerAttempt } from '../models/attempt';
import { completed_questions, attempted_questions } from '../models/question_status';
import { User } from '../models/users';

// Expected POST json data from /question/submit/{id}
// Request {{params}, {response body}, {request body}}
interface llmRequest extends Request<{ id: number }, {}, { user_input: string, time: number, hint_used: boolean }> { }

// Controller for handling api calls for a question submission
// Handles subsequent calls to generate and test llm generated functions
export const llmSubmit = async (req: llmRequest, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        try {
            const { id: questionID } = req.params;
            const { user_input, time, hint_used } = req.body;

            // Type bypass for passport without further extending req
            const user = req.user as User;
            const userID = user.userID;

            const llm_gen_function = await llmFunctionGeneration(user_input);
            const test_results = await test_function(llm_gen_function, questionID);

            // NOTE: surround registerAttempt with its own try/catch if we want it to keep going
            await registerAttempt({
                userID,
                questionID,
                score: test_results.tests_passed,
                maxScore: test_results.total_tests,
                timeTaken: time, 
                hintUsed: hint_used 
            });

            // Successful 200 response
            return res.status(200).json({
                success: true,
                tests_passed: test_results.tests_passed,
                total_tests: test_results.total_tests,
                llm_function: llm_gen_function.toString(),
                cases: test_results.cases
            });
        } catch (e) {
            // Catch internal errors from llmFunctionGeneration, test_function and register attempt
            // Return 500 response (Internal Server Error)
            if (e instanceof Error) {
                if (e.message === 'Failed to register attempt on DB') {
                    return res.status(500).json({ success: false, message: 'Fail to register on DB' });
                } else {
                    return res.status(500).json({ success: false, message: e.message });
                }
            } else {
                return res.status(500).json({ success: false, message: 'An unknown error occurred' });
            }
        }
    } else {
        // User is not authenticated, return 401 response
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
};

// question map, questionID mapped to completion status
// 2 marks completion, 1 marks attempted and 0 marks unattempted
type qMap = {
    [questionID: number]: number;
};

// Generates a question map (noted above) from arrays of questionIDs, completedQuestions and attemptedQuestions
// Indicates completion status for each question
// Completed (2), attempted (1) or not attempted (0) 
const generateQuestionMap = (completedQuestions: number[], attemptedQuestions: number[], questionIDs: string[]): qMap => {
    let questionMap: qMap = {};

    for (let i = 0; i < questionIDs.length; i++) {
        let questionID = Number(questionIDs[i]);
        if (completedQuestions.includes(questionID)) {
            questionMap[questionID] = 2;
        } else if (attemptedQuestions.includes(questionID)) {
            questionMap[questionID] = 1;
        } else {
            questionMap[questionID] = 0;
        }
    }
    return questionMap;
}

// Controller for handling retrieving a question list
export const getQuestionList = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        // Type bypass for passport without further extending req
        const user = req.user as User;
        const userID = user.userID;

        // Get all question IDs from the function suite map
        const questionIDs = Object.keys(Function_Suite_Map);
        // Determine which questions a user has completed
        const completedQuestions = await completed_questions(userID);
        // Determine which questions a user has attempted
        const attemptedQuestions = await attempted_questions(userID);
        // Generate a questionMap 
        const questionMap = generateQuestionMap(completedQuestions, attemptedQuestions, questionIDs);

        // Successful 200 response
        return res.status(200).json({ success: true, message: questionMap });
    } else {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
};

// Expected GET json data from /question/id/{id}
interface getQuestionRequest extends Request<{ id: number }, {}, {}> { }

// Controller for handling retrieving a question based on a passed id
export const getQuestion = async (req: getQuestionRequest, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        const { id } = req.params;
        if (!(id in Function_Suite_Map)) {
            return res.status(400).json({success: false, message: 'Invalid id'});
        }
        const test_suite = Function_Suite_Map[id];
        

        return res.status(200).json({
            success: true,
            function_string: test_suite.function_string,
            hint: test_suite.hint,
        });
    } else {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
};