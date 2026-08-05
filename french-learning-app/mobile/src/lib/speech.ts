import * as Speech from "expo-speech";

export interface SpeakOptions {
  onWordBoundary?: () => void;
  onDone?: () => void;
}

/**
 * Speaks French text aloud and fires onWordBoundary as each word/character
 * boundary is hit. Avatar3D uses those callbacks to pulse the mouth open,
 * which gives a lightweight, dependency-free lip-sync effect without needing
 * phoneme-level viseme data.
 */
export function speakFrench(text: string, { onWordBoundary, onDone }: SpeakOptions = {}) {
  Speech.stop();
  Speech.speak(text, {
    language: "fr-FR",
    pitch: 1.0,
    rate: 0.95,
    onBoundary: () => onWordBoundary?.(),
    onDone: () => onDone?.(),
    onStopped: () => onDone?.(),
    onError: () => onDone?.(),
  });
}

export function stopSpeaking() {
  Speech.stop();
}

export async function isSpeaking() {
  return Speech.isSpeakingAsync();
}
