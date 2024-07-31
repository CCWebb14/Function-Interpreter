import db from './db';

// Queries the db for an array of completed questions by a user.
export const completed_questions = async (id: number): Promise<number[]> => {
    try {
        const completed = await db('attempts').where({ 'userID': id }).andWhereRaw('score == maxScore').distinct('questionID').pluck('questionID');
        return completed;
    } catch (error) {
        throw error;
    }
};

// Queries the db for an array of attempted questions by a user.
export const attempted_questions = async (id: number): Promise<number[]> => {
    try {
        let attempted = await db('attempts').where({ 'userID': id }).andWhereRaw('score != maxScore').distinct('questionID').pluck('questionID');
        return attempted;
    } catch (error) {
        throw error;
    }
};