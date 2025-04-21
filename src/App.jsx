import "./App.css";
import { Routes, Route } from "react-router-dom";
import Signup from "../src/components/authentication/signUp/SignUp";
import VerifyOTP from "./components/authentication/verifyOTP/VerifyOTP";
import SignIn from "./components/authentication/signIn/SignIn";
import ForgotPassword from "./components/authentication/forgotPassword/ForgotPassword";
import ResetPassword from "./components/authentication/resetPassword/ResetPassword";
import MyBoard from "./components/pages/board/MyBoard";
import Dashboard from "./components/pages/dashboard/Dashboard";
import NotFound from "./components/pages/404/NotFound";
import Home from "./components/pages/home/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/board/:id" element={<MyBoard />} />
        <Route path="/*" element={<NotFound/>}/>
      </Routes>
    </>
  );
}

export default App;
