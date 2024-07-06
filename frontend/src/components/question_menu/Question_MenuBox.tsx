import '../../styles/login-signup.css'
import NavButton from '../navigation/NavButton'

export default function Question_MenuBox() {

    return(
        <div className='white-box'>
            <NavButton name={'Return Home'} style={'login-button'} path={'/dashboard'}/>
        </div>
    )
}