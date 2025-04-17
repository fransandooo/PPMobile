import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useRef, useState } from "react";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "@/src/controllers/authController";
import { useSession } from "@/ctx";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef<TextInput>(null);

  const {signIn} = useSession();

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Login",
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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 bg-beige px-6 justify-center py-12">
              <Text className="text-3xl font-bold text-navy mb-6">Login</Text>

              <TextInput
                placeholder="Email"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                placeholderTextColor="#555"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="username"
                keyboardType="email-address"
                className="bg-white px-4 py-3 rounded-xl mb-4"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                ref={passwordRef}
                placeholder="Password"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                placeholderTextColor="#555"
                secureTextEntry
                autoComplete="password"
                textContentType="password"
                className="bg-white px-4 py-3 rounded-xl mb-6"
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                className="bg-navy py-4 rounded-2xl"
                onPress={async () => {
                  if (!email || !password) {
                    Alert.alert("Both fields are required.");
                    return;
                  }
                  const result = await loginUser(email, password);
                
                  if (result.success && result.token) {
                    await signIn(result.token);
                    router.replace("/(protected)/dashboard");
                  } else {
                    Alert.alert("Error", result.message);
                  }
                }}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Log In
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
