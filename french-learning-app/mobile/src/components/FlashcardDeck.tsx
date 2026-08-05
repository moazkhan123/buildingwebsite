import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme/colors";
import { Flashcard } from "@/lib/api";

interface Props {
  cards: Flashcard[];
}

export function FlashcardDeck({ cards }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const spin = useRef(new Animated.Value(0)).current;

  const card = cards[index];

  const flip = () => {
    Animated.timing(spin, {
      toValue: flipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setFlipped((f) => !f);
  };

  const goTo = (next: number) => {
    if (next < 0 || next >= cards.length) return;
    spin.setValue(0);
    setFlipped(false);
    setIndex(next);
  };

  const frontRotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });
  const backRotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["180deg", "360deg"] });

  return (
    <View style={{ gap: spacing(2) }}>
      <Text style={styles.progress}>
        {index + 1} / {cards.length}
      </Text>

      <Pressable onPress={flip} style={styles.cardWrapper}>
        <Animated.View
          style={[styles.face, styles.front, { transform: [{ rotateY: frontRotate }] }]}
        >
          <Text style={styles.word}>{card.word}</Text>
          <Text style={styles.hint}>Tap to flip</Text>
        </Animated.View>
        <Animated.View
          style={[styles.face, styles.back, { transform: [{ rotateY: backRotate }] }]}
        >
          <Text style={styles.translation}>{card.translation}</Text>
          <Text style={styles.example}>“{card.example}”</Text>
          <Text style={styles.exampleTranslation}>{card.exampleTranslation}</Text>
          <Text style={styles.tip}>💡 {card.tip}</Text>
        </Animated.View>
      </Pressable>

      <View style={styles.navRow}>
        <Pressable style={styles.navButton} onPress={() => goTo(index - 1)} disabled={index === 0}>
          <Text style={styles.navText}>‹ Prev</Text>
        </Pressable>
        <Pressable
          style={styles.navButton}
          onPress={() => goTo(index + 1)}
          disabled={index === cards.length - 1}
        >
          <Text style={styles.navText}>Next ›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progress: { color: colors.textMuted, textAlign: "center" },
  cardWrapper: {
    height: 240,
  },
  face: {
    position: "absolute",
    width: "100%",
    height: 240,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing(3),
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  front: {},
  back: {},
  word: { color: colors.text, fontSize: 32, fontWeight: "800" },
  hint: { color: colors.textMuted, marginTop: spacing(1) },
  translation: { color: colors.accent, fontSize: 22, fontWeight: "700", marginBottom: spacing(1) },
  example: { color: colors.text, fontStyle: "italic", textAlign: "center" },
  exampleTranslation: { color: colors.textMuted, textAlign: "center", marginTop: 4 },
  tip: { color: colors.text, marginTop: spacing(1.5), textAlign: "center" },
  navRow: { flexDirection: "row", justifyContent: "space-between" },
  navButton: { padding: 12 },
  navText: { color: colors.primary, fontWeight: "700" },
});
