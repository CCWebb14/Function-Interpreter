import { Request, Response, NextFunction } from 'express';
import { findUserByUsername, createUser } from '../models/users';
import { llmFunctionGeneration } from '../llm/function_gen';
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

//LLM Controllers
interface LLM_Params {
    id: string;
}

interface LLM_Body {
    user_input: string;
}

// Request {{params}, {response body}, {request body}}
interface llmRequest extends Request<LLM_Params, {}, LLM_Body> {}


export const llmSubmit = async (req: llmRequest, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        const { user_input } = req.body; 
        const result = await llmFunctionGeneration(user_input);
        // return result
        return res.status(200).json({ success: true, message: result.toString() });
    } else {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
};