import '../../styles/login.css'
import NavButton from '../navigation/NavButton'

export default function Leader_Menu() {

    return(
        <div className='white-box'>
            <div>LEADERBOARD</div>      
            <NavButton name={'Return Home'} style={'login-button'} path={'/dashboard'}/>         
        </div>
    )
}