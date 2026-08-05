import { Router } from "express";
import { askForJson } from "../anthropicClient.js";

const router = Router();

// Feature 4: Grammar Decoder
// "Explain this French rule: [insert]. Use simple examples and highlight the
//  three most common mistakes students make."
router.post("/", async (req, res) => {
  const { rule, level = "beginner" } = req.body || {};

  if (!rule || typeof rule !== "string" || !rule.trim()) {
    return res.status(400).json({ error: "Provide a French grammar rule/topic to explain." });
  }

  try {
    const explanation = await askForJson({
      system:
        "You are a clear, encouraging French grammar teacher. Always respond with ONLY valid JSON, no prose.",
      prompt: `Explain this French grammar rule: "${rule.trim()}". Use simple examples suited to a ${level} student, ` +
        `and highlight the three most common mistakes students make.
Return JSON with this exact shape:
{
  "ruleName": string,
  "explanation": string,
  "examples": [ { "french": string, "english": string } ],
  "commonMistakes": [ { "mistake": string, "why": string, "fix": string } ]
}
"commonMistakes" must have exactly 3 items.`,
      maxTokens: 1600,
    });
    res.json(explanation);
  } catch (err) {
    console.error("grammar route error:", err.message);
    res.status(502).json({ error: "Failed to explain the grammar rule." });
  }
});

export default router;
