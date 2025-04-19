import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTrello, FaEnvelope } from "react-icons/fa";
import { HiMail, HiOutlineMailOpen } from "react-icons/hi";
import { resendOtpApi, verifyOtpApi } from "../../utils/Api";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [verifyOtp, setVerifyOtp] = useState({
    email: location.state || "",
    otp: "",
  });

  useEffect(() => {
    if (!location.state) {
      console.error("Email not provided in location state");
      setMessage("Email not provided. Please go back to signup.");
      setMessageType("error");
    }
  }, [location.state]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleChange = (e) => {
    setVerifyOtp({ ...verifyOtp, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await verifyOtpApi(verifyOtp);
      console.log("Verification response:", response);
      
      if (response && response.data) {
        setMessage("Email verified successfully!");
        setMessageType("success");
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage(error.response?.data?.message || "Failed to verify OTP. Please try again.");
      setMessageType("error");
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    
    if (cooldown > 0 || isResending) return;
    
    if (!verifyOtp.email) {
      setMessage("Email address is missing. Please go back to signup.");
      setMessageType("error");
      return;
    }
    
    setIsResending(true);
    
    try {
      const response = await resendOtpApi({ email: verifyOtp.email });
      console.log("Resend OTP response:", response);
      
      if (response && response.data) {
        setMessage("OTP has been resent successfully!");
        setMessageType("success");
        setCooldown(60);
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setMessage(error.response?.data?.message || "Failed to resend OTP. Please try again.");
      setMessageType("error");
    } finally {
      setIsResending(false);
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
            <HiOutlineMailOpen className="text-5xl text-blue-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-4 text-gray-700">
          Verify your email
        </h1>
        
        <p className="text-center text-gray-600 mb-1">
          We sent a verification code to:
        </p>
        <p className="text-center font-medium text-gray-800 mb-6 flex items-center justify-center">
          <FaEnvelope className="mr-2 text-blue-500" />
          {verifyOtp.email || "No email provided"}
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
              value={verifyOtp.otp}
              onChange={handleChange}
              className="w-full py-3 px-4 text-center bg-white text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg tracking-wider"
              required
              maxLength="6"
              pattern="\d*"
              inputMode="numeric"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200 font-medium"
          >
            Verify Email
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <div className="text-center">
            <a href="/signup" className="text-blue-600 hover:underline text-sm font-medium">
              Sign up with a different email
            </a>
          </div>
          
          <button
            onClick={handleResendOtp}
            disabled={cooldown > 0 || isResending}
            className={`px-4 py-3 rounded-lg transition duration-200 flex items-center justify-center w-full ${
              cooldown > 0 || isResending
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : "border border-blue-200 text-blue-600 hover:bg-blue-50"
            }`}
          >
            <HiMail className="mr-2" />
            {isResending ? "Sending..." : cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
          </button>
        </div>
        
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-500">
            Didn't receive the code? Check your spam folder or request a new one.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;