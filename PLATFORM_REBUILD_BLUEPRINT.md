# ✅ InUnity Startup Diagnosis Profiler: CORRECTED Blueprint v2.0

**All errors from v1.0 identified and corrected below.**

---

## CORRECTIONS SUMMARY

**Total Errors Found:** 33
**Critical Decisions Clarified:** 6
**Architecture Changes:** Role restructure, multi-submission model, comment system

---

## 1. CORRECTED WEIGHTS (ERROR 1, 4, 11, 13)

| Parameter | Weight | Notes |
|---|---|---|
| P1 — Entrepreneur Character & Problem | **15%** | Reduced by 1% |
| P2 — Customer Discovery | 13% | Unchanged |
| P3 — Product & TRL | **13%** | Reduced by 1% |
| P4 — Differentiation | 7% | Unchanged |
| P5 — Market & ICP | 12% | Unchanged |
| P6 — Business Model | 11% | Unchanged |
| P7 — Traction & CRL | **11%** | Reduced by 1% |
| P8 — Team Readiness | 12% | Unchanged |
| P9 — Advantage & Moats | **6% base** | Was 3%, now 6% |
| **P9 Bonus** | **+3%** | Activates at stageNumber ≥ 4 (MVP+) |
| **Total (base)** | **100%** | ✓ Correct |
| **Total (bonus active)** | **103% → redistributed to 100%** | +1% to P2, +1% to P5, +1% to P7 when bonus active |

**When P9 bonus activates (stageNumber ≥ 4):**
- P2: 13% → 14%
- P5: 12% → 13%
- P7: 11% → 12% (returns to original)
- P9: 6% → 9%
- Total remains 100%

---

## 2. CORRECTED ROLE STRUCTURE (ERROR 7, 10, 17, 22)

### Role 1: STARTUP

**Access:**
- `/startup/profiler` — self-assessment form (unlimited submissions)
- `/startup/submissions` — list of all their past submissions
- `/startup/submissions/[id]` — read-only view of one submission
- `/startup/diagnosis/[id]` — limited AI diagnosis view (only after programme team releases it)

**Can Do:**
- Fill profiler unlimited times
- Submit multiple profiles (each gets a submission_number)
- View all their past submissions in read-only mode
- View limited AI diagnosis results ONLY when programme team marks submission as ready

**Cannot Do:**
- Edit after submission
- See programme team comments
- See admin_notes
- Download PDF or Excel (view only on web)
- Access other startups' data
- Access `/programme/*` or `/admin/*` routes

**No Dashboard:** Startup lands directly on `/startup/profiler` after login

---

### Role 2: PROGRAMME TEAM

**Access:**
- `/programme/dashboard` — cohort overview stats
- `/programme/startups` — ALL submissions table (not just assigned)
- `/programme/startups/[id]` — detail view + comment panel (right sidebar)
- `/programme/comments` — (optional) all their comments across submissions

**Can Do:**
- View ALL startup submissions (no assignment restriction)
- Add evaluator comments on any submission (per parameter)
- Trigger AI analysis manually via button
- Download PDF and Excel for any submission
- See full diagnosis results for every startup
- Mark a submission as "ready for startup view" (enables startup to see limited diagnosis)

**Cannot Do:**
- Edit startup's answers directly
- Approve/reject accounts (admin only)
- Access `/admin/*` routes
- Delete submissions

**Comment System:**
Each comment has:
- `team_id` (which submission)
- `commenter_id` (who wrote it)
- `parameter_ref` ('overall' | 'P1' | 'P2' ... | 'P9')
- `comment_text`
- `created_at`, `updated_at`

---

### Role 3: ADMIN

**Access:** Everything
- All `/admin/*` routes
- All `/programme/*` routes (can view as programme team)
- Full CRUD on all data

**Can Do:**
- Approve/reject startup registrations
- Edit any submission directly
- Add internal `admin_notes` (hidden from startup)
- Delete submissions
- Manage user accounts
- View cohort-level AI insights
- Full control

---

## 3. CORRECTED DATABASE SCHEMA (ERROR 3, 8, 9, 19, 20)

### Table: `teams`

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),  -- programme team user who created
  startup_user_id UUID REFERENCES auth.users(id),  -- startup who owns (NULL if created by programme team)
  
  -- Status tracking
  submission_status TEXT CHECK (submission_status IN ('draft', 'submitted')),  -- REMOVED 'finalised' and 'locked'
  submission_number INT DEFAULT 1,  -- NEW: tracks which attempt (1st, 2nd, 3rd...)
  diagnosis_released BOOLEAN DEFAULT FALSE,  -- NEW: replaces diagnosis_visible, controls if startup can see limited diagnosis
  
  -- Basic info
  team_name TEXT,
  startup_name TEXT,
  sector TEXT,
  institution TEXT,
  team_size TEXT,
  
  -- All P1-P9 fields (60+ columns)
  -- Format: px_question_text TEXT, px_question_score INT
  -- (Full schema as defined in previous prompts)
  
  -- Diagnosis outputs
  detected_stage TEXT,
  stage_override_flag TEXT,
  assigned_mentor_type TEXT,
  overall_weighted_score FLOAT,
  p9_bonus_active BOOLEAN DEFAULT FALSE,
  
  -- Internal only
  admin_notes TEXT DEFAULT '',  -- CRITICAL: Must be excluded from API when requester is startup
  
  -- Roadmap
  roadmap JSONB DEFAULT '[]'::jsonb,
  
  -- Programme needs
  p0_need TEXT,
  p1_need TEXT,
  p2_need TEXT,
  barriers TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**CRITICAL SECURITY RULE:**
When API route responds to a startup user, SELECT query MUST exclude `admin_notes`:
```sql
SELECT * EXCEPT (admin_notes) FROM teams WHERE startup_user_id = auth.uid()
```

---

### Table: `submission_comments` (NEW)

```sql
CREATE TABLE submission_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  commenter_id UUID REFERENCES auth.users(id),
  commenter_name TEXT DEFAULT '',
  comment_text TEXT NOT NULL,
  parameter_ref TEXT DEFAULT 'overall',  -- 'overall' | 'P1' | 'P2' ... | 'P9'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:**
- Programme team + admin: INSERT, SELECT
- Commenter: UPDATE own comments
- Admin: DELETE any comment

---

### Table: `profiles`

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'startup' CHECK (role IN ('startup', 'programme_team', 'admin')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Status Behaviour:**
- `pending`: User can log in → redirected to `/pending` waiting page
- `approved`: User can access their role's home route
- `rejected`: User can log in → see error page at `/rejected` explaining their account was not approved, with contact info for InUnity team

---

## 4. CORRECTED STAGE CLASSIFICATION LOGIC (ERROR 5, 6, 18)

### Stage Definitions

| Stage | stageNumber | Triggers |
|---|---|---|
| Idea Stage | 1 | P1 < 2.0 OR TRL ≤ 2 OR (P2 < 1.5 AND P7 < 1.5) |
| Problem-Solution Fit | 2 | P1 ≥ 2.0 AND P2 ≥ 2.0 AND TRL 3–4 AND P7 < 2.0 |
| Validation Stage | 3 | TRL 4–6 AND P2 ≥ 2.5 AND P7 ≥ 1.5 |
| MVP / Pre-Revenue | 4 | TRL 6–7 AND revenue_stage='Pre-Revenue' AND P7 ≥ 2.0 AND P6 ≥ 2.0 |
| Early Revenue | 5 | revenue_stage IN ('First Revenue','Recurring Revenue') AND P7 ≥ 3.0 AND TRL ≥ 7 |
| Growth / Scale | 6 | revenue_stage IN ('Recurring Revenue','Scaling') AND P7 ≥ 4.0 AND all params avg ≥ 3.5 |

### Override Rules (Weakest Link Logic)

Applied in order AFTER base stage is calculated:

1. **If P1 < 2.0:** Cap at Idea Stage (stageNumber = 1)
   - Flag: "Entrepreneur conviction and problem clarity must be strengthened before progressing"

2. **If P3 < 2.0:** Cap at Idea Stage OR Problem-Solution Fit (stageNumber = min(calculated, 2))
   - Flag: "Product readiness is the critical blocker"

3. **If P8 < 2.0:** Decrement stage by 1 (stageNumber = max(1, calculated - 1))
   - Flag: "Team capability and commitment gaps are limiting overall readiness"

### Deep Dive Question Unlock

Deep dive questions unlock when **stageNumber ≥ 3** (Validation Stage or above).
This is based on the **detected stage from the engine**, not manually set.

---

## 5. CORRECTED SCORING CALCULATIONS (ERROR 26, 27, 25)

### Empty Score Handling

**Rule:** Score 0 = not answered. Exclude from averages. Do NOT treat as zero.

```javascript
function avgScores(scores: (number | null | undefined)[]): number | null {
  const valid = scores.filter(s => s !== null && s !== undefined && s > 0) as number[]
  if (valid.length === 0) return null
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10
}
```

### TRL and CRL Mapping

TRL and CRL values (1–9) map to score scale (1–5):

| TRL/CRL | Score |
|---|---|
| 1–2 | 1 |
| 3–4 | 2 |
| 5–6 | 3 |
| 7–8 | 4 |
| 9 | 5 |

### Rounding Precision

**When:** After each dimension average AND after final weighted score
**Method:** `Math.round(score * 10) / 10`
**Result:** Always 1 decimal place (e.g., 3.7, 4.2, 2.5)

---

## 6. CORRECTED AI SYSTEM MESSAGE (ERROR 16, 28, 29)

```javascript
const INUNITY_SYSTEM_MESSAGE = `
You are the InUnity Startup Diagnosis AI — an expert startup coach,
incubation specialist, and programme evaluator.

InUnity Private Limited runs customised pre-incubation, incubation,
and acceleration programmes. You apply Y Combinator principles,
Lean Startup, Steve Blank Customer Development, TRL/CRL scales,
and ExO framework.

This profiler is a SELF-ASSESSMENT tool. Startups fill it themselves.
Programme team reviews and comments. You assist both.

TONE: Supportive mentor — encouraging but realistic.
Acknowledge progress genuinely. Name gaps directly without harshness.
Give specific actionable advice. Adapt language to stage.

STAGE LANGUAGE:
- Idea Stage: "The most important thing right now is..."
- PSF Stage: "You're asking the right questions. Now..."
- Validation: "The data is telling you..."
- MVP Stage: "You have built it. Now the challenge is..."
- Revenue: "You have proven the model. Now focus on..."
- Growth: "The fundamentals are strong. The next challenge..."

RULES:
ALWAYS: Base insights on actual data, return ONLY valid JSON when requested,
be specific (name parameters, scores, answers), adapt to stage
NEVER: Invent data, use generic phrases ("game-changer", "leverage synergies",
"comprehensive strategy"), claim investor-ready unless stage 5+/CRL 7+/TRL 7+
`
```

### AI Features (4 calls, same system message)

1. **Profile Analysis** → `{strengths, gaps, recommendations, readiness_summary, stage_insight, founder_note}`
2. **Stage Explanation** → `{why_this_stage, what_would_move_them_up, honest_assessment}`
3. **Roadmap Generation** → See structure below
4. **Dashboard Insights** → `{cohort_summary, strongest_cohort_area, biggest_cohort_gap, programme_recommendation, teams_needing_attention, positive_signal, programme_design_tip}`

### Roadmap JSON Structure

```json
{
  "week1": {
    "title": "Short milestone title (5-7 words)",
    "focus": "Which parameter this week addresses",
    "actions": ["Specific action 1", "Specific action 2", "Specific action 3"],
    "success_metric": "How to know if Week 1 was successful"
  },
  "week2": { ... },
  "week3": { ... },
  "week4": { ... },
  "p0_need": "Single most urgent thing before the event",
  "p1_need": "Most important thing during the programme",
  "p2_need": "Longer-term capability to build after",
  "recommended_tools": [
    "Tool name — why it applies to this team",
    "Tool name — why it applies to this team"
  ],
  "mentor_focus": "What the mentor should specifically focus on"
}
```

### Mentor Assignment Logic

Find the lowest scoring parameter among P1–P8 (exclude P9).

| Lowest Parameter | Mentor Type |
|---|---|
| P1 | Entrepreneurship Mentor |
| P2 | Customer Research Mentor |
| P3 | Technical Mentor |
| P4 | Product Strategy Mentor |
| P5 | Market Strategy Mentor |
| P6 | Business Model Mentor |
| P7 | Growth Mentor |
| P8 | Team Building Mentor |

If P9 is lowest (rare): Competitive Strategy Mentor

---

## 7. CORRECTED ROUTE STRUCTURE (ERROR 14, 15)

### Startup Routes

- `/startup/profiler` — Self-assessment form, create NEW submission each visit
- `/startup/submissions` — List of ALL past submissions with submission_number
- `/startup/submissions/[id]` — Read-only view of ONE past submission
- `/startup/diagnosis/[id]` — Limited AI diagnosis (ONLY if `diagnosis_released = TRUE`)

### Programme Team Routes

- `/programme/dashboard` — Cohort stats, stage distribution, recent activity
- `/programme/startups` — Table of ALL submissions (all startups, searchable/filterable)
- `/programme/startups/[id]` — Full detail view + right-side comment panel

### Admin Routes

- `/admin/dashboard` — System-wide insights, approval queue count
- `/admin/startups` — All startups table with full data
- `/admin/startups/[id]` — Full edit capability + internal notes
- `/admin/approvals` — Pending registrations (approve/reject)
- `/admin/users` — User management (change role, status, delete)

### Auth Routes

- `/login` — Role-based redirect after auth
- `/register` — Startup self-registration
- `/pending` — Waiting room for approval
- `/rejected` — Error page for rejected users with contact info

---

## 8. CORRECTED USER FLOWS (ERROR 7, 15, 17)

### Startup Journey (Complete)

1. Visit `/register` → fill form (name, startup name, email, password)
2. Account created → `role='startup'`, `status='pending'`
3. Redirected to `/pending` (waiting room)
4. Admin approves in `/admin/approvals`
5. Status → `'approved'`
6. Startup logs in → lands on `/startup/profiler` (blank form)
7. Fills 9 parameters, auto-saves as draft
8. Clicks "Submit Profile" → confirmation dialog
9. Confirms → `submission_status='submitted'`, `submission_number=1`
10. Redirected to **thank-you page** showing:
    - "✓ Profile #1 submitted successfully"
    - Date submitted
    - "View your submission" button → `/startup/submissions/1`
    - "Start a new profile" button → `/startup/profiler` (creates submission #2)
11. Can submit unlimited times (each gets new submission_number)

### Programme Team Evaluation Flow

1. Log in → `/programme/dashboard`
2. Navigate to `/programme/startups` → see all submissions
3. Click on GreenKart submission #1 → `/programme/startups/[id]`
4. Left panel: read-only view of all 9 parameters
5. Right panel: comment section
   - Add comment on P7: "Traction needs to scale to 10 restaurants"
   - Select parameter from dropdown: P7
   - Comment saves to `submission_comments` table
6. Click "Run AI Analysis" button → triggers OpenRouter call
7. AI results populate: strengths, gaps, roadmap
8. Toggle "Release diagnosis to startup" → sets `diagnosis_released = TRUE`
9. Download PDF or Excel for records

### Startup Views Diagnosis (After Release)

1. Log in → `/startup/submissions`
2. See submission #1 with new badge: "Diagnosis Ready"
3. Click "View Diagnosis" → `/startup/diagnosis/1`
4. **Limited view shows:**
   - Stage banner
   - Overall score
   - Top 3 strengths
   - Top 3 gaps
   - 4-week roadmap (high-level)
   - Mentor type assigned
5. **Does NOT show:**
   - Programme team comments
   - Admin notes
   - Full AI analysis text
   - Download buttons (PDF/Excel)

---

## 9. CORRECTED PDF STRUCTURE (ERROR 23, 24)

### 3-Page PDF Layout

**Page 1 — Diagnosis Summary**
- Header: Startup name, team, sector, date, interviewer (navy bg, gold accent)
- Stage banner (full width, colour by stage, override flag if present)
- **9-Parameter Score Grid** (ALL 9 visible):
  ```
  P1  P2  P3  P4  P5
  P6  P7  P8  P9  Overall
  ```
  Each cell: parameter name, score X.X/5, colour-coded bg, weight%
- TRL + CRL status bar
- Key Strengths (top 3 parameters by score)
- Key Gaps (bottom 3 parameters by score)
- Mentor Assignment

**Page 2 — Parameter Detail** (ALL 9 parameters)
- For each P1–P9:
  - Parameter heading + weight badge + score badge
  - All core question answers (2-line summaries)
  - All deep dive answers (purple tint box if unlocked)
  - Observation notes (grey bg)
- 2-column layout for space efficiency
- P9 spans full width at bottom

**Page 3 — Roadmap**
- 4-week sprint plan table
- P0/P1/P2 priority badges
- Recommended tools list
- Mentor type + focus description
- Programme needs summary
- Footer (all pages): InUnity logo, "Confidential — Internal Use Only", Page X of 3

**Filename:** `{StartupName}_Diagnosis_Report_{YYYY-MM-DD}.pdf`

---

## 10. CORRECTED EXCEL STRUCTURE (ERROR 23)

### 3-Sheet Workbook

**Sheet 1 — Full Profile**
- All 9 parameters with section headers (colour-coded)
- Every question label + answer + score
- Observation fields
- Deep dive answers (purple-tinted rows if unlocked)

**Sheet 2 — Score Summary**
- 9-parameter score table with weights
- Overall weighted score
- Detected stage
- Mentor type
- Override flag (if present)
- P9 bonus status (Active/Inactive)

**Sheet 3 — Roadmap**
- 4-week sprint table (Week | Focus | Actions | Success Metric)
- P0/P1/P2 programme needs
- Recommended tools list
- Mentor assignment

**Score cell formatting:**
- 5.0: #1A7A6E bg, white text
- 4.0–4.9: #2E9E6E bg, white text
- 3.0–3.9: #E8A020 bg, white text
- 2.0–2.9: #E86A20 bg, white text
- 1.0–1.9: #E84B3A bg, white text
- 0 (not assessed): "—" (not "0")

**Filename:** `{StartupName}_Diagnosis_Data_{YYYY-MM-DD}.xlsx`

---

## 11. CORRECTED DESIGN SYSTEM (ERROR 11, 30, 31)

### Design Tokens (NO Glassmorphism)

```css
--navy:     #0F2647  /* primary dark, headers, nav */
--navy2:    #1A3A6B  /* secondary dark */
--gold:     #E8A020  /* accent, active states */
--gold-lt:  #FDF3DC  /* gold light bg */
--teal:     #1A7A6E  /* success, strength */
--teal-lt:  #D8F0ED  /* teal light bg */
--coral:    #E84B3A  /* error, gaps, danger */
--coral-lt: #FDECEA  /* coral light bg */
--purple:   #5B4FCF  /* deep dive, info */
--purple-lt:#EEEAFF  /* purple light bg */
--slate:    #3B5070  /* body text */
--silver:   #8A9BB0  /* muted text */
--smoke:    #F4F6F9  /* page background */
--rule:     #DDE3EC  /* borders */
```

### Contrast Rules (CRITICAL)

| Background | Required Text Colour |
|---|---|
| `bg-white` or `bg-smoke` | **Body:** `text-slate` (#3B5070) minimum<br>**Headings:** `text-navy` (#0F2647)<br>**NEVER** `text-silver` for main content |
| `bg-navy` or `bg-navy2` | `text-white` (#FFFFFF) |
| `bg-gold` | `text-navy` (#0F2647) |
| `bg-gold-lt` | `text-slate` or #92600A (dark amber) |
| `bg-teal` | `text-white` |
| `bg-teal-lt` | `text-slate` or #0F5A52 (dark teal) |
| `bg-coral` | `text-white` |
| `bg-coral-lt` | `text-slate` or #8B1A10 (dark coral) |
| `bg-purple` | `text-white` |
| `bg-purple-lt` | `text-slate` or #2D2080 (dark purple) |

**Forbidden:** Light grey text on light backgrounds (invisible)

### Stage Banner Colours

| Stage | Background | Text |
|---|---|---|
| Idea | `bg-coral-lt` | #8B1A10 (dark coral) |
| PSF | `bg-gold-lt` | #92600A (dark amber) |
| Validation | `bg-purple-lt` | #2D2080 (dark purple) |
| MVP | `bg-teal-lt` | #0F5A52 (dark teal) |
| Revenue | `bg-teal` | `text-white` |
| Growth | `bg-navy` | `text-white` |

---

## 12. CORRECTED TECHNICAL DETAILS

### Auto-save Debounce (ERROR 32)

**Timing:** 600ms (not 500ms)
**Trigger:** Every field change (text input, score dot click, dropdown change)
**Indicator:** "Saving..." label appears during debounce, "Saved" on success

### OpenRouter Fallback (ERROR 33)

**Model sequence (try in order):**
1. `meta-llama/llama-3.1-8b-instruct:free`
2. `mistralai/mistral-7b-instruct:free`
3. `google/gemma-2-9b-it:free`
4. `openchat/openchat-7b:free`

**Timeout:** 30 seconds per model
**Fallback:** Rule-based heuristic analysis if all 4 fail

---

## 13. QUESTION REGISTRY DECISION

**Question:** Should there be a centralised `parameters.ts` file?

**Recommendation: YES — Create it**

**Why:**
- **Single source of truth** — all questions defined once
- **Easier updates** — change a question label in one place, updates everywhere
- **Type safety** — TypeScript can enforce question IDs and structure
- **Reusability** — PDF, Excel, and form all pull from same source
- **Consistency** — no risk of question text diverging across components

**Structure:**

```typescript
// src/lib/parameters.ts
export const PARAMETERS = {
  P1: {
    id: 'P1',
    name: 'Entrepreneur's Character & Problem Clarity',
    weight: 0.15,
    questions: {
      core: [
        {
          id: 'p1_problem_statement',
          label: 'What is the problem you are solving?',
          hint: 'Be specific...',
          type: 'textarea',
          scoreField: 'p1_problem_score',
        },
        // ... more core questions
      ],
      deepDive: [
        {
          id: 'p1_deep_empathy',
          label: 'Describe the worst version of this problem...',
          hint: '...',
          type: 'textarea',
          scoreField: 'p1_deep_empathy_score',
          unlockStage: 3,  // Validation+
        },
        // ... more deep dive questions
      ],
    },
    observation: {
      id: 'p1_observation',
      label: 'Interviewer Observations',
    },
  },
  // P2–P9 follow same structure
}
```

Each section component imports and renders from this registry.

---

## 14. REBUILD INSTRUCTIONS (CORRECTED)

### Step 1: Environment Setup
```bash
npx create-next-app@latest inunity-profiler --typescript --tailwind --app
cd inunity-profiler
npm install @supabase/ssr @supabase/auth-helpers-nextjs
npm install zustand @tanstack/react-query zod
npm install lucide-react
npm install @react-pdf/renderer xlsx
npm install --save-dev @types/node
```

### Step 2: Database Creation
Run the complete schema SQL (teams, profiles, submission_comments tables with all RLS policies as defined above)

### Step 3: Core Logic Layer
Create in order:
1. `src/lib/parameters.ts` — question registry (NEW, as designed above)
2. `src/utils/scores.ts` — weights, stage triggers, overrides, mentor assignment
3. `src/utils/mappers.ts` — DB ↔ Frontend transformations
4. `src/types/team.types.ts` — TypeScript interfaces + Zod schemas

### Step 4: AI Bridge
1. `src/lib/ai/openrouter.ts` — 4-model fallback, system message, 4 analysis functions
2. Environment: `OPENROUTER_API_KEY`, `NEXT_PUBLIC_APP_URL`

### Step 5: Auth & Roles
1. `middleware.ts` — role-based routing
2. `src/lib/roles.ts` — `getUserProfile()`, `getHomeRouteForRole()`
3. `src/lib/supabase/server.ts`, `client.ts`, `getUser.ts`

### Step 6: Frontend Build
1. Create all 9 parameter section components (import from `parameters.ts`)
2. Build score dot component (1–5 visual selector)
3. Build stage detection banner (live calculation display)
4. Build comment panel (programme team evaluation)
5. Build PDF component (3-page structure)
6. Build Excel export (3-sheet structure)

### Step 7: Route Implementation
Create all routes as listed in Section 7 above.

### Step 8: Deployment
```bash
git init
git add .
git commit -m "Initial InUnity Profiler v2.0"
vercel --prod
```
Set environment variables in Vercel dashboard:
- `OPENROUTER_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

---

## 15. CRITICAL CHANGES FROM v1.0

1. ✅ P9 weight corrected: 3% → 6% (with +3% bonus)
2. ✅ P9 bonus trigger: stage ≥ 3 → **stage ≥ 4**
3. ✅ Weights redistributed to total 100%
4. ✅ `submission_status`: removed 'finalised' and 'locked'
5. ✅ `diagnosis_visible` → replaced with `diagnosis_released`
6. ✅ Added `submission_comments` table
7. ✅ Added `submission_number` column
8. ✅ Startup can submit unlimited times
9. ✅ Programme team sees ALL submissions (not assigned)
10. ✅ AI analysis manually triggered, not auto
11. ✅ Startup sees limited diagnosis only after release
12. ✅ No glassmorphism — solid design tokens
13. ✅ Contrast rules enforced
14. ✅ Stage logic uses TRL/CRL values precisely
15. ✅ Override rules clarified and corrected
16. ✅ 4 OpenRouter models (was 3)
17. ✅ PDF 3-page structure defined
18. ✅ Excel 3-sheet structure defined
19. ✅ Mentor assignment logic defined
20. ✅ Roadmap JSON structure defined
21. ✅ `admin_notes` security rule documented
22. ✅ Rejected user flow defined
23. ✅ Thank-you page after submit defined
24. ✅ Deep dive unlock at stageNumber ≥ 3
25. ✅ TRL/CRL → score mapping defined
26. ✅ Empty score handling (exclude zeros)
27. ✅ Rounding precision specified
28. ✅ Complete route structure documented
29. ✅ parameters.ts registry recommended and structured
30. ✅ Comment workflow fully defined
31. ✅ System message updated and corrected
32. ✅ Auto-save timing: 600ms
33. ✅ All UI/UX colours defined with contrast rules

---

*© 2026 InUnity Private Limited. Corrected Blueprint v2.0 — Ready for Full Rebuild*
