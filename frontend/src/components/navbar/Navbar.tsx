import NavButton from "../navigation/NavButton";

export default function Navbar() {

    return (
        <div className="navbar">
            <NavButton name={'Main Menu'} style={'navbar-button'} path={'/dashboard'} />
            <NavButton name={'Questions'} style={'navbar-button'} path={'/questions'} />
            <NavButton name={'Leaderboard'} style={'navbar-button'} path={'/leaderboard'} />
            <NavButton name={'Logout'} style={'navbar-button'} path={'/logout'} />
        </div>
    )
}