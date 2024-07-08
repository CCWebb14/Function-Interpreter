import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/login-signup.css';
import TextField from '@mui/material/TextField';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:4001/api/users/login', {
                username,
                password,
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                // TODO: Change to dashboard when complete
                navigate('/dashboard');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                // Check if the error has a response and a message
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError('An unexpected error occurred');
                }
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    const handleNav = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        navigate('/signup')
    };

    return (
        <div className='box-container'>
            <div className="box">
                <div className='form-group'>
                    <div className='login-header'>Login</div>
                    <TextField label="Username" variant="outlined" size="medium" fullWidth required onChange={
                        (e) => setUsername(e.target.value)
                    } />
                    <TextField label="Password" type='password' variant="outlined" size="medium" fullWidth required onChange={
                        (e) => setPassword(e.target.value)
                    } />
                    <div onClick={handleSubmit} className="button">Login</div>
                    <div className='need-account-frame'>
                        <div className='need-account'>Need an account?</div>
                        <div className='join-now' onClick={handleNav}>Join now</div>
                    </div>
                    <div className='error-field'>{error}</div>
                </div>
            </div>
        </div>
    );
}
