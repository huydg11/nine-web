import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import NineLogo from '../../resources/logo/nine-logo-white.png';

import { getJSON, postJSON } from '../../helper/api';

function CreateAccount() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        joinDate: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Set today's date as default join date
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, joinDate: today }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.userName.trim()) {
            newErrors.userName = 'Username is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirm password is required';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.displayName.trim()) {
            newErrors.displayName = 'Display name is required';
        }

        if (!formData.joinDate) {
            newErrors.joinDate = 'Join date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Create FormData for multipart/form-data
            const submitData = new FormData();
            submitData.append('UserName', formData.userName);
            submitData.append('Email', formData.email);
            submitData.append('Password', formData.password);
            submitData.append('DisplayName', formData.displayName);
            submitData.append('JoinDate', formData.joinDate);

            const result = await postJSON('/Admin/addAccount', submitData, true);
            
            // If we get here without an error being thrown, the request was successful
            alert('Account created successfully!');
            // Reset form
            setFormData({
                userName: '',
                email: '',
                password: '',
                confirmPassword: '',
                displayName: '',
                joinDate: new Date().toISOString().split('T')[0]
            });
            // Optionally navigate to another page
            // navigate('/admin/accounts');

        } catch (error) {
            console.error('Error creating account:', error);
            // Extract error message from the error thrown by postJSON
            const errorMessage = error.message || 'Unknown error occurred';
            alert(`Error creating account: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="App gradient-background">
            <form onSubmit={handleSubmit} className="container">
                <h1 className="heading">Create New Account</h1>

                <div>
                    <fieldset className="fieldset">
                        <legend className="legend">Account Details</legend>
                        
                        <label className="label">
                            Username:
                            <input
                                className="input"
                                name="userName"
                                type="text"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                            />
                            {errors.userName && (
                                <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                    {errors.userName}
                                </span>
                            )}
                        </label>

                        <label className="label">
                            Email:
                            <input
                                className="input"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && (
                                <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                    {errors.email}
                                </span>
                            )}
                        </label>

                        <label className="label">
                            Password:
                            <input
                                className="input"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            {errors.password && (
                                <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                    {errors.password}
                                </span>
                            )}
                        </label>

                        <label className="label">
                            Confirm Password:
                            <input
                                className="input"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            {errors.confirmPassword && (
                                <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                    {errors.confirmPassword}
                                </span>
                            )}
                        </label>

                        <label className="label">
                            Display Name:
                            <input
                                className="input"
                                name="displayName"
                                type="text"
                                value={formData.displayName}
                                onChange={handleChange}
                                required
                            />
                            {errors.displayName && (
                                <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                    {errors.displayName}
                                </span>
                            )}
                        </label>

                        <label className="label">
                            Join Date:
                            <input
                                className="input"
                                name="joinDate"
                                type="date"
                                value={formData.joinDate}
                                onChange={handleChange}
                                required
                            />
                            {errors.joinDate && (
                                <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                    {errors.joinDate}
                                </span>
                            )}
                        </label>
                    </fieldset>
                </div>

                <button 
                    type="submit" 
                    className="button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
        </div>
    );
}

export default CreateAccount;