const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(express.json({ limit: "20kb" }));

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

const API_KEY =
  process.env.GEMINI_API_KEY;

const MODEL =
  "gemini-3.8-flash";

const ai = API_KEY
  ? new GoogleGenAI({
      apiKey: API_KEY
    })
  : null;

function normalize(text) {
  return String(text || "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(
      /[^\p{Letter}\p{Number}\s@_.-]/gu,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
}

function readyAnswer(message) {
  const t = normalize(message);

  const has = (...words) =>
    words.some(word =>
      t.includes(normalize(word))
    );

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
      "kim kodladı",
      "kim kodladi"
    )
  ) {
    return "Beni YouTube'da @breynot_editzz adlı YouTuber yaptı.";
  }

  if (
    has(
      "geliştirici kim",
      "gelistirici kim",
      "developer kim"
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
      "kendini tanit"
    )
  ) {
    return "Ben Onur AI'yım. Sorularını yanıtlamak ve sana yardımcı olmak için oluşturulmuş bir yapay zekâ asistanıyım.";
  }

  if (
    has(
      "hangi modeli kullanıyorsun",
      "hangi modeli kullaniyorsun",
      "hangi modeli kullanıyorsun"
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
      "yapay zeka misin"
    )
  ) {
    return "Evet, ben Onur AI adlı bir yapay zekâ asistanıyım.";
  }

  if (
    t === "insan mısın" ||
    t === "insan misin"
  ) {
    return "Hayır, ben insan değilim. Ben bir yapay zekâ asistanıyım.";
  }

  if (
    has(
      "kaç yaşındasın",
      "kac yasindasin",
      "yaşın kaç",
      "yasin kac"
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
      "neler yaparsın"
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
    return "Ben
