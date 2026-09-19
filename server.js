const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  res.json({
    status: "online"
  });
});

app.options("/api/chat", (req, res) => {
  res.sendStatus(204);
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({
        error: "Mesaj boş olamaz."
      });
    }

    let prompt = message;

    if (message.toLocaleLowerCase("tr-TR") === "selam") {
      prompt =
        "Kullanıcı selam dedi. Tam olarak şu cevabı ver: Merhaba ben Onur AI, yardıma ihtiyacın varsa hazırım.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
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
