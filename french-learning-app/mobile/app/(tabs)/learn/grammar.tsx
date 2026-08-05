import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, Pressable, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAppStore } from "@/store/useAppStore";
import { decodeGrammar, GrammarExplanation } from "@/lib/api";
import { colors, spacing } from "@/theme/colors";

const SUGGESTIONS = ["passé composé vs imparfait", "when to use être vs avoir", "adjective agreement", "the subjunctive"];

export default function GrammarScreen() {
  const router = useRouter();
  const { level, recordStudySession } = useAppStore();
  const [rule, setRule] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GrammarExplanation | null>(null);

  const onDecode = async (ruleText?: string) => {
    const target = (ruleText ?? rule).trim();
    if (!target) {
      Alert.alert("Add a rule", "Type a French grammar rule or topic to decode.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const explanation = await decodeGrammar({ rule: target, level });
      setResult(explanation);
      recordStudySession();
    } catch {
      Alert.alert("Couldn't decode that rule", "Check your connection to the server and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>‹ Learn</Text>
      </Pressable>
      <ScreenHeader title="Grammar Decoder" subtitle="Plain-language rules, no jargon" />

      <Card style={{ gap: spacing(1) }}>
        <TextInput
          style={styles.input}
          placeholder="e.g. passé composé vs imparfait"
          placeholderTextColor={colors.textMuted}
          value={rule}
          onChangeText={setRule}
        />
        <PrimaryButton label="Decode this rule" onPress={() => onDecode()} loading={loading} />
        <Text style={styles.label}>Or try:</Text>
        <View style={styles.chipRow}>
          {SUGGESTIONS.map((s) => (
            <Pressable
              key={s}
              onPress={() => {
                setRule(s);
                onDecode(s);
              }}
              style={styles.chip}
            >
              <Text style={styles.chipText}>{s}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      {result && (
        <>
          <Card style={{ gap: spacing(1) }}>
            <Text style={styles.ruleName}>{result.ruleName}</Text>
            <Text style={styles.body}>{result.explanation}</Text>
          </Card>

          <Card style={{ gap: spacing(1) }}>
            <Text style={styles.sectionTitle}>Examples</Text>
            {result.examples.map((ex, i) => (
              <Text key={i} style={styles.body}>
                <Text style={{ fontWeight: "700" }}>{ex.french}</Text> — {ex.english}
              </Text>
            ))}
          </Card>

          <Card style={{ gap: spacing(1.5) }}>
            <Text style={styles.sectionTitle}>3 common mistakes</Text>
            {result.commonMistakes.map((m, i) => (
              <Card key={i} style={styles.mistakeCard}>
                <Text style={styles.mistakeTitle}>❌ {m.mistake}</Text>
                <Text style={styles.body}>{m.why}</Text>
                <Text style={styles.fix}>✅ {m.fix}</Text>
              </Card>
            ))}
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing(2), paddingTop: spacing(7), paddingBottom: spacing(6), gap: spacing(2) },
  back: { color: colors.primary, fontSize: 16, marginBottom: spacing(1) },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    padding: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { color: colors.textMuted, fontSize: 13, marginTop: spacing(1) },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing(1) },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: { color: colors.textMuted, fontSize: 13 },
  ruleName: { color: colors.text, fontSize: 20, fontWeight: "800" },
  body: { color: colors.text, lineHeight: 20 },
  sectionTitle: { color: colors.accent, fontWeight: "700", fontSize: 16 },
  mistakeCard: { backgroundColor: colors.surfaceAlt, gap: 4 },
  mistakeTitle: { color: colors.error, fontWeight: "700" },
  fix: { color: colors.success, fontWeight: "600" },
});
