import axios from 'axios';
import config from '../config'

export const logout = async (): Promise<boolean> => {
    try {
        const response = await axios.post(config.baseURL + '/api/users/logout', {}, {
            withCredentials: true // Include credentials (cookies) with the request
        });

        return response.status === 200;
    } catch (error) {
        console.error('Error logging out:', error);
        return false;
    }
};
