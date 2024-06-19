import '../../styles/login.css'
import Navbar from '../navbar/Navbar'
import Leader_Menu from './Leader_Menu'

export default function Leaderboard() {

    return(
        <div className='app-container'>
            <Navbar />
            <Leader_Menu />         
        </div>
    )
}