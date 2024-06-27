import React, { useState } from 'react';
import '../../styles/login.css';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: ''
    });

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


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //Get element from html page , e.target.name/e.target.value to use
        const { name, value } = e.target;
        setFormData({
            //Learning : ... is a spread  operator, essentially creating updatedFormData above
            ...formData,
            //dynamically sets name from forms
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission logic here, e.g., sending data to an API
        console.log('Form Data:', formData);
    };

    return (
        <div className="white-box">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
        </div>
    );
}
