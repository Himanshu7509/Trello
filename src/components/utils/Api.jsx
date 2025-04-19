import axios from "axios";
import Cookies from "js-cookie";

const Api = axios.create({
  baseURL: "https://trello-441q.onrender.com/api/v1",
});

Api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signUpApi = (post) => {
  return Api.post("/auth/signup", post);
};

export const signInApi = (post) => {
  return Api.post("/auth/login", post);
};

export const verifyOtpApi = (post) => {
  return Api.post("/auth/verify-otp", post);
};

export const resendOtpApi = (post) => {
  return Api.post("/auth/resend-otp", post);
};

export const forgetPassword = (post) => {
  return Api.post("/auth/forgot-password", post);
};

export const resetPassword = (post) => {
  return Api.post("/auth/reset-password", post);
};

export const resendOtpForPasswordResetApi = (post) => {
  return Api.post("/auth/resend-otp-reset", post);
};

export const createBoardApi = (post) => {
  return Api.post("/board/create", post);
};

export const getCredatedBoardApi = () => {
  return Api.get("/board/my-boards");
};
