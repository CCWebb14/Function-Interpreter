import '../../styles/login.css'
import Navbar from '../navbar/Navbar'
import Question_MenuBox from './Question_MenuBox'

export default function Question_Menu() {

    return(
        <div className='app-container'>
            <Navbar />
            <Question_MenuBox />
        </div>
    )
}