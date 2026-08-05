import { Router } from "express";
import { askForJson } from "../anthropicClient.js";
import { storeQuiz, consumeQuiz } from "../quizStore.js";

const router = Router();

// Feature 5: Progress Evaluator
// "Give me a 10-question quiz based on what I've studied this week. Only
//  reveal the answers after I've taken it."
router.post("/", async (req, res) => {
  const { topics = [], level = "beginner" } = req.body || {};
  const topicList = Array.isArray(topics) && topics.length ? topics.join(", ") : "general French basics";

  try {
    const generated = await askForJson({
      system:
        "You are a French exam writer. Always respond with ONLY valid JSON, no prose.",
      prompt: `Write a 10-question quiz covering: ${topicList}, for a ${level}-level student. Mix multiple-choice and fill-in-the-blank.
Return JSON with this exact shape:
{
  "questions": [
    { "id": number, "type": "multiple-choice" | "fill-blank", "question": string, "options": string[] | null, "answer": string, "explanation": string }
  ]
}
Exactly 10 questions, ids 1-10. For "fill-blank" questions, "options" is null.`,
      maxTokens: 2500,
    });

    const questions = generated.questions || [];
    const quizId = storeQuiz(questions);

    // Strip answers/explanations before sending — they're only revealed after grading.
    const publicQuestions = questions.map(({ id, type, question, options }) => ({
      id,
      type,
      question,
      options,
    }));

    res.json({ quizId, questions: publicQuestions });
  } catch (err) {
    console.error("quiz create route error:", err.message);
    res.status(502).json({ error: "Failed to generate quiz." });
  }
});

router.post("/grade", async (req, res) => {
  const { quizId, answers } = req.body || {};
  if (!quizId || typeof answers !== "object") {
    return res.status(400).json({ error: "quizId and answers are required." });
  }

  const questions = consumeQuiz(quizId);
  if (!questions) {
    return res.status(404).json({ error: "Quiz expired or not found. Generate a new one." });
  }

  const normalize = (s) => String(s ?? "").trim().toLowerCase();

  const results = questions.map((q) => {
    const submitted = answers[q.id];
    const isCorrect = normalize(submitted) === normalize(q.answer);
    return {
      id: q.id,
      question: q.question,
      submitted: submitted ?? null,
      correct: q.answer,
      explanation: q.explanation,
      isCorrect,
    };
  });

  const score = results.filter((r) => r.isCorrect).length;

  res.json({ score, total: results.length, results });
});

export default router;
