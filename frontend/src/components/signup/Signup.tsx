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

    const validateEmail = (email: any) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();

        if (!username) {
            setMessage('Username is required.');
            return;
        }

        if (!password) {
            setMessage('Password is required.');
            return;
        }

        if (!consent) {
            setMessage('Please read our T&C.');
            return;
        }

        if (!validateEmail(email)) {
            setMessage('Please enter a valid email address.');
            return;
        }

        const formData = { username, password, firstName, lastName, email }

        try {
            await axios.post('http://localhost:4001/api/users/register', formData);
            setMessage('You have successfully registered!');

            setTimeout(() => {
                setMessage('Redirecting to login page...');

                // Wait for another 2 seconds before redirecting
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }, 1000);


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
                                    <Typography id="terms-modal-description" variant="body1" gutterBottom>
                                        1) <strong>Data Collection:</strong> We collect personal information such as your name, email address, and other details provided during signup and usage. <br /> <br />
                                        2) <strong>Use of Information:</strong> Your data is used to provide and improve our services, communicate with you, and comply with legal obligations. <br /> <br />
                                        3) <strong>Data Sharing:</strong> We do not sell or share your personal information with third parties without your explicit consent, except as required by law or for service provision (e.g., payment processing). <br /> <br />
                                        4) <strong>Data Security:</strong> We use industry-standard security measures to protect your information from unauthorized access, disclosure, alteration, or destruction. <br /> <br />
                                        5) <strong>Access and Correction:</strong> You can access, correct, or delete your personal information anytime by contacting our support team. <br /> <br />
                                        < br />
                                        <strong>Consent:</strong> By signing up, you consent to the collection, use, and sharing of your personal information as described above. You agree to follow our ethical guidelines and all applicable laws. <br />
                                    </Typography>

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
