import '../../styles/login.css'
import Landing_Menu from './Landing_menu';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../../../util/auth';
import Navbar from "../navbar/Navbar";
import AuthenticatedNavbar from '../navbar/AuthenticatedNavbar';

export default function Landing() {

    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication
    const navigate = useNavigate();

    useEffect(() => {
        const authenticate = async () => {
            const isAuthenticated = await checkAuth();
            setIsAuthenticated(isAuthenticated);
            if (isAuthenticated) {
                navigate('/dashboard');
            } else {
                setLoading(false); // Stop loading if not authenticated
            }
        };
        authenticate();
    }, [navigate]);

    //Flicker fix
    if (loading) {
        return <div>Checking your authentication.</div>;
    }

    return (
        <div className='app-container'>
            {isAuthenticated ? <AuthenticatedNavbar /> : <Navbar />}
            <Landing_Menu />
        </div>
    );
}