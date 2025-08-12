const MODEL = "gemini-2.0-flash";
const BASE_URL = "https://generativelanguage.googleapis.com/v1";

const keyInput = document.getElementById("api-key");
const saveKeyBtn = document.getElementById("save-key");
const clearKeyBtn = document.getElementById("clear-key");
const keyStatus = document.getElementById("key-status");

const chatContainer = document.getElementById("chat-container");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function getStoredKey() {
  return localStorage.getItem("gemini_api_key") || "";
}
function setStoredKey(key) {
  localStorage.setItem("gemini_api_key", key);
}
function clearStoredKey() {
  localStorage.removeItem("gemini_api_key");
}

function updateKeyUI() {
  if (getStoredKey()) {
    keyStatus.textContent = "✅ API Key salva. Chat pronto.";
    chatContainer.style.display = "flex";
  } else {
    keyStatus.textContent = "Insira sua API Key do Gemini para começar.";
    chatContainer.style.display = "none";
  }
}

async function callGemini(userMessage) {
  const apiKey = getStoredKey();
  if (!apiKey) throw new Error("API Key não encontrada.");

  const url = `${BASE_URL}/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    contents: [{
      role: "user",
      parts: [{ text: `Você é o Brocolito, especialista em vida fitness. Responda: ${userMessage}` }]
    }]
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    throw new Error(`Erro ${resp.status}: ${await resp.text()}`);
  }

  const data = await resp.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Não consegui responder 😅";
}

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `mensagem ${sender}`;
  div.innerHTML = `<strong>${sender === "usuario" ? "Você" : "Brocolito"}:</strong> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function enviarMensagem() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage("usuario", text);
  userInput.value = "";

  appendMessage("brocolito", "⏳ Pensando...");
  const loadingElem = chatBox.lastChild;

  try {
    const resposta = await callGemini(text);
    chatBox.removeChild(loadingElem);
    appendMessage("brocolito", resposta);
  } catch (err) {
    chatBox.removeChild(loadingElem);
    appendMessage("brocolito", "Erro: " + err.message);
  }
}

saveKeyBtn.addEventListener("click", () => {
  if (!keyInput.value.trim()) return alert("Digite a API Key.");
  setStoredKey(keyInput.value.trim());
  updateKeyUI();
  keyInput.value = "";
});
clearKeyBtn.addEventListener("click", () => {
  clearStoredKey();
  updateKeyUI();
});
sendBtn.addEventListener("click", enviarMensagem);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") enviarMensagem();
});

updateKeyUI();