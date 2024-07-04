import { Request, Response, NextFunction } from 'express';
import { findUserByUsername, createUser } from '../models/users';
import { llmFunctionGeneration } from '../llm/function_gen';
import { Function_Suite_Map } from '../llm/function_suite';
import { test_function } from '../llm/function_test';
import passport from 'passport';

//import bcrypt from 'bcrypt'; // Ensure bcrypt is imported

//Signup Controllers
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password, firstName, lastName, email } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            res.status(400).json({ message: 'Username already taken' });
            return;
        }

        // Hash the password (bcrypt *milestone 2? diff hash?)
        //const hashedPassword = await bcrypt.hash(password, 10);

        //Non hash version atm
        const result = await createUser(username, password, firstName, lastName, email);

        // Return a success message
        res.status(201).json(result);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Login Controllers (using npm passport :local strategy)
export const loginUser = (req: Request, res: Response, next: NextFunction) => {
    // Use Passport to authenticate with the 'local' strategy
    passport.authenticate('local', (err, user, info) => {
        // Handle any errors that occur during authentication
        if (err) return next(err);

        // If no user is found (authentication fails), send a 401 response
        if (!user) {
            return res.status(401).json({ success: false, message: info?.message || 'Login failed' });
        }

        // Log the user in
        req.logIn(user, (err) => {
            // Handle any errors that occur during login
            if (err) return next(err);

            // If login is successful, send a success response with the user object
            return res.json({ success: true, user });
        });
    })(req, res, next); // Call the authenticate function with req, res, and next
};

//Auth Controllers
export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({ success: true, user: req.user });
    } else {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
};

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
                test_result: `Tests passed: ${test_results.tests_passed} / ${test_results.total_tests}`,
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