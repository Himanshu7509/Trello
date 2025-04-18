import React, { useState } from 'react';
import { signUpApi } from '../../utils/Api';
import trelloIcon from '../../../assets/icons8-trello-48.png';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {
  const navigate =useNavigate()
  const [signup, setSignup] = useState({
    userName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signUpApi(signup);
      console.log(response);
      navigate('/verify-otp',{state:signup.email})
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side illustration - Empty container for your images */}
      <div className="hidden lg:flex lg:w-1/3 bg-white items-center justify-center">
        <div className="relative w-full h-full">
          {/* Left side illustration will go here */}
          {/* You can add your image with: <img src="/path-to-your-left-image.png" alt="Trello illustration" className="w-full h-full object-cover" /> */}
        </div>
      </div>
      
      {/* Right side form */}
      <div className="w-full lg:w-2/3 flex justify-center items-center">
        <div className="w-full max-w-md p-8">
          <img src="" alt="" />
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <img src={trelloIcon} alt="Trello" className="h-8" />
              <span className="ml-2 text-gray-800 font-bold text-2xl">Trello</span>
            </div>
          </div>
          
          <h1 className="text-xl font-bold text-center mb-6 text-gray-700">Sign up to continue</h1>
          
          {/* Signup form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="userName"
                placeholder="Enter your username"
                value={signup.userName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={signup.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={signup.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="text-xs text-gray-600 mb-4">
              By signing up, I accept the Atlassian Cloud <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and acknowledge the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition duration-200"
            >
              Sign up
            </button>
          </form>
          
       
          
          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an Atlassian account? <a href="#" className="text-blue-600 hover:underline">Log in</a>
            </p>
          </div>
          
          {/* Atlassian footer with empty container for Atlassian logo */}
          <div className="mt-12 text-center">
            <div className="flex justify-center mb-2">
              {/* Atlassian logo will go here */}
              {/* You can add your logo with: <img src="/path-to-your-atlassian-logo.png" alt="Atlassian" className="h-6" /> */}
            </div>
            <p className="text-sm text-gray-600">One account for Trello, Jira, Confluence and more.</p>
            <p className="text-xs text-gray-500 mt-2">
              This site is protected by reCAPTCHA and the Google <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> apply.
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side illustration - Empty container for your images */}
      <div className="hidden xl:block absolute right-0 top-0 h-full w-1/4">
        {/* Right side illustration will go here */}
        {/* You can add your image with: <img src="/path-to-your-right-image.png" alt="Trello illustration" className="w-full h-full object-cover" /> */}
      </div>
    </div>
  );
};

export default SignUp;