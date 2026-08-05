import { Router } from "express";
import { askForJson } from "../anthropicClient.js";

const router = Router();

// Feature 1: Daily Lesson Creator
// "Create a 30-minute French lesson focused on [grammar/speaking/listening comprehension].
//  Includes examples, exercises, and a short quiz."
router.post("/", async (req, res) => {
  const { focus = "grammar", level = "beginner", topic = "" } = req.body || {};

  const allowedFocus = ["grammar", "speaking", "listening comprehension"];
  const safeFocus = allowedFocus.includes(focus) ? focus : "grammar";

  try {
    const lesson = await askForJson({
      system:
        "You are an expert French teacher who designs concise, practical lessons for self-study learners. " +
        "Always respond with ONLY valid JSON, no prose, no markdown fences.",
      prompt: `Create a 30-minute French lesson focused on ${safeFocus}${
        topic ? ` about the topic "${topic}"` : ""
      } for a ${level} level student.
Return JSON with this exact shape:
{
  "title": string,
  "level": string,
  "focus": string,
  "durationMinutes": 30,
  "objectives": string[],
  "sections": [ { "heading": string, "content": string, "examples": string[] } ],
  "exercises": [ { "instruction": string, "prompt": string } ],
  "quiz": [ { "question": string, "options": string[], "answerIndex": number } ]
}
Keep "quiz" to 5 short questions. Use simple, encouraging language.`,
      maxTokens: 2500,
    });
    res.json(lesson);
  } catch (err) {
    console.error("lesson route error:", err.message);
    res.status(502).json({ error: "Failed to generate lesson." });
  }
});

export default router;
