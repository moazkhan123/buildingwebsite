// French speech-to-text via expo-speech-recognition — a native module: it
// works in an EAS development/production build, NOT in Expo Go. Conversation
// Mode falls back to a text input when it's unavailable, so the app is still
// fully usable during Expo Go testing.
//
// Previously used @react-native-voice/voice, but that package is deprecated
// and still depends on the legacy (pre-AndroidX) Android support library,
// which caused an AndroidManifest merge conflict with modern androidx.core
// during the EAS build. expo-speech-recognition is the actively maintained,
// AndroidX-native replacement.
import { useCallback, useState } from "react";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export function isVoiceInputAvailable() {
  return true;
}

export function useVoiceInput() {
  const [listening, setListening] = useState(false);
  const [partialText, setPartialText] = useState("");
  const [available, setAvailable] = useState(true);

  useSpeechRecognitionEvent("start", () => setListening(true));
  useSpeechRecognitionEvent("end", () => setListening(false));
  useSpeechRecognitionEvent("result", (event) => {
    setPartialText(event.results[0]?.transcript ?? "");
  });
  useSpeechRecognitionEvent("error", () => setListening(false));

  const start = useCallback(async () => {
    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      setAvailable(false);
      return;
    }
    setPartialText("");
    ExpoSpeechRecognitionModule.start({
      lang: "fr-FR",
      interimResults: true,
      continuous: false,
    });
  }, []);

  const stop = useCallback(async (): Promise<string> => {
    ExpoSpeechRecognitionModule.stop();
    return partialText;
  }, [partialText]);

  return { listening, partialText, start, stop, available };
}
