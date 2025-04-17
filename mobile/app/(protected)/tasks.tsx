// app/(protected)/tasks.tsx
import { View, Text } from "react-native";

export default function TasksScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-beige px-6">
      <Text className="text-2xl font-bold text-navy">✅ Tasks</Text>
    </View>
  );
}
