import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './components/pages/home/HomePage'
import SignUp from './components/authentication/signUp/SignUp'
import SignIn from './components/authentication/signIn/SignIn'
import VerifyOTP from './components/authentication/verifyOTP/VerifyOTP'

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path='/verify-otp' element={<VerifyOTP/>}/>
      <Route path='/home' element={<HomePage/>} />
    </Routes>
    </>
  )
}

export default App