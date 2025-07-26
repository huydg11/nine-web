import React, { useEffect, useState } from 'react';
import { getJSON } from '../../helper/api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';

function ChangePassword() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: form, 2: email verification, 3: success
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [authCode, setAuthCode] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Parse JWT token to get userId
  const parseJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  // Get user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get auth data from localStorage
        const authData = localStorage.getItem('authToken');
        
        if (!authData) {
          setErrors({ general: 'No authentication data found' });
          setLoading(false);
          return;
        }

        const tokenData = JSON.parse(authData);
        const userId = tokenData.userId;
        
        if (!userId) {
          setErrors({ general: 'User ID not found in token data' });
          setLoading(false);
          return;
        }
        
        // Fetch user data from API using the userId
        const response = await getJSON(`/api/Admin/getStaffById/${userId}`);
        setUserData(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrors({ general: 'Failed to load user data' });
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
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

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage('');
    setErrors({});

    try {
      // Get auth data from localStorage
      const authData = localStorage.getItem('authToken');
      const tokenData = JSON.parse(authData);

      const changePasswordData = {
        id: userData.id,
        username: userData.username || userData.name,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      };

      const response = await fetch('/api/Login/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.token}`
        },
        body: JSON.stringify(changePasswordData)
      });

      if (response.ok) {
        setStep(2);
        setMessage('Password change request sent! Please check your email for the authentication code.');
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.message || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setErrors({ general: 'An error occurred while changing password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthCodeSubmit = async () => {
    if (!authCode.trim()) {
      setErrors({ authCode: 'Authentication code is required' });
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    setErrors({});

    try {
      const response = await fetch('/api/Login/authenticateToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: authCode
        })
      });

      if (response.ok) {
        setMessage('Password changed successfully!');
        setStep(3);
      } else {
        const errorData = await response.json();
        setErrors({ authCode: errorData.message || 'Invalid authentication code' });
      }
    } catch (error) {
      console.error('Error verifying auth code:', error);
      setErrors({ authCode: 'An error occurred while verifying the code' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setAuthCode('');
    setErrors({});
    setMessage('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Change Password</h2>
            {userData && (
              <p className="mt-2 text-sm text-gray-600">
                Logged in as: <span className="font-medium">{userData.username || userData.name}</span>
              </p>
            )}
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}

          {/* Step 1: Password Change Form */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.oldPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.oldPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.oldPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.newPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Change Password'}
              </button>
            </div>
          )}

          {/* Step 2: Email Verification */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  We've sent an authentication code to your email. Please enter it below to complete the password change.
                </p>
              </div>

              <div>
                <label htmlFor="authCode" className="block text-sm font-medium text-gray-700">
                  Authentication Code
                </label>
                <input
                  id="authCode"
                  type="text"
                  value={authCode}
                  onChange={(e) => {
                    setAuthCode(e.target.value);
                    if (errors.authCode) {
                      setErrors(prev => ({ ...prev, authCode: '' }));
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAuthCodeSubmit();
                    }
                  }}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.authCode ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter the code from your email"
                />
                {errors.authCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.authCode}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleAuthCodeSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isSubmitting ? 'Verifying...' : 'Verify Code'}
                </button>
                
                <button
                  onClick={resetForm}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Password Changed Successfully!</h3>
              <p className="text-sm text-gray-600">Your password has been updated. You can now use your new password to log in.</p>
              <button
                onClick={resetForm}
                className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Change Password Again
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ChangePassword;