import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { Avatar3D } from "@/components/Avatar3D";
import { useAppStore } from "@/store/useAppStore";
import { converse, ConversationTurn } from "@/lib/api";
import { speakFrench, stopSpeaking } from "@/lib/speech";
import { useVoiceInput } from "@/lib/voiceInput";
import { colors, spacing } from "@/theme/colors";

const TOPICS = ["Everyday small talk", "Ordering at a café", "Travel & directions", "Work & school", "Hobbies"];

interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

export default function ConversationScreen() {
  const { level, avatarUrl, avatarName, recordStudySession } = useAppStore();
  const [topic, setTopic] = useState(TOPICS[0]);
  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState<ConversationTurn[]>([]);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [textInput, setTextInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const mouthPulseRef = useRef(0);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voice = useVoiceInput();

  const onWordBoundary = useCallback(() => {
    mouthPulseRef.current = 0.75 + Math.random() * 0.25;
    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    pulseTimeoutRef.current = setTimeout(() => {
      mouthPulseRef.current = 0;
    }, 120);
  }, []);

  const sendTurn = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed) return;

    const nextHistory: ConversationTurn[] = [...history, { role: "user", content: trimmed }];
    setHistory(nextHistory);
    setTextInput("");
    setThinking(true);
    try {
      const result = await converse({ history: nextHistory, topic, level, avatarName });
      setHistory((h) => [...h, { role: "assistant", content: result.reply }]);
      setCorrections(result.corrections || []);
      recordStudySession();
      setSpeaking(true);
      speakFrench(result.reply, {
        onWordBoundary,
        onDone: () => setSpeaking(false),
      });
    } catch {
      Alert.alert("The avatar is unavailable", "Check your connection to the server and try again.");
    } finally {
      setThinking(false);
    }
  };

  const startConversation = async () => {
    setStarted(true);
    setHistory([]);
    setCorrections([]);
    setThinking(true);
    try {
      const result = await converse({ history: [], topic, level, avatarName });
      setHistory([{ role: "assistant", content: result.reply }]);
      setSpeaking(true);
      speakFrench(result.reply, { onWordBoundary, onDone: () => setSpeaking(false) });
      recordStudySession();
    } catch {
      Alert.alert("The avatar is unavailable", "Check your connection to the server and try again.");
      setStarted(false);
    } finally {
      setThinking(false);
    }
  };

  const onMicPress = async () => {
    if (!voice.available) {
      Alert.alert(
        "Voice input needs a dev build",
        "Speech-to-text uses a native module, so it only works in an EAS development/production build — not in Expo Go. Use the text box below to test conversations for now."
      );
      return;
    }
    stopSpeaking();
    if (voice.listening) {
      const text = await voice.stop();
      sendTurn(text);
    } else {
      await voice.start();
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Real Conversation Mode" subtitle={`Talk with ${avatarName}, your AI avatar`} />

        <Avatar3D avatarUrl={avatarUrl} speaking={speaking} mouthPulseRef={mouthPulseRef} />

        {!started ? (
          <Card style={{ gap: spacing(1.5) }}>
            <Text style={styles.label}>Choose a topic</Text>
            <View style={styles.chipRow}>
              {TOPICS.map((t) => (
                <Pressable key={t} onPress={() => setTopic(t)} style={[styles.chip, topic === t && styles.chipActive]}>
                  <Text style={[styles.chipText, topic === t && styles.chipTextActive]}>{t}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={styles.startButton} onPress={startConversation}>
              <Text style={styles.startButtonText}>Start talking →</Text>
            </Pressable>
          </Card>
        ) : (
          <>
            <View style={styles.transcript}>
              {history.map((turn, i) => (
                <View
                  key={i}
                  style={[styles.bubble, turn.role === "user" ? styles.bubbleUser : styles.bubbleAvatar]}
                >
                  <Text style={turn.role === "user" ? styles.bubbleLabelUser : styles.bubbleLabelAvatar}>
                    {turn.role === "user" ? "You" : avatarName}
                  </Text>
                  <Text style={turn.role === "user" ? styles.bubbleTextUser : styles.bubbleTextAvatar}>
                    {turn.content}
                  </Text>
                </View>
              ))}
              {thinking && <ActivityIndicator color={colors.primary} style={{ marginTop: spacing(1) }} />}
            </View>

            {corrections.length > 0 && (
              <Card style={{ gap: spacing(1) }}>
                <Text style={styles.label}>Corrections</Text>
                {corrections.map((c, i) => (
                  <View key={i} style={styles.correctionRow}>
                    <Text style={styles.correctionOriginal}>{c.original}</Text>
                    <Text style={styles.correctionArrow}>→</Text>
                    <Text style={styles.correctionFixed}>{c.corrected}</Text>
                    <Text style={styles.correctionExplanation}>{c.explanation}</Text>
                  </View>
                ))}
              </Card>
            )}
          </>
        )}
      </ScrollView>

      {started && (
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Type in French… (or use the mic)"
            placeholderTextColor={colors.textMuted}
            value={textInput}
            onChangeText={setTextInput}
            onSubmitEditing={() => sendTurn(textInput)}
          />
          <Pressable
            style={[styles.micButton, voice.listening && styles.micButtonActive]}
            onPress={onMicPress}
          >
            <Text style={styles.micIcon}>{voice.listening ? "■" : "🎙️"}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing(2), paddingTop: spacing(7), paddingBottom: spacing(12), gap: spacing(2) },
  label: { color: colors.textMuted, fontSize: 13 },
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
  startButton: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  startButtonText: { color: colors.background, fontWeight: "800", fontSize: 16 },
  transcript: { gap: spacing(1) },
  bubble: {
    borderRadius: 14,
    padding: spacing(1.5),
    maxWidth: "88%",
  },
  bubbleUser: { backgroundColor: colors.primary, alignSelf: "flex-end" },
  bubbleAvatar: { backgroundColor: colors.surface, alignSelf: "flex-start", borderWidth: 1, borderColor: colors.border },
  bubbleLabelUser: { fontSize: 11, color: "rgba(0,0,0,0.5)", marginBottom: 2, fontWeight: "700" },
  bubbleLabelAvatar: { fontSize: 11, color: colors.textMuted, marginBottom: 2, fontWeight: "700" },
  bubbleTextUser: { color: colors.background, fontSize: 15 },
  bubbleTextAvatar: { color: colors.text, fontSize: 15 },
  correctionRow: {
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    paddingLeft: spacing(1),
  },
  correctionOriginal: { color: colors.error, textDecorationLine: "line-through" },
  correctionArrow: { color: colors.textMuted },
  correctionFixed: { color: colors.success, fontWeight: "700" },
  correctionExplanation: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  inputBar: {
    flexDirection: "row",
    gap: spacing(1),
    padding: spacing(1.5),
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  micButtonActive: { backgroundColor: colors.error },
  micIcon: { fontSize: 18 },
});
