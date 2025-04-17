import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  fetchPlanById,
  assignTaskToParticipant,
  fetchTasksForPlan,
} from "@/src/controllers/planController";
import { Stack, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [showAssignForm, setShowAssignForm] = useState(false);

  const [selectedUser, setSelectedUser] = useState<string | undefined>();
  const [taskText, setTaskText] = useState("");
  const [costText, setCostText] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const loadPlan = async () => {
      try {
        const result = await fetchPlanById(id as string);
        if (!result) {
          Alert.alert("Error", "Plan not found.");
          return;
        }
        setPlan(result);
      } catch (err) {
        Alert.alert("Error", "Failed to load plan.");
      } finally {
        setLoading(false);
      }
    };

    const loadTasks = async () => {
      try {
        const taskList = await fetchTasksForPlan(id as string);
        setTasks(taskList);
      } catch (err) {
        console.error("❌ Error loading tasks:", err);
      } finally {
        setTasksLoading(false);
      }
    };

    loadPlan();
    loadTasks();
  }, [id]);

  const handleAssign = async () => {
    if (!selectedUser || !taskText) {
      Alert.alert("All fields are required.");
      return;
    }

    try {
      await assignTaskToParticipant(
        plan.id,
        selectedUser,
        taskText,
        costText ? parseFloat(costText) : undefined
      );
      Alert.alert("✅ Task assigned!");
      setTaskText("");
      setCostText("");
      setSelectedUser(undefined);
      setShowAssignForm(false);

      // Reload tasks
      const taskList = await fetchTasksForPlan(id as string);
      setTasks(taskList);
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-beige justify-center items-center">
        <ActivityIndicator size="large" color="#1c2a48" />
      </View>
    );
  }

  if (!plan) {
    return (
      <View className="flex-1 justify-center items-center bg-beige">
        <Text className="text-lg text-navy">Plan not found.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-beige"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 24 }}
        >
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-navy">← Back</Text>
          </TouchableOpacity>
          <Stack.Screen options={{ title: plan.name }} />

          <Text className="text-3xl font-bold text-navy mb-4">{plan.name}</Text>
          <Text className="text-base text-navy-light mb-2">{plan.description}</Text>

          <View className="bg-white rounded-2xl p-5 shadow-md mt-4">
            <InfoRow label="Location" value={plan.location} />
            <InfoRow
              label="Date"
              value={new Date(plan.date).toLocaleDateString()}
            />
            <InfoRow label="Status" value={plan.status} />
            <InfoRow label="Organizer" value={plan.createdBy.name} />
          </View>

          <Text className="text-lg font-bold text-navy mt-6 mb-2">Participants</Text>
          {plan.participants.map((p: any) => (
            <View
              key={p.id}
              className="bg-white mb-2 px-4 py-3 rounded-xl shadow-sm"
            >
              <Text className="text-base text-navy">
                {p.user.name} ({p.role})
              </Text>
            </View>
          ))}

          {plan.createdBy?.id ===
            plan.participants.find((p: any) => p.role === "organizer")?.user?.id && (
            <View className="bg-white rounded-xl mt-6 p-4 shadow-sm">
              <TouchableOpacity
                className="mb-2"
                onPress={() => setShowAssignForm((prev) => !prev)}
              >
                <Text className="text-navy font-semibold text-base">
                  {showAssignForm ? "▲ Hide Assign Task" : "▼ Assign Task"}
                </Text>
              </TouchableOpacity>

              {showAssignForm && (
                <>
                  <Text className="text-sm font-semibold mb-1">Select Participant:</Text>
                  <View className="border border-gray-300 rounded-lg overflow-hidden mb-4">
                    <Picker
                      selectedValue={selectedUser}
                      onValueChange={(value) => setSelectedUser(value)}
                      style={{
                        height: Platform.OS === "ios" ? 140 : 48,
                        marginTop: Platform.OS === "ios" ? -50 : 0,
                      }}
                      itemStyle={{ fontSize: 14 }}
                    >
                      <Picker.Item label="Choose participant" value={undefined} />
                      {plan.participants.map((p: any) => (
                        <Picker.Item key={p.user.id} label={p.user.name} value={p.user.id} />
                      ))}
                    </Picker>
                  </View>

                  <TextInput
                    placeholder="Task"
                    className="bg-gray-100 rounded-lg px-3 py-2 mb-2"
                    value={taskText}
                    onChangeText={setTaskText}
                  />

                  <TextInput
                    placeholder="Cost (optional)"
                    className="bg-gray-100 rounded-lg px-3 py-2 mb-4"
                    keyboardType="numeric"
                    value={costText}
                    onChangeText={setCostText}
                  />

                  <TouchableOpacity
                    className="bg-navy rounded-xl py-3"
                    onPress={handleAssign}
                  >
                    <Text className="text-white text-center font-medium">Assign Task</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          <Text className="text-lg font-bold text-navy mt-6 mb-2">Tasks</Text>
          {tasksLoading ? (
            <ActivityIndicator size="small" color="#1c2a48" />
          ) : tasks.length === 0 ? (
            <Text className="text-gray-600 italic">No tasks yet.</Text>
          ) : (
            tasks.map((task) => (
              <View
                key={task.id}
                className="bg-white mb-2 px-4 py-3 rounded-xl shadow-sm"
              >
                <Text className="text-base text-navy">{task.task}</Text>
                <Text className="text-sm text-gray-600">
                  Assigned to: {task.user?.name || "Unassigned"}
                </Text>
                <Text
                  className={`text-sm font-medium ${
                    task.status === "completed"
                      ? "text-green-700"
                      : task.status === "assigned"
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {task.status}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className="mb-3">
    <Text className="text-navy font-semibold">{label}:</Text>
    <Text className="text-gray-700">{value}</Text>
  </View>
);
