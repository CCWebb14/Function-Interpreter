// this query takes the top score for each user on each 
// question, sums them, and returns total
const top_ten_query = () => {
    return `
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
}

export default top_ten_query