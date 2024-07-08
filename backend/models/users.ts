import db from './db';

// Define the User type (adjust according to your actual user schema)
interface User {
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
        console.error('Error finding user by username:', error);
        throw error;
    }
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const user = await db('users').where({ email }).first();
        return user || null;
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error;
    }
};

export const findUserById = async (userID: number): Promise<User | null> => {
    try {
        const user = await db('users').where({ userID }).first();
        return user || null;
    } catch (error) {
        console.error('Error finding user by ID:', error);
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
        console.error('Error creating user:', error);
        throw error;
    }
};

// Login funcs
// Verify the user's password (simple string comparison no encryption yet)
export const verifyPassword = async (user: User, password: string): Promise<boolean> => {
    return user.password === password;
};
