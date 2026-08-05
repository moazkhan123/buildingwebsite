import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAppStore } from "@/store/useAppStore";
import { generateLesson, Lesson, LessonFocus } from "@/lib/api";
import { colors, spacing } from "@/theme/colors";

const FOCI: LessonFocus[] = ["grammar", "speaking", "listening comprehension"];

export default function LessonScreen() {
  const router = useRouter();
  const { level, recordStudySession } = useAppStore();
  const [focus, setFocus] = useState<LessonFocus>("grammar");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const onGenerate = async () => {
    setLoading(true);
    setLesson(null);
    setSubmitted(false);
    setSelectedAnswers({});
    try {
      const result = await generateLesson({ focus, level, topic: topic.trim() || undefined });
      setLesson(result);
      recordStudySession();
    } catch (err) {
      Alert.alert("Couldn't create the lesson", "Check your connection to the server and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>‹ Learn</Text>
      </Pressable>
      <ScreenHeader title="Daily Lesson Creator" subtitle="A 30-minute lesson, tailored to you" />

      <Card style={styles.section}>
        <Text style={styles.label}>Focus</Text>
        <View style={styles.chipRow}>
          {FOCI.map((f) => (
            <Pressable key={f} onPress={() => setFocus(f)} style={[styles.chip, focus === f && styles.chipActive]}>
              <Text style={[styles.chipText, focus === f && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>Topic (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. ordering food, the past tense, travel"
          placeholderTextColor={colors.textMuted}
          value={topic}
          onChangeText={setTopic}
        />
        <PrimaryButton label="Generate lesson" onPress={onGenerate} loading={loading} />
      </Card>

      {lesson && (
        <View style={{ gap: spacing(2) }}>
          <Card>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.helperText}>
              {lesson.durationMinutes} min · {lesson.level} · {lesson.focus}
            </Text>
            {lesson.objectives.map((o, i) => (
              <Text key={i} style={styles.bullet}>
                • {o}
              </Text>
            ))}
          </Card>

          {lesson.sections.map((s, i) => (
            <Card key={i}>
              <Text style={styles.sectionTitle}>{s.heading}</Text>
              <Text style={styles.body}>{s.content}</Text>
              {s.examples.map((ex, j) => (
                <Text key={j} style={styles.example}>
                  “{ex}”
                </Text>
              ))}
            </Card>
          ))}

          <Card>
            <Text style={styles.sectionTitle}>Exercises</Text>
            {lesson.exercises.map((e, i) => (
              <View key={i} style={{ marginBottom: spacing(1) }}>
                <Text style={styles.body}>
                  {i + 1}. {e.instruction}
                </Text>
                <Text style={styles.example}>{e.prompt}</Text>
              </View>
            ))}
          </Card>

          <Card>
            <Text style={styles.sectionTitle}>Quick quiz</Text>
            {lesson.quiz.map((q, qi) => (
              <View key={qi} style={{ marginBottom: spacing(1.5) }}>
                <Text style={styles.body}>
                  {qi + 1}. {q.question}
                </Text>
                {q.options.map((opt, oi) => {
                  const isSelected = selectedAnswers[qi] === oi;
                  const isCorrect = submitted && oi === q.answerIndex;
                  const isWrongSelected = submitted && isSelected && oi !== q.answerIndex;
                  return (
                    <Pressable
                      key={oi}
                      disabled={submitted}
                      onPress={() => setSelectedAnswers((prev) => ({ ...prev, [qi]: oi }))}
                      style={[
                        styles.option,
                        isSelected && styles.optionSelected,
                        isCorrect && styles.optionCorrect,
                        isWrongSelected && styles.optionWrong,
                      ]}
                    >
                      <Text style={styles.optionText}>{opt}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
            {!submitted ? (
              <PrimaryButton label="Check answers" onPress={() => setSubmitted(true)} variant="secondary" />
            ) : (
              <Text style={styles.helperText}>
                Score: {lesson.quiz.filter((q, i) => selectedAnswers[i] === q.answerIndex).length}/
                {lesson.quiz.length}
              </Text>
            )}
          </Card>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing(2), paddingTop: spacing(7), paddingBottom: spacing(6), gap: spacing(2) },
  back: { color: colors.primary, fontSize: 16, marginBottom: spacing(1) },
  section: { gap: spacing(1) },
  label: { color: colors.textMuted, fontSize: 13, marginTop: spacing(1) },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing(1) },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontSize: 13 },
  chipTextActive: { color: colors.background, fontWeight: "700" },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    padding: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lessonTitle: { color: colors.text, fontSize: 20, fontWeight: "800", marginBottom: 4 },
  helperText: { color: colors.textMuted, fontSize: 13, marginBottom: spacing(1) },
  bullet: { color: colors.text, marginTop: 4 },
  sectionTitle: { color: colors.accent, fontWeight: "700", fontSize: 16, marginBottom: 6 },
  body: { color: colors.text, lineHeight: 20 },
  example: { color: colors.textMuted, fontStyle: "italic", marginTop: 4 },
  option: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 6,
  },
  optionSelected: { borderColor: colors.primary },
  optionCorrect: { borderColor: colors.success, backgroundColor: "rgba(76,175,80,0.15)" },
  optionWrong: { borderColor: colors.error, backgroundColor: "rgba(239,83,80,0.15)" },
  optionText: { color: colors.text },
});
