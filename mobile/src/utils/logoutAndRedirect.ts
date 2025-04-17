// src/utils/logoutAndRedirect.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export async function logoutAndRedirect() {
  await AsyncStorage.removeItem("authToken");
  router.replace("/login");
}
