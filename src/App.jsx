

import './App.css'
import {Routes,Route} from 'react-router-dom'
import Signup from '../src/components/authentication/signUp/SignUp'
import VerifyOTP from './components/authentication/verifyOTP/VerifyOTP'
import SignIn from './components/authentication/signIn/SignIn'
import ForgotPassword from './components/authentication/forgotPassword/ForgotPassword'
import ResetPassword from './components/authentication/resetPassword/ResetPassword'
import MyBoard from './components/pages/board/MyBoard'
import HomePage from './components/pages/home/HomePage'

function App() {
 

  return (
    <>
    <Routes>
<Route path='/' element= {<Signup/>}/>
<Route path='/verify-otp' element= {<VerifyOTP/>}/>
<Route path='/login' element= {<SignIn/>}/>
<Route path='/forget-password' element= {<ForgotPassword/>}/>
<Route path='/reset-password' element= {<ResetPassword/>}/>
<Route path='/home' element={<HomePage/>} />
   <Route path='/board' element={<MyBoard/>} />


    </Routes>
    </>
  )
}

export default App