// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Fix fetch for Node 24+ CommonJS
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "⚠️ You sent an empty message." });
  }

  console.log("Received message:", message);
  console.log("API key loaded:", !!process.env.GEMINI_API_KEY);

  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: message } // User message
                ]
              }
            ],
            temperature: 0.7,
            candidate_count: 1
          }),
        }
      );

      const data = await response.json();
      console.log("Gemini API response:", data);

      // Extract AI-generated reply
      const reply =
        data?.candidates?.[0]?.content?.[0]?.text ||
        "I couldn’t process that. Try again.";

      return res.json({ reply });
    } catch (err) {
      console.error("Gemini API error:", err);
      // If Gemini fails, fallback to dummy reply
    }
  }

  // Dummy AI fallback
  const dummyReplies = [
    "I'm here to listen. Tell me more.",
    "That sounds tough. How are you coping?",
    "I hear you. Can you explain that a bit more?",
    "Thanks for sharing. What do you want to do next?",
  ];

  const fallbackReply =
    dummyReplies[Math.floor(Math.random() * dummyReplies.length)];

  res.json({ reply: fallbackReply });
});

app.listen(3000, () =>
  console.log("✅ Server running at http://localhost:3000")
);
