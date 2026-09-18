# VXK_Assistant AI

A clean, modern, and professional AI productivity web app. VXK_Assistant AI helps you plan your day, draft emails, and turn meeting notes into action items — all in one polished dashboard.

> **Responsible AI:** AI can make mistakes. Please verify important details and review outputs.

## ✨ Features

### Dashboard (Overview)
- Productivity overview cards: tasks completed, pending action items, and active projects
- Today's Tasks list with completion toggles, priority tags, and strike-through states
- Upcoming Deadlines widget with relative time chips ("Today", "Tomorrow", "In 3 days")
- AI Insights tip bar with a workload-aware recommendation
- Quick launch cards that open each AI tool directly
- Premium indigo/violet executive layout with generous whitespace

### AI Task Planner
- Input form for tasks with priority, deadlines, and time estimates
- AI generation with realistic loading states
- Produces a prioritized breakdown with rationale and risks, plus a structured daily schedule with time blocks

### Email Generator
- Input for recipient, topic, and key points
- Tone selector: Formal, Friendly, Professional, Concise
- AI output preview with generated subject lines, edit capability, copy-to-clipboard, and regeneration

### Meeting Summarizer
- Paste notes input area with a sample template button
- AI output with an executive summary, key decisions, action items with owners and deadlines, and follow-ups
- Copy-all support

## 🧭 Navigation
- Responsive sidebar navigation on desktop
- Collapsible off-canvas drawer on mobile
- Prominent Responsible AI disclaimer on every page

## 🛠 Tech Stack
- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing with TanStack Router)
- [Vite](https://vitejs.dev) build tooling
- [Tailwind CSS v4](https://tailwindcss.com) with semantic design tokens
- shadcn-style UI components
- TypeScript
- Sonner toasts, Lucide icons

AI outputs are generated locally by a deterministic mock engine (`src/lib/mock-ai.ts`) — no API keys or network calls required, making the app fully demo- and presentation-ready.

## 🚀 Getting Started

### Prerequisites
- Node.js (recommended via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Run locally
```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

Then open http://localhost:8080.

### Available scripts
| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |

## 📁 Project Structure
```
src/
├── components/
│   ├── AppShell.tsx        # Sidebar navigation, page header, disclaimer
│   └── ui/                 # shadcn-style UI primitives
├── lib/
│   ├── demo-data.ts        # Preloaded sample tasks, deadlines, activity
│   └── mock-ai.ts          # Deterministic mock AI generation engine
├── routes/
│   ├── __root.tsx          # App shell, fonts, metadata, toaster
│   ├── index.tsx           # Dashboard
│   ├── planner.tsx         # AI Task Planner
│   ├── email.tsx           # Email Generator
│   └── meetings.tsx        # Meeting Summarizer
└── styles.css              # Theme tokens (indigo/violet), typography
```

## 📄 License
This project was built with [Lovable](https://lovable.dev).
