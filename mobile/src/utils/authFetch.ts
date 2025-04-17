// src/utils/authFetch.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { logoutAndRedirect } from "./logoutAndRedirect";

export async function authFetch(input: RequestInfo, init?: RequestInit) {
  const token = await AsyncStorage.getItem("authToken");

  const headers = {
    ...(init?.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    console.warn("❌ Token expired or unauthorized");

    Alert.alert("Session expired", "Please log in again.");

    await logoutAndRedirect();

    throw new Error("Invalid or expired token.");
  }

  return response;
}
