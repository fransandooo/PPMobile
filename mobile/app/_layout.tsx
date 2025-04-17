// app/_layout.tsx
import { Stack } from "expo-router";
import "../global.css";
import { SessionProvider } from "@/ctx";

export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack
        screenOptions={{
          headerShown: false,
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
    </SessionProvider>
  );
}
