import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/login-signup.css';
import TextField from '@mui/material/TextField';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // TODO: Password repeat & comparison
    // TODO: To be removed only need username and password
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
        //Endpoint here
        try {
            const response = await axios.post('http://localhost:4001/api/users/register', 
                [username, password, firstName, lastName, email]
            );
            setMessage(response.data.message);
        } catch (err) {
            setMessage('Error creating user');
        }
    };

    return (
        <div className='box-container'>
                    <div className="box">
                        <div className='form-group'>
                            <div className='login-header'>Login</div>
                                    <TextField label="Username" variant="outlined" size="medium" fullWidth required onChange={
                                        (e) => setUsername(e.target.value)
                                    }/>
                                    <TextField label="Password" variant="outlined" size="medium" fullWidth required onChange={
                                        (e) => setPassword(e.target.value)
                                    }/>
                                    <TextField label="First Name" variant="outlined" size="medium" fullWidth required onChange={
                                        (e) => setFirstName(e.target.value)
                                    }/>
                                    <TextField label="Last Name" variant="outlined" size="medium" fullWidth required onChange={
                                        (e) => setPassword(e.target.value)
                                    }/>
                                    <TextField label="Email" variant="outlined" size="medium" fullWidth required onChange={
                                        (e) => setPassword(e.target.value)
                                    }/>
                                <div onClick={handleSubmit} className="login-button">Sign up</div>
                                <div className='need-account-frame'>
                                    <div className='need-account'>Have an account?</div>
                                    <div className='join-now'>Login here</div>
                                </div>
                                <div className='error-field'>{message}</div>
                        </div>
                    </div>
                </div>
    );
}
