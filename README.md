# NeuralFlow — AI Website

A stunning dark-mode AI SaaS landing page with a **live AI chat** powered by Claude.

## Project Structure

ai-website/
├── index.html        ← Main page
├── css/
│   └── style.css     ← All styles
├── js/
│   └── main.js       ← AI chat logic + interactions
└── README.md

## Setup in VS Code

1. Open the folder in VS Code  
   File → Open Folder → select ai-website/

2. Install Live Server extension  
   Ctrl+Shift+X → search "Live Server"

3. Run the site  
   Right-click index.html → Open with Live Server

## Enable Live AI Chat

1. Get API key: https://console.anthropic.com  
2. Open `js/main.js`  
3. Replace:
   ```js
   const API_KEY = "YOUR_ANTHROPIC_API_KEY";