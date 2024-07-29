import db from './db';

export const getTopScores = async (): Promise<any[]> => {
    try {
        // this query takes the top score for each user on each 
        // question, sums them, and returns total
        const query = `
            SELECT u.userID, u.username, totalScores.totalScore
            FROM (
                SELECT userID, SUM(max_score) AS totalScore
                FROM (
                    SELECT userID, MAX(score) AS max_score
                    FROM attempts
                    GROUP BY userID, questionID
                ) AS max_scores
                GROUP BY userID
            ) AS totalScores
            JOIN users u ON totalScores.userID = u.userID
            ORDER BY totalScores.totalScore DESC
            LIMIT 10;
        `;
        const aggregatedScores = await db.raw(query);
        console.log('query: ', aggregatedScores)
        return aggregatedScores;
    } catch (error) {
        console.error('Error fetching top scores:', error);
        throw error;
    }
};