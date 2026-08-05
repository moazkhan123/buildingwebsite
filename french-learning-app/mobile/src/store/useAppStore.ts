import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type FrenchLevel = "beginner" | "intermediate" | "advanced";

interface QuizHistoryEntry {
  date: string;
  score: number;
  total: number;
}

interface AppState {
  level: FrenchLevel;
  avatarUrl: string;
  avatarName: string;
  streakDays: number;
  lastStudyDate: string | null;
  quizHistory: QuizHistoryEntry[];
  setLevel: (level: FrenchLevel) => void;
  setAvatarUrl: (url: string) => void;
  setAvatarName: (name: string) => void;
  recordStudySession: () => void;
  recordQuizResult: (score: number, total: number) => void;
}

function isConsecutiveDay(lastISODate: string | null): "same" | "next" | "broken" {
  if (!lastISODate) return "broken";
  const last = new Date(lastISODate);
  const today = new Date();
  const diffDays = Math.floor(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
      Date.UTC(last.getFullYear(), last.getMonth(), last.getDate())) /
      86400000
  );
  if (diffDays === 0) return "same";
  if (diffDays === 1) return "next";
  return "broken";
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      level: "beginner",
      avatarUrl: "",
      avatarName: "Camille",
      streakDays: 0,
      lastStudyDate: null,
      quizHistory: [],

      setLevel: (level) => set({ level }),
      setAvatarUrl: (avatarUrl) => set({ avatarUrl }),
      setAvatarName: (avatarName) => set({ avatarName }),

      recordStudySession: () => {
        const relation = isConsecutiveDay(get().lastStudyDate);
        const todayISO = new Date().toISOString();
        if (relation === "same") {
          set({ lastStudyDate: todayISO });
          return;
        }
        set({
          streakDays: relation === "next" ? get().streakDays + 1 : 1,
          lastStudyDate: todayISO,
        });
      },

      recordQuizResult: (score, total) => {
        const entry: QuizHistoryEntry = { date: new Date().toISOString(), score, total };
        set({ quizHistory: [entry, ...get().quizHistory].slice(0, 50) });
      },
    }),
    {
      name: "french-app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
