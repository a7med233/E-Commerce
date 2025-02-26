import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [isLoadingForgotPassword, setIsLoadingForgotPassword] = useState(false);
  const [isLoadingResetPassword, setIsLoadingResetPassword] = useState(false);

  // Email validation for Sign Up
  const validateEmail = async (email) => {
    try {
      const response = await axios.get(`https://www.disify.com/api/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Email validation error:', error.message);
      return null;
    }
  };

  // Login / Sign-up handler
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const validationResult = await validateEmail(email);
        if (!validationResult || !validationResult.format || validationResult.disposable || !validationResult.dns) {
          toast.error('Invalid email address.');
          return;
        }

        const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success("Account created successfully!");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success("Login successful!");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Forgot Password: Request OTP
  const handleForgotPassword = async () => {
    setIsLoadingForgotPassword(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
      if (response.data.success) {
        setOtpToken(response.data.otpToken);
        toast.success('OTP sent to your email!');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error sending OTP. Please try again.');
    }
    setIsLoadingForgotPassword(false);
  };

  // Forgot Password: Reset Password
  const handleResetPassword = async () => {
    setIsLoadingResetPassword(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/reset-password`, { otp, otpToken, newPassword });
      if (response.data.success) {
        toast.success('Password reset successful! Please log in.');
        setShowForgotPassword(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error resetting password. Please try again.');
    }
    setIsLoadingResetPassword(false);
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <>
      <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="text-3xl font-semibold">{currentState}</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
        {currentState === 'Sign Up' && (
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="w-full px-3 py-2 border border-gray-800 rounded"
            placeholder="Name"
            required
          />
        )}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="w-full px-3 py-2 border border-gray-800 rounded"
          placeholder="Email"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="w-full px-3 py-2 border border-gray-800 rounded"
          placeholder="Password"
          required
        />
        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p onClick={() => setShowForgotPassword(true)} className="cursor-pointer text-blue-500 hover:underline">
            Forgot your password?
          </p>
          {currentState === 'Login' ? (
            <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer text-blue-500 hover:underline">
              Create account
            </p>
          ) : (
            <p onClick={() => setCurrentState('Login')} className="cursor-pointer text-blue-500 hover:underline">
              Login Here
            </p>
          )}
        </div>
        <button className="bg-black text-white font-light px-8 py-2 mt-4 rounded">
          {currentState === 'Login' ? 'Sign in' : 'Sign Up'}
        </button>
      </form>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border mb-3 rounded"
            />
            <button
              onClick={handleForgotPassword}
              className="bg-blue-500 text-white px-5 py-2 rounded w-full mb-3"
              disabled={isLoadingForgotPassword}
            >
              {isLoadingForgotPassword ? "Sending OTP..." : "Request OTP"}
            </button>

            {otpToken && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full px-3 py-2 border mb-3 rounded"
                />
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border mb-3 rounded"
                />
                <button
                  onClick={handleResetPassword}
                  className="bg-green-500 text-white px-5 py-2 rounded w-full"
                  disabled={isLoadingResetPassword}
                >
                  {isLoadingResetPassword ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}
            <button onClick={() => setShowForgotPassword(false)} className="text-white bg-blue-500 mt-3 text-center px-6 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;