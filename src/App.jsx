import './App.css'
import {Routes,Route} from 'react-router-dom'
import Signup from '../src/components/authentication/signUp/SignUp'
import VerifyOTP from './components/authentication/verifyOTP/VerifyOTP'
import SignIn from './components/authentication/signIn/SignIn'

function App() {
 

  return (
    <>
    <Routes>
<Route path='/' element= {<Signup/>}/>
<Route path='/verify-otp' element= {<VerifyOTP/>}/>
<Route path='/login' element= {<SignIn/>}/>



    </Routes>
    </>
  )
}

export default App
