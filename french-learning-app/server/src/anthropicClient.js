import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    "[french-app-server] ANTHROPIC_API_KEY is not set. AI routes will fail until it is configured in server/.env"
  );
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

/**
 * Calls Claude with a system prompt + user message and asks for strict JSON back.
 * Anthropic doesn't have a JSON-mode flag, so we instruct it in the prompt and
 * defensively extract the first {...} or [...] block from the response.
 */
export async function askForJson({ system, prompt, maxTokens = 2000 }) {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return extractJson(text);
}

export function extractJson(text) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Model sometimes wraps JSON in prose or markdown fences — pull out the block.
    const match = trimmed.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("Model response was not valid JSON: " + trimmed.slice(0, 300));
  }
}
