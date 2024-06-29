import axios from 'axios';

axios.defaults.withCredentials = true;

export const checkAuth = async () => {
    try {
        const response = await axios.get('http://localhost:4001/api/users/checkAuth');
        return response.data.success;
    } catch (error) {
        console.error('Error checking authentication status:', error);
        return false;
    }
};
