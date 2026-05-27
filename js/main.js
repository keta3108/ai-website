/* ===========================
   NEURALFLOW — MAIN SCRIPT
   =========================== */

// ---- CONFIG ----
const SYSTEM_PROMPT = `You are NeuralFlow AI, a helpful, intelligent, and slightly futuristic-feeling AI assistant built into the NeuralFlow website. You are friendly, concise, and sharp. You help users with writing, analysis, coding, brainstorming, and general questions. Keep responses clear and useful. Avoid being overly verbose.`;

// ---- STATE ----
let conversationHistory = [];
let isTyping = false;

// ---- DOM ----
const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearChat");
const hamburger = document.getElementById("hamburger");

// ---- HELPERS ----

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendMessage(role, text) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${role === "user" ? "user-message" : "ai-message"}`;

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.textContent = role === "user" ? "U" : "N";

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.textContent = text;

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  chatMessages.appendChild(wrapper);
  scrollToBottom();
  return bubble;
}

function showTyping() {
  const wrapper = document.createElement("div");
  wrapper.className = "message ai-message";
  wrapper.id = "typingIndicator";

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.textContent = "N";

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble typing-indicator";
  bubble.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  chatMessages.appendChild(wrapper);
  scrollToBottom();
}

function removeTyping() {
  const indicator = document.getElementById("typingIndicator");
  if (indicator) indicator.remove();
}

function setLoading(state) {
  isTyping = state;
  sendBtn.disabled = state;
  userInput.disabled = state;
}

// ---- SEND MESSAGE ----

async function sendMessage(text) {
  const trimmed = (text || userInput.value).trim();
  if (!trimmed || isTyping) return;

  userInput.value = "";
  autoResize();

  appendMessage("user", trimmed);
  conversationHistory.push({ role: "user", content: trimmed });

  setLoading(true);
  showTyping();

  try {
    // If you are NOT using API, this will always fail and go to fallback
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: conversationHistory
      })
    });

    if (!response.ok) {
      throw new Error("API error");
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Sorry, I couldn't generate a response.";

    conversationHistory.push({ role: "assistant", content: reply });

    removeTyping();
    appendMessage("assistant", reply);

  } catch (err) {
    removeTyping();
    console.error(err);

    // ---- SMART LOCAL CHATBOT (NO API NEEDED) ----
    let fallback = "";
    const lowerText = trimmed.toLowerCase();

    if (lowerText.includes("season")) {
      fallback = "Australia is currently in autumn.";
    } 
    else if (lowerText.includes("hello") || lowerText.includes("hi")) {
      fallback = "Hello! I'm NeuralFlow AI. How can I help you today?";
    }
    else if (lowerText.includes("weather")) {
      fallback = "I can't access live weather yet, but I can help explain climate and seasons.";
    }
    else if (lowerText.includes("code")) {
      fallback = "I can help with HTML, CSS, JavaScript, React, and frontend development concepts.";
    }
    else if (lowerText.includes("job")) {
      fallback = "Building portfolio projects like this is a great way to showcase your frontend skills to recruiters.";
    }
    else {
      fallback = "That's an interesting question. NeuralFlow AI is currently running in smart local mode.";
    }

    appendMessage("assistant", fallback);

  } finally {
    setLoading(false);
  }
}

// ---- QUICK PROMPTS ----

function usePrompt(text) {
  userInput.value = text;
  userInput.focus();
  autoResize();
}

window.usePrompt = usePrompt;

// ---- CLEAR CHAT ----

clearBtn.addEventListener("click", () => {
  conversationHistory = [];
  chatMessages.innerHTML = `
    <div class="message ai-message">
      <div class="msg-avatar">N</div>
      <div class="msg-bubble">
        Chat cleared! I'm ready for a fresh conversation.
      </div>
    </div>
  `;
});

// ---- AUTO RESIZE ----

function autoResize() {
  userInput.style.height = "auto";
  userInput.style.height = Math.min(userInput.scrollHeight, 120) + "px";
}

userInput.addEventListener("input", autoResize);

// ---- EVENTS ----

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener("click", () => sendMessage());

// ---- MOBILE MENU ----

hamburger?.addEventListener("click", () => {
  const navLinks = document.querySelector(".nav-links");
  if (navLinks) {
    navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
  }
});

// ---- ANIMATIONS ----

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "fadeUp 0.6s ease both";
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".feature-card, .price-card").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  observer.observe(el);
});
