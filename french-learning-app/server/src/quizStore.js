import { randomUUID } from "crypto";

// In-memory store so quiz answers never reach the client until they submit.
// Fine for a single-instance server; swap for Redis if you scale to multiple instances.
const quizzes = new Map();
const TTL_MS = 1000 * 60 * 60; // 1 hour

export function storeQuiz(questionsWithAnswers) {
  const id = randomUUID();
  quizzes.set(id, { questions: questionsWithAnswers, createdAt: Date.now() });
  return id;
}

export function getQuiz(id) {
  const entry = quizzes.get(id);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > TTL_MS) {
    quizzes.delete(id);
    return null;
  }
  return entry.questions;
}

export function consumeQuiz(id) {
  const questions = getQuiz(id);
  quizzes.delete(id);
  return questions;
}

setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of quizzes) {
    if (now - entry.createdAt > TTL_MS) quizzes.delete(id);
  }
}, 1000 * 60 * 10).unref();
