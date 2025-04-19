import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrello, FaEnvelope } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi";
import { forgetPassword } from "../../utils/Api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await forgetPassword({ email });
      console.log("Forgot password response:", response);
      
      if (response && response.data) {
        setMessage("Password reset instructions sent to your email!");
        setMessageType("success");
        // After successful submission, you might want to redirect to a confirmation page
        // or keep the user on this page with the success message
        setTimeout(() =>// In your forgot password page
        navigate('/reset-password', { state: { email: userEmail } }), 3000);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setMessage(error.response?.data?.message || "Failed to process your request. Please try again.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
            <FaTrello className="text-blue-600 text-2xl" />
            <span className="ml-2 text-gray-800 font-bold text-2xl">Trello</span>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 rounded-full p-4">
            <HiLockClosed className="text-5xl text-blue-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-4 text-gray-700">
          Forgot Your Password?
        </h1>
        
        <p className="text-center text-gray-600 mb-6">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        {message && (
          <div className={`text-center mb-6 p-3 rounded-lg ${
            messageType === "error" ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              value={email}
              onChange={handleChange}
              className="w-full py-3 pl-10 pr-4 bg-white text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg transition duration-200 font-medium ${
              isSubmitting 
                ? "bg-blue-400 text-white cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isSubmitting ? "Sending..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm">Remember your password?</p>
            <a href="/login" className="text-blue-600 hover:underline text-sm font-medium">
              Back to Login
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-500">
            Check your spam folder if you don't receive the reset email within a few minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;