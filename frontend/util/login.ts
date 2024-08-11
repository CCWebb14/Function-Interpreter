import axios from 'axios';
import config from '../config'

export const login = async (username: string, password: string): Promise<boolean> => {
    try {
        const response = await axios.post(config.baseURL + '/api/users/login', {
            username,
            password,
        }, {
            withCredentials: true
        });

        return response.data.success;
    } catch (err) {
        console.error(err);
        return false;
    }
};
