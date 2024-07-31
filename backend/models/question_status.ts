import db from './db';

export const completed_questions = async (id: number): Promise<number[]> => {
    try {
        const completed = await db('attempts').where({ 'userID': id }).andWhereRaw('score == maxScore').distinct('questionID').pluck('questionID');
        return completed;
    } catch (error) {
        throw error;
    }
};

export const attempted_questions = async (id: number): Promise<number[]> => {
    try {
        let attempted = await db('attempts').where({ 'userID': id }).andWhereRaw('score != maxScore').distinct('questionID').pluck('questionID');
        return attempted;
    } catch (error) {
        throw error;
    }
};