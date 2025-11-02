import { axiosInstance, API_BASE_URL } from "@/config/axios";

const withProvider = (data, provider = "email") => ({
  oauthProvider: provider,
  ...data,
});

export const signup = (data) =>
  axiosInstance.post(`/auth/signup`, withProvider(data));

export const login = (data) =>
  axiosInstance.post(`/auth/login`, withProvider(data));

export const logout = () => axiosInstance.post(`/auth/logout`);

export const forgotPassword = (data) =>
  axiosInstance.post(`/auth/forgot-password`, data);

export const resetPassword = (data) =>
  axiosInstance.post(`/auth/reset-password`, data);

export const refreshToken = () => axiosInstance.post(`/auth/refresh-token`);

export const verifyEmail = (data) => axiosInstance.post(`/auth/verify-email`, data);

export const getCurrentUser = () => axiosInstance.get(`/users/currentUser`);

export const oauthLogin = (provider) => {
  window.location.href = `${API_BASE_URL}/auth/oauth/${provider}`;
};
