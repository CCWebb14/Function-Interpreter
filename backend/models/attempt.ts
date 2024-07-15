import db from './db';

interface Attempt {
    userID: number;
    questionID: number;
    score: number;
    timeTaken: number;
    hintUsed: boolean;
}

// Create a new attempt entry
export const registerAttempt = async (attempt: Attempt): Promise<{ success: boolean; message: string }> => {
    // Check if all required fields are provided
    if (attempt.userID === undefined || attempt.questionID === undefined || attempt.score === undefined || attempt.timeTaken === undefined || attempt.hintUsed === undefined) {
        throw new Error('All fields (userID, questionID, score, timeTaken, hintUsed) are required');
    }

    try {
        await db('attempts').insert(attempt);
        return { success: true, message: 'Attempt registered successfully' };
    } catch (error) {
        throw new Error('Failed to register attempt on DB');
    }
};
