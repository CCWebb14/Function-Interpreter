import '../../styles/login-signup.css'
import '../../styles/leaderboard.css'
import { useQuestionListFetch } from '../../hooks/useQuestionListFetch';

export default function Leaderboard() {
  const { state } = 
    useQuestionListFetch('http://localhost:4001/api/attempts/top-ten');
    console.log('State: ', state.results)

    return (
        <div className='app-container'>
            <div className='box-container-su'>
                <div className='box'>Leaderboard</div>
                <ol>
                {
                    state.results.map((user, index)=> (
                        <li key={index} className='leaderboard'>
                            <div>{index+1 + '. ' + user.username}</div>
                            <div>{user.totalScore}</div>
                        </li>
                    ))
                }
                </ol>
            </div>
        </div>
    )
}