import { Tabs, Redirect } from "expo-router";
import { useSession } from "@/ctx";
import { View, ActivityIndicator, Text } from "react-native";
import AnimatedTabBar from "../../src/components/AnimatedTabBar";

export default function ProtectedTabsLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-beige">
        <ActivityIndicator size="large" color="#1c2a48" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: true,
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
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: () => <Text>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: () => <Text>✅</Text>,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: () => <Text>＋</Text>,
        }}
      />
      <Tabs.Screen
        name="plans-tab"
        options={{
          title: "Plans",
          tabBarIcon: () => <Text>📋</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => <Text>👤</Text>,
        }}
      />
    </Tabs>
  );
}
