import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resendOtpApi, verifyOtpApi } from "../../utils/Api";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error

  const [verifyOtp, setVerifyOtp] = useState({
    email: location.state || "",
    otp: "",
  });

  // Check if email is available from location state
  useEffect(() => {
    if (!location.state) {
      console.error("Email not provided in location state");
      setMessage("Email not provided. Please go back to signup.");
      setMessageType("error");
    }
  }, [location.state]);

  // Cooldown timer for resend button
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
        // Navigate after short delay to show success message
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
        setCooldown(60); // Set 60 seconds cooldown
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        {/* Mailbox Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Mailbox */}
            <div className="bg-gray-400 w-16 h-12 rounded-md relative">
              {/* Mail icon */}
              <div className="absolute left-1 top-2 w-14 h-8 bg-gray-300 rounded flex items-center justify-center">
                <div className="border-b-8 border-l-8 border-r-8 border-t-0 border-gray-500 w-10 h-6"></div>
              </div>
              {/* Red flag */}
              <div className="absolute -right-1 -top-2">
                <div className="bg-red-500 w-3 h-8"></div>
              </div>
            </div>
            {/* Post */}
            <div className="bg-orange-400 w-4 h-8 mx-auto"></div>
          </div>
        </div>

        <h1 className="text-2xl font-medium text-gray-300 text-center mb-4">
          Let's verify your email
        </h1>
        
        <p className="text-center text-gray-400 mb-1">
          We sent a verification code to:
        </p>
        <p className="text-center text-gray-300 mb-6">
          {verifyOtp.email || "No email provided"}
        </p>

        {message && (
          <div className={`text-center mb-4 p-2 rounded ${
            messageType === "error" ? "bg-red-800 text-red-200" : "bg-green-800 text-green-200"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* OTP Input Field */}
          <div className="mb-4">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={verifyOtp.otp}
              onChange={handleChange}
              className="w-full py-2 px-4 text-center bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength="6"
              pattern="\d*"
              inputMode="numeric"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-200 mb-4"
          >
            Verify
          </button>
        </form>

        {/* Footer options */}
        <div className="flex flex-col items-center gap-4">
          <a href="/signup" className="text-blue-400 hover:underline text-sm">
            Sign up with a different email
          </a>
          
          <button
            onClick={handleResendOtp}
            disabled={cooldown > 0 || isResending}
            className={`px-4 py-2 rounded transition duration-200 flex items-center justify-center w-full ${
              cooldown > 0 || isResending
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600 text-white"
            }`}
          >
            {isResending ? "Sending..." : cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;