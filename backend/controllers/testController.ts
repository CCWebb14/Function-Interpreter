import { Request, Response, NextFunction } from 'express';
import db from '../models/db'; // Adjust the path to your database module

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
