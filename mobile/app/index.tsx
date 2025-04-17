// app/index.tsx
import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link, Stack, router } from "expo-router";
import { useSession } from "@/ctx";

export default function AuthLandingScreen() {
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && session) {
      // If already logged in, redirect to dashboard
      router.replace("/(protected)/dashboard");
    }
  }, [session, isLoading]);

  // While checking session, show nothing or loading
  if (isLoading) {
    return null;
  }

  return (
    <View className="flex-1 bg-beige items-center justify-center px-6">
      <Stack.Screen
        options={{
          title: "Welcome",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#f3efe4",
          },
          headerTintColor: "#1c2a48",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
      />

      <Text className="text-4xl font-bold text-navy mb-2 text-center">
        Plan A Plan
      </Text>
      <Text className="text-base text-navy-light mb-10 text-center">
        Organize, Plan, and Win Together 🧠✨
      </Text>

      <View className="w-full space-y-4">
        <Link href="/login" asChild>
          <TouchableOpacity className="bg-navy rounded-2xl py-4 mb-4">
            <Text className="text-white text-lg text-center font-medium">
              Log In
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/signup" asChild>
          <TouchableOpacity className="bg-white border border-navy rounded-2xl py-4 mb-4">
            <Text className="text-navy text-lg text-center font-medium">
              Sign Up
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(protected)/dashboard" asChild>
          <TouchableOpacity className="bg-navy rounded-2xl py-4 mb-4">
            <Text className="text-white text-lg text-center font-medium">
              Test Protected Route
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
