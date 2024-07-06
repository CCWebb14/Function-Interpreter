import NavButton from "../navigation/NavButton";
import '../../styles/navbar.css'


export default function Navbar() {

    return (
        <div className="header">
            <div className="frame2">
                    <div className="nav-logo"></div>
                    <div className="button-holder">
                        {/* TODO: <NavButton name={'Main Menu'} style={'navbar-button'} path={'/dashboard'} /> */}
                        <NavButton name={'Questions'} style={'navbar-button'} path={'/questions'} />
                        {/* TODO: <NavButton name={'Leaderboard'} style={'navbar-button'} path={'/leaderboard'} /> */}
                        <NavButton name={'Logout'} style={'navbar-button'} path={'/logout'} />
                    </div>
            </div>
        </div>
    )
}