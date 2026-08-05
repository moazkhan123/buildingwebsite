import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";
import { FlashcardDeck } from "@/components/FlashcardDeck";
import { useAppStore } from "@/store/useAppStore";
import { generateFlashcards, Flashcard } from "@/lib/api";
import { colors, spacing } from "@/theme/colors";

export default function FlashcardsScreen() {
  const router = useRouter();
  const { recordStudySession } = useAppStore();
  const [wordsInput, setWordsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<Flashcard[] | null>(null);

  const onGenerate = async () => {
    const words = wordsInput
      .split(/[\n,]/)
      .map((w) => w.trim())
      .filter(Boolean);
    if (words.length === 0) {
      Alert.alert("Add some words", "Type or paste a list of French words or phrases first.");
      return;
    }
    setLoading(true);
    setCards(null);
    try {
      const result = await generateFlashcards(words);
      setCards(result);
      recordStudySession();
    } catch {
      Alert.alert("Couldn't create flashcards", "Check your connection to the server and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>‹ Learn</Text>
      </Pressable>
      <ScreenHeader title="Instant Flashcards" subtitle="From word list to memorable cards" />

      <Card style={{ gap: spacing(1) }}>
        <Text style={styles.label}>Words or phrases (one per line, or comma-separated)</Text>
        <TextInput
          style={styles.textArea}
          placeholder={"le chat\nla maison\nmanger\n..."}
          placeholderTextColor={colors.textMuted}
          value={wordsInput}
          onChangeText={setWordsInput}
          multiline
          numberOfLines={6}
        />
        <PrimaryButton label="Generate flashcards" onPress={onGenerate} loading={loading} />
      </Card>

      {cards && cards.length > 0 && <FlashcardDeck cards={cards} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing(2), paddingTop: spacing(7), paddingBottom: spacing(6), gap: spacing(2) },
  back: { color: colors.primary, fontSize: 16, marginBottom: spacing(1) },
  label: { color: colors.textMuted, fontSize: 13 },
  textArea: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    padding: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
    textAlignVertical: "top",
  },
});
