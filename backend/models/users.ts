import db from './db';
import bcrypt from 'bcrypt'

// Define the User type (adjust according to your actual user schema)
export interface User {
    userID: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
}

// Signup funcs
export const findUserByUsername = async (username: string): Promise<User | null> => {
    try {
        const user = await db('users').where({ username }).first();
        return user || null;
    } catch (error) {
        throw error;
    }
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const user = await db('users').where({ email }).first();
        return user || null;
    } catch (error) {
        throw error;
    }
};

export const findUserById = async (userID: number): Promise<User | null> => {
    try {
        const user = await db('users').where({ userID }).first();
        return user || null;
    } catch (error) {
        throw error;
    }
};

export const createUser = async (username: string, password: string, firstName: string, lastName: string, email: string): Promise<{ success: boolean; message: string }> => {
    try {
        await db('users').insert({
            username,
            password,
            firstName,
            lastName,
            email
        });
        // Custom success message instead of .returning() from knex
        return { success: true, message: 'User created successfully' };
    } catch (error) {
        throw error;
    }
};

// Login funcs
// Verify the user's password (simple string comparison no encryption yet)
export const verifyPassword = async (user: User, password: string): Promise<boolean> => {
    return await bcrypt.compare(password, user.password);
};
