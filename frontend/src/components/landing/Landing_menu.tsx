import '../../styles/login.css'
import React, { useState } from 'react';
import { login } from '../../../util/login';
import { useNavigate } from 'react-router-dom';


export default function Landing_Menu() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Login failed');
        }
    };

    return (
        <div className='white-box'>
            <h2>Sign in</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className='submit-button'>Sign in</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>Need an Account? <a href="/signup">Join now</a></p>
        </div>
    );
}
