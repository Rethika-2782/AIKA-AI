# ĀIKĀ AI

**Quietly intelligent legal clarity for everyday legal questions.**

> Understand the law. Know your options. Take the next step.

ĀIKĀ AI (AIKA AI) is a complete, working **MERN-stack** application — MongoDB, Express.js, React, Node.js — that helps people organize legal situations, understand them in plain language, manage evidence, prepare questions for a professional, and generate editable document drafts. It is **not a substitute for a qualified legal professional**, and it never invents laws, statutes, or citations.

- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion + Lucide icons + React Router + Axios
- **Backend:** Node.js + Express + Mongoose + JWT + bcrypt + helmet + cors + dotenv
- **Database:** MongoDB (`mongodb://127.0.0.1:27017/aika_ai` locally, or Atlas via `MONGODB_URI`)
- **AI:** 100% inbuilt rule-based engine (`backend/src/services/aikaEngine.js`, provider `aika-engine`) — **no external AI provider, no third-party API key**

---

## Table of Contents

1. [Project Status](#project-status)
2. [Problem Statement](#problem-statement)
3. [Solution](#solution)
4. [Features](#features)
5. [Technology Stack](#technology-stack)
6. [Architecture](#architecture)
7. [Project Structure](#project-structure)
8. [Database Design](#database-design)
9. [Environment Variables](#environment-variables)
10. [Installation & Running](#installation--running)
11. [Demo Account](#demo-account)
12. [Frontend Routes & Pages](#frontend-routes--pages)
13. [API Reference](#api-reference)
14. [AI Workflow & Engine](#ai-workflow--engine)
15. [Responsible AI](#responsible-ai)
16. [Security](#security)
17. [Verification & Testing](#verification--testing)
18. [Documentation & Deliverables](#documentation--deliverables)
19. [Limitations](#limitations)
20. [Future Enhancements](#future-enhancements)

---

## Project Status

Everything below is **implemented and verified end-to-end** against a running MongoDB + backend + frontend — not a mock-up.

| Area | Status |
|---|---|
| Backend (6 route groups, 5 controllers + dashboard stats route, 6 models, middleware, health check) | ✅ Complete |
| Frontend (10 pages, protected routing, Axios client, auth context) | ✅ Complete |
| JWT registration/login with real personal email addresses | ✅ Complete + tested |
| Inbuilt AI engine (analysis, explain, simplify, draft generation) | ✅ Complete + tested |
| Case / evidence / document CRUD with ownership checks | ✅ Complete + tested |
| Dashboard with live database statistics | ✅ Complete + tested |
| Full API journey (happy path, validation, 401, 403, 404, cross-user isolation) | ✅ Tested |
| `npm run build` (production bundle) | ✅ Passes |
| Branding (Lexora → ĀIKĀ AI), Gemini fully removed | ✅ Complete |
| Report draft `document.md` (title page, bonafide, acknowledgement, abstract, TOC) | 🟡 Chapters pending |
| Report screenshots (`docs/screenshots/`) | 🟡 4 of ~9 captured |

---

## Problem Statement

Legal information is complex, expensive, and inaccessible to most people. When something goes wrong — a withheld security deposit, an unfair employer, a consumer dispute — the average person does not know *what the issue is called*, *what the risks are*, *what to do first*, or *what to ask a lawyer*.

## Solution

ĀIKĀ AI turns a plain-language description of a situation into a **structured understanding**:

- a plain-English **summary**
- the **key issues** involved
- **possible risks**
- an ordered **ActionPath** of practical next steps
- **questions to ask** a qualified professional
- **missing information** the user should gather

…plus tools to simplify legal clauses, manage evidence, and draft documents — all behind a REST API with JWT authentication, and all produced by an **inbuilt, deterministic engine** so the app is fully self-contained and demonstrable offline.

---

## Features

### Authentication & account security
- Register with **your own email address and password** (any real mailbox — Gmail, Outlook, college ID, etc.)
- Email format validation (server + client), lowercase/trim normalization so one mailbox = one account
- Duplicate-email rejection (`409`), password minimum length, **confirm-password** field on sign-up
- bcrypt-hashed passwords (cost 10), JWT sessions (7-day expiry) stored in `localStorage`
- Login brute-force guard: **8 failed attempts per email+IP in 15 minutes → HTTP 429**
- Generic "Invalid email or password" message (no account enumeration)
- Auto-login on registration, session restore on reload, protected routes redirect to `/login`

### Cases
- Create, view, edit, delete cases (title, description, jurisdiction, category, status)
- Search by title (case-insensitive regex) and filter by status/category
- Statuses: `active`, `pending`, `closed`
- Each case stores its AI analysis, risks, action path, and professional questions

### Evidence
- Per-case evidence items: name, description, type, status
- Types: Rental Agreement, Payment Receipt, Email Conversation, Legal Notice, Photograph, Other
- Statuses: `collected`, `pending`, `missing` — readiness tracking at a glance

### Documents
- Five AI-generated draft types: **Complaint Draft, Request Letter, Response Letter, Evidence Checklist, Professional Consultation Summary**
- Editable in-browser, saved to MongoDB, downloadable as `.txt`, deletable
- Every draft stamped `DRAFT — review with a qualified professional`

### AI tools
- **AI Analyzer** — situation → structured analysis (summary / issues / risks / action path / questions / missing info)
- **Legal Simplifier** — paste a clause, notice, or contract section → plain-language breakdown
- **Draft Studio** — generate tailored drafts from a case + instructions
- **AI History** — every interaction persisted to MongoDB and re-viewable

### Dashboard & profile
- Live counts: total cases, active cases, documents, evidence items, AI interactions
- Recent cases and recent AI activity straight from the database
- Profile shows name, email, jurisdiction, member-since date, logout

### UX
- Responsive layout (mobile hamburger + desktop sidebar), keyboard navigable, ARIA labels on all controls
- Playfair Display display type, ivory/wine palette, Framer Motion transitions
- Loading states, inline error alerts, empty states on every page

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18.3, Vite 6, Tailwind CSS 3.4, Framer Motion 11, Lucide React, React Router 7, Axios |
| Backend | Node.js 24, Express 4.21, Mongoose 8.6, JSONWebToken 9, bcrypt 6, helmet 7, cors 2.8, dotenv 17 |
| Database | MongoDB (Community locally / Atlas via env) |
| AI | Inbuilt rule-based engine — **no Gemini, no OpenAI, no external API keys** |
| Tooling | nodemon (dev), PostCSS + Autoprefixer, ESLint-free minimal config |

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  Browser — React + Vite + Tailwind + Framer Motion          │
│  Public: /  /login  /register                              │
│  Protected: /dashboard /cases /cases/:id /ai /simplifier    │
│             /drafts /documents /profile                     │
└───────────────────────┬─────────────────────────────────────┘
                        │  Axios + JWT (Authorization: Bearer …)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Express API  (helmet · CORS allowlist · 1mb JSON limit)    │
│                                                             │
│  /api/auth      register · login · me      (bcrypt + JWT)   │
│  /api/cases     CRUD + search/filter    ┐                   │
│  /api/evidence  CRUD + caseId filter    ├ protect middleware│
│  /api/documents CRUD + caseId filter    │  + ownership check│
│  /api/ai        analyze · explain · simplify · generate     │
│                 · history                 ┘                   │
│  /api/dashboard stats                                      │
│  /api/health     liveness + DB state                       │
└───────────┬─────────────────────────────┬───────────────────┘
            │                             │
            ▼                             ▼
┌───────────────────────┐   ┌─────────────────────────────────┐
│  MongoDB  (aika_ai)   │   │  Inbuilt AIKA Engine            │
│  users                │   │  keyword scoring → theme        │
│  cases                │   │  (Housing/Employment/Family/    │
│  evidenceitems        │   │   Consumer/Civil/General)       │
│  documents            │   │  → structured JSON templates    │
│  consultations        │   │  → jurisdiction-aware output    │
│  aiinteractions       │   └─────────────────────────────────┘
└───────────────────────┘
```

**Request lifecycle:** React → Axios → Express route → `protect` (JWT → `req.user`) → controller → Mongoose/MongoDB → (for AI routes) inbuilt engine → structured JSON → persisted `AIInteraction` → response → React state.

---

## Project Structure

```text
lexora-ai/
├── frontend/
│   ├── index.html                 # ĀIKĀ AI title + meta
│   ├── package.json               # aika-ai-frontend
│   ├── vite.config.js             # dev server (port 5173)
│   ├── tailwind.config.js         # ivory/wine palette, Playfair Display
│   ├── postcss.config.js
│   ├── vercel.json                # SPA deploy config
│   ├── .env.example               # VITE_API_URL
│   └── src/
│       ├── main.jsx               # React root + BrowserRouter
│       ├── App.jsx                # route table + Protected wrapper
│       ├── index.css              # base styles, .card/.btn/.input utilities
│       ├── components/
│       │   ├── Logo.jsx           # ĀIKĀ AI wordmark
│       │   ├── StatCard.jsx       # dashboard metric card
│       │   └── LoadingAI.jsx      # AI working indicator
│       ├── layouts/
│       │   └── Layout.jsx         # sidebar/hamburger shell + nav
│       ├── context/
│       │   └── AuthContext.jsx    # user state, login/register/logout, JWT
│       ├── services/
│       │   └── api.js             # Axios instance + every API call
│       └── pages/
│           ├── Landing.jsx        # public marketing page
│           ├── Auth.jsx           # sign-in / create-account tabs
│           ├── Dashboard.jsx      # live stats + recent activity
│           ├── Cases.jsx          # list, search, filter, create
│           ├── CasePage.jsx       # case detail: evidence, docs, history
│           ├── AIAnalyzer.jsx     # situation analysis
│           ├── Simplifier.jsx     # clause → plain language
│           ├── DraftStudio.jsx    # draft generation + editing
│           ├── Documents.jsx      # saved documents list
│           └── Profile.jsx        # account info + logout
├── backend/
│   ├── package.json               # aika-backend (start/dev scripts)
│   ├── .env.example               # PORT, MONGODB_URI, JWT_SECRET, CLIENT_URL
│   └── src/
│       ├── server.js              # app wiring, CORS, health, demo seed
│       ├── config/db.js           # mongoose connect (+ local fallback URI)
│       ├── middleware/
│       │   ├── authMiddleware.js  # protect → verifies JWT, loads user
│       │   └── errorMiddleware.js # 404 + centralized error handler
│       ├── models/                # User, Case, EvidenceItem, Document,
│       │                          # Consultation, AIInteraction
│       ├── controllers/
│       │   ├── authController.js  # register/login/me + rate limiting
│       │   ├── caseController.js  # CRUD + search/filter
│       │   ├── evidenceController.js
│       │   ├── documentController.js
│       │   └── aiController.js    # analyze/explain/simplify/generate/history
│       ├── routes/                # auth, cases, evidence, documents, ai, dashboard
│       │                          # (dashboardRoutes.js holds the stats query inline)
│       └── services/
│           ├── aikaEngine.js      # ★ inbuilt AI engine
│           └── documentService.js # draft wrapper over the engine
├── docs/
│   └── screenshots/               # report screenshots (PNG)
├── document.md                    # lab report (college format)
├── Lexora_AI.mp4                  # demo video
├── MERN STACK LAB REPORT.docx     # college report template
├── .gitignore                     # ignores .env, node_modules, dist, logs
└── README.md                      # this file
```

---

## Database Design

Database: **`aika_ai`** — six collections, all created automatically on first write.

### `users`
| Field | Type | Notes |
|---|---|---|
| name | String | required, trimmed |
| email | String | required, **unique**, lowercase, trimmed |
| password | String | bcrypt hash (cost 10), never returned |
| jurisdiction | String | default `India` |
| createdAt / updatedAt | Date | timestamps |

### `cases`
| Field | Type | Notes |
|---|---|---|
| user | ObjectId → users | required, indexed — ownership |
| title | String | required, indexed, searchable |
| description | String | plain-language situation |
| jurisdiction | String | default `India` |
| category | String | e.g. Housing, Employment, Consumer |
| status | Enum | `active` / `pending` / `closed` |
| aiAnalysis | Mixed | last analysis payload |
| risks, actionPath, questions | [Mixed]/[String] | structured AI output |

### `evidenceitems`
`user`, `case` (→ cases, optional), `name` (required), `description`, `type` (enum of 6), `status` (`collected`/`pending`/`missing`), timestamps.

### `documents`
`user`, `case` (optional), `title` (required), `type` (draft type), `content` (editable text), timestamps.

### `consultations`
`user`, `case`, `questions: [String]`, `notes`, timestamps — created automatically when an analysis is run on a case.

### `aiinteractions`
`user`, `case` (optional), `type` (enum: `analysis`, `explanation`, `document`, `simplification`), `input` (truncated to 5000 chars), `output` (Mixed), timestamps — powers the AI history view.

**Indexes:** `email` (unique), `cases.user`, `cases.title`, `evidenceitems.user/case`, `documents.user/case`, `aiinteractions.user`.

---

## Environment Variables

`backend/.env` (copy from `backend/.env.example`) — **never committed; `.gitignore` blocks it**:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/aika_ai
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

`frontend/.env` (optional, from `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

> There is **no AI API key** anywhere in the project — the engine is inbuilt.

---

## Installation & Running

```bash
# 1. install dependencies
cd backend  && npm install
cd ../frontend && npm install

# 2. terminal 1 — backend (port 5000)
cd backend
npm start          # or: npm run dev  (nodemon)

# 3. terminal 2 — frontend (port 5173)
cd frontend
npm run dev
```

Then open **http://localhost:5173**.

- Health check: `http://localhost:5000/api/health` → `{"success":true,"message":"AIKA AI backend is running","database":"connected"}`
- If port 5173 is already in use by another project, run `npm run dev -- --port 5174` — the backend CORS allowlist already includes **5173 and 5174**.
- Requires a running MongoDB (local `mongod` on 27017, or set `MONGODB_URI` to Atlas).

---

## Demo Account

On first start (when `NODE_ENV !== "production"`) the backend seeds:

```text
Email:    demo@aika.ai
Password: AikaDemo@123
```

This is shown as a hint box on the login page. **Any user can also create their own account** with their real email via the *Create account* tab (name, email, password, confirm password, jurisdiction).

---

## Frontend Routes & Pages

| Route | Access | Page | What it does |
|---|---|---|---|
| `/` | public | Landing | Hero, feature overview, sign-in CTA |
| `/login` | public | Auth (sign in) | email + password → JWT |
| `/register` | public | Auth (create account) | name, email, password, confirm, jurisdiction |
| `/dashboard` | protected | Dashboard | live stats, recent cases, recent AI activity |
| `/cases` | protected | Cases | list, search, status/category filter, create |
| `/cases/:id` | protected | CasePage | detail, AI analysis, evidence, documents, history |
| `/ai` | protected | AI Analyzer | situation → structured analysis |
| `/simplifier` | protected | Legal Simplifier | clause → plain language |
| `/drafts` | protected | Draft Studio | generate + edit drafts |
| `/documents` | protected | Documents | saved docs: edit, download, delete |
| `/profile` | protected | Profile | account info + logout |
| `*` | — | redirect | falls back to `/` |

---

## API Reference

All endpoints are prefixed with `/api`. **🔒 = requires `Authorization: Bearer <token>`** (from login/register). Errors always return `{ "success": false, "message": "..." }`.

### Health
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | — | service + database status |

### Auth
| Method | Path | Auth | Body | Notes |
|---|---|---|---|---|
| POST | `/auth/register` | — | `name, email, password, jurisdiction` | `201` + token; validates email format; `409` duplicate; `400` weak password |
| POST | `/auth/login` | — | `email, password` | `200` + token; `401` bad creds; `429` after 8 failures/15 min |
| GET | `/auth/me` | 🔒 | — | current user profile (no password) |

### Cases
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/cases?status=&category=&search=` | 🔒 | own cases only, sorted by `updatedAt` desc |
| POST | `/cases` | 🔒 | `title` required → `201` |
| GET | `/cases/:id` | 🔒 | `404` if not found or owned by another user |
| PUT | `/cases/:id` | 🔒 | whitelisted fields only |
| DELETE | `/cases/:id` | 🔒 | ownership enforced |

### Evidence
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/evidence?caseId=` | 🔒 | list (optionally per case) |
| POST | `/evidence` | 🔒 | `name` required, `type`, `status`, `caseId` |
| PUT | `/evidence/:id` | 🔒 | ownership enforced |
| DELETE | `/evidence/:id` | 🔒 | ownership enforced |

### Documents
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/documents?caseId=` | 🔒 | list (optionally per case) |
| POST | `/documents` | 🔒 | `title`, `type`, `content`, optional `caseId` |
| PUT | `/documents/:id` | 🔒 | edit content/title — ownership enforced |
| DELETE | `/documents/:id` | 🔒 | ownership enforced |

### AI
| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| POST | `/ai/analyze` | 🔒 | `situation` (≥10 chars), `jurisdiction?`, `caseId?` | `analysis` + `provider: "aika-engine"`; writes to case + `consultations` + `aiinteractions` |
| POST | `/ai/explain` | 🔒 | `text` (≥10 chars), `caseId?` | `explanation` + `provider: "aika-engine"` |
| POST | `/ai/simplify` | 🔒 | `text` (≥10 chars), `caseId?` | `simplification` + `provider: "aika-engine"` |
| POST | `/ai/generate-document` | 🔒 | `type` (required), `instructions?`, `caseId?` | draft `document` (case details pulled from the case doc; `DRAFT — …` stamped) |
| GET | `/ai/history?type=&caseId=` | 🔒 | — | last 50 interactions for this user (newest first) |

### Dashboard
| Method | Path | Auth | Returns |
|---|---|---|---|
| GET | `/dashboard/stats` | 🔒 | `stats` (totalCases, activeCases, documents, evidence, interactions), `recentCases`, `recentActivity` |

**Example:**

```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@aika.ai","password":"AikaDemo@123"}' | jq -r .token)

curl -s -X POST http://localhost:5000/api/ai/analyze \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"situation":"My landlord has not returned my security deposit after I moved out.","jurisdiction":"India"}'
```

---

## AI Workflow & Engine

```text
React form → Express /api/ai/* → aikaEngine.js → structured JSON
                                        ├→ aiinteractions (history)
                                        ├→ case.aiAnalysis / risks / actionPath / questions
                                        ├→ consultations (questions for the professional)
                                        └→ response → React renders sections
```

**Every result matches this JSON shape**, so the UI can always render it:

```json
{
  "summary": "...",
  "keyIssues": ["..."],
  "possibleRisks": ["..."],
  "actionPath": [{ "title": "...", "description": "..." }],
  "questionsForProfessional": ["..."],
  "missingInformation": ["..."],
  "disclaimer": "AIKA AI provides general legal information and organizational assistance. It is not a substitute for advice from a qualified legal professional.",
  "category": "Housing",
  "jurisdiction": "India"
}
```

### How the inbuilt engine works

1. **Classification** — the situation text is scored against keyword sets for six themes: **Housing, Employment, Family, Consumer, Civil, General** (e.g. `deposit, landlord, rent, lease, eviction → Housing`).
2. **Composition** — the winning theme supplies templates for key issues, risks, ActionPath steps, and professional questions, combined with the selected jurisdiction.
3. **Guarantees** — output is always structured JSON (never free-form), and the engine **never fabricates statutes, sections, case names, or citations**.
4. **Simplifier** — recognized legal terms map to plain-language meanings; unrecognized clauses still get a generic structured breakdown.
5. **Drafts** — five document types rendered from editable templates, always stamped `DRAFT — review with a qualified professional`.
6. **Provider tag** — API responses carry `provider: "aika-engine"` to make the inbuilt source explicit.

---

## Responsible AI

- Never claims to be a lawyer or guarantees outcomes
- Never invents laws, cases, or citations
- Every response carries the disclaimer: *"AIKA AI provides general legal information and organizational assistance. It is not a substitute for advice from a qualified legal professional."*
- The engine is deterministic and auditable — same input, same safe output
- No user data is sent to any external AI service

---

## Security

- **bcrypt** password hashing (cost 10); password field is stripped by `toJSON`
- **Email validation** — format regex + lowercase/trim normalization on the server, duplicate check + unique index
- **Brute-force guard** — 8 failed logins per email+IP in 15 minutes → `429` (in-memory)
- **No account enumeration** — identical `401 Invalid email or password` for unknown email vs wrong password
- **JWT authentication** (7-day expiry) via `protect` middleware on every private route
- **Ownership checks** — every case/evidence/document/AI query is scoped to `req.user._id`; cross-user access returns `404`
- **helmet** security headers, `x-powered-by` disabled
- **CORS allowlist** — only `CLIENT_URL`, `localhost:5173`, `localhost:5174`
- **1 MB JSON body limit**
- **Secrets in `.env`** — git-ignored (`.env`, `.env.*` except `.env.example`)
- **Input validation** — required fields, enum checks, ObjectId format checks (`400`), consistent error envelope
- **Centralized error handler** — controlled `404` + `500` responses, no stack traces leaked

---

## Verification & Testing

All of the following were executed against the live stack (MongoDB + Express + Vite) and passed:

### API journey
- ✅ Register → login → authenticated `/me`
- ✅ Duplicate email → `409`, bad login → `401`, weak password → `400`
- ✅ Case create → read → update → delete → search/filter
- ✅ AI analyze / explain / simplify / generate-document → correct structured output (`provider: aika-engine`)
- ✅ Evidence + document CRUD scoped to the logged-in user
- ✅ AI history + dashboard stats return real database numbers
- ✅ Unknown route → `404`; malformed ObjectId → `400`
- ✅ **Cross-user isolation:** user B requesting user A's case → `404` (no data leak)
- ✅ Missing/invalid token → `401` on all protected routes

### Authentication hardening
- ✅ Register/login with real personal emails (`@gmail.com`, `@outlook.com`) succeeds
- ✅ Case-insensitive email login works (`Student.2026@Outlook.com` = `student.2026@outlook.com`)
- ✅ 8 wrong passwords → `401`, 9th attempt → `429` lockout
- ✅ UI validation: mismatched passwords, weak password, invalid email all blocked client-side with inline alerts

### Frontend
- ✅ `npm run build` — production bundle builds cleanly (≈409 kB JS, ≈30 kB gzip)
- ✅ Protected routes redirect when logged out; auto-login after register/login
- ✅ Landing, login, dashboard, cases, case detail, analyzer, simplifier, drafts, documents, profile all render with live data

---

## Documentation & Deliverables

| Item | Location | Status |
|---|---|---|
| Lab report (college 26-section format) | `document.md` | Title page, bonafide certificate, acknowledgement, abstract, table of contents written — **chapters 1–8 to be expanded** |
| Report screenshots | `docs/screenshots/` | `01-landing.png`, `02-login.png`, `03-simplifier.png`, `04-cases.png` captured — **dashboard, case page, analyzer, drafts, documents still to capture** |
| College report template | `MERN STACK LAB REPORT.docx` | source of the required format |
| Demo video | `Lexora_AI.mp4` | ~2 MB screen recording |
| README | `README.md` | this file — full current-state reference |

---

## Limitations

- The inbuilt engine returns general, template-based legal information — by design it **never** fabricates legal citations, so it won't quote specific statutes
- Document drafts are structured templates; always review with a qualified professional
- No file upload/parsing (PDF/DOCX) — analysis is text-based
- Rate-limit counters are in-memory (reset on backend restart); a production deployment would use Redis or a database
- Email is validated but not verified (no confirmation emails sent)

---

## Future Enhancements

- PDF/DOCX text extraction for uploaded documents
- Email verification + password reset flows
- Multi-language explanations
- Two-factor authentication
- Redis-backed rate limiting for horizontal scaling
- Role-based access for legal-aid organizations
- Case timeline visualization and exportable consultation packs
#   A I K A - A I  
 