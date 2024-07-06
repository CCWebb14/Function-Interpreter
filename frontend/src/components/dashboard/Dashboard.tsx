import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../../../util/auth';
// TODO: STUBBED
import '../../styles/login-signup.css';

export default function Dashboard() {

    const navigate = useNavigate();

    useEffect(() => {
        const authenticate = async () => {
            const isAuthenticated = await checkAuth();
            if (isAuthenticated) {
                navigate('/dashboard');
            } else {
                navigate('/login'); // Redirect to login page
            }
        };
        authenticate();
    }, [navigate]);


    return (
        // TODO: Stubbed component
        <div className='box-container'>
            <div className='box'>STUB</div>            
        </div>
    )
}