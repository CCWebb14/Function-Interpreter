import { Request, Response, NextFunction } from 'express';
import { findUserByUsername, findUserByEmail, createUser, User } from '../models/users';
import passport from 'passport';
import { getTotalTimeTaken, getCompletedQuestionsCount, getFullyPassedQuestionsCount } from '../models/attempt';
import bcrypt from 'bcrypt'; // Ensure bcrypt is imported

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

        const existingEmail = await findUserByEmail(email)
        if (existingEmail) {
            res.status(401).json({ message: 'Email already taken' });
            return;
        }

        // Hash the password
        //making the bcrypt algorithm perform 2^10 (1024) iterations of the hashing process.
        const hashedPassword = await bcrypt.hash(password, 10);

        //Non hash version atm
        const result = await createUser(username, hashedPassword, firstName, lastName, email);

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
    passport.authenticate('local', (err: any, user: any, info: any) => {
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


//Logout Controllers
export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie('310dev');
            return res.status(200).json({ success: true, message: 'Logged out successfully' });
        });
    });
};

//Auth Controllers
export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({ success: true });
    } else {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
};

// User Profile Controllers
export const userProfile = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        try {
            const user = req.user as User;
            const userid = user.userID;
            const username = user.username;


            // total time spent attempting questions 
            let totaltime = await getTotalTimeTaken(userid);

            // total attempted questions regardless of pass or fail 
            let attemptedQuestions = await getCompletedQuestionsCount(userid);

            // total passing questions 
            let passedQuestions = await getFullyPassedQuestionsCount(userid);

            return res.status(200).json({
                success: true, userName: username, totalTime: totaltime,
                attemptedQuestions: attemptedQuestions, passedQuestions: passedQuestions
            });

        } catch (err) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

    }
};
