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

export const registerAttempt = async (req: Request, res: Response) => {
    try {
        console.log('Registering attempt:', req.body); // Add this line
        const result = await registerAttemptModel(req.body);
        console.log('Attempt registered:', result); // Add this line
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
        console.log(`Fetching attempts for userID: ${userID}, questionID: ${questionID}`);
        const attempts = await getAttemptsByUserAndQuestionModel(parseInt(userID), parseInt(questionID));
        console.log('Attempts found:', attempts);
        if (!attempts || attempts.length === 0) {
            return res.status(404).json({ success: false, message: 'No attempts found' });
        }
        res.status(200).json({ success: true, data: attempts });
    } catch (error: any) {
        console.error('Error retrieving attempts:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
