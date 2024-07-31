import db from './db';
import top_ten_query from './top_ten_query';

export const getTopScores = async (): Promise<any[]> => {
    try {
        // retrieves top 10 scores and returns
        const aggregatedScores = await db.raw(top_ten_query());
        return aggregatedScores;
    } catch (error) {
        console.error('Error fetching top scores:', error);
        throw error;
    }
};