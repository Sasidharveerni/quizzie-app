import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import showToasts from './Toast';

function LoginSignup() {

    const navigate = useNavigate();
    const [click, setClick] = useState({
        signup: true,
        login: false
    });

    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false
    });

    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const validation = () => {
        let valid = true;
    
        // Username validation
        if (userData.username.length < 3) {
            setErrors(prevErrors => ({ ...prevErrors, name: true }));
            valid = false;
        }
    
        // Email validation (basic pattern)
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userData.email)) {
            setErrors(prevErrors => ({ ...prevErrors, email: true }));
            valid = false;
        }
    
        // Password validation (e.g., minimum 6 characters)
        if (userData.password.length < 6) {
            setErrors(prevErrors => ({ ...prevErrors, password: true }));
            valid = false;
        }
    
        // Confirm Password validation
        if (userData.password !== userData.confirmPassword) {
            setErrors(prevErrors => ({ ...prevErrors, confirmPassword: true }));
            valid = false;
        }
    
        return valid;
    };
    

    const register = async () => {
        if (validation()) {
            try {
                const response = await axios.post('http:/localhost:5000/register', {
                    username: userData.username,
                    email: userData.email,
                    password: userData.password
                });
                if (response.data.status === 'Success') {
                    showToasts(response.data.message, 'success');
                    navigate('/dashboard');
                }
            } catch (error) {
                showToasts("Validation failed. Please check your inputs.", 'error');
                console.log(error);
            }
        } 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (click.signup) {
            register();
        } else {
            // Handle login logic here
        }
    };

    return (
        <div className='signup-header'>
            <div className='signup-header-1'>
                <div style={{ width: '40vw' }}>
                    <div className='text-header'>
                        QUIZZIE
                    </div>

                    <div className='components-1'>
                        <div style={{ cursor: 'pointer' }} className={click.signup ? 'component-style' : ''} onClick={() => setClick({ ...click, signup: true, login: false })}>
                            Sign Up
                        </div>

                        <div style={{ cursor: 'pointer' }} className={click.login ? 'component-style' : ''} onClick={() => setClick({ ...click, signup: false, login: true })}>
                            Login
                        </div>
                    </div>

                    <div>
                        <form onSubmit={handleSubmit}>
                            {click.signup && (
                                <div className='input-bars'>
                                    <label>Name </label>
                                    <input type='text' 
                                        value={userData.username} 
                                        placeholder={errors.name ? 'Invalid Name' : ''} 
                                        style={{ color: errors.name ? '#D60000' : '#000000', border: errors.name ? '2px solid #D60000' : 'none' }} 
                                        onChange={(e) => { 
                                            setUserData({ ...userData, username: e.target.value }); 
                                            setErrors({ ...errors, name: false });
                                        }} 
                                    />
                                </div>
                            )}
                            <div className='input-bars'>
                                <label>Email </label>
                                <input type='text' 
                                    value={click.signup ? userData.email : loginData.email}
                                    placeholder={errors.email ? 'Invalid Email' : ''}
                                    style={{ color: errors.email ? '#D60000' : '#000000', border: errors.email ? '3px solid #D60000' : 'none' }} 
                                    onChange={(e) => { 
                                        if (click.signup) setUserData({ ...userData, email: e.target.value }); 
                                        else setLoginData({ ...loginData, email: e.target.value });
                                        setErrors({ ...errors, email: false });
                                    }} 
                                />
                            </div>
                            <div className='input-bars'>
                                <label>Password </label>
                                <input type='password' 
                                    value={click.signup ? userData.password : loginData.password} 
                                    placeholder={errors.password ? 'Weak Password' : ''}
                                    style={{ color: errors.password ? '#D60000' : '#000000', border: errors.password ? '3px solid #D60000' : 'none' }} 
                                    onChange={(e) => { 
                                        if (click.signup) setUserData({ ...userData, password: e.target.value }); 
                                        else setLoginData({ ...loginData, password: e.target.value });
                                        setErrors({ ...errors, password: false });
                                    }} 
                                />
                            </div>
                            {click.signup && (
                                <div className='input-bars'>
                                    <label>Confirm Password </label>
                                    <input type='password' 
                                        value={userData.confirmPassword}
                                        style={{ color: errors.confirmPassword ? '#D60000' : '#000000', border: errors.confirmPassword ? '3px solid #D60000' : 'none' }} 
                                        placeholder={errors.confirmPassword ? 'Passwords does not match' : ''}
                                        onChange={(e) => {setUserData({ ...userData, confirmPassword: e.target.value })
                                        setErrors({ ...errors, confirmPassword: false });
                                    }} 
                                    />
                                </div>
                            )}
                            <button className='submit-button' type='submit'>
                                {click.signup ? 'Sign-Up' : 'Login'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginSignup;
