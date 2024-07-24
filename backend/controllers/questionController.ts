import { Request, Response, NextFunction } from 'express';
import { llmFunctionGeneration } from '../llm/function_gen';
import { Function_Suite_Map } from '../llm/function_suite';
import { test_function } from '../llm/function_test';
import { registerAttempt } from '../models/attempt';
import { User } from '../models/users';

// Request {{params}, {response body}, {request body}}
interface llmRequest extends Request<{ id: number }, {}, { user_input: string, time: number, hint_used: boolean }> { }

export const llmSubmit = async (req: llmRequest, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        try {
            const { id: questionID } = req.params;
            const { user_input, time, hint_used } = req.body;

            //Type bypass for passport without further extending req
            const user = req.user as User;
            const userID = user.userID;

            const llm_gen_function = await llmFunctionGeneration(user_input);
            const test_results = await test_function(llm_gen_function, questionID);

            //NOTE: surround registerAttempt with its own try/catch if we want it to keep going
            await registerAttempt({
                userID,
                questionID,
                score: test_results.tests_passed,
                maxScore: test_results.total_tests,
                timeTaken: time, 
                hintUsed: hint_used 
            });

            return res.status(200).json({
                success: true,
                tests_passed: test_results.tests_passed,
                tests_failed: test_results.total_tests,
                failed_tests: test_results.failed_tests,
                llm_function: llm_gen_function.toString()
            });
        } catch (e) {
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
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
};

//Question controllers
export const getQuestionList = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        const keys = Object.keys(Function_Suite_Map);
        return res.status(200).json({ success: true, message: keys });
    } else {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
};

interface getQuestionRequest extends Request<{ id: number }, {}, {}> { }

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