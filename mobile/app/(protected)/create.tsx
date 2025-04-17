// app/(protected)/create.tsx
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
  ActivityIndicator,
  Modal,
} from "react-native";
import { useState, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import { createPlan } from "@/src/controllers/planController";
import Animated, { FadeInUp } from "react-native-reanimated";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CreatePlanScreen() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalExpenses, setTotalExpenses] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [location, setLocation] = useState("");

  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);

  const descRef = useRef<TextInput>(null);
  const amountRef = useRef<TextInput>(null);
  const locationRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    if (!name || !description || !totalExpenses || !date || !location) {
      Alert.alert("All fields are required.");
      return;
    }

    setLoading(true);

    const result = await createPlan({
      name,
      description,
      totalexpenses: parseFloat(totalExpenses),
      date: date.toISOString(),
      location,
    });

    setLoading(false);

    if (result.success) {
      Alert.alert("Success", result.message);
      resetForm();
      router.replace("/dashboard");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setTotalExpenses("");
    setDate(new Date());
    setLocation("");
  };

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    setShowCalendar(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 bg-beige"
          contentContainerStyle={{ padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Stack.Screen
            options={{
              title: "Create Plan",
              headerTitleAlign: "center",
              headerStyle: { backgroundColor: "#f3efe4" },
              headerTintColor: "#1c2a48",
              headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
            }}
          />

          <Animated.View entering={FadeInUp.delay(100)} className="mb-6">
            <Text className="text-3xl font-bold text-navy">Create a Plan</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(150)}>
            <TextInput
              placeholder="Plan Name"
              className="bg-white rounded-xl px-4 py-3 mb-4"
              placeholderTextColor="#555"
              returnKeyType="next"
              onSubmitEditing={() => descRef.current?.focus()}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              ref={descRef}
              placeholder="Description"
              className="bg-white rounded-xl px-4 py-3 mb-4"
              placeholderTextColor="#555"
              returnKeyType="next"
              onSubmitEditing={() => amountRef.current?.focus()}
              value={description}
              onChangeText={setDescription}
            />

            <TextInput
              ref={amountRef}
              placeholder="Total Expenses"
              className="bg-white rounded-xl px-4 py-3 mb-4"
              placeholderTextColor="#555"
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => setShowCalendar(true)}
              value={totalExpenses}
              onChangeText={setTotalExpenses}
            />

            <TouchableOpacity
              className="bg-white rounded-xl px-4 py-3 mb-4"
              onPress={() => setShowCalendar(true)}
            >
              <Text className="text-gray-700">
                {date ? date.toDateString() : "Pick a Date"}
              </Text>
            </TouchableOpacity>

            <TextInput
              ref={locationRef}
              placeholder="Location"
              className="bg-white rounded-xl px-4 py-3 mb-6"
              placeholderTextColor="#555"
              returnKeyType="done"
              value={location}
              onChangeText={setLocation}
            />

            <TouchableOpacity
              className="bg-navy rounded-2xl py-4"
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text className="text-white text-lg text-center font-medium">
                {loading ? "Creating..." : "Create Plan"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Calendar */}
      {showCalendar && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeDate}
        />
      )}

      {/* Optional fullscreen spinner overlay */}
      {loading && (
        <Modal transparent>
          <View className="flex-1 justify-center items-center bg-black/40">
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}
