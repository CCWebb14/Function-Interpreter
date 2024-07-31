import db from './db';
import top_ten_query from './top_ten_query';

export const getTopScores = async (): Promise<any[]> => {
    try {
        // this query takes the top score for each user on each 
        // question, sums them, and returns total
        
        const aggregatedScores = await db.raw(top_ten_query());
        console.log('query: ', aggregatedScores)
        return aggregatedScores;
    } catch (error) {
        console.error('Error fetching top scores:', error);
        throw error;
    }
};