import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { useCallback, useState } from "react";
import { fetchUserPlans } from "@/src/controllers/planController";
import { useRouter, Stack } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";


export default function PlansScreen() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const loadPlans = async () => {
        try {
          setLoading(true);
          const data = await fetchUserPlans();
          setPlans(data);
        } catch (err) {
          console.error("❌ Failed to fetch user plans:", err);
        } finally {
          setLoading(false);
        }
      };
  
      loadPlans();
    }, [])
  );

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString();

  return (
    <View className="flex-1 bg-beige px-4 py-6">
      <Stack.Screen
        options={{
          title: "My Plans",
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
      ) : plans.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("@/assets/images/undraw_no-data_ig65.png")}
            style={{ width: 150, height: 150, marginBottom: 20 }}
            resizeMode="contain"
          />
          <Text className="text-lg text-navy text-center font-semibold">
            You have no plans yet. Tap "Create" to make your first one!
          </Text>
        </View>
      ) : (
        <ScrollView
          className="space-y-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {plans.map((plan, index) => (
            <Animated.View
              entering={FadeInUp.delay(index * 100)}
              key={plan.id}
              className="rounded-xl shadow-sm bg-white mb-4"
              style={{
                elevation: Platform.OS === "android" ? 3 : 0,
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <TouchableOpacity
                onPress={() => router.navigate(`/(stacks)/${plan.id}`)}
                activeOpacity={0.85}
                className="p-4"
              >
                <Text className="text-lg font-semibold text-navy">
                  {plan.name}
                </Text>
                <Text className="text-sm text-gray-700 mt-1">
                  📍 {plan.location} • 📅 {formatDate(plan.date)}
                </Text>
                <Text
                  className={`text-sm mt-2 font-medium ${
                    plan.status === "cancelled"
                      ? "text-red-600"
                      : "text-green-700"
                  }`}
                >
                  {plan.status === "cancelled" ? "Cancelled" : "Active"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
