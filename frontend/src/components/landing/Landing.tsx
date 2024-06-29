import '../../styles/login.css'
import Landing_Menu from './Landing_menu';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../../../util/auth';


export default function Landing() {

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const authenticate = async () => {
            const isAuthenticated = await checkAuth();
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
        return <div>Loading...</div>;
    }

    return (
        <div className='app-container'>
            <Landing_Menu />
        </div>
    );
}