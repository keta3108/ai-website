/* ===========================
   NEURALFLOW — MAIN SCRIPT
   =========================== */

// ---- CONFIG ----
// Replace with your actual Anthropic API key
const API_KEY = "YOUR_ANTHROPIC_API_KEY";
const MODEL = "claude-sonnet-4-20250514";
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
      const err = await response.json();
      throw new Error(err.error?.message || "API error");
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Sorry, I couldn't generate a response.";

    conversationHistory.push({ role: "assistant", content: reply });

    removeTyping();
    appendMessage("assistant", reply);

  } catch (err) {
    removeTyping();
    console.error(err);

    // Fallback demo response if API key not set
    const demoReplies = [
      "That's a great question! To fully use my AI capabilities, please add your Anthropic API key in `js/main.js`. For now, I'm running in demo mode.",
      "I'd love to help with that! Set up your API key in the js/main.js file and I'll give you a real answer instantly.",
      "In demo mode right now — add your Anthropic API key to unlock full AI responses. It's just one line in js/main.js!"
    ];
    const fallback = demoReplies[Math.floor(Math.random() * demoReplies.length)];
    appendMessage("assistant", fallback);
  }

  setLoading(false);
}

// ---- QUICK PROMPTS ----

function usePrompt(text) {
  userInput.value = text;
  userInput.focus();
  autoResize();
}

// Expose globally for inline onclick handlers
window.usePrompt = usePrompt;

// ---- CLEAR CHAT ----

clearBtn.addEventListener("click", () => {
  conversationHistory = [];
  chatMessages.innerHTML = `
    <div class="message ai-message">
      <div class="msg-avatar">N</div>
      <div class="msg-bubble">
        Chat cleared! I'm ready for a fresh conversation. What would you like to explore?
      </div>
    </div>
  `;
});

// ---- AUTO RESIZE TEXTAREA ----

function autoResize() {
  userInput.style.height = "auto";
  userInput.style.height = Math.min(userInput.scrollHeight, 120) + "px";
}

userInput.addEventListener("input", autoResize);

// ---- KEYBOARD ----

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener("click", () => sendMessage());

// ---- MOBILE NAV ----

hamburger?.addEventListener("click", () => {
  const navLinks = document.querySelector(".nav-links");
  if (navLinks) {
    navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
    navLinks.style.flexDirection = "column";
    navLinks.style.position = "fixed";
    navLinks.style.top = "64px";
    navLinks.style.left = "0";
    navLinks.style.right = "0";
    navLinks.style.background = "rgba(6,6,10,0.97)";
    navLinks.style.padding = "1.5rem 3rem";
    navLinks.style.borderBottom = "1px solid rgba(255,255,255,0.07)";
    navLinks.style.zIndex = "99";
  }
});

// ---- SCROLL ANIMATIONS ----

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
