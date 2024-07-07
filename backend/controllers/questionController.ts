import { Request, Response, NextFunction } from 'express';
import { llmFunctionGeneration } from '../llm/function_gen';
import { Function_Suite_Map } from '../llm/function_suite';
import { test_function } from '../llm/function_test';

// Request {{params}, {response body}, {request body}}
interface llmRequest extends Request<{id : number}, {}, {user_input : string}> {}

export const llmSubmit = async (req: llmRequest, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        try {
            const { id } = req.params;
            const { user_input } = req.body; 
            const llm_gen_function = await llmFunctionGeneration(user_input);
            const test_results = await test_function(llm_gen_function, id);
            return res.status(200).json({ success: true,
                tests_passed: test_results.tests_passed,
                tests_failed: test_results.total_tests,
                llm_function: llm_gen_function.toString()
             });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.toString() });
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

interface getQuestionRequest extends Request<{id : number}, {}, {}> {}

export const getQuestion = async (req: getQuestionRequest, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        const { id } = req.params;
        const question_string = Function_Suite_Map[id].function_string;
        return res.status(200).json({ success: true, message: question_string });
    } else {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
};