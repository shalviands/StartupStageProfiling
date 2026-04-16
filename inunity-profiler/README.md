# InUnity Profiler — Next.js Application 🚀

This is the core Next.js 14 application for the InUnity Startup Diagnosis Profiler.

## 🛠 Tech Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Supabase** (Auth & Database)
- **Zustand** (Global UI/Team State)
- **TanStack Query** (Server State/Synchronization)
- **Tailwind CSS** (Premium Design System)
- **OpenRouter** (AI Diagnosis Engine)

## 📡 Deployment Readiness (Vercel)
This project is configured for **high-reliability deployment**:
- **Next.js 14.2.x**: Stabilized for `@react-pdf/renderer` compatibility.
- **next.config.mjs**: Includes webpack aliases for building browser-only libraries.
- **middleware.ts**: Centralized auth logic with pulse health check bypass.

## 📋 Scripts
- `npm run dev`: Start development server.
- `npm run build`: Production build (Optimized).
- `npm run type-check`: Full TypeScript validation.
- `npm run lint`: ESLint audit.

## 📂 Architecture Note
- `src/app/api`: All route handlers for team management and AI analysis.
- `src/components/form`: The 7-section diagnostic logic.
- `src/lib/ai`: Multi-model fallback logic for reliable diagnosis.
- `src/utils/scores.ts`: Centralized logic for scoring fundamentals.

---
For full project documentation, see the [main README](../README.md).
