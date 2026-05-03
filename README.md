<div align="center">

# 🗳️ PollPilot — Your AI Civic Companion

**Empowering Citizens through Conversational Intelligence**

*Built for the Google Antigravity Challenge · Developed with Gemini 3.1 Pro · Runs on Groq + LLaMA 3.1*

### 🌐 [**LIVE DEMO → pollpilot-app-2026.web.app**](https://pollpilot-app-2026.web.app)
### 🐙 [**SOURCE CODE → github.com/Karthikprabhu07/PollPilot**](https://github.com/Karthikprabhu07/PollPilot)
### 📦 [**FULL PROJECT ASSETS → Google Drive**](https://drive.google.com/drive/folders/1iZbUFaF0QKhBcuO2V2N8F1aFgg_AQ1K3?usp=sharing)

---

[![Built With](https://img.shields.io/badge/Built%20with-Google%20Antigravity-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://antigravity.dev/)
[![Gemini](https://img.shields.io/badge/Developed%20via-Gemini%203.1%20Pro-34A853?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Hosted%20on-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Groq](https://img.shields.io/badge/Runtime%20AI-Groq%20LLaMA%203.1-F55036?style=for-the-badge)](https://groq.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)

</div>

---

## 🌟 Overview

**PollPilot** is a professional, AI-powered civic assistant that makes democratic processes **simple, accessible, and understandable for everyone**.

From **voter registration → final certification**, PollPilot guides users through every stage of the electoral process using a streaming conversational interface — breaking language barriers, reducing misinformation, and improving civic participation across all communities.

---

## 🤖 How It Was Built — Intent-Driven Development

> *"No manual coding. Every line was generated through conversation."*

PollPilot is a **100% prompt-engineered application** built using **Google Antigravity**, powered by **Gemini 3.1 Pro**. This project is a direct demonstration of what the PromptWars challenge is about — **intent-driven development** where natural language replaces manual coding.

### The Development Journey

| Stage | What Was Prompted | Output |
|---|---|---|
| 🧠 **Architecture** | "Design a civic assistant with sidebar, chat, and multilingual support" | Full component tree and state design |
| 🎨 **UI & Styling** | "Build a ChatGPT-style interface with dark mode and mobile responsiveness" | `election-assistant.css` — complete, zero-framework stylesheet |
| 🌐 **Translations** | "Add full native-script UI translations for 16 languages including Indian regional languages" | Complete `TRANSLATIONS` object with every UI string |
| ⚡ **AI Streaming** | "Integrate Groq API with real-time SSE streaming and a custom markdown renderer" | `callGroqAPI()` + `renderMarkdown()` — production-ready |
| 💾 **State & History** | "Persist chat history per user with pin, rename, delete, and date grouping" | Full session management with `localStorage` |
| 🔐 **Auth** | "Add Clerk authentication with Google sign-in and guest mode fallback" | `main.jsx` ClerkProvider + Clerk components throughout |
| 🛡️ **Safety** | "Add a React error boundary with one-click reset and AI guardrails for non-partisan responses" | `PollPilotErrorBoundary` + system prompt engineering |

**Every component, every hook, every CSS rule, every translation string** in this repository was produced through iterative prompting with Gemini 3.1 Pro inside Google Antigravity — not written by hand.

---

## 🚨 The Problem

Millions of citizens — especially:

- 🆕 **First-time voters**
- 🌾 **Rural populations**
- 🌏 **Linguistically diverse communities**

...struggle with:

| Challenge | Impact |
|---|---|
| Complex election procedures | Confusion and disengagement |
| Language barriers | Exclusion from the democratic process |
| Scattered, hard-to-find information | Misinformation and low voter turnout |

---

## 💡 The Solution

PollPilot transforms complex civic systems into **simple, streaming conversations**:

- 🧠 Explains processes in plain, accessible language
- 🌐 **21 languages** in the picker — **16 with full native-script UI translations**, all 21 with AI responses in the user's language
- 🗺️ Interactive **5-step Election Roadmap** — guides users from Registration to Results
- 🛡️ Strictly **non-partisan** and factual via engineered system prompts
- ⚡ **Real-time streaming** responses powered by Groq's ultra-fast inference

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🌐 **Multilingual Support** | 21 languages in the picker — 16 with full native-script UI translations (Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Urdu, Arabic, Spanish, French, German, Chinese, Japanese, Korean, English). All 21 languages supported for AI responses |
| ⚡ **Streaming AI Responses** | Real-time token-by-token streaming via Groq API (`llama-3.1-8b-instant`) |
| 🔊 **Voice Input** | Web Speech API integration for hands-free civic queries |
| 🌓 **Dark / Light Theme** | Persisted theme toggle with smooth transitions |
| 💾 **Per-User Chat History** | Sessions grouped by Today / Yesterday / Previous 7 Days / Older / Pinned — stored in `localStorage` per Clerk user ID |
| 📌 **Chat Management** | Rename, pin, and delete individual chat sessions |
| 🔐 **Clerk Auth** | Google Sign-In via Clerk with seamless guest mode fallback |
| 🗳️ **Quick Prompts** | Context-aware suggestion chips and 4-card starter grid |
| ↺ **Error Recovery** | Per-message retry button with clean error state handling |
| 🛡️ **Error Boundary** | App-level React error boundary with one-click reset |
| 🗺️ **Interactive Election Roadmap** | Visual 5-step timeline on welcome screen — Registration → Learn Issues → Polling Place → Cast Vote → Track Results |
| 🤖 **Auto AI Guidance** | Clicking any roadmap step instantly triggers a full streaming AI walkthrough for that step |
| 📊 **Progress Tracker** | Sidebar tracks which of the 5 civic steps you've explored — persisted in `localStorage` |

---

## 🏗️ Architecture

### Component Tree

```
main.jsx
└── ClerkProvider
    └── App.jsx
        └── PollPilotApp  (election-assistant.jsx)
            └── PollPilotErrorBoundary
                └── ElectionAssistant
                    ├── Sidebar           (chat history, search, new chat, profile)
                    │   └── CivicProgress (5-step progress tracker with localStorage)
                    ├── Header            (menu, title, language selector, auth)
                    ├── ChatArea
                    │   ├── ElectionRoadmap  (welcome screen — 5-step clickable timeline)
                    │   └── Messages         (streaming chat bubbles)
                    ├── InputArea         (textarea, mic, send, suggestion chips)
                    └── LanguageSheet     (full-screen language picker modal)
```

### 🧠 Runtime AI Pipeline

```
User Input
    ↓
Build clean conversation history
(deduplicate consecutive roles, skip error messages)
    ↓
Attach system prompt:
"You are PollPilot, nonpartisan. Respond in [Language]. Use markdown."
    ↓
POST → Groq API  (llama-3.1-8b-instant · temp: 0.2 · stream: true)
    ↓
Parse SSE stream line-by-line → token-by-token React state updates
    ↓
Custom renderMarkdown() → **bold**, *italic*, links, lists as React nodes
    ↓
Session auto-saved to localStorage on every message
```

### 💾 Persistence Layer

| Data | Storage | Key |
|---|---|---|
| Chat history | `localStorage` | `pollpilot_history_<userId>` |
| Selected language | `localStorage` | `pollpilot_language` |
| Theme preference | `localStorage` | `pollpilot_theme` |
| Onboarding status | `localStorage` | `pollpilot_onboarding` |
| Roadmap progress | `localStorage` | `pollpilot_progress` |

> Chat history is scoped per **Clerk user ID** — users only ever see their own sessions. Guest history is stored under the key `'guest'`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Development Platform** | Google Antigravity (Gemini 3.1 Pro) |
| **Frontend** | React 18 + Vite |
| **Styling** | Vanilla CSS (zero UI framework) |
| **Runtime AI** | [Groq API](https://groq.com/) — `llama-3.1-8b-instant` with SSE streaming |
| **Authentication** | [Clerk](https://clerk.com/) — Google OAuth + guest mode |
| **Hosting** | Firebase Hosting (Google Cloud) |
| **Voice Input** | Web Speech API |
| **Storage** | Browser `localStorage` |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com/)
- A [Clerk](https://dashboard.clerk.com/) Publishable Key

### 1. Clone the Repository

```bash
git clone https://github.com/Karthikprabhu07/PollPilot.git
cd PollPilot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

> ⚠️ Both keys are **required**. The app throws on startup if `VITE_CLERK_PUBLISHABLE_KEY` is missing.

### 4. Run the Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser. 🎉

### 5. Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── election-assistant.jsx   # 🧠 Core app — UI, AI logic, state, translations
├── election-assistant.css   # 🎨 All styles (light/dark, responsive, animations)
├── App.jsx                  # Root component — renders <PollPilotApp />
├── App.css                  # Intentionally minimal (avoids style conflicts)
├── main.jsx                 # Entry point — wraps app in <ClerkProvider>
├── index.css                # Intentionally minimal (avoids style conflicts)
└── firebase.js              # Firebase init — loads config from /__/firebase/init.json
```

---

## 🌐 Language Support

| | Language | UI Translated | AI Responds |
|---|---|---|---|
| 🇮🇳 | Hindi — हिन्दी | ✅ | ✅ |
| 🇮🇳 | Tamil — தமிழ் | ✅ | ✅ |
| 🇮🇳 | Telugu — తెలుగు | ✅ | ✅ |
| 🇮🇳 | Kannada — ಕನ್ನಡ | ✅ | ✅ |
| 🇮🇳 | Malayalam — മലയാളം | ✅ | ✅ |
| 🇮🇳 | Bengali — বাংলা | ✅ | ✅ |
| 🇮🇳 | Marathi — मराठी | ✅ | ✅ |
| 🇵🇰 | Urdu — اردو | ✅ | ✅ |
| 🌍 | Arabic — العربية | ✅ | ✅ |
| 🌍 | Spanish — Español | ✅ | ✅ |
| 🌍 | French — Français | ✅ | ✅ |
| 🌍 | German — Deutsch | ✅ | ✅ |
| 🌏 | Chinese — 中文 | ✅ | ✅ |
| 🌏 | Japanese — 日本語 | ✅ | ✅ |
| 🌏 | Korean — 한국어 | ✅ | ✅ |
| 🌍 | English | ✅ | ✅ |
| 🌍 | Russian — Русский | ❌ (EN fallback) | ✅ |
| 🌍 | Portuguese — Português | ❌ (EN fallback) | ✅ |
| 🌍 | Hausa | ❌ (EN fallback) | ✅ |
| 🌍 | Yoruba — Yorùbá | ❌ (EN fallback) | ✅ |
| 🌍 | Igbo | ❌ (EN fallback) | ✅ |

> ✅ UI Translated = every button, label, placeholder and history group renders in that language.
> ❌ EN fallback = language appears in the picker and AI responds in it, but UI strings fall back to English.

---

## 📦 Project Assets — Google Drive

> GitHub repo is kept under 10 MB as per submission rules.
> Full project assets including all source files are available on Google Drive.

### 📥 [**Download Full Project Assets → Google Drive**](https://drive.google.com/drive/folders/1iZbUFaF0QKhBcuO2V2N8F1aFgg_AQ1K3?usp=sharing)

| What's inside | Details |
|---|---|
| 📁 Complete source files | All project files including dependencies |
| 🎨 Design assets | CSS, icons, and UI resources |
| 📝 Build artifacts | Production-ready dist output |

---

## 🔒 Privacy & Safety

- 🏠 **Local-first** — all chat history lives in the browser, never on a server
- 🚫 **No tracking** — no analytics, no personal data collection
- 🛡️ **Non-partisan guardrails** — system prompt explicitly prevents political bias
- 🔐 **Auth-scoped history** — sessions are keyed to Clerk user ID; guest data is isolated

---

## 👤 Author

<div align="center">

**Built with ❤️ by [Karthik Prabhu](https://github.com/Karthikprabhu07)**

*Submission for PromptWars: Virtual — Google Antigravity Challenge · 2026*

[![GitHub](https://img.shields.io/badge/GitHub-Karthikprabhu07-181717?style=flat-square&logo=github)](https://github.com/Karthikprabhu07)

</div>

---

## ⚠️ Disclaimer

PollPilot is an **educational tool**. For official election procedures, always refer to your **local election authority** or official government sources such as [eci.gov.in](https://eci.gov.in/) (India).

---

<div align="center">

*PollPilot isn't just a chatbot — it's proof that a single developer, armed with the right AI tools, can build production-grade civic infrastructure in a fraction of the traditional time.*

© 2026 PollPilot Project. All rights reserved.

---

### 🌐 [**LIVE DEMO → pollpilot-app-2026.web.app**](https://pollpilot-app-2026.web.app)
### 🐙 [**SOURCE CODE → github.com/Karthikprabhu07/PollPilot**](https://github.com/Karthikprabhu07/PollPilot)
### 📦 [**FULL PROJECT ASSETS → Google Drive**](https://drive.google.com/drive/folders/1iZbUFaF0QKhBcuO2V2N8F1aFgg_AQ1K3?usp=sharing)

⭐ **If PollPilot helped you, star the repo!** ⭐

</div>
