import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/login-signup.css';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { checkAuth } from '../../../util/auth';


export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('tmp');
    const [lastName, setLastName] = useState('tmp');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const authenticate = async () => {
            const isAuthenticated = await checkAuth();
            if (isAuthenticated) {
                navigate('/dashboard'); // Redirect to dashboard if authenticated
            }
        };
        authenticate();
    }, [navigate]);

    /*OLD SCHOOL WAY BUT GOOD FOR CLARITY, superseeded by Google.com's spread operator (see below)
    setFormData((prevFormData) => {
        // Create a new object to hold the updated state
        const updatedFormData = {
          username: prevFormData.username,
          password: prevFormData.password,
          firstName: prevFormData.firstName,
          lastName: prevFormData.lastName,
          email: prevFormData.email,
        };
      
        // Update the specific field based on the name
        if (name === 'username') {
          updatedFormData.username = value;
        } else if (name === 'password') {
          updatedFormData.password = value;
        } else if (name === 'firstName') {
          updatedFormData.firstName = value;
        } else if (name === 'lastName') {
          updatedFormData.lastName = value;
        } else if (name === 'email') {
          updatedFormData.email = value;
        }*/

    const [message, setMessage] = useState(''); // Define the message state

    const handleSubmit = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        const formData = { username, password, firstName, lastName, email }

        try {
            const response = await axios.post('http://localhost:4001/api/users/register',
                formData
            );
            setMessage('You have successfully registered!');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response && err.response.status === 400) {
                    setMessage('Username already taken');
                } else if (err.response && err.response.status === 401) {
                    setMessage('Email already taken');

                } else {
                    setMessage('Error creating user');
                }
            } else {
                setMessage('An unexpected error occurred');
            }
        }
    };

    const handleNav = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        navigate('/login')
    };

    return (
        <div className='box-container-su'>
            <div className="box">
                <div className='form-group'>
                    <div className='login-header'>Sign up</div>
                    <TextField label="Username" variant="outlined" size="medium" fullWidth required onChange={
                        (e) => setUsername(e.target.value)
                    } />
                    <TextField label="Password" type='password' variant="outlined" size="medium" fullWidth required onChange={
                        (e) => setPassword(e.target.value)
                    } />
                    <TextField label="Email" variant="outlined" size="medium" fullWidth required onChange={
                        (e) => setEmail(e.target.value)
                    } />
                    <div onClick={handleSubmit} className="button">Sign up</div>
                    <div className='need-account-frame'>
                        <div className='need-account'>Have an account?</div>
                        <div className='join-now' onClick={handleNav}>Login here</div>
                    </div>
                    <div className='error-field'>{message}</div>
                </div>
            </div>
        </div>
    );
}
