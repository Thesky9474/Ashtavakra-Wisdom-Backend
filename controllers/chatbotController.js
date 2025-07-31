const { buildPrompt } = require('../utils/buildPrompt');
const ChatLog = require('../models/ChatLog');
const ChatMessage = require("../models/ChatMessage");

exports.askGemini = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id; // From JWT

  console.log("📩 Chatbot prompt:", message);

  // Fetch top verses from Python server
  const wisdomApiUrl = process.env.WISDOM_API_URL || "http://127.0.0.1:8000";
  const response = await fetch(`${wisdomApiUrl}/rag/rag/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: message }),
  });
  const { results } = await response.json();
  const prompt = buildPrompt(message, results);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    const result = await response.json();
    console.log("🔮 Gemini Raw:", JSON.stringify(result, null, 2));

    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "🧘 Gemini is silent...";

    // 🧠 Save to MongoDB
    if (reply != "🧘 Gemini is silent..."){
      await ChatLog.create({
        userId,
        prompt: message,
        response: reply,
        matchedVerses: results,
      });
      await ChatMessage.create({
        user: userId,
        role: "user",
        text: message,
      });
      await ChatMessage.create({
        user: userId,
        role: "bot",
        text: reply,
      });
    }

    res.json({ reply });
  } catch (err) {
    console.error("❌ Gemini Error:", err);
    res.status(500).json({ reply: "🙏 Error while generating response." });
  }
};

// ✨ MODIFIED: Updated function to handle pagination
exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get page and limit from query, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Fetch messages for the page, plus one extra to check if there are more
    const messages = await ChatMessage.find({ user: userId })
      .sort({ createdAt: -1 }) // Sort by newest first for pagination
      .skip(skip)
      .limit(limit + 1); // Fetch one extra

    // Check if there are more messages to load
    const hasMore = messages.length > limit;
    // If there are more, remove the extra one from the response
    if (hasMore) {
      messages.pop();
    }

    // Send messages in chronological order for display and hasMore flag
    res.json({ messages: messages.reverse(), hasMore });

  } catch (err) {
    console.error("❌ Error fetching paginated history:", err);
    res.status(500).json({ message: "Failed to fetch chat history." });
  }
};


