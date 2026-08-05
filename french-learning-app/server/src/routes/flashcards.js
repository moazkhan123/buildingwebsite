import { Router } from "express";
import { askForJson } from "../anthropicClient.js";

const router = Router();

// Feature 2: Instant Flashcards
// "Turn these words into flashcards: [list]. Add usage examples and simple
//  memorization tips that beginners can follow."
router.post("/", async (req, res) => {
  const { words } = req.body || {};

  if (!Array.isArray(words) || words.length === 0) {
    return res.status(400).json({ error: "Provide a non-empty array of French words." });
  }
  const clean = words
    .filter((w) => typeof w === "string" && w.trim().length > 0)
    .slice(0, 30)
    .map((w) => w.trim());

  try {
    const cards = await askForJson({
      system:
        "You are a French vocabulary coach. Always respond with ONLY a valid JSON array, no prose.",
      prompt: `Turn these French words/phrases into flashcards: ${JSON.stringify(clean)}.
For each one, add a usage example sentence and a simple memorization tip a beginner can follow.
Return a JSON array with this exact shape:
[ { "word": string, "translation": string, "example": string, "exampleTranslation": string, "tip": string } ]`,
      maxTokens: 2500,
    });
    res.json({ cards });
  } catch (err) {
    console.error("flashcards route error:", err.message);
    res.status(502).json({ error: "Failed to generate flashcards." });
  }
});

export default router;
