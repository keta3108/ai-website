# NeuralFlow — AI Website

A stunning dark-mode AI SaaS landing page with a **live AI chat** powered by Claude.

## Project Structure

```
ai-website/
├── index.html        ← Main page
├── css/
│   └── style.css     ← All styles
├── js/
│   └── main.js       ← AI chat logic + interactions
└── README.md
```

## Setup in VS Code

1. **Open the folder** in VS Code:
   ```
   File → Open Folder → select ai-website/
   ```

2. **Install Live Server** extension (if not already):
   - Press `Ctrl+Shift+X` → search "Live Server" → Install

3. **Run the site**:
   - Right-click `index.html` → "Open with Live Server"
   - OR click "Go Live" in the bottom status bar

## Enable Live AI Chat

1. Get a free API key at: https://console.anthropic.com
2. Open `js/main.js`
3. Replace line 5:
   ```js
   const API_KEY = "YOUR_ANTHROPIC_API_KEY";
   ```
   with your actual key.

4. Save and reload — the chat is now fully powered by Claude!

> **Note:** For production, never expose API keys in client-side JS.
> Use a backend proxy (Node.js, Python, etc.) to keep keys secret.

## Sections

- **Hero** — Animated headline with floating feature cards
- **Features** — Bento-grid layout with 5 AI capabilities
- **Live Demo** — Real AI chat with quick-prompt buttons
- **Pricing** — 3-tier pricing cards
- **Footer** — Clean minimal footer

## Customization

| What | Where |
|------|-------|
| Brand name | `index.html` — search "NeuralFlow" |
| Colors | `css/style.css` — `:root` CSS variables |
| AI personality | `js/main.js` — `SYSTEM_PROMPT` |
| Pricing | `index.html` — `.pricing` section |
