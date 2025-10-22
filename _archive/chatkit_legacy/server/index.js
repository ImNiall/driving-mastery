/* Production-ready minimal API server for OpenAI-backed chat (ESM) */
import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import OpenAI from "openai";
import { fileURLToPath } from "url";
import { DVSA_CATEGORIES, SYSTEM_INSTRUCTION } from "./constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8787;
const NODE_ENV = process.env.NODE_ENV || "development";
const MODEL = process.env.OPENAI_MODEL || "gpt-5";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn(
    "[WARN] OPENAI_API_KEY is not set. The /api/chat endpoint will return an error until a key is provided.",
  );
}

const app = express();

// Security and logging
app.use(
  helmet({
    contentSecurityPolicy: NODE_ENV === "production" ? undefined : false,
  }),
);
app.use(morgan("tiny"));

// In dev, allow CORS from Vite server
if (NODE_ENV !== "production") {
  app.use(cors({ origin: true, credentials: true }));
}

app.use(express.json({ limit: "1mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
});
app.use("/api/", limiter);

function buildMessages(history) {
  const msgs = [];
  msgs.push({
    role: "system",
    content: `${SYSTEM_INSTRUCTION}\n\nReturn concise answers.\nIf recommending a quiz, include a single JSON object at the end of your reply on a new line like:\n<action>{\n  \"type\": \"start_quiz\",\n  \"categories\": [\"Motorway rules\"],\n  \"questionCount\": 10\n}</action>\nOnly include <action> if truly relevant. Categories must be from this set: ${DVSA_CATEGORIES.join(", ")}.`,
  });
  for (const m of history || []) {
    if (m.role === "user") msgs.push({ role: "user", content: m.text });
    else msgs.push({ role: "assistant", content: m.text });
  }
  return msgs;
}

function extractActionFromText(text) {
  try {
    const start = text.lastIndexOf("<action>");
    const end = text.lastIndexOf("</action>");
    if (start === -1 || end === -1 || end <= start) return undefined;
    const jsonText = text.substring(start + "<action>".length, end).trim();
    const obj = JSON.parse(jsonText);
    if (
      obj &&
      obj.type === "start_quiz" &&
      Array.isArray(obj.categories) &&
      typeof obj.questionCount === "number"
    ) {
      const allowed = DVSA_CATEGORIES.map(String);
      const mapped = obj.categories.filter((c) => allowed.includes(String(c)));
      return {
        type: "start_quiz",
        categories: mapped,
        questionCount: obj.questionCount,
      };
    }
  } catch (e) {}
  return undefined;
}

// API route
app.post("/api/chat", async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res
        .status(500)
        .json({ error: "Server not configured with OPENAI_API_KEY" });
    }
    const history = Array.isArray(req.body?.history) ? req.body.history : [];

    const client = new OpenAI({ apiKey: OPENAI_API_KEY });
    const messages = buildMessages(history);

    const resp = await client.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.3,
    });

    const text = resp.choices?.[0]?.message?.content || "";
    const action = extractActionFromText(text);

    return res.json({ text, action });
  } catch (err) {
    console.error("Error in /api/chat:", err);
    return res.status(500).json({ error: "Upstream error contacting OpenAI" });
  }
});

// Static hosting for production build
const distDir = path.resolve(__dirname, "..", "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(
    `[server] listening on http://localhost:${PORT} (env: ${NODE_ENV})`,
  );
});
