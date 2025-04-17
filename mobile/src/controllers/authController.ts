
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { authFetch } from "../utils/authFetch";

const API_BASE_URL = 'https://ppmobile.onrender.com/api/auth';

export async function registerUser(
    name: string,
    surname: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, surname, email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return { success: false, message: data.message || "Registration failed." };
      }
  
      return { success: true, message: "Account created!" };
    } catch (error) {
      return { success: false, message: "An error occurred during registration." };
    }
  }
  
  export async function loginUser(
    email: string,
    password: string
  ): Promise<{ success: boolean; token?: string; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok || !data.token) {
        return { success: false, message: data.message || "Login failed." };
      }
  
      return { success: true, token: data.token, message: "Login successful." };
    } catch (error) {
      return { success: false, message: "An error occurred during login." };
    }
  }

  export async function fetchUserProfile() {
    try {
      const response = await authFetch(`${API_BASE_URL}/profile`, {
        method: "GET",
      });
  
      if (!response) return null;
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }
  
      return data.user;
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
      throw err;
    }
  }