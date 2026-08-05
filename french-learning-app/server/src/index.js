import "dotenv/config";
import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

import lessonRoute from "./routes/lesson.js";
import flashcardsRoute from "./routes/flashcards.js";
import conversationRoute from "./routes/conversation.js";
import grammarRoute from "./routes/grammar.js";
import quizRoute from "./routes/quiz.js";
import immersionRoute from "./routes/immersion.js";

const app = express();
const PORT = process.env.PORT || 8787;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "*").split(",").map((o) => o.trim());
app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  })
);
app.use(express.json({ limit: "1mb" }));

// AI calls are the expensive/abusable part of this API, so rate-limit them
// separately from the health check.
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down." },
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/lesson", aiLimiter, lessonRoute);
app.use("/api/flashcards", aiLimiter, flashcardsRoute);
app.use("/api/conversation", aiLimiter, conversationRoute);
app.use("/api/grammar", aiLimiter, grammarRoute);
app.use("/api/quiz", aiLimiter, quizRoute);
app.use("/api/immersion", aiLimiter, immersionRoute);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`French app server listening on http://localhost:${PORT}`);
});
