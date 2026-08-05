// Wraps @react-native-voice/voice for French speech-to-text.
// This is a native module: it works in an EAS development/production build,
// NOT in Expo Go. Conversation Mode falls back to a text input when it's
// unavailable, so the app is still fully usable during Expo Go testing.
import { useEffect, useRef, useState } from "react";

type VoiceModule = typeof import("@react-native-voice/voice").default;

let Voice: VoiceModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Voice = require("@react-native-voice/voice").default;
} catch {
  Voice = null;
}

export function isVoiceInputAvailable() {
  return Voice !== null;
}

export function useVoiceInput() {
  const [listening, setListening] = useState(false);
  const [partialText, setPartialText] = useState("");
  const finalTextRef = useRef("");

  useEffect(() => {
    if (!Voice) return;

    Voice.onSpeechStart = () => setListening(true);
    Voice.onSpeechEnd = () => setListening(false);
    Voice.onSpeechResults = (e) => {
      const text = e.value?.[0] ?? "";
      finalTextRef.current = text;
      setPartialText(text);
    };
    Voice.onSpeechPartialResults = (e) => {
      setPartialText(e.value?.[0] ?? "");
    };
    Voice.onSpeechError = () => setListening(false);

    return () => {
      Voice?.destroy().then(() => Voice?.removeAllListeners());
    };
  }, []);

  const start = async () => {
    if (!Voice) return;
    finalTextRef.current = "";
    setPartialText("");
    await Voice.start("fr-FR");
  };

  const stop = async (): Promise<string> => {
    if (!Voice) return "";
    await Voice.stop();
    return finalTextRef.current || partialText;
  };

  return { listening, partialText, start, stop, available: Voice !== null };
}
