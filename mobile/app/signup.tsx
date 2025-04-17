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
import { Stack, useRouter } from "expo-router";
import { registerUser } from "@/src/controllers/authController";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const surnameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const router = useRouter();

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Sign Up",
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
              <Text className="text-3xl font-bold text-navy mb-6">Sign Up</Text>

              <TextInput
                placeholder="Name"
                returnKeyType="next"
                onSubmitEditing={() => surnameRef.current?.focus()}
                autoComplete="name-given"
                textContentType="givenName"
                autoCapitalize="words"
                placeholderTextColor="#555"
                className="bg-white px-4 py-3 rounded-xl mb-4"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                ref={surnameRef}
                placeholder="Surname"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                autoComplete="name-family"
                textContentType="familyName"
                autoCapitalize="words"
                placeholderTextColor="#555"
                className="bg-white px-4 py-3 rounded-xl mb-4"
                value={surname}
                onChangeText={setSurname}
              />

              <TextInput
                ref={emailRef}
                placeholder="Email"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                placeholderTextColor="#555"
                className="bg-white px-4 py-3 rounded-xl mb-4"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                ref={passwordRef}
                placeholder="Password"
                placeholderTextColor="#555"
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="done"
                className="bg-white px-4 py-3 rounded-xl mb-6"
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                className="bg-navy py-4 rounded-2xl"
                onPress={async () => {
                  if (!name || !surname || !email || !password) {
                    Alert.alert("All fields are required.");
                    return;
                  }

                  const result = await registerUser(
                    name,
                    surname,
                    email,
                    password
                  );

                  if (result.success) {
                    Alert.alert("Success", result.message);
                    // Optionally navigate to login or dashboard
                    router.replace("/login");
                    // You could navigate to login or dashboard here
                  } else {
                    Alert.alert("Error", result.message);
                  }
                }}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
