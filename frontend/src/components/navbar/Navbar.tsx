import NavButton from "../navigation/NavButton";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../util/logout';
import { checkAuth } from '../../../util/auth';
import '../../styles/navbar.css'


export default function Navbar() {

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            navigate('/login');
        } else {
            console.error('Logout failed');
        }
    };

    useEffect(() => {
        const authenticate = async () => {
            const isAuthenticated = await checkAuth();
            setIsAuthenticated(isAuthenticated);
        };
        authenticate();
    }, [navigate]);

    return (
        <div className="header">
            <div className="frame2">
                <div className="nav-logo"></div>
                <div className="button-holder">
                    {/* TODO: <NavButton name={'Main Menu'} style={'navbar-button'} path={'/dashboard'} /> */}
                    
                    {/* TODO: <NavButton name={'Leaderboard'} style={'navbar-button'} path={'/leaderboard'} /> */}
                    {isAuthenticated ? (
                        <>
                            <NavButton name={'Questions'} style={'navbar-button'} path={'/questions'} />
                            <NavButton name={'Leaderboard'} style={'navbar-button'} path={'/leaderboard'} />
                            <NavButton name={'Logout'} style={'navbar-button-highlighted'} onClick={handleLogout} />
                        </>
                    ) : (
                        null
                    )}
                </div>
            </div>
        </div>        
    )
}

