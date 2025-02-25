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

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpToken, setOtpToken] = useState('');

  // Email validation logic for Sign Up
  const validateEmail = async (email) => {
    try {
      const response = await axios.get(`https://www.disify.com/api/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Email validation error:', error.message);
      return null;
    }
  };

  // Submit handler for login and sign-up
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const validationResult = await validateEmail(email);

        if (!validationResult) {
          toast.error('Failed to validate email.');
          return;
        }

        if (!validationResult.format) {
          toast.error('Invalid email format.');
          return;
        }

        if (validationResult.disposable) {
          toast.error('Disposable email addresses are not allowed.');
          return;
        }

        if (!validationResult.dns) {
          toast.error('Email domain does not exist.');
          return;
        }

        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
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
    try {
      const response = await axios.post(backendUrl + '/api/user/forgot-password', { email });
      if (response.data.success) {
        setOtpToken(response.data.otpToken); // Save OTP token for later verification
        toast.success('OTP sent to your email!');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error sending OTP. Please try again.');
    }
  };

  // Forgot Password: Reset Password
  const handleResetPassword = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/user/reset-password', { otp, otpToken, newPassword });
      if (response.data.success) {
        toast.success('Password reset successfully! Please log in.');
        setShowForgotPassword(false); // Close modal
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error resetting password. Please try again.');
    }
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
          <p className="prata-regular text-3xl">{currentState}</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
        {currentState === 'Login' ? '' : (
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Name"
            required
          />
        )}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Email"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Password"
          required
        />
        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p onClick={() => setShowForgotPassword(true)} className="cursor-pointer">Forgot your password?</p>
          {currentState === 'Login' ? (
            <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer">
              Create account
            </p>
          ) : (
            <p onClick={() => setCurrentState('Login')} className="cursor-pointer">
              Login Here
            </p>
          )}
        </div>
        <button className="bg-black text-white font-light px-8 py-2 mt-4">
          {currentState === 'Login' ? 'Sign in' : 'Sign Up'}
        </button>
      </form>

      {showForgotPassword && (
        <div className="modal bg-gray-100 p-5 rounded shadow-lg">
          <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border mb-3"
          />
          <button onClick={handleForgotPassword} className="bg-blue-500 text-white px-5 py-2 rounded mb-3">
            Request OTP
          </button>

          {otpToken && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-3 py-2 border mb-3"
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border mb-3"
              />
              <button onClick={handleResetPassword} className="bg-green-500 text-white px-5 py-2 rounded">
                Reset Password
              </button>
            </>
          )}
          <button onClick={() => setShowForgotPassword(false)} className="text-white-500 mt-3 flex items-end">Cancel</button>
        </div>
      )}
    </>
  );
};

export default Login;