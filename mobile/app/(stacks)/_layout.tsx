// app/(stacks)/plans/_layout.tsx
import { Stack } from "expo-router";

export default function PlansLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackButtonMenuEnabled: true,
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
  );
}
