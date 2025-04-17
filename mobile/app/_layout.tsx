// app/_layout.tsx
import { Stack } from "expo-router";
import "../global.css";
import { SessionProvider } from "@/ctx";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <SessionProvider>
      <PaperProvider>
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
      </PaperProvider>
    </SessionProvider>
  );
}
