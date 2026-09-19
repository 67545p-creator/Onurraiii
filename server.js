const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const path = require("path");

const app = express();

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({
        error: "Mesaj boş olamaz."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: message
    });

    res.json({
      reply: response.text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Gemini API bağlantısı başarısız."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Onur AI server çalışıyor.");
});
