// src/api/authApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/auth"; // change later

// Real API calls
export const signup = (data) => axios.post(`${API_URL}/signup`, data);
export const login = (data) => axios.post(`${API_URL}/login`, data);
export const logout = (data) => axios.post(`${API_URL}/logout`, data);
export const forgotPassword = (data) => axios.post(`${API_URL}/forgot-password`, data);
export const resetPassword = (data) => axios.post(`${API_URL}/reset-password`, data);
export const refreshToken = (data) => axios.post(`${API_URL}/refresh-token`, data);
export const verifyEmail = (data) => axios.post(`${API_URL}/verify-email`, data);

// OAuth buttons (for redirect)
export const googleLogin = () => {
  window.location.href = `${API_URL}/oauth/google`;
};
export const discordLogin = () => {
  window.location.href = `${API_URL}/oauth/discord`;
};

// Mock OAuth login for frontend testing without backend
export const oauthLogin = async ({ provider }) => {
  // Mock delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    data: {
      data: {
        user: {
          id: "12345",
          name: provider === "google" ? "Google User" : "Discord User",
          email: provider === "google" ? "google@example.com" : "discord@example.com",
          role: "member",
          avatarUrl: "",
          skills: [],
          projectCount: 0,
          taskCount: 0,
          completedTaskCount: 0,
          points: 0,
          badges: [],
          achievements: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        accessToken: "fake-jwt-token",
        refreshToken: "fake-refresh-token",
      },
      message: "OAuth login successful",
    },
  };
};
