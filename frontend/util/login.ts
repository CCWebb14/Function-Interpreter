import axios from 'axios';

export const login = async (username: string, password: string): Promise<boolean> => {
    try {
        const response = await axios.post('http://localhost:4001/api/users/login', {
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
