import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, Pressable, View, Alert } from "react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAppStore } from "@/store/useAppStore";
import { generateQuiz, gradeQuiz, QuizQuestion, QuizGradeResult } from "@/lib/api";
import { colors, spacing } from "@/theme/colors";

export default function ProgressScreen() {
  const { level, quizHistory, recordQuizResult, recordStudySession } = useAppStore();
  const [topicsInput, setTopicsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [grade, setGrade] = useState<QuizGradeResult | null>(null);

  const onGenerate = async () => {
    const topics = topicsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setLoading(true);
    setGrade(null);
    setAnswers({});
    try {
      const { quizId: id, questions: qs } = await generateQuiz({ topics, level });
      setQuizId(id);
      setQuestions(qs);
    } catch {
      Alert.alert("Couldn't generate a quiz", "Check your connection to the server and try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    if (!quizId) return;
    if (Object.keys(answers).length < questions.length) {
      Alert.alert("Almost done", "Answer every question before submitting.");
      return;
    }
    setLoading(true);
    try {
      const result = await gradeQuiz(quizId, answers);
      setGrade(result);
      recordQuizResult(result.score, result.total);
      recordStudySession();
    } catch {
      Alert.alert("Couldn't grade the quiz", "It may have expired — generate a new one and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader title="Progress Evaluator" subtitle="Test what you've studied — answers stay hidden until you submit" />

      <Card style={{ gap: spacing(1) }}>
        <Text style={styles.label}>Topics from this week (comma-separated, optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. food vocabulary, passé composé, greetings"
          placeholderTextColor={colors.textMuted}
          value={topicsInput}
          onChangeText={setTopicsInput}
        />
        <PrimaryButton label="Generate 10-question quiz" onPress={onGenerate} loading={loading} />
      </Card>

      {questions.length > 0 && (
        <Card style={{ gap: spacing(2) }}>
          {questions.map((q) => {
            const result = grade?.results.find((r) => r.id === q.id);
            return (
              <View key={q.id} style={styles.questionBlock}>
                <Text style={styles.question}>
                  {q.id}. {q.question}
                </Text>
                {q.type === "multiple-choice" && q.options ? (
                  q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt;
                    const isCorrect = grade && result && opt === result.correct;
                    const isWrongSelected = grade && result && isSelected && !result.isCorrect;
                    return (
                      <Pressable
                        key={opt}
                        disabled={!!grade}
                        onPress={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
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
                  })
                ) : (
                  <TextInput
                    style={styles.input}
                    editable={!grade}
                    placeholder="Your answer"
                    placeholderTextColor={colors.textMuted}
                    value={answers[q.id] ?? ""}
                    onChangeText={(text) => setAnswers((a) => ({ ...a, [q.id]: text }))}
                  />
                )}
                {grade && result && (
                  <Text style={result.isCorrect ? styles.correctNote : styles.wrongNote}>
                    {result.isCorrect ? "✅ Correct" : `❌ Correct answer: ${result.correct}`} —{" "}
                    {result.explanation}
                  </Text>
                )}
              </View>
            );
          })}

          {!grade ? (
            <PrimaryButton label="Submit answers" onPress={onSubmit} loading={loading} />
          ) : (
            <Text style={styles.score}>
              Score: {grade.score}/{grade.total}
            </Text>
          )}
        </Card>
      )}

      {quizHistory.length > 0 && (
        <Card style={{ gap: spacing(1) }}>
          <Text style={styles.label}>Recent quiz history</Text>
          {quizHistory.slice(0, 5).map((h, i) => (
            <Text key={i} style={styles.body}>
              {new Date(h.date).toLocaleDateString()} — {h.score}/{h.total}
            </Text>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing(2), paddingTop: spacing(7), paddingBottom: spacing(6), gap: spacing(2) },
  label: { color: colors.textMuted, fontSize: 13 },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    padding: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  questionBlock: { gap: 6 },
  question: { color: colors.text, fontWeight: "700", fontSize: 15 },
  option: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.primary },
  optionCorrect: { borderColor: colors.success, backgroundColor: "rgba(76,175,80,0.15)" },
  optionWrong: { borderColor: colors.error, backgroundColor: "rgba(239,83,80,0.15)" },
  optionText: { color: colors.text },
  correctNote: { color: colors.success, fontSize: 13 },
  wrongNote: { color: colors.error, fontSize: 13 },
  score: { color: colors.accent, fontSize: 20, fontWeight: "800", textAlign: "center" },
  body: { color: colors.text },
});
