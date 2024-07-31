import '../../styles/login-signup.css'
import '../../styles/leaderboard.css'
import { useQuestionListFetch } from '../../hooks/useQuestionListFetch';

export default function Leaderboard() {
    // utilizes api endpoint to get top 10
    const { state } = useQuestionListFetch('http://localhost:4001/api/attempts/top-ten');

    return (
        <div className='box-container-leaderboard'>
            <div className='leaderboard-title'>Leaderboard</div>
            <div className='leaderboard-header'>
                <div>Username</div>
                <div>Score</div>
            </div>
            <ol>
                {/*Iterates through top 10 and posts to frontend*/}
                {
                    state.results.map((user: any, index: any) => (
                        <li key={index} className='leaderboard'>
                            <div className='lb-item'>
                                <div className='lb-word'>{index + 1 + '.'}</div>
                                <div>{user.username}</div>
                            </div>
                            <div>{user.totalScore}</div>
                        </li>
                    ))
                }
            </ol>
        </div>
    )
}