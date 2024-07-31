import { Router } from 'express';
import { createTestTable, insertTestData, queryTestData, updateTestData, deleteTestData, dropTestTable, registerAttempt, getAttemptsByUserAndQuestion, deleteMockUser } from '../controllers/testController';

const router = Router();

//Testing DB-Connection
// Create Test Table
router.get('/create-test-table', createTestTable);
// Insert Test Data
router.post('/insert-test-data', insertTestData);
// Query Test Data
router.get('/query-test-data', queryTestData);
// Update Test Data
router.put('/update-test-data/:id', updateTestData);
// Delete Test Data
router.delete('/delete-test-data/:id', deleteTestData);
// Drop Test Table
router.delete('/drop-test-table', dropTestTable);
// Register Attempt 
router.post('/attempts', registerAttempt);
//Get attempt by user and question
router.get('/attempts/user/:userID/question/:questionID', getAttemptsByUserAndQuestion);
// Delete Mock user
router.delete('/delete-mock-users', deleteMockUser);

export default router;
