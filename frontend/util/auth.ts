import axios from 'axios';
import config from '../config'

axios.defaults.withCredentials = true;

export const checkAuth = async () => {
    try {
        const response = await axios.get(config.baseURL + '/api/users/checkAuth');
        return response.data.success;
    } catch (error) {
        return false;
    }
};
