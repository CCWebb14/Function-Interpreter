import Navbar from "../navbar/Navbar";
import Menu from "./Menu";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../../../util/auth';
import AuthenticatedNavbar from "../navbar/AuthenticatedNavbar";

export default function Dashboard() {

    const navigate = useNavigate();

    useEffect(() => {
        const authenticate = async () => {
            const isAuthenticated = await checkAuth();
            if (isAuthenticated) {
                navigate('/dashboard');
            } else {
                navigate('/landing');; // Redirect to landing page
            }
        };
        authenticate();
    }, [navigate]);


    return (
        <div className='app-container'>
            <AuthenticatedNavbar />
            <Menu />
        </div>
    )
}