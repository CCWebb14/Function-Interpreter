import '../../styles/login.css'
import NavButton from '../navigation/NavButton'

export default function Menu() {

    return(
        <div className='white-box'>
            <NavButton name={'Leaderboard'} style={'login-button'} path={'/leaderboard'}/>
            <NavButton name={'Questions'} style={'login-button'} path={'/questions'}/>         
            <NavButton name={'Logout'} style={'login-button'} path={'/login'}/>         
        </div>
    )
}