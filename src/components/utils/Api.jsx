import axios from 'axios';

const Api = axios.create({
    baseURL:'https://trello-441q.onrender.com'
})

export const signUpApi = (post) =>{

    return Api.post('/api/v1/auth/signup',post)
}

export const signInApi = (post) =>{

    return Api.post('/api/v1/auth/login',post)
}

export const verifyOtpApi = (post) =>{

    return Api.post('/api/v1/auth/verify-otp',post)
}

export const resendOtpApi = (post) =>{

    return Api.post('/api/v1/auth/resend-otp',post)
}

export const forgetPassword = (post) =>{

    return Api.post ('/api/v1/auth/forgot-password',post)
}

export const resetPassword = (post) =>{

    return Api.post ('/api/v1/auth/reset-password',post)
}