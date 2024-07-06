import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/login.css';
import TextField from '@mui/material/TextField';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:4001/api/users/login', {
                username,
                password,
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                navigate('/dashboard');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || 'An error occurred. Please try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
            console.error(err);
        }
    };

    return (
        <div className='login-container'>
            <div className="login-box">
                <div className='form-group'>
                    <div className='login-header'>Login</div>
                            <TextField label="Username" variant="outlined" size="medium" fullWidth required onChange={
                                (e) => setUsername(e.target.value)
                            }/>
                            <TextField label="Password" variant="outlined" size="medium" fullWidth required onChange={
                                (e) => setPassword(e.target.value)
                            }/>
                        <div onClick={handleSubmit} className="login-button">Login</div>
                        <div className='need-account-frame'>
                            <div className='need-account'>Need an account?</div>
                            <div className='join-now'>Join now</div>
                        </div>
                        <div className='error-field'>{error}</div>
                </div>
            </div>
        </div>
    );
}
