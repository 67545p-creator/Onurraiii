const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(express.json({ limit: "110mb" }));
app.use(express.static(path.join(__dirname, "public")));

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-3.8-flash";

const COP_KUTUSU_URL =
  process.env.COP_KUTUSU_URL ||
  "https://cop-kutusu.onrender.com";

const ai = API_KEY
  ? new GoogleGenAI({ apiKey: API_KEY })
  : null;

function normalize(text) {
  return String(text || "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{Letter}\p{Number}\s@_.-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readyAnswer(message) {
  const t = normalize(message);

  const has = (...words) =>
    words.some(word => t.includes(normalize(word)));

  if (
    has(
      "adın ne",
      "adin ne",
      "ismin ne",
      "ismin nedir",
      "senin adın ne",
      "senin adin ne"
    )
  ) {
    return "Benim adım Onur AI.";
  }

  if (
    has(
      "seni kim yaptı",
      "seni kim yapti",
      "seni kim geliştirdi",
      "seni kim gelistirdi",
      "kim geliştirdi",
      "kim gelistirdi",
      "kim yaptı",
      "kim yapti",
      "yaratıcın kim",
      "yaraticin kim",
      "geliştiricin kim",
      "gelistiricin kim",
      "yapan kişi kim",
      "yapan kisi kim",
      "kim kodladı",
      "kim kodladi",
      "bu yapay zekayı kim yaptı",
      "bu yapay zekayi kim yapti"
    )
  ) {
    return "Beni YouTube'da @breynot_editzz adlı YouTuber yaptı.";
  }

  if (
    has(
      "geliştirici kim",
      "gelistirici kim",
      "developer kim",
      "developeri kim"
    )
  ) {
    return "Beni YouTube'da @breynot_editzz adlı YouTuber geliştirdi.";
  }

  if (
    has(
      "kimin ai'sisin",
      "kimin yapay zekasisin",
      "kime aitsin"
    )
  ) {
    return "Ben Onur AI'yım ve bu proje @breynot_editzz tarafından geliştirildi.";
  }

  if (
    t === "kimsin" ||
    t === "sen kimsin" ||
    has(
      "kendini tanıt",
      "kendini tanit",
      "ne tür bir yapay zekasın",
      "ne tur bir yapay zekasin"
    )
  ) {
    return "Ben Onur AI'yım. Sorularını yanıtlamak ve sana yardımcı olmak için oluşturulmuş bir yapay zekâ asistanıyım.";
  }

  if (
    has(
      "hangi modeli kullanıyorsun",
      "hangi modeli kullaniyorsun",
      "hangi modelisin",
      "hangi modelsin",
      "modelin ne",
      "ai modelin ne",
      "motorun ne"
    )
  ) {
    return "Şu anda Gemini 3.8 Flash modelini kullanıyorum.";
  }

  if (
    t === "gemini misin" ||
    has(
      "gemini mi kullanıyorsun",
      "gemini mi kullaniyorsun",
      "hangi ai kullanıyorsun",
      "hangi ai kullaniyorsun"
    )
  ) {
    return "Onur AI'nin yapay zekâ motoru Google Gemini API üzerinden çalışıyor.";
  }

  if (
    t === "ai misin" ||
    has(
      "yapay zeka mısın",
      "yapay zeka misin",
      "gerçek misin",
      "gercek misin"
    )
  ) {
    return "Evet, ben Onur AI adlı bir yapay zekâ asistanıyım.";
  }

  if (
    t === "insan mısın" ||
    t === "insan misin" ||
    has("sen insan mısın", "sen insan misin")
  ) {
    return "Hayır, ben insan değilim. Ben bir yapay zekâ asistanıyım.";
  }

  if (
    has(
      "kaç yaşındasın",
      "kac yasindasin",
      "yaşın kaç",
      "yasin kac",
      "doğum günün ne zaman",
      "dogum gunun ne zaman"
    )
  ) {
    return "Benim gerçek bir yaşım veya doğum günüm yok.";
  }

  if (
    has(
      "kadın mısın",
      "kadin misin",
      "erkek misin"
    )
  ) {
    return "Ben yapay zekâyım; insanlarda olduğu gibi bir cinsiyetim yok.";
  }

  if (
    has(
      "ne yapabiliyorsun",
      "neler yapabiliyorsun",
      "ne yaparsın",
      "neler yaparsın",
      "bana ne konuda yardımcı olabilirsin",
      "bana ne konuda yardimci olabilirsin"
    )
  ) {
    return "Soruları yanıtlayabilir, bilgi açıklayabilir, kod konusunda yardımcı olabilir, matematik işlemleri yapabilir ve farklı konularda içerik oluşturabilirim.";
  }

  if (
    has(
      "nasıl yapıldın",
      "nasil yapildin",
      "nasıl oluşturuldun",
      "nasil olusturuldun"
    )
  ) {
    return "Onur AI; web arayüzü, Node.js/Express sunucusu ve Google Gemini API kullanılarak oluşturuldu.";
  }

  if (
    has(
      "hangi dili konuşuyorsun",
      "hangi dili konusuyorsun",
      "türkçe biliyor musun",
      "turkce biliyor musun"
    )
  ) {
    return "Türkçe konuşabiliyorum ve Türkçe sorularını anlayıp yanıtlayabiliyorum.";
  }

  if (
    has(
      "internete bağlı mısın",
      "internete bagli misin",
      "internetin var mı",
      "internetin var mi"
    )
  ) {
    return "Ben Render üzerinde çalışan bir web uygulamasının içindeki yapay zekâ asistanıyım. İnternet erişimi ve kullandığım özellikler sunucu tarafındaki sisteme bağlıdır.";
  }

  if (
    has(
      "neredesin",
      "nerede yaşıyorsun",
      "nerede yasiyorsun"
    )
  ) {
    return "Ben fiziksel bir yerde yaşamıyorum; çevrimiçi çalışan bir yapay zekâ asistanıyım.";
  }

  if (
    t === "nasılsın" ||
    t === "nasilsin" ||
    has("nasılsın onur", "nasilsin onur")
  ) {
    return "İyiyim, teşekkür ederim! Senin için buradayım.";
  }

  if (
    t === "merhaba" ||
    t === "selam" ||
    t === "selam onur" ||
    t === "merhaba onur" ||
    t === "hey onur"
  ) {
    return "Merhaba! Ben Onur AI. 👋";
  }

  if (
    has(
      "teşekkürler",
      "tesekkurler",
      "teşekkür ederim",
      "tesekkur ederim",
      "sağ ol",
      "sag ol"
    )
  ) {
    return "Rica ederim!";
  }

  if (
    has(
      "görüşürüz",
      "gorusuruz",
      "bay bay",
      "hoşçakal",
      "hoscakal"
    )
  ) {
    return "Görüşürüz! 👋";
  }

  if (t === "test" || t === "ping") {
    return "Onur AI çalışıyor.";
  }

  return null;
}

async function createStorageChat() {
  try {
    const response = await fetch(
      `${COP_KUTUSU_URL}/new-chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Çöp Kutusu yeni sohbet oluşturamadı.");
    }

    const data = await response.json();

    return data.id || null;
  } catch (error) {
    console.error(
      "ÇÖP KUTUSU YENİ SOHBET HATASI:",
      error.message
    );

    return null;
  }
}

async function saveStorageChat(
  chatId,
  messages
) {
  if (!chatId) {
    return false;
  }

  try {
    const response = await fetch(
      `${COP_KUTUSU_URL}/save`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: chatId,
          title: "",
          messages
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        "Çöp Kutusu sohbeti kaydedemedi."
      );
    }

    return true;
  } catch (error) {
    console.error(
      "ÇÖP KUTUSU KAYDETME HATASI:",
      error.message
    );

    return false;
  }
}

async function getStorageChats() {
  try {
    const response = await fetch(
      `${COP_KUTUSU_URL}/chats`
    );

    if (!response.ok) {
      throw new Error(
        "Çöp Kutusu sohbetleri alınamadı."
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "ÇÖP KUTUSU SOHBETLER HATASI:",
      error.message
    );

    return {
      success: false,
      chats: []
    };
  }
}

async function getStorageChat(chatId) {
  try {
    const response = await fetch(
      `${COP_KUTUSU_URL}/chat/${encodeURIComponent(chatId)}`
    );

    if (!response.ok) {
      throw new Error(
        "Çöp Kutusu sohbeti bulunamadı."
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "ÇÖP KUTUSU SOHBET ALMA HATASI:",
      error.message
    );

    return {
      success: false,
      chat: null
    };
  }
}

async function deleteStorageChat(chatId) {
  try {
    const response = await fetch(
      `${COP_KUTUSU_URL}/chat/${encodeURIComponent(chatId)}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error(
        "Çöp Kutusu sohbeti silemedi."
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "ÇÖP KUTUSU SİLME HATASI:",
      error.message
    );

    return {
      success: false
    };
  }
}

app.get("/", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public",
      "index.html"
    )
  );
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    name: "Onur AI",
    model: MODEL,
    readyAnswers: true,
    storage: COP_KUTUSU_URL
  });
});

app.get("/api/chats", async (req, res) => {
  const result = await getStorageChats();

  res.json(result);
});

app.get(
  "/api/chats/:id",
  async (req, res) => {
    const result = await getStorageChat(
      req.params.id
    );

    res.json(result);
  }
);

app.delete(
  "/api/chats/:id",
  async (req, res) => {
    const result = await deleteStorageChat(
      req.params.id
    );

    res.json(result);
  }
);

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(
      req.body?.message || ""
    ).trim();

    if (!message) {
      return res.status(400).json({
        error: "Mesaj boş olamaz."
      });
    }

    let chatId =
      String(req.body?.chatId || "").trim();

    let messages = Array.isArray(
      req.body?.messages
    )
      ? req.body.messages
      : [];

    if (!chatId) {
      chatId = await createStorageChat();
    }

    messages = messages.filter(
      item =>
        item &&
        typeof item === "object" &&
        (item.role === "user" ||
          item.role === "assistant") &&
        typeof item.content === "string"
    );

    const alreadyExists = messages.some(
      item =>
        item.role === "user" &&
        item.content === message
    );

    if (!alreadyExists) {
      messages.push({
        role: "user",
        content: message
      });
    }

    const prepared = readyAnswer(message);

    if (prepared) {
      messages.push({
        role: "assistant",
        content: prepared
      });

      await saveStorageChat(
        chatId,
        messages
      );

      return res.json({
        reply: prepared,
        source: "ready-answer",
        chatId,
        messages
      });
    }

    if (!API_KEY || !ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY bulunamadı.",
        chatId
      });
    }

    const response =
      await ai.models.generateContent({
        model: MODEL,
        contents: message,
        config: {
          systemInstruction:
            "Sen Onur AI'sın. Türkçe konuş. Kullanıcının sorularını anlayarak doğal, doğru ve yardımcı cevaplar ver. Kendin hakkında sabit bilgiler sorulursa verilen proje bilgileriyle çelişme."
        }
      });

    const reply = response?.text;

    if (!reply) {
      return res.status(502).json({
        error: "AI cevap üretmedi.",
        chatId
      });
    }

    messages.push({
      role: "assistant",
      content: reply
    });

    await saveStorageChat(
      chatId,
      messages
    );

    res.json({
      reply,
      source: "gemini",
      chatId,
      messages
    });

  } catch (error) {
    console.error(
      "ONUR AI HATASI:",
      error
    );

    res.status(500).json({
      error:
        "Onur AI cevap oluşturamadı."
    });
  }
});

const PORT =
  process.env.PORT || 3000;

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Onur AI çalışıyor: ${PORT}`
    );

    console.log(
      `Çöp Kutusu: ${COP_KUTUSU_URL}`
    );
  }
);
