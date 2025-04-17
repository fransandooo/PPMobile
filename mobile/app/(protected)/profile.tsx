// app/(protected)/profile.tsx
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "@/ctx";
import { fetchUserProfile } from "@/src/controllers/authController";

export default function ProfileScreen() {
  const { signOut } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = async () => {
    try {
      const userData = await fetchUserProfile();
      setUser(userData);
    } catch (error) {
      console.error("❌ Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadProfile();
  }, []);

  const getInitials = () => {
    if (!user) return "";
    return `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase();
  };

  if (loading || !user) {
    return (
      <View className="flex-1 bg-beige justify-center items-center">
        <ActivityIndicator size="large" color="#1c2a48" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-beige"
      contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      bounces={true}
    >
      

      {/* Avatar */}
      <View className="items-center mt-12 mb-6">
        <View className="w-28 h-28 rounded-full bg-navy justify-center items-center shadow-lg">
          <Text className="text-white text-4xl font-bold">{getInitials()}</Text>
        </View>
        <Text className="text-2xl font-bold text-navy mt-4">
          {user.name} {user.surname}
        </Text>
        <Text className="text-base text-navy-light">{user.email}</Text>
      </View>

      {/* Profile Details Card */}
      <View className="bg-white rounded-3xl px-6 py-5 shadow-md space-y-4">
        <InfoRow label="Full Name" value={`${user.name} ${user.surname}`} />
        <InfoRow label="Email" value={user.email} />
        <InfoRow
          label="Confirmed"
          value={user.confirmed ? "✅ Yes" : "❌ No"}
        />
        <InfoRow
          label="Created"
          value={new Date(user.createdAt).toLocaleDateString()}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        className="mt-10 bg-navy py-4 rounded-2xl"
        onPress={signOut}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Log Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View>
    <Text className="text-navy font-semibold mb-1">{label}</Text>
    <Text className="text-gray-700 text-base">{value}</Text>
  </View>
);
