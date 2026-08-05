import { Router } from "express";
import { askForJson } from "../anthropicClient.js";

const router = Router();

// Feature 6: Immersion Engine
// "Translate this text into French: [paste]. Then, ask me questions about
//  vocabulary, phrases & comprehension."
router.post("/", async (req, res) => {
  const { text, level = "beginner" } = req.body || {};

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Provide text to translate and study." });
  }
  const input = text.trim().slice(0, 4000);

  try {
    const result = await askForJson({
      system:
        "You are a French immersion tutor. Always respond with ONLY valid JSON, no prose.",
      prompt: `Translate this text into French, then write questions about its vocabulary, phrases and comprehension for a ${level} student:
"""
${input}
"""
Return JSON with this exact shape:
{
  "translation": string,
  "vocabQuestions": [ { "question": string, "answer": string } ],
  "phraseQuestions": [ { "question": string, "answer": string } ],
  "comprehensionQuestions": [ { "question": string, "answer": string } ]
}
Include 3-5 items in each question array.`,
      maxTokens: 2500,
    });
    res.json(result);
  } catch (err) {
    console.error("immersion route error:", err.message);
    res.status(502).json({ error: "Failed to process the text." });
  }
});

export default router;
