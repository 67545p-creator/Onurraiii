const fs = require("fs");
const path = require("path");

const STORAGE_PATH =
  process.env.STORAGE_PATH || "/var/data";

const DATA_DIR = path.join(STORAGE_PATH, "onur-ai");
const DATA_FILE = path.join(DATA_DIR, "chats.json");

const MAX_CHATS = 1000000;

function ensureStorage() {
  fs.mkdirSync(DATA_DIR, {
    recursive: true
  });

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({
        chatNumber: 0,
        chats: []
      }),
      "utf8"
    );
  }
}

function loadData() {
  ensureStorage();

  try {
    const content = fs.readFileSync(
      DATA_FILE,
      "utf8"
    );

    const data = JSON.parse(content);

    return {
      chatNumber:
        Number(data.chatNumber) || 0,

      chats:
        Array.isArray(data.chats)
          ? data.chats
          : []
    };
  } catch (error) {
    console.error(
      "Storage okuma hatası:",
      error
    );

    return {
      chatNumber: 0,
      chats: []
    };
  }
}

function saveData(data) {
  ensureStorage();

  const temporaryFile =
    DATA_FILE + ".tmp";

  fs.writeFileSync(
    temporaryFile,
    JSON.stringify(data),
    "utf8"
  );

  fs.renameSync(
    temporaryFile,
    DATA_FILE
  );
}

function createChat() {
  const data = loadData();

  if (data.chatNumber >= MAX_CHATS) {
    throw new Error(
      "1.000.000 sohbet sınırına ulaşıldı."
    );
  }

  data.chatNumber++;

  const chat = {
    id:
      Date.now().toString() +
      "-" +
      Math.random()
        .toString(36)
        .substring(2),

    title:
      "Sohbet " +
      data.chatNumber,

    messages: [],

    createdAt:
      new Date().toISOString()
  };

  data.chats.unshift(chat);

  saveData(data);

  return chat;
}

function getAllChats() {
  return loadData().chats;
}

function getChat(id) {
  const data = loadData();

  return (
    data.chats.find(
      chat => chat.id === id
    ) || null
  );
}

function addMessage(
  id,
  text,
  type
) {
  const data = loadData();

  const chat =
    data.chats.find(
      item => item.id === id
    );

  if (!chat) {
    return null;
  }

  chat.messages.push({
    text: String(text || ""),
    type: type || "user",
    createdAt:
      new Date().toISOString()
  });

  saveData(data);

  return chat;
}

module.exports = {
  createChat,
  getAllChats,
  getChat,
  addMessage,
  loadData
};
