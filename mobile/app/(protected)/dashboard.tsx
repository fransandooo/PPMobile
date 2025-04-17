import { View, Text, Button } from "react-native";
import { useSession } from "@/ctx";

export default function Dashboard() {
  const { signOut } = useSession();

  return (
    <View className="flex-1 items-center justify-center bg-beige px-6">
      <Text className="text-2xl font-bold text-navy mb-4">
        🎉 Welcome to your Dashboard!
      </Text>
    </View>
  );
}
