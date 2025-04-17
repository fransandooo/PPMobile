import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useCallback } from "react";
import { fetchAssignedTasks, completeUserTask } from "@/src/controllers/taskController";
import { Stack } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function TasksScreen() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchAssignedTasks();
      setTasks(data);
    } catch (err) {
      console.error("❌ Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (taskId: string) => {
    try {
      await completeUserTask(taskId);
      Alert.alert("Task marked as completed!");
      loadTasks(); // refresh the list
    } catch (err) {
      Alert.alert("Error", "Could not complete the task.");
    }
  };

  // 👉 Re-run when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  return (
    <View className="flex-1 bg-beige px-4 py-6">
      <Stack.Screen
        options={{
          title: "My Tasks",
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
      ) : tasks.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-navy">No tasks assigned to you.</Text>
        </View>
      ) : (
        <ScrollView className="space-y-4">
          {tasks.map((task, index) => (
            <Animated.View
              entering={FadeInUp.delay(index * 80)}
              key={task.id}
              className="bg-white p-4 rounded-xl shadow-sm mb-4"
            >
              <Text className="text-lg font-semibold text-navy mb-1">
                {task.task}
              </Text>
              <Text className="text-sm text-gray-700 mb-1">
                📍 {task.plan.location} • 📅{" "}
                {new Date(task.plan.date).toLocaleDateString()}
              </Text>
              <Text className="text-sm text-gray-600 mb-2">
                🧾 Plan: {task.plan.name}
              </Text>
              <Text
                className={`text-sm font-medium mb-2 ${
                  task.status === "completed"
                    ? "text-green-700"
                    : "text-blue-600"
                }`}
              >
                {task.status}
              </Text>

              {task.status !== "completed" && (
                <TouchableOpacity
                  className="bg-navy px-4 py-2 rounded-lg"
                  onPress={() => handleComplete(task.id)}
                >
                  <Text className="text-white text-center font-medium">
                    Mark as Completed
                  </Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
