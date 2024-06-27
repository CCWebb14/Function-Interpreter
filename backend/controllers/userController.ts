import { Request, Response } from 'express';
import { findUserByUsername, createUser } from '../models/users';
//import bcrypt from 'bcrypt'; // Ensure bcrypt is imported

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
