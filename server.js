const express = require("express");
const path = require("path");
const { InferenceClient } = require("@huggingface/inference");
const { webSearch } = require("./web-search");

const app = express();

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

const HF_TOKEN = process.env.HF_TOKEN;
const MODEL = "openai/gpt-oss-20b";

const hf = new InferenceClient(HF_TOKEN);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    name: "Onur AI",
    model: MODEL,
    webSearch: "DuckDuckGo"
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

    if (!HF_TOKEN) {
      return res.status(500).json({
        error: "HF_TOKEN bulunamadı."
      });
    }

    let webResults = [];

    try {
      webResults = await webSearch(message);
    } catch (error) {
      console.error("WEB ARAMA HATASI:", error.message);
    }

    let webContext = "";

    if (webResults.length > 0) {
      webContext =
        "\n\nİnternetten bulunan sonuçlar:\n" +
        webResults
          .map(
            (result, index) =>
              `${index + 1}. ${result.title}\n${result.url}`
          )
          .join("\n");
    }

    const response = await hf.chatCompletion({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "Sen Onur AI'sın. Türkçe konuş. Kullanıcının sorusunu anlayıp açık, doğru ve yardımcı cevaplar ver. Sana internet arama sonuçları verilirse bunları güncel bilgi için kullan. Sonuçlarda bilgi yoksa bunu uydurma."
        },
        {
          role: "user",
          content: message + webContext
        }
      ],
      max_tokens: 1024,
      temperature: 0.7
    });

    const reply = response?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({
        error: "AI cevap üretmedi."
      });
    }

    res.json({
      reply,
      webResults
    });

  } catch (error) {
    console.error("ONUR AI HATASI:", error);

    res.status(500).json({
      error: "Onur AI cevap oluşturamadı."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Onur AI çalışıyor: ${PORT}`);
});
