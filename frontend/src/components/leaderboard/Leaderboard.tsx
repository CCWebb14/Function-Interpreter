import '../../styles/login-signup.css'
import '../../styles/leaderboard.css'
import { useQuestionListFetch } from '../../hooks/useQuestionListFetch';

export default function Leaderboard() {
  const { state } = 
    useQuestionListFetch('http://localhost:4001/api/attempts/top-ten');
    console.log('State: ', state.results)

    return (
            <div className='box-container-leaderboard'>
                <div className='leaderboard-header'>Leaderboard</div>
                <ol>
                {
                    state.results.map((user, index)=> (
                        <li key={index} className='leaderboard'>
                            <div className='lb-item'>
                                <div className='lb-word'>{index+1 + '.'}</div>
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