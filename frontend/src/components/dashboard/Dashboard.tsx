import Menu from "./Menu";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../../../util/auth';

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
            <Menu />
        </div>
    )
}