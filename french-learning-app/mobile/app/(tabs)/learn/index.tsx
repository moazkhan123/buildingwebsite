import React from "react";
import { ScrollView, StyleSheet, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { colors, spacing } from "@/theme/colors";

const FEATURES = [
  {
    href: "/learn/lesson",
    emoji: "📖",
    title: "Daily Lesson Creator",
    description: "A focused 30-minute lesson with examples, exercises and a quiz.",
  },
  {
    href: "/learn/flashcards",
    emoji: "🗂️",
    title: "Instant Flashcards",
    description: "Turn any word list into flashcards with examples and memory tips.",
  },
  {
    href: "/learn/grammar",
    emoji: "🧩",
    title: "Grammar Decoder",
    description: "Plain-language explanations plus the 3 mistakes students make most.",
  },
  {
    href: "/learn/immersion",
    emoji: "🌍",
    title: "Immersion Engine",
    description: "Translate any text to French, then answer vocabulary & comprehension questions.",
  },
] as const;

export default function LearnHome() {
  const router = useRouter();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader title="Learn" subtitle="Pick a study tool" />
      {FEATURES.map((f) => (
        <Pressable key={f.href} onPress={() => router.push(f.href)}>
          <Card style={styles.card}>
            <Text style={styles.emoji}>{f.emoji}</Text>
            <Text style={styles.title}>{f.title}</Text>
            <Text style={styles.description}>{f.description}</Text>
          </Card>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing(2), paddingTop: spacing(7), paddingBottom: spacing(6), gap: spacing(2) },
  card: { gap: 6 },
  emoji: { fontSize: 28 },
  title: { color: colors.text, fontSize: 18, fontWeight: "700" },
  description: { color: colors.textMuted, fontSize: 14, lineHeight: 19 },
});
