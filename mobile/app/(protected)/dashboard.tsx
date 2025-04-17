import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { fetchUserPlans } from "@/src/controllers/planController";
import { fetchAssignedTasks } from "@/src/controllers/taskController";
import { Stack } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function DashboardScreen() {
  const [plans, setPlans] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [planData, taskData] = await Promise.all([
        fetchUserPlans(),
        fetchAssignedTasks(),
      ]);
      setPlans(planData);
      setTasks(taskData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const completed = tasks.filter((t) => t.status === "completed").length;
  const assigned = tasks.filter((t) => t.status !== "completed").length;
  const upcoming = plans.slice(0, 3);

  return (
    <View className="flex-1 bg-beige px-5 pt-6">
      <Stack.Screen
        options={{
          title: "Dashboard",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#f3efe4" },
          headerTintColor: "#1c2a48",
          headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
        }}
      />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1c2a48" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View
            entering={FadeInUp.delay(100)}
            className="mb-6 p-4 bg-white rounded-xl shadow-sm"
          >
            <Text className="text-xl font-bold text-navy mb-2">Overview</Text>
            <Text className="text-base text-navy-light">
              📁 Plans: {plans.length}
            </Text>
            <Text className="text-base text-navy-light">
              ✅ Completed Tasks: {completed}
            </Text>
            <Text className="text-base text-navy-light">
              ⏳ Pending Tasks: {assigned}
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(200)}
            className="mb-6 p-4 bg-white rounded-xl shadow-sm"
          >
            <Text className="text-xl font-bold text-navy mb-2">Upcoming Plans</Text>
            {upcoming.length === 0 ? (
              <Text className="text-navy-light italic">No upcoming plans.</Text>
            ) : (
              upcoming.map((plan) => (
                <View key={plan.id} className="mb-3">
                  <Text className="text-lg font-semibold text-navy">
                    {plan.name}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    📅 {new Date(plan.date).toLocaleDateString()} • 📍 {plan.location}
                  </Text>
                </View>
              ))
            )}
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
}
