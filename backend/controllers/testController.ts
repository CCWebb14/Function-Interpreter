import { Request, Response, NextFunction } from 'express';
import db from '../models/db'; // Adjust the path to your database module
import { registerAttempt as registerAttemptModel, getAttemptsByUserAndQuestion as getAttemptsByUserAndQuestionModel } from '../models/attempt';

export const createTestTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await db.schema.createTable('test_table', (table) => {
            table.increments('id').primary();
            table.string('name');
        });
        return res.status(200).json({ success: true, message: 'Test table created successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Error creating test table.` });
    }
};

export const insertTestData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await db('test_table').insert({ name: req.body.name });
        return res.status(200).json({ success: true, message: 'Test data inserted successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Error inserting test data.` });
    }
};

export const queryTestData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await db('test_table').select('*');
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Error querying test data.` });
    }
};

export const updateTestData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await db('test_table').where({ id: req.params.id }).update({ name: req.body.name });
        return res.status(200).json({ success: true, message: 'Test data updated successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Error updating test data.` });
    }
};

export const deleteTestData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await db('test_table').where({ id: req.params.id }).del();
        return res.status(200).json({ success: true, message: 'Test data deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Error deleting test data.` });
    }
};

export const dropTestTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await db.schema.dropTable('test_table');
        return res.status(200).json({ success: true, message: 'Test table dropped successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Error dropping test table.` });
    }
};

export const leaderboardTables = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Create users table
        await db.schema.createTable('users', (table) => {
            table.increments('userID').primary();
            table.string('username').notNullable();
            table.string('password').notNullable();
            table.string('firstName').notNullable();
            table.string('lastName').notNullable();
            table.string('email').notNullable();
        });

        // Create attempts table
        await db.schema.createTable('attempts', (table) => {
            table.increments('attemptID').primary();
            table.integer('userID').unsigned().notNullable().references('userID').inTable('users').onDelete('CASCADE');
            table.integer('questionID').notNullable();
            table.integer('score').notNullable();
            table.integer('maxScore').notNullable();
            table.integer('timeTaken').notNullable();
            table.boolean('hintUsed').notNullable();
        });

        return res.status(200).json({ success: true, message: 'Attempts and Users tables created successfully.' });
    } catch (error) {
        console.error('Error creating tables:', error);
        return res.status(500).json({ success: false, message: 'Error creating attempts and users tables.' });
    }
};

export const insertUserData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, firstName, lastName, email } = req.body;

        await db('users').insert({
            username,
            password,
            firstName,
            lastName,
            email
        });

        return res.status(200).json({ success: true, message: 'User data inserted successfully.' });
    } catch (error) {
        console.error('Error inserting user data:', error);
        return res.status(500).json({ success: false, message: 'Error inserting user data.' });
    }
};

export const insertAttemptData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userID, questionID, score, maxScore, timeTaken, hintUsed } = req.body;

        await db('attempts').insert({
            userID,
            questionID,
            score,
            maxScore,
            timeTaken,
            hintUsed
        });

        return res.status(200).json({ success: true, message: 'Attempt data inserted successfully.' });
    } catch (error) {
        console.error('Error inserting attempt data:', error);
        return res.status(500).json({ success: false, message: 'Error inserting attempt data.' });
    }
};

export const registerAttempt = async (req: Request, res: Response) => {
    try {
        const result = await registerAttemptModel(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        console.error('Error registering attempt:', error); // Add this line
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to get attempts by user and question
export const getAttemptsByUserAndQuestion = async (req: Request, res: Response) => {
    const { userID, questionID } = req.params;
    try {
        const attempts = await getAttemptsByUserAndQuestionModel(parseInt(userID), parseInt(questionID));
        if (!attempts || attempts.length === 0) {
            return res.status(404).json({ success: false, message: 'No attempts found' });
        }
        res.status(200).json({ success: true, data: attempts });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
