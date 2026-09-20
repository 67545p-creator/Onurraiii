const express = require("express");
const path = require("path");
const { InferenceClient } = require("@huggingface/inference");

const app = express();

app.use(express.json({ limit: "20kb" }));

app.use(express.static(path.join(__dirname, "public")));

const hf = new InferenceClient(process.env.HF_TOKEN);

const MODEL = "openai/gpt-oss-120b:fastest";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    name: "Onur AI",
    ai: "Hugging Face"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({
        error: "Mesaj boş olamaz."
      });
    }

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({
        error: "HF_TOKEN ayarlanmamış."
      });
    }

    const response = await hf.chatCompletion({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "Sen Onur AI'sın. Türkçe konuş. Kullanıcının sorusunu anlamaya çalış ve doğrudan, anlaşılır ve doğru cevap ver."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 1024,
      temperature: 0.7
    });

    const reply =
      response?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({
        error: "AI cevap üretemedi."
      });
    }

    res.json({
      reply,
      source: "ai"
    });

  } catch (error) {
    console.error("AI HATASI:", error);

    res.status(500).json({
      error: "Onur AI şu anda cevap oluşturamadı."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Onur AI server çalışıyor. Port: ${PORT}`);
});
