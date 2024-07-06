import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                const response = await axios.post('http://localhost:4001/api/users/logout', {}, {
                    withCredentials: true // Include credentials (cookies) with the request
                });

                if (response.status === 200) {
                    // Redirect to the login page or home page
                    navigate('/');
                } else {
                    console.error('Logout failed');
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    console.error('Logout failed:', error.response.data.message);
                } else {
                    console.error('Error logging out:', error);
                }
            }
        };

        logout();
    }, [navigate]);

    return (
        <div>
            Logging out...
        </div>
    );
}
