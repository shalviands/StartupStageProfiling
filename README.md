# 🚀 InUnity Startup Diagnosis Profiler

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-DB%20%26%20Auth-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-gold?style=flat-square)](LICENSE)

> **Precision Diagnostics for Early-Stage Startups.**  
> A standard-bearing platform designed to profile, score, and provide actionable AI roadmaps for entrepreneurs and mentors.

---

## 🌟 Platform Overview

The **InUnity Startup Diagnosis Profiler** is a sophisticated screening and mentorship tool. It transitions startups through a multi-stage diagnostic flow, measuring fundamentals across 7 critical domains. By combining real-time qualitative input with quantitative scoring and AI-powered insights, it provides mentors and founders with a unified "Health Score" and a generated growth roadmap.

### 🔒 Secure Auth Gateway (Logic Flow)
The platform implements a strict **Instant Redirect Strategy** to ensure data security and a professional user experience:
- **Guest Access (`/`)**: Automatically redirected to `/login`.
- **Authenticated Access (`/`)**: Automatically redirected to `/profiler`.
- **Session Persistence**: Users remain logged in across refreshes and deep links.
- **Auto-Protection**: Any attempt to access `/profiler` or data APIs while unauthenticated results in an immediate bounce to `/login`.

---

## 🏗️ Technical Architecture

This project is built on a **Unified Next.js 14 Full-Stack Architecture**, optimized for Vercel deployment and maximum performance.

```mermaid
graph TD
    A[Founder/Guest] --> B(Next.js App Router)
    B --> C{Authenticated?}
    C -- No --> D[Branded Login Page]
    C -- Yes --> E[Profiler Dashboard]
    E --> F[Zustand Local State]
    E --> G[TanStack Query]
    G <--- Real-time Sync ---> H[(Supabase DB)]
    E --> I[OpenRouter AI Analysis]
    E --> J[PDF/Excel Export]
```

---

## 🚀 Key Features

### 1. The 7-Domain Diagnostic Engine
A comprehensive flow covering every facet of a startup's lifecycle:
1. **Founder Profile**: Identifying the core team and domain expertise.
2. **Problem & Solution**: Assessing the pain point intensity and solution clarity.
3. **Market Validation**: Scoring customer interviews and market sizing.
4. **Business Model**: Evaluating unit economics and revenue strategies.
5. **IncubX Startup Readiness**: Tracking TRL, BRL, and CRL progress.
6. **The Pitch Deck**: Auditing the quality of storytelling and investor-readiness.
7. **Final Diagnosis**: Consolidating overall strengths, gaps, and next steps.

### 2. Intelligent AI Analysis
Powered by **OpenRouter**, the system utilizes a high-performance heuristic model to generate:
- **Startup Health Score**: A balanced metric across all 7 domains.
- **Strengths & Gaps**: Immediate identification of core advantages and critical weaknesses.
- **Actionable Roadmap**: A prioritized list of next steps for the founder.

### 3. Professional Exports
- **Diagnostic Brief (PDF)**: High-quality portable document for pitch preparation.
- **Analysis Sheet (Excel)**: Full data export for mentor auditing and offline analysis.

### 4. Robust Real-time Backend
- **Supabase Auth**: Secure, session-aware authentication.
- **Auto-Sync**: Debounced real-time persistence ensuring zero data loss during entry.

---

## 🎨 Design System

The platform utilizes the **InUnity Premium Design Language**:
- **Typography**: Montserrat (300-900 weights) for a modern, structured feel.
- **Color Palette**:
  - `Deep Navy (#0F172A)`
  - `Amber Gold (#F59E0B)`
  - `Slate/Smoke Neutrals`

---

## 🛠️ Technical Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Server State**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Styling**: Vanilla CSS with Tailwind CSS utilities.
- **Database/Auth**: [Supabase](https://supabase.com/)
- **AI Engine**: [OpenRouter](https://openrouter.ai/)
- **Document Engines**: `@react-pdf/renderer` and `SheetJS (XLSX)`.

---

## 🚦 Installation & Setup

### Prerequisites
- Node.js 18.x or 20.x
- Supabase Project & OpenRouter API Key

### Setup Steps
1. **Clone & Install**
   ```bash
   git clone <repo-url>
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   OPENROUTER_API_KEY=your_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Run Development**
   ```bash
   npm run dev
   ```

---
© 2026 InUnity Private Limited. All Rights Reserved.
