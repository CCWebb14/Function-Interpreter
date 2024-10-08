import db from './db';

interface Attempt {
    userID: number;
    questionID: number;
    score: number;
    maxScore: number;
    timeTaken: number;
    hintUsed: boolean;
}


// Create a new attempt entry
export const registerAttempt = async (attempt: Attempt): Promise<{ success: boolean; message: string }> => {
    // Check if all required fields are provided
    if (attempt.userID === undefined || attempt.questionID === undefined || attempt.score === undefined || attempt.maxScore === undefined || attempt.timeTaken === undefined || attempt.hintUsed === undefined) {
        throw new Error('All fields (userID, questionID, score,maxScore, timeTaken, hintUsed) are required');
    }

    try {
        await db('attempts').insert(attempt);
        return { success: true, message: 'Attempt registered successfully' };
    } catch (error) {
        throw new Error('Failed to register attempt on DB');
    }
};

// Function to get total time spent on questions, regardless of fail/pass 
export const getTotalTimeTaken = async (userID: number): Promise<number> => {

    try {
        const result = await db('attempts')
            .where({ userID })
            .sum('timeTaken as totalTime');

        return result[0]?.totalTime || 0; // Return total time or 0 if no records
    } catch (error) {
        throw new Error('Failed to get total time taken from DB');
    }
};

// Function to get the number of completed questions by a user
export const getCompletedQuestionsCount = async (userID: number): Promise<number> => {
    try {
        const result = await db('attempts')
            .where({ userID })
            .countDistinct('questionID as attemptedQuestions');

        
        const attemptedQuestions = parseInt(result[0]?.attemptedQuestions as string, 10);

        return isNaN(attemptedQuestions) ? 0: attemptedQuestions; // Return the count or 0 if no records
    } catch (error) {
        throw new Error('Failed to get the number of completed questions from DB');
    }
};

// Function to get the number of fully passing questions by a user
export const getFullyPassedQuestionsCount = async (userID: number): Promise<number> => {
    try {

         // Subquery to find distinct questionID with score = maxScore
        const subquery = db('attempts')
            .where({ userID })
            .andWhere('score', '=', db.raw('maxScore'))
            .distinct('questionID');

        // Count distinct questionID from the subquery
        const result = await db(subquery)
            .count('questionID as passedQuestions');

            // Convert the count to a number
        const passedQuestions = parseInt(result[0]?.passedQuestions as string, 10);

        return isNaN(passedQuestions) ? 0 : passedQuestions;
    } catch (error) {
        throw new Error('Failed to get the number of fully passed questions from DB');
    }
};

// Retrieve attempts by user and question
export const getAttemptsByUserAndQuestion = async (userID: number, questionID: number) => {
    try {
        const attempts = await db('attempts').where({ userID, questionID });
        return attempts;
    } catch (error) {
        throw new Error('Failed to retrieve attempts');
    }
};
