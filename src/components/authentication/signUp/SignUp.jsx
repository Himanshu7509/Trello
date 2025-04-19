import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaTrello, FaAtlassian, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiOutlineShieldCheck } from 'react-icons/hi';
import { signUpApi } from '../../utils/Api';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
  const [signup, setSignup] = useState({
    userName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signUpApi(signup);
      console.log(response);
      navigate('/verify-otp', { state: signup.email });
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-gray-100">
        <div className="flex justify-center mb-8">
          <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
            <FaTrello className="text-blue-600 text-2xl" />
            <span className="ml-2 text-gray-800 font-bold text-2xl">Trello</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Create your account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              type="text"
              name="userName"
              placeholder="Enter your username"
              value={signup.userName}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={signup.email}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={signup.password}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
            <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                          ) : (
                            <FaEye className="text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
          </div>
          
          <div className="text-xs text-gray-600 flex items-start space-x-2">
            <HiOutlineShieldCheck className="flex-shrink-0 text-gray-500 text-lg mt-0.5" />
            <span>
              By signing up, I accept the Atlassian Cloud <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and acknowledge the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </span>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-200 flex items-center justify-center"
          >
            <span>Sign Up</span>
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an Atlassian account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="flex items-center justify-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
            </svg>
            Facebook
          </button>
        </div>
        
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <div className="flex justify-center mb-2">
            <FaAtlassian className="text-blue-500 text-2xl" />
          </div>
          <p className="text-sm text-gray-600">One account for Trello, Jira, Confluence and more.</p>
          <p className="text-xs text-gray-500 mt-2">
            This site is protected by reCAPTCHA and the Google <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;