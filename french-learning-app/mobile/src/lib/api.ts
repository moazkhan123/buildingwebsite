import axios from "axios";
import Constants from "expo-constants";

const apiBaseUrl =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) || "http://localhost:8787";

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
});

export type LessonFocus = "grammar" | "speaking" | "listening comprehension";

export interface Lesson {
  title: string;
  level: string;
  focus: string;
  durationMinutes: number;
  objectives: string[];
  sections: { heading: string; content: string; examples: string[] }[];
  exercises: { instruction: string; prompt: string }[];
  quiz: { question: string; options: string[]; answerIndex: number }[];
}

export async function generateLesson(params: {
  focus: LessonFocus;
  level: string;
  topic?: string;
}): Promise<Lesson> {
  const { data } = await api.post("/api/lesson", params);
  return data;
}

export interface Flashcard {
  word: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  tip: string;
}

export async function generateFlashcards(words: string[]): Promise<Flashcard[]> {
  const { data } = await api.post("/api/flashcards", { words });
  return data.cards;
}

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ConversationResult {
  reply: string;
  replyEnglish: string;
  corrections: { original: string; corrected: string; explanation: string }[];
}

export async function converse(params: {
  history: ConversationTurn[];
  topic: string;
  level: string;
  avatarName?: string;
}): Promise<ConversationResult> {
  const { data } = await api.post("/api/conversation", params);
  return data;
}

export interface GrammarExplanation {
  ruleName: string;
  explanation: string;
  examples: { french: string; english: string }[];
  commonMistakes: { mistake: string; why: string; fix: string }[];
}

export async function decodeGrammar(params: {
  rule: string;
  level: string;
}): Promise<GrammarExplanation> {
  const { data } = await api.post("/api/grammar", params);
  return data;
}

export interface QuizQuestion {
  id: number;
  type: "multiple-choice" | "fill-blank";
  question: string;
  options: string[] | null;
}

export async function generateQuiz(params: {
  topics: string[];
  level: string;
}): Promise<{ quizId: string; questions: QuizQuestion[] }> {
  const { data } = await api.post("/api/quiz", params);
  return data;
}

export interface QuizGradeResult {
  score: number;
  total: number;
  results: {
    id: number;
    question: string;
    submitted: string | null;
    correct: string;
    explanation: string;
    isCorrect: boolean;
  }[];
}

export async function gradeQuiz(
  quizId: string,
  answers: Record<number, string>
): Promise<QuizGradeResult> {
  const { data } = await api.post("/api/quiz/grade", { quizId, answers });
  return data;
}

export interface ImmersionResult {
  translation: string;
  vocabQuestions: { question: string; answer: string }[];
  phraseQuestions: { question: string; answer: string }[];
  comprehensionQuestions: { question: string; answer: string }[];
}

export async function runImmersion(params: {
  text: string;
  level: string;
}): Promise<ImmersionResult> {
  const { data } = await api.post("/api/immersion", params);
  return data;
}
