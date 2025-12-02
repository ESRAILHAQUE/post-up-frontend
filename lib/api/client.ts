import axios from "axios";
import { auth } from "../firebase/config";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Try to get JWT token from localStorage first (for email/password login)
    const jwtToken = localStorage.getItem("auth_token");
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    } else {
      // Fallback to Firebase token (for Google sign-in)
      if (auth) {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.log("API Error:", error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.log("Network Error:", error.message);
    } else {
      // Something else happened
      console.log("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
