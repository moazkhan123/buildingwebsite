import React from "react";
import { Stack } from "expo-router";

export default function LearnLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="lesson" />
      <Stack.Screen name="flashcards" />
      <Stack.Screen name="grammar" />
      <Stack.Screen name="immersion" />
    </Stack>
  );
}
