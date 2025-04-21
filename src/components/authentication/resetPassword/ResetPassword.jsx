import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTrello, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { HiKey } from "react-icons/hi";
import { resetPassword, resendOtpForPasswordResetApi } from "../../utils/Api";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resendingOtp, setResendingOtp] = useState(false);

  const [formData, setFormData] = useState({
    email: location.state || "",
    otp: "",
    newPassword: "",
  });

  useEffect(() => {
    if (!formData.email) {
      setMessage("Email not provided. Please start from the forgot password page.");
      setMessageType("error");
    }
  }, [formData.email]);

  
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    
    e.preventDefault();
    
   
    if (!formData.otp) {
      setMessage("Please enter the OTP sent to your email");
      setMessageType("error");
      return;
    }
    
    if (!formData.newPassword) {
      setMessage("Please enter a new password");
      setMessageType("error");
      return;
    }
    
    if (formData.newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long");
      setMessageType("error");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
    
      const postData = {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      };
      
 
      const response = await resetPassword(postData);
      
      console.log("Reset password response:", response);
      
      if (response && response.data) {
        setMessage("Password reset successful!");
        setMessageType("success");
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage(error.response?.data?.message || "Failed to reset password. Please try again.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    if (!formData.email) {
      setMessage("Email not provided. Please start from the forgot password page.");
      setMessageType("error");
      return;
    }
    
    setResendingOtp(true);
    
    try {
      const response = await resendOtpForPasswordResetApi({ email: formData.email });
      console.log("Resend OTP response:", response);
      
      if (response && response.data) {
        setMessage("A new OTP has been sent to your email");
        setMessageType("success");
        setCountdown(60); 
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setMessage(error.response?.data?.message || "Failed to resend OTP. Please try again.");
      setMessageType("error");
    } finally {
      setResendingOtp(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            <HiKey className="text-5xl text-blue-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-4 text-gray-700">
          Reset Your Password
        </h1>
        
        <p className="text-center text-gray-600 mb-1">
          Enter the verification code sent to:
        </p>
        <p className="text-center font-medium text-gray-800 mb-6 flex items-center justify-center">
          <FaEnvelope className="mr-2 text-blue-500" />
          {formData.email || "No email provided"}
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
            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={handleChange}
              className="w-full py-3 px-4 text-center bg-white text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg tracking-wider"
              required
              maxLength="6"
              pattern="\d*"
              inputMode="numeric"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder="New password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full py-3 pl-10 pr-10 bg-white text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
              minLength="8"
            />
            <div 
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </div>
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
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <div className="text-center">
            <button 
              onClick={handleResendOtp}
              disabled={countdown > 0 || resendingOtp}
              className={`text-blue-600 hover:underline text-sm font-medium ${
                countdown > 0 || resendingOtp ? "text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              {resendingOtp ? "Sending..." : 
                countdown > 0 ? `Request a new OTP (${countdown}s)` : "Request a new OTP"}
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-500">
            Make sure your new password is secure and different from your previous one.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;