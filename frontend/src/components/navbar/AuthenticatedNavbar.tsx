import NavButton from "../navigation/NavButton";
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../util/logout';

export default function AuthenticatedNavbar() {

    const navigate = useNavigate();
    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            navigate('/');
        } else {
            console.error('Logout failed');
        }
    };

    return (
        <div className="navbar">
            <NavButton name={'Main Menu'} style={'navbar-button'} path={'/dashboard'} />
            <NavButton name={'Questions'} style={'navbar-button'} path={'/questions'} />
            <NavButton name={'Leaderboard'} style={'navbar-button'} path={'/leaderboard'} />
            <NavButton name="Logout" style="navbar-button" onClick={handleLogout} />
        </div>
    )
}

