import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAppStore, FrenchLevel } from "@/store/useAppStore";
import { colors, spacing } from "@/theme/colors";

const LEVELS: FrenchLevel[] = ["beginner", "intermediate", "advanced"];

export default function HomeScreen() {
  const router = useRouter();
  const { level, setLevel, avatarUrl, setAvatarUrl, avatarName, setAvatarName, streakDays, quizHistory } =
    useAppStore();
  const [urlDraft, setUrlDraft] = useState(avatarUrl);
  const [nameDraft, setNameDraft] = useState(avatarName);

  const bestScore = quizHistory[0] ? `${quizHistory[0].score}/${quizHistory[0].total}` : "—";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader title="Bonjour AI 👋" subtitle="Your interactive French coach" />

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{streakDays}</Text>
          <Text style={styles.statLabel}>day streak</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{bestScore}</Text>
          <Text style={styles.statLabel}>last quiz</Text>
        </Card>
      </View>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Your level</Text>
        <View style={styles.levelRow}>
          {LEVELS.map((l) => (
            <Pressable
              key={l}
              onPress={() => setLevel(l)}
              style={[styles.levelChip, level === l && styles.levelChipActive]}
            >
              <Text style={[styles.levelChipText, level === l && styles.levelChipTextActive]}>
                {l}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>AI avatar tutor</Text>
        <Text style={styles.helperText}>
          Create a free 3D avatar at readyplayer.me, then paste its .glb link below to bring your
          Conversation Mode tutor to life.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Avatar name (e.g. Camille)"
          placeholderTextColor={colors.textMuted}
          value={nameDraft}
          onChangeText={setNameDraft}
        />
        <TextInput
          style={styles.input}
          placeholder="https://models.readyplayer.me/xxxx.glb"
          placeholderTextColor={colors.textMuted}
          value={urlDraft}
          onChangeText={setUrlDraft}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <PrimaryButton
          label="Save avatar"
          onPress={() => {
            setAvatarUrl(urlDraft.trim());
            setAvatarName(nameDraft.trim() || "Camille");
          }}
        />
      </Card>

      <PrimaryButton label="Start a conversation →" onPress={() => router.push("/conversation")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing(2), paddingTop: spacing(7), paddingBottom: spacing(6), gap: spacing(2) },
  statsRow: { flexDirection: "row", gap: spacing(2) },
  statCard: { flex: 1, alignItems: "center", paddingVertical: spacing(2) },
  statValue: { fontSize: 28, fontWeight: "800", color: colors.accent },
  statLabel: { color: colors.textMuted, marginTop: 4 },
  section: { gap: spacing(1.5) },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
  helperText: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
  levelRow: { flexDirection: "row", gap: spacing(1) },
  levelChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  levelChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  levelChipText: { color: colors.textMuted, textTransform: "capitalize" },
  levelChipTextActive: { color: colors.background, fontWeight: "700" },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    padding: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
