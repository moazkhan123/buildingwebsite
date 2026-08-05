import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAppStore } from "@/store/useAppStore";
import { runImmersion, ImmersionResult } from "@/lib/api";
import { colors, spacing } from "@/theme/colors";

function QuestionList({ title, items }: { title: string; items: { question: string; answer: string }[] }) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  if (items.length === 0) return null;
  return (
    <Card style={{ gap: spacing(1) }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, i) => (
        <Pressable key={i} onPress={() => setRevealed((r) => ({ ...r, [i]: !r[i] }))}>
          <Text style={styles.body}>{item.question}</Text>
          <Text style={styles.answer}>{revealed[i] ? item.answer : "Tap to reveal answer"}</Text>
        </Pressable>
      ))}
    </Card>
  );
}

export default function ImmersionScreen() {
  const router = useRouter();
  const { level, recordStudySession } = useAppStore();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImmersionResult | null>(null);

  const onRun = async () => {
    if (!text.trim()) {
      Alert.alert("Paste some text", "Add a sentence or paragraph in any language to translate and study.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await runImmersion({ text: text.trim(), level });
      setResult(data);
      recordStudySession();
    } catch {
      Alert.alert("Couldn't process that text", "Check your connection to the server and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>‹ Learn</Text>
      </Pressable>
      <ScreenHeader title="Immersion Engine" subtitle="Translate, then test yourself on it" />

      <Card style={{ gap: spacing(1) }}>
        <TextInput
          style={styles.textArea}
          placeholder="Paste a sentence or short paragraph…"
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={6}
        />
        <PrimaryButton label="Translate & study" onPress={onRun} loading={loading} />
      </Card>

      {result && (
        <>
          <Card>
            <Text style={styles.sectionTitle}>French translation</Text>
            <Text style={styles.body}>{result.translation}</Text>
          </Card>
          <QuestionList title="Vocabulary" items={result.vocabQuestions} />
          <QuestionList title="Phrases" items={result.phraseQuestions} />
          <QuestionList title="Comprehension" items={result.comprehensionQuestions} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing(2), paddingTop: spacing(7), paddingBottom: spacing(6), gap: spacing(2) },
  back: { color: colors.primary, fontSize: 16, marginBottom: spacing(1) },
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
  sectionTitle: { color: colors.accent, fontWeight: "700", fontSize: 16, marginBottom: 4 },
  body: { color: colors.text, lineHeight: 20 },
  answer: { color: colors.textMuted, marginTop: 2, marginBottom: spacing(1), fontStyle: "italic" },
});
