import React from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function AnimatedTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const tabWidth = width / state.routes.length;
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = withSpring(state.index * tabWidth, {
      damping: 15,
      stiffness: 150,
    });
  }, [state.index]);

  return (
    <View style={[styles.tabBar, { paddingBottom: 10 + insets.bottom }]}>
      <Animated.View
        style={[
          styles.indicator,
          {
            width: tabWidth * 0.5,
            bottom: 6 + insets.bottom, // ✅ this line is key!
          },
          useAnimatedStyle(() => ({
            transform: [{ translateX: translateX.value + tabWidth * 0.25 }],
          })),
        ]}
      />

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          } as unknown as { type: "tabPress"; target?: string; canPreventDefault: true });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconName =
          route.name === "dashboard"
            ? "view-dashboard"
            : route.name === "tasks"
            ? "check-circle-outline"
            : "account";

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={iconName}
              size={24}
              color={isFocused ? "#1c2a48" : "#aaa"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#f3efe4",
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#e0ddd5",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    height: 4,
    borderRadius: 999,
    backgroundColor: "#1c2a48",
    bottom: 6,
  },
});
