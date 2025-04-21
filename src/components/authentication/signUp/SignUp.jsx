import React, { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaTrello,
  FaAtlassian,
  FaUser,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { signUpApi } from "../../utils/Api";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [signup, setSignup] = useState({
    userName: "",
    email: "",
    password: "",
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
      navigate("/verify-otp", { state: signup.email });
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
            <span className="ml-2 text-gray-800 font-bold text-2xl">
              Trello
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Create your account
        </h1>

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
              By signing up, I accept the Atlassian Cloud{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and acknowledge the{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
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
            Already have an Atlassian account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </Link>
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

    

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <div className="flex justify-center mb-2">
            <FaAtlassian className="text-blue-500 text-2xl" />
          </div>
          <p className="text-sm text-gray-600">
            One account for Trello, Jira, Confluence and more.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
