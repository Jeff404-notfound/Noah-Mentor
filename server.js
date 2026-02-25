// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Fix fetch for Node 24+ CommonJS
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are Noah Mentor, a warm and compassionate AI wellness companion for youth.
Your role is to provide emotional support, active listening, and gentle guidance.
- Always respond with empathy and without judgment
- Keep responses concise: 2-4 sentences max
- Never diagnose or replace professional therapy
- If someone is in crisis, always mention the 988 Suicide & Crisis Lifeline
- Current date and time (IST): ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "⚠️ You sent an empty message." });
  }

  console.log("📩 Received message:", message);
  console.log("🔑 Groq API key loaded:", !!process.env.GROQ_API_KEY);

  // ── Groq API ──
  if (process.env.GROQ_API_KEY) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user",   content: message }
          ],
          temperature: 0.75,
          max_tokens: 200
        })
      });

      const data = await response.json();
      console.log("✅ Groq response received");

      const reply = data?.choices?.[0]?.message?.content?.trim()
        || "I'm here for you. Could you tell me a little more?";

      return res.json({ reply });

    } catch (err) {
      console.error("❌ Groq API error:", err.message);
    }
  } else {
    console.warn("⚠️ GROQ_API_KEY not found in .env file!");
  }

  // ── Fallback dummy replies ──
  const dummyReplies = [
    "I'm here to listen. Tell me more. 💚",
    "That sounds tough. How are you coping?",
    "I hear you. Can you share a little more about that?",
    "Thank you for trusting me with this. What would help you most right now?",
    "You're not alone in this. I'm right here with you. 🌿",
  ];

  res.json({ reply: dummyReplies[Math.floor(Math.random() * dummyReplies.length)] });
});

app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));