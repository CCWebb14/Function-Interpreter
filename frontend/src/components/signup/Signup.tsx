import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/login-signup.css';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../../../util/auth';


export default function Signup() {

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

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('tmp');
    const [lastName, setLastName] = useState('tmp');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(''); // Define the message state
    const [consent, setConsent] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [hasOpenedModal, setHasOpenedModal] = useState(false);


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

    //MaterialUI Modal
    // Function to open the modal
    const handleOpen = () => {
        setModalOpen(true);
    };

    // Function to close the modal
    const handleClose = () => {
        setModalOpen(false);
        setHasOpenedModal(true);
    };

    const handleSubmit = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();

        if (!consent) {
            setMessage('Please read our T&C.');
            return;
        }

        const formData = { username, password, firstName, lastName, email }

        try {
            await axios.post('http://localhost:4001/api/users/register', formData);
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
                    <div className='consent-checkbox'>
                        <Modal
                            open={modalOpen}
                            onClose={handleClose}
                            aria-labelledby="terms-modal-title"
                            aria-describedby="terms-modal-description"
                        >
                            <Box className="modal-style">
                                <Typography id="terms-modal-title" variant="h6" align="center">
                                    Terms and Conditions
                                </Typography>
                                {/*https://mui.com/material-ui/api/typography/*/}
                                <Typography id="terms-modal-description" variant="body1" gutterBottom>
                                    {/* T&C here*/}
                                    1) WIP <br />
                                    2) WIP
                                </Typography>
                            </Box>
                        </Modal>
                        <input
                            type="checkbox"
                            id="consent"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            disabled={!hasOpenedModal}
                        />
                        <label htmlFor="consent">  I agree to the <span onClick={handleOpen} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>terms and conditions</span></label>
                    </div>
                    <div onClick={consent ? handleSubmit : undefined}
                        className={`button ${!consent ? 'button-disabled' : ''}`}
                    >Sign up</div>
                    <div className='need-account-frame'>
                        <div className='need-account'>Have an account?</div>
                        <div className='join-now' onClick={handleNav}>Login here</div>
                    </div>
                    <div className='error-field'>{message}</div>
                </div>
            </div>
        </div >
    );
}
