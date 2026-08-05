import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors } from "@/theme/colors";

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: () => <TabIcon emoji="🏠" /> }}
      />
      <Tabs.Screen
        name="learn"
        options={{ title: "Learn", tabBarIcon: () => <TabIcon emoji="📚" /> }}
      />
      <Tabs.Screen
        name="conversation"
        options={{ title: "Conversation", tabBarIcon: () => <TabIcon emoji="🗣️" /> }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: "Progress", tabBarIcon: () => <TabIcon emoji="📈" /> }}
      />
    </Tabs>
  );
}
