import { Router } from "express";
import { askForJson } from "../anthropicClient.js";

const router = Router();

// Feature 3: Real Conversation Mode (drives the AI avatar)
// "Play the role of a native French speaker. Have a natural conversation about
//  [topic]. Correct my mistakes as you go."
router.post("/", async (req, res) => {
  const { history = [], topic = "everyday life", level = "beginner", avatarName = "Camille" } =
    req.body || {};

  if (!Array.isArray(history) || history.length > 40) {
    return res.status(400).json({ error: "history must be an array of at most 40 turns." });
  }

  const transcript = history
    .slice(-16) // keep prompts small; the avatar doesn't need the full session history
    .map((turn) => `${turn.role === "user" ? "Student" : avatarName}: ${turn.content}`)
    .join("\n");

  try {
    const result = await askForJson({
      system:
        `You play the role of ${avatarName}, a warm, patient native French speaker having a real spoken ` +
        `conversation with a ${level}-level French student about "${topic}". ` +
        "Keep your in-character reply short (1-3 sentences) and natural, like real speech, at a pace suited to the student's level. " +
        "Separately, gently correct any French mistakes the student's LAST message contained — do not interrupt the conversational flow to do this, just list corrections apart from your reply. " +
        "If the student's last message had no mistakes, return an empty corrections array. " +
        "Always respond with ONLY valid JSON, no prose, no markdown fences.",
      prompt: `Conversation so far:\n${transcript || "(the student has not said anything yet — greet them and ask an opening question about the topic)"}\n\nRespond as ${avatarName}.
Return JSON with this exact shape:
{
  "reply": string,               // your in-character French reply
  "replyEnglish": string,        // short English gloss of your reply, for the student's reference
  "corrections": [ { "original": string, "corrected": string, "explanation": string } ]
}`,
      maxTokens: 1200,
    });
    res.json(result);
  } catch (err) {
    console.error("conversation route error:", err.message);
    res.status(502).json({ error: "The avatar couldn't respond. Please try again." });
  }
});

export default router;
